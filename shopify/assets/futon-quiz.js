// Shopify Futon Quiz Integration
// This file handles the interaction between the React quiz and Shopify's ecosystem

class ShopifyQuizIntegration {
  constructor() {
    this.quizRoot = document.getElementById('futon-quiz-root');
    this.productsData = this.loadProductsData();
    this.shopifyData = this.loadShopifyData();
    this.initializeQuiz();
  }

  loadProductsData() {
    const dataScript = document.getElementById('quiz-products-data');
    if (dataScript) {
      try {
        return JSON.parse(dataScript.textContent);
      } catch (e) {
        console.error('Failed to parse products data:', e);
        return { soft_products: [], medium_products: [], hard_products: [], couples_products: [] };
      }
    }
    return { soft_products: [], medium_products: [], hard_products: [], couples_products: [] };
  }

  loadShopifyData() {
    if (!this.quizRoot) return {};
    
    return {
      softCollectionId: this.quizRoot.dataset.softCollection,
      mediumCollectionId: this.quizRoot.dataset.mediumCollection, 
      hardCollectionId: this.quizRoot.dataset.hardCollection,
      couplesCollectionId: this.quizRoot.dataset.couplesCollection,
      shopUrl: this.quizRoot.dataset.shopUrl,
      quizTitle: this.quizRoot.dataset.quizTitle,
      quizSubtitle: this.quizRoot.dataset.quizSubtitle
    };
  }

  getRecommendations(quizData) {
    let recommendedProducts = [];
    
    // Determine which collections to search based on preferences
    const preferences = [quizData.preferences.person1];
    if (quizData.peopleCount === 2 && quizData.preferences.person2) {
      preferences.push(quizData.preferences.person2);
    }

    // Check if couples collection should be prioritized
    if (quizData.peopleCount === 2 && this.productsData.couples_products.length > 0) {
      recommendedProducts = [...this.productsData.couples_products];
    }

    // Add products based on firmness preferences
    preferences.forEach(preference => {
      switch (preference) {
        case 'soft':
          recommendedProducts = recommendedProducts.concat(this.productsData.soft_products);
          break;
        case 'medium':
          recommendedProducts = recommendedProducts.concat(this.productsData.medium_products);
          break;
        case 'hard':
          recommendedProducts = recommendedProducts.concat(this.productsData.hard_products);
          break;
      }
    });

    // Remove duplicates and limit results
    const uniqueProducts = recommendedProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    // Score and sort products based on quiz data
    return this.scoreProducts(uniqueProducts, quizData).slice(0, 4);
  }

  scoreProducts(products, quizData) {
    return products.map(product => {
      let score = 0;
      
      // Score based on tags matching sleep positions
      const sleepPositions = [quizData.sleepPositions.person1];
      if (quizData.peopleCount === 2 && quizData.sleepPositions.person2) {
        sleepPositions.push(quizData.sleepPositions.person2);
      }

      sleepPositions.forEach(position => {
        if (product.tags.includes(`sleep-${position}`) || 
            product.tags.includes(position) ||
            product.description.toLowerCase().includes(position)) {
          score += 10;
        }
      });

      // Score based on weight capacity (look for weight-related tags)
      const totalWeight = quizData.weights.person1 + (quizData.weights.person2 || 0);
      if (totalWeight > 150 && product.tags.includes('heavy-duty')) {
        score += 15;
      }
      if (totalWeight < 120 && product.tags.includes('lightweight')) {
        score += 10;
      }

      // Score for couples products
      if (quizData.peopleCount === 2 && 
          (product.tags.includes('couples') || 
           product.tags.includes('double') || 
           product.title.toLowerCase().includes('double'))) {
        score += 20;
      }

      return { ...product, score };
    }).sort((a, b) => b.score - a.score);
  }

