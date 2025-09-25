import React from 'react';
import { FutonQuiz } from '../components/FutonQuiz';
import { ShopifyProductAdapter } from './ShopifyProductAdapter';
import { ShopifyThemeIntegrationComponent, ShopifyThemeIntegrationService } from './ShopifyThemeIntegration';

interface ShopifyQuizWrapperProps {
  config: {
    title: string;
    subtitle: string;
    collections: {
      soft: string;
      medium: string;
      hard: string;
      couples: string;
    };
    products: any[];
    shop: {
      domain: string;
      currency: string;
    };
    klaviyo?: {
      publicKey: string;
    };
    themeEditorMode: boolean;
    version: 'v1' | 'v2';
  };
}

export const ShopifyQuizWrapper: React.FC<ShopifyQuizWrapperProps> = ({ config }) => {
  // Adapt Shopify product data for React components
  const adaptedProducts = React.useMemo(() => {
    return ShopifyProductAdapter.adaptProductsForReact(config.products, config.shop);
  }, [config.products, config.shop]);

  // Handle Klaviyo integration
  const handleQuizComplete = React.useCallback((quizData: any, recommendations: any[]) => {
    // Send data to Klaviyo if configured
    if (config.klaviyo?.publicKey) {
      ShopifyThemeIntegrationService.sendToKlaviyo(config.klaviyo.publicKey, {
        quizData,
        recommendations,
        timestamp: new Date().toISOString(),
      });
    }

    // Trigger Shopify analytics events
    if (window.gtag) {
      window.gtag('event', 'quiz_complete', {
        event_category: 'engagement',
        event_label: 'futon_quiz_v2',
        value: recommendations.length,
      });
    }

    // Custom event for theme integration
    document.dispatchEvent(new CustomEvent('futon-quiz-complete', {
      detail: { quizData, recommendations, version: 'v2' }
    }));
  }, [config.klaviyo]);

  // Handle cart integration
  const handleAddToCart = React.useCallback(async (variantId: string, quantity: number = 1) => {
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
        // Trigger cart drawer or redirect
        document.dispatchEvent(new CustomEvent('cart:updated'));
        
        // Show success notification
        if (window.Shopify?.theme?.showToast) {
          window.Shopify.theme.showToast('Product added to cart');
        }
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      // Show error notification
      if (window.Shopify?.theme?.showToast) {
        window.Shopify.theme.showToast('Failed to add product to cart', 'error');
      }
    }
  }, []);

  return (
    <div className="futon-quiz-wrapper-v2" data-version="v2">
      <FutonQuiz />
      
      {/* Theme editor integration */}
      {config.themeEditorMode && (
        <ShopifyThemeIntegrationComponent
          config={config}
          onConfigUpdate={(newConfig) => {
            // Handle real-time config updates from theme editor
            window.quizConfig = { ...window.quizConfig, ...newConfig };
          }}
        />
      )}
    </div>
  );
};