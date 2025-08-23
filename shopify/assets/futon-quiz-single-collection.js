/**
 * Enhanced Futon Quiz with Tag-Based Product Selection  
 * Uses a single collection with product tags for flexible categorization
 */
class FutonQuizSingleCollection {
  constructor() {
    this.currentStep = 0;
    this.quizData = {
      peopleCount: 1,
      weights: { person1: null, person2: null },
      sleepPositions: { person1: null, person2: null },
      preferences: { person1: null, person2: null },
      contactInfo: { name: '', email: '', phone: '' }
    };
    
    this.products = [];
    this.tagMappings = window.quizConfig?.tagMappings || {};
    this.steps = [];
    this.blockSettings = {};
  }

  /**
   * Initialize the quiz
   */
  init() {
    this.loadProductData();
    // Guard optional methods in case they are not present yet
    if (typeof this.getStepBlocksOrder === 'function') this.getStepBlocksOrder();
    if (typeof this.loadBlockSettings === 'function') this.loadBlockSettings();
    if (typeof this.showStep === 'function') this.showStep(0);
  }

  // Public wrappers for inline handlers used in Liquid templates
  startQuiz() {
    if (typeof this.nextStep === 'function') {
      this.nextStep();
    } else if (typeof this.showStep === 'function') {
      this.showStep(1);
    }
  }

  selectPeopleCount(count) {
    if (typeof this.setPeopleCount === 'function') {
      this.setPeopleCount(count);
    } else {
      this.quizData.peopleCount = Number(count) || 1;
    }
  }

  nextStep() {
    this.currentStep = (this.currentStep || 0) + 1;
    if (typeof this.showStep === 'function') this.showStep(this.currentStep);
  }

  prevStep() {
    this.currentStep = Math.max(0, (this.currentStep || 0) - 1);
    if (typeof this.showStep === 'function') this.showStep(this.currentStep);
  }