  formatPrice(priceInCents) {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK'
    }).format(priceInCents / 100);
  }

  generateProductHTML(product, isRecommended = false) {
    const price = this.formatPrice(product.price);
    const comparePrice = product.compare_at_price ? this.formatPrice(product.compare_at_price) : null;
    
    return `
      <div class="futon-product-card bg-white rounded-lg shadow-md overflow-hidden ${isRecommended ? 'ring-2 ring-primary' : ''}" 
           data-product-id="${product.id}">
        
        ${isRecommended ? `
          <div class="bg-primary text-white text-sm font-medium px-3 py-1 text-center">
            Anbefalet til dig
          </div>
        ` : ''}

        ${product.featured_image ? `
          <div class="aspect-w-16 aspect-h-9 bg-gray-200">
            <img 
              src="${product.featured_image}" 
              alt="${product.title}"
              loading="lazy"
              class="w-full h-48 object-cover"
            >
          </div>
        ` : ''}

        <div class="p-4">
          <h3 class="font-semibold text-lg text-gray-900 mb-2">
            ${product.title}
          </h3>
          
          ${product.vendor ? `
            <p class="text-sm text-gray-500 mb-2">${product.vendor}</p>
          ` : ''}

          ${product.description ? `
            <p class="text-sm text-gray-600 mb-3">
              ${product.description}
            </p>
          ` : ''}

          <div class="flex items-center justify-between mb-4">
            <div class="price-wrapper">
              ${comparePrice && product.compare_at_price > product.price ? `
                <span class="text-lg font-bold text-red-600">
                  ${price}
                </span>
                <span class="text-sm text-gray-500 line-through ml-2">
                  ${comparePrice}
                </span>
              ` : `
                <span class="text-lg font-bold text-gray-900">
                  ${price}
                </span>
              `}
            </div>
          </div>

          ${product.tags && product.tags.length > 0 ? `
            <div class="mb-4">
              <p class="text-xs font-medium text-gray-700 mb-1">Funktioner:</p>
              <div class="flex flex-wrap gap-1">
                ${product.tags.slice(0, 3).map(tag => `
                  <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    ${tag}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="space-y-2">
            <button 
              onclick="this.addToCart('${product.variants[0].id}')"
              class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded transition-colors"
              ${!product.variants[0].available ? 'disabled' : ''}
            >
              ${product.variants[0].available ? 'Tilføj til kurv' : 'Udsolgt'}
            </button>
            
            <a 
              href="${product.url}" 
              class="block w-full text-center border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
            >
              Se detaljer
            </a>
          </div>
        </div>
      </div>
    `;
  }

  addToCart(variantId) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1
      })
    })
    .then(response => response.json())
    .then(data => {
      // Show success message or update cart UI
      this.showCartAddedMessage();
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
    });
  }

  showCartAddedMessage() {
    // You can implement a toast notification here
    alert('Produkt tilføjet til kurv!');
  }

  submitQuizData(quizData) {
    // Submit quiz data to Shopify for analytics/marketing
    const formData = {
      'contact[first_name]': quizData.contactInfo.name.split(' ')[0] || '',
      'contact[last_name]': quizData.contactInfo.name.split(' ').slice(1).join(' ') || '',
      'contact[email]': quizData.contactInfo.email,
      'contact[phone]': quizData.contactInfo.phone,
      'contact[note]': `Futon Quiz Results:
People Count: ${quizData.peopleCount}
Weights: Person 1: ${quizData.weights.person1}kg${quizData.weights.person2 ? `, Person 2: ${quizData.weights.person2}kg` : ''}
Sleep Positions: Person 1: ${quizData.sleepPositions.person1}${quizData.sleepPositions.person2 ? `, Person 2: ${quizData.sleepPositions.person2}` : ''}
Preferences: Person 1: ${quizData.preferences.person1}${quizData.preferences.person2 ? `, Person 2: ${quizData.preferences.person2}` : ''}
Comments: ${quizData.contactInfo.comments || 'None'}`,
      'contact[tags]': 'futon-quiz-participant'
    };

    if (quizData.contactInfo.marketingConsent) {
      formData['contact[accepts_marketing]'] = '1';
    }

    return fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData)
    });
  }

  initializeQuiz() {
    if (!this.quizRoot) return;

    // Make the integration methods available globally for the React app
    window.shopifyQuizIntegration = {
      getRecommendations: this.getRecommendations.bind(this),
      generateProductHTML: this.generateProductHTML.bind(this), 
      addToCart: this.addToCart.bind(this),
      submitQuizData: this.submitQuizData.bind(this),
      shopifyData: this.shopifyData,
      productsData: this.productsData
    };

    // Initialize the React quiz component
    // The React app will use window.shopifyQuizIntegration to get product recommendations
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new ShopifyQuizIntegration();
});