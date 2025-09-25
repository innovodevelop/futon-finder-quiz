import React from 'react';

interface ShopifyThemeIntegrationProps {
  config: any;
  onConfigUpdate: (newConfig: any) => void;
}

export const ShopifyThemeIntegrationComponent: React.FC<ShopifyThemeIntegrationProps> = ({ 
  config, 
  onConfigUpdate 
}) => {
  React.useEffect(() => {
    // Listen for theme editor changes
    const handleSectionLoad = (event: any) => {
      if (event.detail.sectionId.includes('futon-quiz')) {
        // Reload configuration from updated section
        const newConfig = window.quizConfig;
        if (newConfig && JSON.stringify(newConfig) !== JSON.stringify(config)) {
          onConfigUpdate(newConfig);
        }
      }
    };

    const handleSectionSelect = (event: any) => {
      if (event.detail.sectionId.includes('futon-quiz')) {
        // Highlight the quiz container for theme editor
        const container = document.querySelector('.futon-quiz-wrapper-v2');
        if (container) {
          container.classList.add('shopify-section-selected');
          setTimeout(() => {
            container.classList.remove('shopify-section-selected');
          }, 2000);
        }
      }
    };

    document.addEventListener('shopify:section:load', handleSectionLoad);
    document.addEventListener('shopify:section:select', handleSectionSelect);
    document.addEventListener('shopify:section:reorder', handleSectionLoad);

    return () => {
      document.removeEventListener('shopify:section:load', handleSectionLoad);
      document.removeEventListener('shopify:section:select', handleSectionSelect);
      document.removeEventListener('shopify:section:reorder', handleSectionLoad);
    };
  }, [config, onConfigUpdate]);

  return null; // This is a logic-only component
};

export class ShopifyThemeIntegrationService {
  /**
   * Send quiz data to Klaviyo
   */
  static async sendToKlaviyo(publicKey: string, data: any) {
    try {
      if (typeof window.klaviyo !== 'undefined') {
        // Use existing Klaviyo integration
        window.klaviyo.push([
          'track', 
          'Futon Quiz Completed',
          {
            quiz_version: 'v2',
            quiz_data: data.quizData,
            recommendations: data.recommendations.map((p: any) => ({
              product_id: p.id,
              product_title: p.title,
              product_price: p.price,
            })),
            timestamp: data.timestamp,
          }
        ]);
      } else {
        // Direct API call if Klaviyo script not loaded
        const response = await fetch('https://a.klaviyo.com/api/events/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Klaviyo-API-Key ${publicKey}`,
          },
          body: JSON.stringify({
            data: {
              type: 'event',
              attributes: {
                event_name: 'Futon Quiz Completed',
                customer_properties: {
                  email: data.quizData.contactInfo?.email,
                },
                properties: {
                  quiz_version: 'v2',
                  quiz_data: data.quizData,
                  recommendations: data.recommendations,
                  timestamp: data.timestamp,
                },
              },
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Klaviyo API request failed');
        }
      }
    } catch (error) {
      console.error('Failed to send data to Klaviyo:', error);
    }
  }

  /**
   * Handle cart integration
   */
  static async addToCart(variantId: string, quantity: number = 1) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        const cartData = await response.json();
        
        // Trigger cart update events
        document.dispatchEvent(new CustomEvent('cart:updated', { 
          detail: cartData 
        }));
        
        return cartData;
      } else {
        throw new Error(`Cart add failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  }

  /**
   * Get current cart data
   */
  static async getCart() {
    try {
      const response = await fetch('/cart.js');
      return await response.json();
    } catch (error) {
      console.error('Failed to get cart:', error);
      return null;
    }
  }

  /**
   * Redirect to checkout
   */
  static redirectToCheckout() {
    window.location.href = '/cart';
  }
}