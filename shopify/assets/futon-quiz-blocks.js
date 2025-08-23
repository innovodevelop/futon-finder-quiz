/**
 * Futon Quiz with Blocks - Pure JavaScript Implementation for Shopify
 */

class FutonQuizBlocks {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = window.quizConfig?.totalSteps || 7;
    this.quizData = {
      peopleCount: 1,
      weights: { person1: 0, person2: 0 },
      sleepPositions: { person1: '', person2: '' },
      preferences: { person1: '', person2: '' },
      contactInfo: {
        name: '',
        email: '',
        phone: '',
        comments: '',
        marketingConsent: false
      }
    };
    
    this.products = {
      soft: [],
      medium: [],
      hard: [],
      couples: []
    };
    
    // Get block order from DOM
    this.stepBlocks = [];
    this.init();
  }

  init() {
    this.loadProductData();
    this.getStepBlocksOrder();
    this.showStep(0);
    this.updateProgress();
  }

  /**
   * Get the order of steps from the DOM blocks
   */
  getStepBlocksOrder() {
    const steps = document.querySelectorAll('.quiz-step[data-block-id]');
    this.stepBlocks = Array.from(steps).map(step => {
      return {
        element: step,
        blockId: step.getAttribute('data-block-id'),
        stepType: step.id
      };
    });
    this.totalSteps = this.stepBlocks.length;
  }

  /**
   * Load product data from the page
   */
  loadProductData() {
    try {
      const productDataElement = document.getElementById('quiz-products-data');
      if (productDataElement) {
        const data = JSON.parse(productDataElement.textContent);
        this.products = {
          soft: data.soft_products || [],
          medium: data.medium_products || [],
          hard: data.hard_products || [],
          couples: data.couples_products || []
        };
      }
    } catch (error) {
      console.error('Error loading product data:', error);
    }
  }

  showStep(stepIndex) {
    // Hide all steps
    this.stepBlocks.forEach(block => {
      block.element.style.display = 'none';
    });
    
    // Show current step
    if (this.stepBlocks[stepIndex]) {
      this.stepBlocks[stepIndex].element.style.display = 'block';
    }
    
    // Show/hide progress indicator based on step type
    const progressIndicator = document.getElementById('progress-indicator');
    const currentStepType = this.stepBlocks[stepIndex]?.stepType;
    
    if (currentStepType === 'start-step' || currentStepType === 'recommendation-step') {
      progressIndicator.style.display = 'none';
    } else {
      progressIndicator.style.display = 'block';
    }
    
    // Update step-specific UI
    this.updateStepUI(stepIndex);
  }

  updateStepUI(stepIndex) {
    const currentStepType = this.stepBlocks[stepIndex]?.stepType;
    
    switch(currentStepType) {
      case 'weight-step':
        this.updateWeightStepUI();
        break;
      case 'sleep-position-step':
        this.updateSleepPositionStepUI();
        break;
      case 'preference-step':
        this.updatePreferenceStepUI();
        break;
      case 'recommendation-step':
        this.showRecommendations();
        break;
    }
  }

  updateWeightStepUI() {
    const { peopleCount } = this.quizData;
    const title = document.getElementById('weight-title');
    const label1 = document.getElementById('weight1-label');
    const weight2Container = document.getElementById('weight2-container');
    const inputsContainer = document.getElementById('weight-inputs');
    
    // Get block settings dynamically from the current step block
    const currentBlock = this.stepBlocks[this.currentStep]?.element;
    const singleTitle = currentBlock?.querySelector('[data-single-title]')?.getAttribute('data-single-title') || 'Hvad er din vægt?';
    const coupleTitle = currentBlock?.querySelector('[data-couple-title]')?.getAttribute('data-couple-title') || 'Hvad er jeres vægt?';
    const singleLabel = currentBlock?.querySelector('[data-single-label]')?.getAttribute('data-single-label') || 'Din vægt (kg)';
    
    if (peopleCount === 2) {
      if (title) title.textContent = coupleTitle;
      if (label1) label1.textContent = 'Person 1 vægt (kg)';
      if (weight2Container) weight2Container.style.display = 'block';
      if (inputsContainer) inputsContainer.className = 'mb-6 grid grid-cols-1 md:grid-cols-2 gap-6';
    } else {
      if (title) title.textContent = singleTitle;
      if (label1) label1.textContent = singleLabel;
      if (weight2Container) weight2Container.style.display = 'none';
      if (inputsContainer) inputsContainer.className = 'mb-6 space-y-4';
    }
    
    this.validateWeightStep();
  }

  updateSleepPositionStepUI() {
    const { peopleCount } = this.quizData;
    const title = document.getElementById('sleep-position-title');
    const singlePersonPositions = document.getElementById('single-person-positions');
    const twoPersonPositions = document.getElementById('two-person-positions');
    
    // Get block settings dynamically
    const currentBlock = this.stepBlocks[this.currentStep]?.element;
    const singleTitle = currentBlock?.querySelector('[data-single-title]')?.getAttribute('data-single-title') || 'Hvilken sovposition foretrækker du?';
    const coupleTitle = currentBlock?.querySelector('[data-couple-title]')?.getAttribute('data-couple-title') || 'Hvilke sovpositioner foretrækker I?';
    
    if (peopleCount === 2) {
      if (title) title.textContent = coupleTitle;
      if (singlePersonPositions) singlePersonPositions.style.display = 'none';
      if (twoPersonPositions) twoPersonPositions.style.display = 'block';
    } else {
      if (title) title.textContent = singleTitle;
      if (singlePersonPositions) singlePersonPositions.style.display = 'block';
      if (twoPersonPositions) twoPersonPositions.style.display = 'none';
    }
    
    this.validateSleepPositionStep();
  }

  updatePreferenceStepUI() {
    const { peopleCount } = this.quizData;
    const title = document.getElementById('preference-title');
    const singlePersonPreferences = document.getElementById('single-person-preferences');
    const twoPersonPreferences = document.getElementById('two-person-preferences');
    
    // Get block settings dynamically
    const currentBlock = this.stepBlocks[this.currentStep]?.element;
    const singleTitle = currentBlock?.querySelector('[data-single-title]')?.getAttribute('data-single-title') || 'Hvilken matras fasthed foretrækker du?';
    const coupleTitle = currentBlock?.querySelector('[data-couple-title]')?.getAttribute('data-couple-title') || 'Hvilken matras fasthed foretrækker I?';
    
    if (peopleCount === 2) {
      if (title) title.textContent = coupleTitle;
      if (singlePersonPreferences) singlePersonPreferences.style.display = 'none';
      if (twoPersonPreferences) twoPersonPreferences.style.display = 'block';
    } else {
      if (title) title.textContent = singleTitle;
      if (singlePersonPreferences) singlePersonPreferences.style.display = 'block';
      if (twoPersonPreferences) twoPersonPreferences.style.display = 'none';
    }
    
    this.validatePreferenceStep();
  }

  updateProgress() {
    const currentStepType = this.stepBlocks[this.currentStep]?.stepType;
    if (currentStepType === 'start-step' || currentStepType === 'recommendation-step') return;
    
    // Count steps that should show in progress (exclude start and recommendation)
    const progressSteps = this.stepBlocks.filter(block => 
      block.stepType !== 'start-step' && block.stepType !== 'recommendation-step'
    );
    
    const currentProgressIndex = progressSteps.findIndex(block => block.stepType === currentStepType);
    const adjustedStep = currentProgressIndex + 1;
    const adjustedTotal = progressSteps.length;
    const percentage = Math.round((adjustedStep / adjustedTotal) * 100);
    
    const stepTextEl = document.getElementById('step-text');
    const progressPercentEl = document.getElementById('progress-percent');
    const progressBarEl = document.getElementById('progress-bar');
    
    if (stepTextEl) stepTextEl.textContent = `Trin ${adjustedStep} af ${adjustedTotal}`;
    if (progressPercentEl) progressPercentEl.textContent = `${percentage}%`;
    if (progressBarEl) progressBarEl.style.width = `${percentage}%`;
    
    this.updateStepIndicators(adjustedStep, adjustedTotal);
  }

  updateStepIndicators(currentStep, totalSteps) {
    const container = document.getElementById('step-indicators');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= totalSteps; i++) {
      const indicator = document.createElement('div');
      indicator.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300';
      
      if (i < currentStep) {
        indicator.className += ' bg-success text-success-foreground';
        indicator.textContent = '✓';
      } else if (i === currentStep) {
        indicator.className += ' bg-step-active text-primary-foreground';
        indicator.textContent = i;
      } else {
        indicator.className += ' bg-step-inactive text-muted-foreground';
        indicator.textContent = i;
      }
      
      container.appendChild(indicator);
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
      this.updateProgress();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
      this.updateProgress();
    }
  }

  setPeopleCount(count) {
    this.quizData.peopleCount = count;
    
    // Update UI to show selection
    const buttons = document.querySelectorAll('#people-count-step button[data-value]');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-value') == count) {
        btn.className = btn.className.replace('quiz-btn-option', 'quiz-btn-option quiz-btn-option-selected');
      } else {
        btn.className = btn.className.replace('quiz-btn-option-selected', '').replace('quiz-btn-option quiz-btn-option', 'quiz-btn-option');
      }
    });
  }

  updateWeight(person, value) {
    const weight = parseInt(value) || 0;
    this.quizData.weights[person] = weight;
    this.validateWeightStep();
  }

  validateWeightStep() {
    const { peopleCount, weights } = this.quizData;
    const isValid = weights.person1 > 0 && (peopleCount === 1 || weights.person2 > 0);
    const nextBtn = document.getElementById('weight-next-btn');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  setSleepPosition(person, position) {
    this.quizData.sleepPositions[person] = position;
    
    // Update UI
    const buttons = document.querySelectorAll(`button[data-position="${position}"][data-person="${person}"], button[data-position="${position}"]:not([data-person])`);
    buttons.forEach(btn => {
      if ((btn.hasAttribute('data-person') && btn.getAttribute('data-person') === person) || 
          (!btn.hasAttribute('data-person') && this.quizData.peopleCount === 1)) {
        btn.className = btn.className.replace('quiz-btn-option', 'quiz-btn-option quiz-btn-option-selected');
      }
    });
    
    // Reset other buttons for this person
    const allButtons = document.querySelectorAll(`button[data-person="${person}"], button[data-position]:not([data-person])`);
    allButtons.forEach(btn => {
      if (btn.getAttribute('data-position') !== position) {
        btn.className = btn.className.replace('quiz-btn-option-selected', '').replace('quiz-btn-option quiz-btn-option', 'quiz-btn-option');
      }
    });
    
    this.validateSleepPositionStep();
  }

  validateSleepPositionStep() {
    const { peopleCount, sleepPositions } = this.quizData;
    const isValid = sleepPositions.person1 && (peopleCount === 1 || sleepPositions.person2);
    const nextBtn = document.getElementById('sleep-position-next-btn');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  setPreference(person, preference) {
    this.quizData.preferences[person] = preference;
    
    // Update UI
    const buttons = document.querySelectorAll(`button[data-preference="${preference}"][data-person="${person}"], button[data-preference="${preference}"]:not([data-person])`);
    buttons.forEach(btn => {
      if ((btn.hasAttribute('data-person') && btn.getAttribute('data-person') === person) || 
          (!btn.hasAttribute('data-person') && this.quizData.peopleCount === 1)) {
        btn.className = btn.className.replace('quiz-btn-option', 'quiz-btn-option quiz-btn-option-selected');
      }
    });
    
    // Reset other buttons for this person
    const allButtons = document.querySelectorAll(`button[data-person="${person}"], button[data-preference]:not([data-person])`);
    allButtons.forEach(btn => {
      if (btn.getAttribute('data-preference') !== preference) {
        btn.className = btn.className.replace('quiz-btn-option-selected', '').replace('quiz-btn-option quiz-btn-option', 'quiz-btn-option');
      }
    });
    
    this.validatePreferenceStep();
  }

  validatePreferenceStep() {
    const { peopleCount, preferences } = this.quizData;
    const isValid = preferences.person1 && (peopleCount === 1 || preferences.person2);
    const nextBtn = document.getElementById('preference-next-btn');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  updateContactInfo(field, value) {
    this.quizData.contactInfo[field] = value;
    this.validateContactInfoStep();
  }

  validateContactInfoStep() {
    const { contactInfo } = this.quizData;
    const isValid = contactInfo.name && contactInfo.email && contactInfo.phone && contactInfo.marketingConsent;
    const nextBtn = document.getElementById('contact-next-btn');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  /**
   * Get product recommendations based on quiz responses
   */
  getRecommendations() {
    const recommendations = [];
    const { peopleCount, preferences, sleepPositions, weights } = this.quizData;
    
    // For couples, consider couples-specific products
    if (peopleCount === 2) {
      recommendations.push(...this.products.couples.map(product => ({
        ...product,
        score: this.calculateProductScore(product, 'couples')
      })));
    }
    
    // Add products based on firmness preferences
    if (preferences.person1 === 'soft' || (peopleCount === 2 && preferences.person2 === 'soft')) {
      recommendations.push(...this.products.soft.map(product => ({
        ...product,
        score: this.calculateProductScore(product, 'soft')
      })));
    }
    
    if (preferences.person1 === 'medium' || (peopleCount === 2 && preferences.person2 === 'medium')) {
      recommendations.push(...this.products.medium.map(product => ({
        ...product,
        score: this.calculateProductScore(product, 'medium')
      })));
    }
    
    if (preferences.person1 === 'hard' || (peopleCount === 2 && preferences.person2 === 'hard')) {
      recommendations.push(...this.products.hard.map(product => ({
        ...product,
        score: this.calculateProductScore(product, 'hard')
      })));
    }
    
    // Remove duplicates and sort by score
    const uniqueRecommendations = recommendations.reduce((acc, current) => {
      const existing = acc.find(item => item.id === current.id);
      if (!existing) {
        acc.push(current);
      } else if (current.score > existing.score) {
        const index = acc.findIndex(item => item.id === current.id);
        acc[index] = current;
      }
      return acc;
    }, []);
    
    return uniqueRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }

  /**
   * Calculate a score for how well a product matches the quiz responses
   */
  calculateProductScore(product, category) {
    let score = 50; // Base score
    
    const { peopleCount, preferences, sleepPositions, weights } = this.quizData;
    
    // Category match bonus
    if (category === 'couples' && peopleCount === 2) {
      score += 30;
    }
    
    // Preference matching
    if (preferences.person1 === category || (peopleCount === 2 && preferences.person2 === category)) {
      score += 25;
    }
    
    // Sleep position matching (check product tags)
    const productTags = product.tags.map(tag => tag.toLowerCase());
    
    if (sleepPositions.person1 === 'back' && productTags.includes('back-sleeper')) {
      score += 15;
    }
    if (sleepPositions.person1 === 'side' && productTags.includes('side-sleeper')) {
      score += 15;
    }
    if (sleepPositions.person1 === 'stomach' && productTags.includes('stomach-sleeper')) {
      score += 15;
    }
    
    if (peopleCount === 2) {
      if (sleepPositions.person2 === 'back' && productTags.includes('back-sleeper')) {
        score += 10;
      }
      if (sleepPositions.person2 === 'side' && productTags.includes('side-sleeper')) {
        score += 10;
      }
      if (sleepPositions.person2 === 'stomach' && productTags.includes('stomach-sleeper')) {
        score += 10;
      }
    }
    
    // Weight considerations
    const totalWeight = weights.person1 + (peopleCount === 2 ? weights.person2 : 0);
    if (totalWeight > 140 && productTags.includes('heavy-duty')) {
      score += 10;
    }
    
    return Math.min(score, 100); // Cap at 100
  }

  showRecommendations() {
    const loadingElement = document.getElementById('recommendations-loading');
    const resultsElement = document.getElementById('recommendations-results');
    const emptyElement = document.getElementById('recommendations-empty');
    const greetingElement = document.getElementById('recommendations-greeting');
    const gridElement = document.getElementById('recommendations-grid');
    
    // Show loading first
    if (loadingElement) loadingElement.style.display = 'block';
    if (resultsElement) resultsElement.style.display = 'none';
    if (emptyElement) emptyElement.style.display = 'none';
    
    // Submit quiz data
    this.submitQuizData();
    
    // Simulate loading delay
    setTimeout(() => {
      const recommendations = this.getRecommendations();
      
      if (loadingElement) loadingElement.style.display = 'none';
      
      if (recommendations.length === 0) {
        if (emptyElement) emptyElement.style.display = 'block';
      } else {
        if (resultsElement) resultsElement.style.display = 'block';
        if (greetingElement) {
          greetingElement.textContent = `Baseret på dine præferencer, her er vores top anbefalinger til ${this.quizData.contactInfo.name}:`;
        }
        if (gridElement) this.renderRecommendations(recommendations, gridElement);
      }
    }, 2000);
  }

  renderRecommendations(recommendations, container) {
    container.innerHTML = '';
    
    recommendations.forEach((product, index) => {
      const productCard = document.createElement('div');
      productCard.className = `relative bg-card border rounded-lg overflow-hidden ${index === 0 ? 'ring-2 ring-primary' : ''}`;
      
      productCard.innerHTML = `
        ${index === 0 ? '<div class="absolute -top-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">Bedste Match</div>' : ''}
        ${product.featured_image ? `
          <div class="aspect-w-16 aspect-h-9 bg-muted">
            <img 
              src="${product.featured_image}" 
              alt="${product.title}"
              class="w-full h-48 object-cover"
              loading="lazy"
            />
          </div>
        ` : ''}
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-lg font-semibold">${product.title}</h3>
              ${product.vendor ? `<p class="text-sm text-muted-foreground">${product.vendor}</p>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-2 mb-4">
            <div class="text-2xl font-bold text-primary">
              ${this.formatPrice(product.price)}
            </div>
            ${product.compare_at_price && product.compare_at_price > product.price ? `
              <div class="text-sm text-muted-foreground line-through">
                ${this.formatPrice(product.compare_at_price)}
              </div>
            ` : ''}
          </div>
          <p class="text-sm text-muted-foreground mb-4">
            ${product.description}
          </p>
          ${product.tags.length > 0 ? `
            <div class="space-y-2 mb-4">
              <div class="flex flex-wrap gap-1">
                ${product.tags.slice(0, 3).map(tag => `
                  <span class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                    ${tag}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
          <div class="flex gap-2">
            <form action="/cart/add" method="post" enctype="multipart/form-data" class="flex-1">
              <input type="hidden" name="id" value="${product.variants[0]?.id || product.id}">
              <button 
                type="submit" 
                class="quiz-btn quiz-btn-primary w-full h-10 text-sm"
                onclick="futonQuiz.addToCart(${product.variants[0]?.id || product.id}); return false;"
              >
                Læg i kurv
              </button>
            </form>
            <a 
              href="${product.url}" 
              class="quiz-btn quiz-btn-secondary h-10 px-3 text-sm flex items-center"
              target="_blank"
              rel="noopener"
            >
              Se detaljer
            </a>
          </div>
        </div>
      `;
      
      container.appendChild(productCard);
    });
  }

  formatPrice(priceInCents) {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK'
    }).format(priceInCents / 100);
  }

  addToCart(variantId) {
    const formData = new FormData();
    formData.append('id', variantId);
    formData.append('quantity', '1');
    
    fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Show success message
      if (window.Shopify && window.Shopify.theme && window.Shopify.theme.cartDrawer) {
        window.Shopify.theme.cartDrawer.open();
      } else {
        alert('Produkt tilføjet til kurv!');
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      alert('Der opstod en fejl ved tilføjelse til kurv.');
    });
  }

  submitQuizData() {
    const quizResults = {
      ...this.quizData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Submit to Shopify contact form or custom endpoint
    const formData = new FormData();
    formData.append('contact[name]', this.quizData.contactInfo.name);
    formData.append('contact[email]', this.quizData.contactInfo.email);
    formData.append('contact[phone]', this.quizData.contactInfo.phone);
    formData.append('contact[body]', `Quiz Results: ${JSON.stringify(quizResults, null, 2)}`);
    
    fetch('/contact', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        console.log('Quiz data submitted successfully');
      }
    })
    .catch(error => {
      console.error('Error submitting quiz data:', error);
    });
  }

  restart() {
    // Reset quiz data
    this.quizData = {
      peopleCount: 1,
      weights: { person1: 0, person2: 0 },
      sleepPositions: { person1: '', person2: '' },
      preferences: { person1: '', person2: '' },
      contactInfo: {
        name: '',
        email: '',
        phone: '',
        comments: '',
        marketingConsent: false
      }
    };
    
    // Reset form inputs
    const inputs = document.querySelectorAll('#quiz-container input, #quiz-container textarea');
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });
    
    // Reset button selections
    const buttons = document.querySelectorAll('.quiz-btn-option-selected');
    buttons.forEach(btn => {
      btn.className = btn.className.replace('quiz-btn-option-selected', '').replace('quiz-btn-option quiz-btn-option', 'quiz-btn-option');
    });
    
    // Go back to start
    this.currentStep = 0;
    this.showStep(0);
    this.updateProgress();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.futonQuiz = new FutonQuizBlocks();
});