  // Utilities
  formatPrice(priceInCents) {
    try {
      return new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: 'DKK',
      }).format((priceInCents || 0) / 100);
    } catch (e) {
      return `${(priceInCents || 0) / 100} kr`;
    }
  }

  addToCart(variantId) {
    const id = typeof variantId === 'string' ? variantId : String(variantId || '');
    if (!id) return;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id, quantity: 1 }] })
    })
    .then(res => res.json())
    .then(() => {
      // Basic feedback; consider replacing with theme toast if available
      // eslint-disable-next-line no-alert
      if (typeof window !== 'undefined') alert('Tilføjet til kurv');
    })
    .catch(err => console.error('Add to cart failed', err));
  }

  /**
   * Load product data from single collection
   */
  loadProductData() {
    try {
      const productDataElement = document.getElementById('quiz-products-data');
      if (productDataElement) {
        const data = JSON.parse(productDataElement.textContent);
        this.products = data.products || [];
        console.log('Loaded products:', this.products.length);
      }
    } catch (error) {
      console.error('Error loading product data:', error);
      this.products = [];
    }
  }

  /**
   * Get quiz recommendations using enhanced tag-based scoring
   */
  getRecommendations() {
    if (!this.products.length) {
      console.warn('No products available for recommendations');
      return [];
    }

    const scoredProducts = this.products.map(product => ({
      ...product,
      score: this.calculateAdvancedProductScore(product)
    }));

    // Sort by score and return top recommendations
    return scoredProducts
      .filter(product => product.score > 0) // Only products with positive scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // Return top 6 recommendations
  }

  /**
   * Advanced scoring system using tags and quiz data
   */
  calculateAdvancedProductScore(product) {
    let score = 20; // Base score
    const { peopleCount, preferences, sleepPositions, weights } = this.quizData;
    const productTags = product.tags.map(tag => tag.toLowerCase());

    // === FIRMNESS PREFERENCE SCORING ===
    score += this.calculateFirmnessScore(product, productTags, preferences, peopleCount);

    // === SLEEP POSITION SCORING ===
    score += this.calculateSleepPositionScore(product, productTags, sleepPositions, peopleCount);

    // === WEIGHT-BASED SCORING ===
    score += this.calculateWeightScore(product, productTags, weights, peopleCount);

    // === COUPLES BONUS ===
    if (peopleCount === 2) {
      score += this.calculateCouplesScore(product, productTags);
    }

    // === TAG MATCHING BONUSES ===
    score += this.calculateTagMatchingBonus(product, productTags);

    // === PENALTY FOR MISMATCHES ===
    score -= this.calculateMismatchPenalty(product, productTags);

    return Math.max(0, score); // Ensure score is never negative
  }

  /**
   * Calculate firmness preference score
   */
  calculateFirmnessScore(product, productTags, preferences, peopleCount) {
    let firmnessScore = 0;
    const firmnessMapping = this.tagMappings.firmness || {};

    // Check person 1 preference
    if (preferences.person1) {
      const matchingTags = firmnessMapping[preferences.person1] || [];
      const hasMatch = matchingTags.some(tag => 
        productTags.includes(tag.toLowerCase())
      );
      if (hasMatch) firmnessScore += 25;
    }

    // Check person 2 preference for couples
    if (peopleCount === 2 && preferences.person2) {
      const matchingTags = firmnessMapping[preferences.person2] || [];
      const hasMatch = matchingTags.some(tag => 
        productTags.includes(tag.toLowerCase())
      );
      if (hasMatch) firmnessScore += 25;
      
      // Bonus for products that work for both preferences
      if (preferences.person1 !== preferences.person2) {
        const person1Tags = firmnessMapping[preferences.person1] || [];
        const person2Tags = firmnessMapping[preferences.person2] || [];
        const hasMultiMatch = person1Tags.some(tag => productTags.includes(tag.toLowerCase())) &&
                             person2Tags.some(tag => productTags.includes(tag.toLowerCase()));
        if (hasMultiMatch) firmnessScore += 15; // Compromise bonus
      }
    }

    return firmnessScore;
  }

  /**
   * Calculate sleep position score
   */
  calculateSleepPositionScore(product, productTags, sleepPositions, peopleCount) {
    let positionScore = 0;
    const positionMapping = this.tagMappings.sleepPosition || {};

    // Check person 1 sleep position
    if (sleepPositions.person1) {
      const matchingTags = positionMapping[sleepPositions.person1] || [];
      const hasMatch = matchingTags.some(tag => 
        productTags.includes(tag.toLowerCase())
      );
      if (hasMatch) positionScore += 15;
    }

    // Check person 2 sleep position for couples
    if (peopleCount === 2 && sleepPositions.person2) {
      const matchingTags = positionMapping[sleepPositions.person2] || [];
      const hasMatch = matchingTags.some(tag => 
        productTags.includes(tag.toLowerCase())
      );
      if (hasMatch) positionScore += 15;
    }

    return positionScore;
  }

  /**
   * Calculate weight-based score
   */
  calculateWeightScore(product, productTags, weights, peopleCount) {
    let weightScore = 0;
    const weightMapping = this.tagMappings.weightSupport || {};

    // Calculate total weight
    const person1Weight = parseInt(weights.person1) || 0;
    const person2Weight = peopleCount === 2 ? (parseInt(weights.person2) || 0) : 0;
    const totalWeight = person1Weight + person2Weight;
    const averageWeight = peopleCount === 2 ? totalWeight / 2 : person1Weight;

    // Light weight support
    if (averageWeight < 70) {
      const lightTags = weightMapping.light || [];
      const hasMatch = lightTags.some(tag => productTags.includes(tag.toLowerCase()));
      if (hasMatch) weightScore += 10;
    }

    // Heavy weight support  
    if (averageWeight > 90 || (peopleCount === 2 && totalWeight > 160)) {
      const heavyTags = weightMapping.heavy || [];
      const hasMatch = heavyTags.some(tag => productTags.includes(tag.toLowerCase()));
      if (hasMatch) weightScore += 15;
    }

    return weightScore;
  }

  /**
   * Calculate couples-specific score
   */
  calculateCouplesScore(product, productTags) {
    const couplesTags = this.tagMappings.couples || [];
    const hasMatch = couplesTags.some(tag => 
      productTags.includes(tag.toLowerCase())
    );
    return hasMatch ? 20 : 0;
  }

  /**
   * Calculate additional tag matching bonuses
   */
  calculateTagMatchingBonus(product, productTags) {
    let bonus = 0;

    // Premium/quality indicators
    const qualityTags = ['premium', 'luxury', 'high-quality', 'organic', 'natural'];
    const hasQuality = qualityTags.some(tag => productTags.includes(tag));
    if (hasQuality) bonus += 5;

    // Comfort/support indicators
    const comfortTags = ['comfortable', 'supportive', 'ergonomic', 'pressure-relief'];
    const hasComfort = comfortTags.some(tag => productTags.includes(tag));
    if (hasComfort) bonus += 5;

    return bonus;
  }

  /**
   * Calculate penalties for mismatches
   */
  calculateMismatchPenalty(product, productTags) {
    let penalty = 0;
    const { peopleCount, preferences } = this.quizData;

    // Penalty for single-only products when customer needs couples
    if (peopleCount === 2) {
      const singleOnlyTags = ['single-only', 'twin', 'enkeltseng'];
      const isSingleOnly = singleOnlyTags.some(tag => productTags.includes(tag));
      if (isSingleOnly) penalty += 30;
    }

    // Penalty for couples-only products when customer is single
    if (peopleCount === 1) {
      const couplesOnlyTags = ['couples-only', 'king-only', 'queen-only'];
      const isCouplesOnly = couplesOnlyTags.some(tag => productTags.includes(tag));
      if (isCouplesOnly) penalty += 20;
    }

    return penalty;
  }

  // ... (include all other existing methods from futon-quiz-blocks.js)
  
  /**
   * Show recommendations with enhanced display
   */
  async showRecommendations() {
    const loadingElement = document.getElementById('recommendations-loading');
    const resultsElement = document.getElementById('recommendations-results');
    const emptyElement = document.getElementById('recommendations-empty');

    if (loadingElement) loadingElement.style.display = 'block';
    if (resultsElement) resultsElement.style.display = 'none';
    if (emptyElement) emptyElement.style.display = 'none';

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    const recommendations = this.getRecommendations();

    if (loadingElement) loadingElement.style.display = 'none';

    if (recommendations.length > 0) {
      const container = document.getElementById('recommendations-grid');
      if (container && resultElement) {
        this.renderAdvancedRecommendations(recommendations, container);
        resultsElement.style.display = 'block';
      }
    } else {
      if (emptyElement) emptyElement.style.display = 'block';
    }
  }

  /**
   * Render recommendations with enhanced product cards
   */
  renderAdvancedRecommendations(recommendations, container) {
    container.innerHTML = '';

    recommendations.forEach((product, index) => {
      const productCard = this.createAdvancedProductCard(product, index === 0);
      container.appendChild(productCard);
    });
  }

  /**
   * Create enhanced product card with tag-based attributes
   */
  createAdvancedProductCard(product, isBestMatch) {
    const card = document.createElement('div');
    const discount = product.compare_at_price && product.compare_at_price > product.price 
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0;

    card.className = `bg-card border rounded-lg p-6 transition-all hover:shadow-lg ${
      isBestMatch ? 'ring-2 ring-primary border-primary' : ''
    }`;

    // Extract key attributes from tags for display
    const attributes = this.extractProductAttributes(product.tags);

    card.innerHTML = `
      ${isBestMatch ? `
        <div class="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
          🏆 Bedste Match
        </div>
      ` : ''}
      
      <div class="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
        <img 
          src="${product.featured_image || '/placeholder.svg'}" 
          alt="${product.title}"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <h3 class="font-semibold text-lg mb-2 line-clamp-2">${product.title}</h3>
      
      <div class="flex items-center gap-2 mb-3">
        <span class="text-2xl font-bold text-primary">
          ${this.formatPrice(product.price)}
        </span>
        ${product.compare_at_price && discount > 0 ? `
          <span class="text-sm text-muted-foreground line-through">
            ${this.formatPrice(product.compare_at_price)}
          </span>
          <span class="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
            -${discount}%
          </span>
        ` : ''}
      </div>
      
      ${attributes.length > 0 ? `
        <div class="flex flex-wrap gap-1 mb-4">
          ${attributes.slice(0, 4).map(attr => `
            <span class="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
              ${attr}
            </span>
          `).join('')}
        </div>
      ` : ''}
      
      <p class="text-sm text-muted-foreground mb-4 line-clamp-3">
        ${product.description}
      </p>
      
      <div class="space-y-2">
        <button 
          onclick="futonQuiz.addToCart('${product.variants[0]?.id}')"
          class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
        >
          Tilføj til Kurv
        </button>
        <button 
          onclick="window.open('${product.url}', '_blank')"
          class="w-full border border-border hover:bg-muted px-4 py-2 rounded-md font-medium transition-colors"
        >
          Se Detaljer
        </button>
      </div>
      
      ${isBestMatch ? `
        <div class="mt-4 text-xs text-muted-foreground">
          Score: ${Math.round(product.score)} - Perfekt match for dine præferencer!
        </div>
      ` : ''}
    `;

    return card;
  }

  /**
   * Extract readable attributes from product tags
   */
  extractProductAttributes(tags) {
    const attributes = [];
    const tagLower = tags.map(tag => tag.toLowerCase());

    // Firmness
    if (tagLower.some(tag => ['soft', 'blød'].includes(tag))) attributes.push('Blød');
    if (tagLower.some(tag => ['medium'].includes(tag))) attributes.push('Medium');
    if (tagLower.some(tag => ['hard', 'fast', 'firm'].includes(tag))) attributes.push('Fast');

    // Special features
    if (tagLower.some(tag => ['couples', 'par'].includes(tag))) attributes.push('Par-venlig');
    if (tagLower.some(tag => ['organic', 'natural'].includes(tag))) attributes.push('Naturlig');
    if (tagLower.some(tag => ['premium', 'luxury'].includes(tag))) attributes.push('Premium');
    if (tagLower.some(tag => ['side-sleeper', 'sideligger'].includes(tag))) attributes.push('Sideligger');

    return attributes;
  }

  // ... (include remaining methods from original file)
}

// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const instance = new FutonQuizSingleCollection();
  if (typeof instance.init === 'function') instance.init();
  // Expose both names for compatibility with Liquid templates and existing assets
  window.futonQuizSingleCollection = instance;
  window.futonQuiz = instance;
});