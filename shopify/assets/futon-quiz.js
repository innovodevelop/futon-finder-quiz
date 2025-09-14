/**
 * Futon Quiz - Self-Contained JavaScript Implementation for Shopify
 * Builds all HTML programmatically to avoid conflicts
 */

class FutonQuiz {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 7;
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
    
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.loadProductData();
    this.showStep(0);
    this.updateProgress();
  }

  /**
   * Load product data from the page
   */
  loadProductData() {
    try {
      const productDataElement = document.getElementById('futon-quiz__products-data');
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
    const container = document.getElementById('futon-quiz__container');
    if (!container) return;

    // Clear container
    container.innerHTML = '';
    
    // Build and show current step
    let stepHTML = '';
    switch(stepIndex) {
      case 0:
        stepHTML = this.buildStartStep();
        break;
      case 1:
        stepHTML = this.buildPeopleCountStep();
        break;
      case 2:
        stepHTML = this.buildWeightStep();
        break;
      case 3:
        stepHTML = this.buildSleepPositionStep();
        break;
      case 4:
        stepHTML = this.buildPreferenceStep();
        break;
      case 5:
        stepHTML = this.buildContactInfoStep();
        break;
      case 6:
        stepHTML = this.buildRecommendationStep();
        break;
    }
    
    container.innerHTML = stepHTML;
    
    // Show/hide progress indicator
    const progressIndicator = document.getElementById('futon-quiz__progress-indicator');
    if (stepIndex === 0 || stepIndex === 6) {
      progressIndicator.style.display = 'none';
    } else {
      progressIndicator.style.display = 'block';
    }
    
    // Initialize step-specific functionality
    this.initializeStepEvents(stepIndex);
  }

  initializeStepEvents(stepIndex) {
    switch(stepIndex) {
      case 2: // Weight step
        this.validateWeightStep();
        break;
      case 3: // Sleep position step
        this.validateSleepPositionStep();
        break;
      case 4: // Preference step
        this.validatePreferenceStep();
        break;
      case 5: // Contact info step
        this.validateContactInfoStep();
        break;
      case 6: // Recommendation step
        this.showRecommendations();
        break;
    }
  }

  buildStartStep() {
    return `
      <div class="futon-quiz__step futon-quiz__text-center futon-quiz__container" style="max-width: 32rem; margin: 0 auto;">
        <div class="futon-quiz__space-y-6">
          <div class="futon-quiz__space-y-4">
            <img 
              src="${window.location.origin}/cdn/shop/files/futon-hero.jpg" 
              alt="Comfortable futon setup" 
              class="futon-quiz__hero-image"
              loading="eager"
            />
            <h1 class="futon-quiz__title">
              Find Din Perfekte Futon
            </h1>
            <p class="futon-quiz__description">
              Tag vores personlige test for at opdage den ideelle futon til dine komfortbehov. 
              Baseret på dine søvnpræferencer anbefaler vi det perfekte match fra vores kollektion.
            </p>
          </div>

          <div class="futon-quiz__info-box">
            <h3 class="futon-quiz__subtitle futon-quiz__mb-4">Hvad du får:</h3>
            <div class="futon-quiz__grid futon-quiz__grid--cols-1 futon-quiz__grid--md-cols-3 futon-quiz__gap-4">
              <div class="futon-quiz__flex futon-quiz__items-center futon-quiz__gap-2 futon-quiz__justify-center">
                <div class="futon-quiz__bullet--success"></div>
                <span>Personlige anbefalinger</span>
              </div>
              <div class="futon-quiz__flex futon-quiz__items-center futon-quiz__gap-2 futon-quiz__justify-center">
                <div class="futon-quiz__bullet--success"></div>
                <span>Ekspert vejledning</span>
              </div>
              <div class="futon-quiz__flex futon-quiz__items-center futon-quiz__gap-2 futon-quiz__justify-center">
                <div class="futon-quiz__bullet--success"></div>
                <span>Perfekt komfort match</span>
              </div>
            </div>
          </div>

          <div class="futon-quiz__space-y-4">
            <button 
              class="futon-quiz__btn futon-quiz__btn--primary"
              style="height: 3rem; padding: 0 3rem; font-size: 1rem; border-radius: 0.5rem;"
              onclick="futonQuiz.startQuiz()"
            >
              Start Test
            </button>
            
            <p style="font-size: 0.75rem; color: hsl(var(--quiz-muted-foreground));">
              Tager kun 2-3 minutter at gennemføre
            </p>
          </div>
        </div>
      </div>
    `;
  }

  buildPeopleCountStep() {
    const { peopleCount } = this.quizData;
    return `
      <div class="futon-quiz__step futon-quiz__container" style="max-width: 32rem; margin: 0 auto;">
        <div class="futon-quiz__text-center futon-quiz__mb-8">
          <h2 class="futon-quiz__title" style="font-size: 1.875rem; margin-bottom: 1rem;">
            Hvor mange personer skal bruge denne futon?
          </h2>
          <p class="futon-quiz__description">
            Dette hjælper os med at anbefale den rigtige størrelse og fasthed til dine behov.
          </p>
        </div>

        <div class="futon-quiz__grid futon-quiz__grid--cols-1 futon-quiz__grid--md-cols-2 futon-quiz__gap-4 futon-quiz__mb-8">
          <button
            class="futon-quiz__btn futon-quiz__btn--option ${peopleCount === 1 ? 'futon-quiz__btn--option-selected' : ''}"
            style="flex-direction: column; gap: 0.75rem;"
            onclick="futonQuiz.setPeopleCount(1)"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <div>
              <div class="futon-quiz__option-title">Kun Mig</div>
              <div class="futon-quiz__option-description">Enkeltperson brug</div>
            </div>
          </button>

          <button
            class="futon-quiz__btn futon-quiz__btn--option ${peopleCount === 2 ? 'futon-quiz__btn--option-selected' : ''}"
            style="flex-direction: column; gap: 0.75rem;"
            onclick="futonQuiz.setPeopleCount(2)"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="m22 21-2-2"/>
              <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0"/>
            </svg>
            <div>
              <div class="futon-quiz__option-title">To Personer</div>
              <div class="futon-quiz__option-description">Par eller delt brug</div>
            </div>
          </button>
        </div>

        <div class="futon-quiz__flex futon-quiz__justify-between">
          <button class="futon-quiz__btn futon-quiz__btn--secondary" style="height: 2.5rem; padding: 0 1rem;" onclick="futonQuiz.prevStep()">
            Tilbage
          </button>
          <button class="futon-quiz__btn futon-quiz__btn--primary" style="height: 2.5rem; padding: 0 1rem;" onclick="futonQuiz.nextStep()">
            Fortsæt
          </button>
        </div>
      </div>
    `;
  }

  buildWeightStep() {
    const { peopleCount, weights } = this.quizData;
    const isTwoPeople = peopleCount === 2;
    
    return `
      <div class="quiz-step quiz-container" style="max-width: 32rem; margin: 0 auto;">
        <div class="quiz-text-center quiz-mb-8">
          <h2 class="quiz-title" style="font-size: 1.875rem; margin-bottom: 1rem;">
            ${isTwoPeople ? 'Hvad er jeres vægt?' : 'Hvad er din vægt?'}
          </h2>
          <p class="quiz-description">
            Dette hjælper os med at anbefale den rigtige fasthed og støtte til dine behov.
          </p>
        </div>

        <div class="quiz-mb-6 ${isTwoPeople ? 'quiz-grid quiz-grid-cols-1 quiz-md:grid-cols-2 quiz-gap-6' : 'quiz-space-y-4'}">
          <div>
            <label class="quiz-option-title quiz-mb-4" style="display: block;">
              ${isTwoPeople ? 'Person 1 vægt (kg)' : 'Din vægt (kg)'}
            </label>
            <input
              type="number"
              class="quiz-input"
              placeholder="Indtast vægt i kg"
              value="${weights.person1 || ''}"
              oninput="futonQuiz.updateWeight('person1', this.value)"
              min="30"
              max="200"
            />
          </div>
          ${isTwoPeople ? `
            <div>
              <label class="quiz-option-title quiz-mb-4" style="display: block;">
                Person 2 vægt (kg)
              </label>
              <input
                type="number"
                class="quiz-input"
                placeholder="Indtast vægt i kg"
                value="${weights.person2 || ''}"
                oninput="futonQuiz.updateWeight('person2', this.value)"
                min="30"
                max="200"
              />
            </div>
          ` : ''}
        </div>

        <div class="quiz-flex quiz-justify-between">
          <button class="quiz-btn quiz-btn-secondary" style="height: 2.5rem; padding: 0 1rem;" onclick="futonQuiz.prevStep()">
            Tilbage
          </button>
          <button 
            id="weight-next-btn" 
            class="quiz-btn quiz-btn-primary" 
            style="height: 2.5rem; padding: 0 1rem;" 
            onclick="futonQuiz.nextStep()"
            disabled
          >
            Fortsæt
          </button>
        </div>
      </div>
    `;
  }

  buildSleepPositionStep() {
    const { peopleCount, sleepPositions } = this.quizData;
    const isTwoPeople = peopleCount === 2;
    
    return `
      <div class="quiz-step quiz-container" style="max-width: 32rem; margin: 0 auto;">
        <div class="quiz-text-center quiz-mb-8">
          <h2 class="quiz-title" style="font-size: 1.875rem; margin-bottom: 1rem;">
            ${isTwoPeople ? 'Hvilke sovpositioner foretrækker I?' : 'Hvilken sovposition foretrækker du?'}
          </h2>
          <p class="quiz-description">
            Din sovposition påvirker, hvilken type støtte og fasthed der er bedst for dig.
          </p>
        </div>

        ${!isTwoPeople ? `
          <div class="quiz-grid quiz-grid-cols-1 quiz-gap-4 quiz-mb-8">
            ${this.buildSleepPositionButtons('person1', sleepPositions.person1)}
          </div>
        ` : `
          <div class="quiz-space-y-6 quiz-mb-8">
            <div>
              <h3 class="quiz-subtitle quiz-mb-4">Person 1</h3>
              <div class="quiz-grid quiz-grid-cols-1 quiz-gap-3">
                ${this.buildSleepPositionButtons('person1', sleepPositions.person1)}
              </div>
            </div>
            <div>
              <h3 class="quiz-subtitle quiz-mb-4">Person 2</h3>
              <div class="quiz-grid quiz-grid-cols-1 quiz-gap-3">
                ${this.buildSleepPositionButtons('person2', sleepPositions.person2)}
              </div>
            </div>
          </div>
        `}

        <div class="quiz-flex quiz-justify-between">
          <button class="quiz-btn quiz-btn-secondary" style="height: 2.5rem; padding: 0 1rem;" onclick="futonQuiz.prevStep()">
            Tilbage
          </button>
          <button 
            id="sleep-position-next-btn" 
            class="quiz-btn quiz-btn-primary" 
            style="height: 2.5rem; padding: 0 1rem;" 
            onclick="futonQuiz.nextStep()"
            disabled
          >
            Fortsæt
          </button>
        </div>
      </div>
    `;
  }

  buildSleepPositionButtons(person, selectedPosition) {
    const positions = [
      { value: 'back', title: 'Ryg', description: 'Jeg sover på ryggen', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="m19 7-1.5 1.5M5 7l1.5 1.5"/></svg>' },
      { value: 'side', title: 'Side', description: 'Jeg sover på siden', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18h20"/><path d="M6 14h12"/><path d="M8 10h8"/><circle cx="12" cy="6" r="2"/></svg>' },
      { value: 'stomach', title: 'Mave', description: 'Jeg sover på maven', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="11" rx="8" ry="6"/><circle cx="12" cy="5" r="2"/></svg>' }
    ];
    
    return positions.map(position => `
      <button
        class="quiz-btn quiz-btn-option ${selectedPosition === position.value ? 'quiz-btn-option-selected' : ''}"
        style="flex-direction: row; gap: 1rem; text-align: left; justify-content: flex-start;"
        onclick="futonQuiz.setSleepPosition('${person}', '${position.value}')"
      >
        <div style="flex-shrink: 0;">
          ${position.icon}
        </div>
        <div>
          <div class="quiz-option-title">${position.title}</div>
          <div class="quiz-option-description">${position.description}</div>
        </div>
      </button>
    `).join('');
  }

  buildPreferenceStep() {
    const { peopleCount, preferences } = this.quizData;
    const isTwoPeople = peopleCount === 2;
    
    return `
      <div class="quiz-step quiz-container" style="max-width: 32rem; margin: 0 auto;">
        <div class="quiz-text-center quiz-mb-8">
          <h2 class="quiz-title" style="font-size: 1.875rem; margin-bottom: 1rem;">
            ${isTwoPeople ? 'Hvilken matras fasthed foretrækker I?' : 'Hvilken matras fasthed foretrækker du?'}
          </h2>
          <p class="quiz-description">
            Fasthed påvirker komfort og støtte. Vælg hvad der føles bedst for dig.
          </p>
        </div>

        ${!isTwoPeople ? `
          <div class="quiz-grid quiz-grid-cols-1 quiz-gap-4 quiz-mb-8">
            ${this.buildPreferenceButtons('person1', preferences.person1)}
          </div>
        ` : `
          <div class="quiz-space-y-6 quiz-mb-8">
            <div>
              <h3 class="quiz-subtitle quiz-mb-4">Person 1</h3>
              <div class="quiz-grid quiz-grid-cols-1 quiz-gap-3">
                ${this.buildPreferenceButtons('person1', preferences.person1)}
              </div>
            </div>
            <div>
              <h3 class="quiz-subtitle quiz-mb-4">Person 2</h3>
              <div class="quiz-grid quiz-grid-cols-1 quiz-gap-3">
                ${this.buildPreferenceButtons('person2', preferences.person2)}
              </div>
            </div>
          </div>
        `}

        <div class="quiz-flex quiz-justify-between">
          <button class="quiz-btn quiz-btn-secondary" style="height: 2.5rem; padding: 0 1rem;" onclick="futonQuiz.prevStep()">
            Tilbage
          </button>
          <button 
            id="preference-next-btn" 
            class="quiz-btn quiz-btn-primary" 
            style="height: 2.5rem; padding: 0 1rem;" 
            onclick="futonQuiz.nextStep()"
            disabled
          >
            Fortsæt
          </button>
        </div>
      </div>
    `;
  }

  buildPreferenceButtons(person, selectedPreference) {
    const preferences = [
      { value: 'soft', title: 'Blød', description: 'Jeg foretrækker bløde madrasser', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 19V5"/><path d="M10 19V6.8"/><path d="M14 19v-7.8"/><path d="M18 5v4"/><path d="M18 19v-6"/></svg>' },
      { value: 'medium', title: 'Medium', description: 'Jeg foretrækker medium-faste madrasser', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 19V5"/><path d="M10 19V7"/><path d="M14 19V9"/><path d="M18 19v-8"/></svg>' },
      { value: 'hard', title: 'Fast', description: 'Jeg foretrækker faste madrasser', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 12h18"/></svg>' }
    ];
    
    return preferences.map(preference => `
      <button
        class="quiz-btn quiz-btn-option ${selectedPreference === preference.value ? 'quiz-btn-option-selected' : ''}"
        style="flex-direction: row; gap: 1rem; text-align: left; justify-content: flex-start;"
        onclick="futonQuiz.setPreference('${person}', '${preference.value}')"
      >
        <div style="flex-shrink: 0;">
          ${preference.icon}
        </div>
        <div>
          <div class="quiz-option-title">${preference.title}</div>
          <div class="quiz-option-description">${preference.description}</div>
        </div>
      </button>
    `).join('');
  }

  buildContactInfoStep() {
    const { contactInfo } = this.quizData;
    
    return `
      <div class="quiz-step quiz-container" style="max-width: 32rem; margin: 0 auto;">
        <div class="quiz-text-center quiz-mb-8">
          <h2 class="quiz-title" style="font-size: 1.875rem; margin-bottom: 1rem;">
            Kontaktoplysninger
          </h2>
          <p class="quiz-description">
            Indtast dine kontaktoplysninger, så vi kan sende dig dine personlige anbefalinger.
          </p>
        </div>

        <div class="quiz-space-y-4 quiz-mb-6">
          <div>
            <label class="quiz-option-title quiz-mb-4" style="display: block;">Fulde navn *</label>
            <input
              type="text"
              class="quiz-input"
              placeholder="Indtast dit fulde navn"
              value="${contactInfo.name}"
              oninput="futonQuiz.updateContactInfo('name', this.value)"
              required
            />
          </div>
          
          <div>
            <label class="quiz-option-title quiz-mb-4" style="display: block;">Email adresse *</label>
            <input
              type="email"
              class="quiz-input"
              placeholder="din@email.dk"
              value="${contactInfo.email}"
              oninput="futonQuiz.updateContactInfo('email', this.value)"
              required
            />
          </div>
          
          <div>
            <label class="quiz-option-title quiz-mb-4" style="display: block;">Telefonnummer *</label>
            <input
              type="tel"
              class="quiz-input"
              placeholder="+45 12 34 56 78"
              value="${contactInfo.phone}"
              oninput="futonQuiz.updateContactInfo('phone', this.value)"
              required
            />
          </div>
          
          <div>
            <label class="quiz-option-title quiz-mb-4" style="display: block;">Yderligere kommentarer (valgfrit)</label>
            <textarea
              class="quiz-input quiz-textarea"
              placeholder="Har du specielle ønsker eller spørgsmål?"
              oninput="futonQuiz.updateContactInfo('comments', this.value)"
            >${contactInfo.comments}</textarea>
          </div>
        </div>

        <div class="quiz-info-box quiz-mb-6">
          <h3 class="quiz-subtitle quiz-mb-4">Næste skridt:</h3>
          <div class="quiz-space-y-2">
            <div class="quiz-flex quiz-items-center quiz-gap-2">
              <div class="quiz-bullet-success"></div>
              <span>Få personlige produktanbefalinger</span>
            </div>
            <div class="quiz-flex quiz-items-center quiz-gap-2">
              <div class="quiz-bullet-success"></div>
              <span>Kontakt fra vores eksperter</span>
            </div>
            <div class="quiz-flex quiz-items-center quiz-gap-2">
              <div class="quiz-bullet-success"></div>
              <span>Særlige tilbud og rabatter</span>
            </div>
          </div>
        </div>

        <div class="quiz-mb-6">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
            <input
              type="checkbox"
              ${contactInfo.marketingConsent ? 'checked' : ''}
              onchange="futonQuiz.updateContactInfo('marketingConsent', this.checked)"
              style="width: 1rem; height: 1rem;"
            />
            <span style="font-size: 0.875rem;">
              Jeg accepterer at modtage markedsføringsmateriale og produktanbefalinger via email og telefon. *
            </span>
          </label>
        </div>

        <div class="quiz-flex quiz-justify-between">
          <button class="quiz-btn quiz-btn-secondary" style="height: 2.5rem; padding: 0 1rem;" onclick="futonQuiz.prevStep()">
            Tilbage
          </button>
          <button 
            id="contact-next-btn" 
            class="quiz-btn quiz-btn-primary" 
            style="height: 2.5rem; padding: 0 1rem;" 
            onclick="futonQuiz.nextStep()"
            disabled
          >
            Få Anbefalinger
          </button>
        </div>
      </div>
    `;
  }

  buildRecommendationStep() {
    return `
      <div class="quiz-step">
        <!-- Loading State -->
        <div id="recommendations-loading" class="quiz-loading">
          <div class="quiz-loading-spinner"></div>
          <h2 class="quiz-subtitle quiz-mb-4">Finder dine perfekte futoner...</h2>
          <p class="quiz-description">
            Vi analyserer dine præferencer og finder de bedste matches fra vores kollektion.
          </p>
        </div>

        <!-- Results State -->
        <div id="recommendations-results" style="display: none;">
          <div class="quiz-text-center quiz-mb-8">
            <h2 class="quiz-title" style="font-size: 1.875rem; margin-bottom: 1rem;">
              Dine Personlige Anbefalinger
            </h2>
            <p id="recommendations-greeting" class="quiz-description"></p>
          </div>

          <div id="recommendations-grid" class="quiz-grid quiz-grid-cols-1 quiz-md:grid-cols-2 quiz-gap-6 quiz-mb-8">
            <!-- Product recommendations will be inserted here -->
          </div>

          <div class="quiz-text-center">
            <button 
              class="quiz-btn quiz-btn-secondary" 
              style="height: 2.5rem; padding: 0 1rem; margin-right: 1rem;"
              onclick="futonQuiz.restart()"
            >
              Tag Test Igen
            </button>
            <a 
              href="/collections/all" 
              class="quiz-btn quiz-btn-primary" 
              style="height: 2.5rem; padding: 0 1rem; display: inline-flex; align-items: center; text-decoration: none;"
            >
              Se Alle Produkter
            </a>
          </div>
        </div>

        <!-- Empty State -->
        <div id="recommendations-empty" style="display: none;" class="quiz-text-center">
          <h2 class="quiz-title" style="font-size: 1.875rem; margin-bottom: 1rem;">
            Ingen anbefalinger fundet
          </h2>
          <p class="quiz-description quiz-mb-6">
            Vi kunne ikke finde specifikke produkter der matcher dine præferencer. 
            Prøv at tage testen igen eller kontakt os direkte for personlig vejledning.
          </p>
          <button 
            class="quiz-btn quiz-btn-primary" 
            style="height: 2.5rem; padding: 0 1rem;"
            onclick="futonQuiz.restart()"
          >
            Tag Test Igen
          </button>
        </div>
      </div>
    `;
  }

  // Quiz navigation and interaction methods
  startQuiz() {
    this.currentStep = 1;
    this.showStep(this.currentStep);
    this.updateProgress();
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

  updateProgress() {
    if (this.currentStep === 0 || this.currentStep === 6) return;
    
    const adjustedStep = this.currentStep;
    const adjustedTotal = this.totalSteps - 2; // Exclude start and recommendation steps
    const percentage = Math.round((adjustedStep / adjustedTotal) * 100);
    
    const stepText = document.getElementById('futon-quiz__step-text');
    const progressPercent = document.getElementById('futon-quiz__progress-percent');
    const progressBar = document.getElementById('futon-quiz__progress-bar');
    
    if (stepText) stepText.textContent = `Trin ${adjustedStep} af ${adjustedTotal}`;
    if (progressPercent) progressPercent.textContent = `${percentage}%`;
    if (progressBar) progressBar.style.width = `${percentage}%`;
    
    this.updateStepIndicators();
  }

  updateStepIndicators() {
    const container = document.getElementById('futon-quiz__step-indicators');
    if (!container) return;
    
    container.innerHTML = '';
    const adjustedTotal = this.totalSteps - 2;
    
    for (let i = 1; i <= adjustedTotal; i++) {
      const indicator = document.createElement('div');
      indicator.className = 'futon-quiz__step-indicator';
      
      if (i < this.currentStep) {
        indicator.classList.add('futon-quiz__step-indicator--completed');
        indicator.textContent = '✓';
      } else if (i === this.currentStep) {
        indicator.classList.add('futon-quiz__step-indicator--active');
        indicator.textContent = i;
      } else {
        indicator.classList.add('futon-quiz__step-indicator--inactive');
        indicator.textContent = i;
      }
      
      container.appendChild(indicator);
    }
  }

  // Data update methods
  setPeopleCount(count) {
    this.quizData.peopleCount = count;
    this.showStep(this.currentStep); // Refresh to update UI
  }

  updateWeight(person, value) {
    const weight = parseInt(value) || 0;
    this.quizData.weights[person] = weight;
    this.validateWeightStep();
  }

  setSleepPosition(person, position) {
    this.quizData.sleepPositions[person] = position;
    this.showStep(this.currentStep); // Refresh to update UI
    this.validateSleepPositionStep();
  }

  setPreference(person, preference) {
    this.quizData.preferences[person] = preference;
    this.showStep(this.currentStep); // Refresh to update UI
    this.validatePreferenceStep();
  }

  updateContactInfo(field, value) {
    this.quizData.contactInfo[field] = value;
    this.validateContactInfoStep();
  }

  // Validation methods
  validateWeightStep() {
    const { peopleCount, weights } = this.quizData;
    const isValid = weights.person1 > 0 && (peopleCount === 1 || weights.person2 > 0);
    const nextBtn = document.getElementById('futon-quiz__weight-next-btn');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  validateSleepPositionStep() {
    const { peopleCount, sleepPositions } = this.quizData;
    const isValid = sleepPositions.person1 && (peopleCount === 1 || sleepPositions.person2);
    const nextBtn = document.getElementById('futon-quiz__sleep-position-next-btn');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  validatePreferenceStep() {
    const { peopleCount, preferences } = this.quizData;
    const isValid = preferences.person1 && (peopleCount === 1 || preferences.person2);
    const nextBtn = document.getElementById('futon-quiz__preference-next-btn');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  validateContactInfoStep() {
    const { contactInfo } = this.quizData;
    const isValid = contactInfo.name && contactInfo.email && contactInfo.phone && contactInfo.marketingConsent;
    const nextBtn = document.getElementById('futon-quiz__contact-next-btn');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  // Recommendation methods
  showRecommendations() {
    const loadingElement = document.getElementById('recommendations-loading');
    const resultsElement = document.getElementById('recommendations-results');
    const emptyElement = document.getElementById('recommendations-empty');
    
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
        const greetingElement = document.getElementById('recommendations-greeting');
        const gridElement = document.getElementById('recommendations-grid');
        
        if (greetingElement) {
          greetingElement.textContent = `Baseret på dine præferencer, her er vores top anbefalinger til ${this.quizData.contactInfo.name}:`;
        }
        if (gridElement) {
          this.renderRecommendations(recommendations, gridElement);
        }
      }
    }, 2000);
  }

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
    
    if (sleepPositions.person1 === 'back' && productTags.includes('futon-back-sleeper')) {
      score += 15;
    }
    if (sleepPositions.person1 === 'side' && productTags.includes('futon-side-sleeper')) {
      score += 15;
    }
    if (sleepPositions.person1 === 'stomach' && productTags.includes('futon-stomach-sleeper')) {
      score += 15;
    }
    
    if (peopleCount === 2) {
      if (sleepPositions.person2 === 'back' && productTags.includes('futon-back-sleeper')) {
        score += 10;
      }
      if (sleepPositions.person2 === 'side' && productTags.includes('futon-side-sleeper')) {
        score += 10;
      }
      if (sleepPositions.person2 === 'stomach' && productTags.includes('futon-stomach-sleeper')) {
        score += 10;
      }
    }
    
    // Weight considerations
    const totalWeight = weights.person1 + (peopleCount === 2 ? weights.person2 : 0);
    if (totalWeight > 140 && productTags.includes('futon-heavy-duty')) {
      score += 10;
    }
    
    return Math.min(score, 100); // Cap at 100
  }

  renderRecommendations(recommendations, container) {
    container.innerHTML = '';
    
    recommendations.forEach((product, index) => {
      const productCard = document.createElement('div');
      productCard.className = `quiz-card ${index === 0 ? 'quiz-best-match' : ''}`;
      productCard.style.position = 'relative';
      
      productCard.innerHTML = `
        ${index === 0 ? '<div style="position: absolute; top: -8px; right: -8px; background: hsl(var(--quiz-primary)); color: hsl(var(--quiz-primary-foreground)); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">Bedste Match</div>' : ''}
        ${product.featured_image ? `
          <div style="aspect-ratio: 16/9; background: hsl(var(--quiz-muted));">
            <img 
              src="${product.featured_image}" 
              alt="${product.title}"
              style="width: 100%; height: 12rem; object-fit: cover;"
              loading="lazy"
            />
          </div>
        ` : ''}
        <div class="quiz-card-content">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <div>
              <h3 style="font-size: 1.125rem; font-weight: 600;">${product.title}</h3>
              ${product.vendor ? `<p style="font-size: 0.875rem; color: hsl(var(--quiz-muted-foreground));">${product.vendor}</p>` : ''}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
            <div style="font-size: 1.5rem; font-weight: 700; color: hsl(var(--quiz-primary));">
              ${this.formatPrice(product.price)}
            </div>
            ${product.compare_at_price && product.compare_at_price > product.price ? `
              <div style="font-size: 0.875rem; color: hsl(var(--quiz-muted-foreground)); text-decoration: line-through;">
                ${this.formatPrice(product.compare_at_price)}
              </div>
            ` : ''}
          </div>
          <p style="font-size: 0.875rem; color: hsl(var(--quiz-muted-foreground)); margin-bottom: 1rem;">
            ${product.description}
          </p>
          <div class="quiz-space-y-2">
            <button 
              class="quiz-btn quiz-btn-primary"
              style="width: 100%; height: 2.5rem;"
              onclick="futonQuiz.addToCart(${product.variants[0].id})"
              ${!product.variants[0].available ? 'disabled' : ''}
            >
              ${product.variants[0].available ? 'Tilføj til kurv' : 'Udsolgt'}
            </button>
            <a 
              href="${product.url}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="quiz-btn quiz-btn-secondary"
              style="width: 100%; height: 2.5rem; display: flex; align-items: center; justify-content: center; text-decoration: none;"
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
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          id: variantId,
          quantity: 1
        }]
      })
    })
    .then(response => response.json())
    .then(data => {
      if (window.location.pathname !== '/cart') {
        window.location.href = '/cart';
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      alert('Der opstod en fejl ved tilføjelse til kurven. Prøv igen.');
    });
  }

  async submitQuizData() {
    try {
      const formData = new FormData();
      formData.append('contact[first_name]', this.quizData.contactInfo.name.split(' ')[0] || '');
      formData.append('contact[last_name]', this.quizData.contactInfo.name.split(' ').slice(1).join(' ') || '');
      formData.append('contact[email]', this.quizData.contactInfo.email);
      formData.append('contact[phone]', this.quizData.contactInfo.phone);
      formData.append('contact[note]', `Futon Quiz Results:
People Count: ${this.quizData.peopleCount}
Weights: Person 1: ${this.quizData.weights.person1}kg${this.quizData.weights.person2 ? `, Person 2: ${this.quizData.weights.person2}kg` : ''}
Sleep Positions: Person 1: ${this.quizData.sleepPositions.person1}${this.quizData.sleepPositions.person2 ? `, Person 2: ${this.quizData.sleepPositions.person2}` : ''}
Preferences: Person 1: ${this.quizData.preferences.person1}${this.quizData.preferences.person2 ? `, Person 2: ${this.quizData.preferences.person2}` : ''}
Comments: ${this.quizData.contactInfo.comments || 'None'}`);
      formData.append('contact[tags]', 'futon-quiz-participant');
      
      if (this.quizData.contactInfo.marketingConsent) {
        formData.append('contact[accepts_marketing]', '1');
      }

      const response = await fetch('/contact', {
        method: 'POST',
        body: formData
      });

      return response.ok;
    } catch (error) {
      console.error('Error submitting quiz data:', error);
      return false;
    }
  }

  restart() {
    this.currentStep = 0;
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
    
    this.showStep(0);
    this.updateProgress();
  }
}

// Initialize the quiz when the DOM is ready
(function() {
  function initQuiz() {
    window.futonQuiz = new FutonQuiz();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
  } else {
    initQuiz();
  }
})();