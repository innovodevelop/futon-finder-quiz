/**
 * Enhanced Futon Quiz with Tag-Based Product Selection  
 * Self-contained implementation that builds HTML programmatically
 * Updated to use React component class names for consistency
 */
class FutonQuizSingleCollection {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 7;
    this.quizData = {
      peopleCount: 1,
      weights: { person1: 0, person2: 0 },
      heights: { person1: 0, person2: 0 },
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
    
    this.products = [];
    this.tagMappings = window.quizConfig?.tagMappings || {};
    
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
    console.log('Futon Quiz (Single Collection) config:', window.quizConfig);
    this.loadProductData();
    this.showStep(0);
  }

  updateProgress() {
    const progressContainer = document.getElementById('fq-progress-indicator');
    if (!progressContainer || this.currentStep === 0 || this.currentStep === 6) return;

    const progressSteps = this.totalSteps - 2; // Exclude start and end steps
    const currentProgress = this.currentStep;
    const progressPercentage = Math.round((currentProgress / progressSteps) * 100);

    const progressText = progressContainer.querySelectorAll('.fq-progress__text');
    const progressBar = progressContainer.querySelector('.fq-progress__fill');
    const stepIndicators = progressContainer.querySelectorAll('.fq-progress__step');

    if (progressText.length >= 2) {
      progressText[0].textContent = `Trin ${currentProgress} af ${progressSteps}`;
      progressText[1].textContent = `${progressPercentage}%`;
    }

    if (progressBar) {
      progressBar.style.width = `${progressPercentage}%`;
    }

    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
      const stepNumber = index + 1;
      if (stepNumber < currentProgress) {
        indicator.className = 'fq-progress__step fq-progress__step--completed';
        indicator.textContent = '✓';
      } else if (stepNumber === currentProgress) {
        indicator.className = 'fq-progress__step fq-progress__step--current';
        indicator.textContent = stepNumber;
      } else {
        indicator.className = 'fq-progress__step fq-progress__step--inactive';
        indicator.textContent = stepNumber;
      }
    });
  }

  /**
   * Load product data from single collection
   */
  loadProductData() {
    try {
      const productDataElement = document.getElementById('futon-quiz__products-data');
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

  showStep(stepIndex) {
    const container = document.getElementById('futon-quiz-container');
    if (!container) return;

    // Update current step
    this.currentStep = stepIndex;

    // Clear container
    container.innerHTML = '';
    
    // Build and show current step
    let stepHTML = '';
    
    switch (stepIndex) {
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
      default:
        stepHTML = this.buildStartStep();
    }

    // Wrap step content in futon-quiz__card to match React component structure
    container.innerHTML = `<div class="futon-quiz__card">${stepHTML}</div>`;

    // Show/hide progress indicator (hidden on start and end)
    const progressIndicator = document.getElementById('fq-progress-indicator');
    if (progressIndicator) {
      if (stepIndex === 0 || stepIndex === 6) {
        progressIndicator.style.display = 'none';
      } else {
        progressIndicator.style.display = 'block';
        this.updateProgress();
      }
    }

    // Initialize step-specific events
    this.initializeStepEvents(stepIndex);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div id="fq-start-step" class="fq-start">
        <div class="fq-step__content">
          <img 
            id="fq-start-hero-image"
            src="${window.quizConfig?.heroImageUrl || ''}" 
            alt="Comfortable futon setup" 
            class="fq-start__hero"
            loading="eager"
            onerror="this.style.display='none'"
          />
          <h1 class="fq-start__title">
            Find Din Perfekte Futon
          </h1>
          <p class="fq-start__description">
            Tag vores personlige test for at opdage den ideelle futon til dine komfortbehov. 
            Baseret på dine søvnpræferencer anbefaler vi det perfekte match fra vores kollektion.
          </p>
        </div>

        <div class="fq-start__features">
          <h3 class="fq-start__features-title">Hvad du får:</h3>
          <div class="fq-start__features-grid">
            <div class="fq-start__feature">
              <div class="fq-start__feature-dot"></div>
              <span>Personlige anbefalinger</span>
            </div>
            <div class="fq-start__feature">
              <div class="fq-start__feature-dot"></div>
              <span>Ekspert vejledning</span>
            </div>
            <div class="fq-start__feature">
              <div class="fq-start__feature-dot"></div>
              <span>Perfekt komfort match</span>
            </div>
          </div>
        </div>

        <div class="fq-start__cta">
          <button 
            id="fq-start-button"
            class="fq-btn--quiz text-base"
            onclick="futonQuizSingleCollection.startQuiz()"
          >
            Start Test
          </button>
          
          <p class="fq-start__note">
            Tager kun 2-3 minutter at gennemføre
          </p>
        </div>
      </div>
    `;
  }

  buildPeopleCountStep() {
    const { peopleCount } = this.quizData;
    return `
      <div class="fq-step">
        <div class="fq-step__header">
          <h2 class="fq-step__title">
            Hvor mange personer skal bruge denne futon?
          </h2>
          <p class="fq-step__subtitle">
            Dette hjælper os med at anbefale den rigtige størrelse og fasthed til dine behov.
          </p>
        </div>

        <div class="fq-options mb-8">
          <button
            class="${peopleCount === 1 ? 'fq-btn--option-selected' : 'fq-btn--option'}"
            onclick="futonQuizSingleCollection.setPeopleCount(1)"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <div>
              <div style="font-size: 1.125rem; font-weight: 600;">Kun Mig</div>
              <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground));">Enkeltperson brug</div>
            </div>
          </button>
          <button
            class="${peopleCount === 2 ? 'fq-btn--option-selected' : 'fq-btn--option'}"
            onclick="futonQuizSingleCollection.setPeopleCount(2)"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="m22 21-2-2"/>
              <path d="m16 16-2-2"/>
              <circle cx="20" cy="8" r="3"/>
            </svg>
            <div>
              <div style="font-size: 1.125rem; font-weight: 600;">To Personer</div>
              <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground));">Par eller delt brug</div>
            </div>
          </button>
        </div>

        <div class="fq-step__navigation">
          <button class="fq-btn--secondary" onclick="futonQuizSingleCollection.prevStep()">
            Tilbage
          </button>
          <button 
            class="fq-btn--quiz"
            onclick="futonQuizSingleCollection.nextStep()"
          >
            Fortsæt
          </button>
        </div>
      </div>
    `;
  }

  buildWeightStep() {
    const { peopleCount, weights, heights } = this.quizData;
    const isTwoPeople = peopleCount === 2;
    
    return `
      <div class="fq-step">
        <div class="fq-step__header">
          <h2 class="fq-step__title">
            ${isTwoPeople ? 'Hvad er jeres vægt og højde?' : 'Hvad er din vægt og højde?'}
          </h2>
          <p class="fq-step__subtitle">
            Vægt og højde hjælper vores medarbejdere med at give dig personlig rådgivning.
          </p>
        </div>

        <div class="fq-form-section ${isTwoPeople ? 'fq-form-section--spaced' : ''}">
          <div>
            <h3 class="fq-form-section__title">
              ${isTwoPeople ? 'Person 1 oplysninger' : 'Dine oplysninger'}
            </h3>
            <div class="fq-inputs-grid">
              <div class="fq-input-group">
                <label class="fq-input-group__label">
                  Vægt (kg)
                </label>
                <input
                  type="number"
                  class="fq-input-group__input"
                  placeholder="Vægt i kg"
                  value="${weights.person1 || ''}"
                  oninput="futonQuizSingleCollection.updateWeight('person1', this.value)"
                  min="30"
                  max="200"
                />
              </div>
              <div class="fq-input-group">
                <label class="fq-input-group__label">
                  Højde (cm)
                </label>
                <input
                  type="number"
                  class="fq-input-group__input"
                  placeholder="Højde i cm"
                  value="${heights.person1 || ''}"
                  oninput="futonQuizSingleCollection.updateHeight('person1', this.value)"
                  min="140"
                  max="220"
                />
              </div>
            </div>
          </div>
          ${isTwoPeople ? `
            <div>
              <h3 class="fq-form-section__title">Person 2 oplysninger</h3>
              <div class="fq-inputs-grid">
                <div class="fq-input-group">
                  <label class="fq-input-group__label">
                    Vægt (kg)
                  </label>
                  <input
                    type="number"
                    class="fq-input-group__input"
                    placeholder="Vægt i kg"
                    value="${weights.person2 || ''}"
                    oninput="futonQuizSingleCollection.updateWeight('person2', this.value)"
                    min="30"
                    max="200"
                  />
                </div>
                <div class="fq-input-group">
                  <label class="fq-input-group__label">
                    Højde (cm)
                  </label>
                  <input
                    type="number"
                    class="fq-input-group__input"
                    placeholder="Højde i cm"
                    value="${heights.person2 || ''}"
                    oninput="futonQuizSingleCollection.updateHeight('person2', this.value)"
                    min="140"
                    max="220"
                  />
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="fq-info-box">
          <p class="fq-info-box__content">
            💡 Vægt og højde bruges kun som reference for vores medarbejdere ved personlig rådgivning.
          </p>
        </div>

        <div class="fq-step__navigation">
          <button class="fq-btn--secondary" onclick="futonQuizSingleCollection.prevStep()">
            Tilbage
          </button>
          <button 
            id="fq-weight-next" 
            class="fq-btn--quiz"
            onclick="futonQuizSingleCollection.nextStep()"
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
      <div class="fq-step">
        <div class="fq-step__header">
          <h2 class="fq-step__title">
            ${isTwoPeople ? 'Hvilke sovpositioner foretrækker I?' : 'Hvilken sovposition foretrækker du?'}
          </h2>
          <p class="fq-step__subtitle">
            Din sovposition påvirker, hvilken type støtte og fasthed der er bedst for dig.
          </p>
        </div>

        <div class="fq-form-section ${isTwoPeople ? 'fq-form-section--spaced' : ''}">
          ${!isTwoPeople ? `
            <div class="fq-options">
              ${this.buildSleepPositionButtons('person1', sleepPositions.person1)}
            </div>
          ` : `
            <div>
              <h3 class="fq-form-section__title">Person 1 Soveposition</h3>
              <div class="fq-options">
                ${this.buildSleepPositionButtons('person1', sleepPositions.person1)}
              </div>
            </div>
            <div>
              <h3 class="fq-form-section__title">Person 2 Soveposition</h3>
              <div class="fq-options">
                ${this.buildSleepPositionButtons('person2', sleepPositions.person2)}
              </div>
            </div>
          `}
        </div>

        <div class="fq-step__navigation">
          <button class="fq-btn--secondary" onclick="futonQuizSingleCollection.prevStep()">
            Tilbage
          </button>
          <button 
            id="fq-sleep-next" 
            class="fq-btn--quiz"
            onclick="futonQuizSingleCollection.nextStep()"
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
      { 
        value: 'side', 
        emoji: '🛌', 
        title: 'Side', 
        description: 'Jeg sover hovedsageligt på siden' 
      },
      { 
        value: 'back', 
        emoji: '😴', 
        title: 'Ryg', 
        description: 'Jeg sover hovedsageligt på ryggen' 
      },
      { 
        value: 'stomach', 
        emoji: '🤱', 
        title: 'Mave', 
        description: 'Jeg sover hovedsageligt på maven' 
      }
    ];

    return positions.map(position => `
      <button
        class="${selectedPosition === position.value ? 'fq-btn--option-selected' : 'fq-btn--option'}"
        onclick="futonQuizSingleCollection.setSleepPosition('${person}', '${position.value}')"
      >
        <div style="font-size: 2rem;">${position.emoji}</div>
        <div>
          <div style="font-size: 1.125rem; font-weight: 600;">${position.title}</div>
          <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground));">${position.description}</div>
        </div>
      </button>
    `).join('');
  }

  buildPreferenceStep() {
    const { peopleCount, preferences } = this.quizData;
    const isTwoPeople = peopleCount === 2;
    
    return `
      <div class="fq-step">
        <div class="fq-step__header">
          <h2 class="fq-step__title">
            ${isTwoPeople ? 'Hvilken fasthed foretrækker I?' : 'Hvilken fasthed foretrækker du?'}
          </h2>
          <p class="fq-step__subtitle">
            Fasthed påvirker støtten og komforten betydeligt.
          </p>
        </div>

        <div class="fq-form-section ${isTwoPeople ? 'fq-form-section--spaced' : ''}">
          ${!isTwoPeople ? `
            <div class="fq-options fq-options--triple">
              ${this.buildPreferenceButtons('person1', preferences.person1)}
            </div>
          ` : `
            <div>
              <h3 class="fq-form-section__title">Person 1 Fasthedspræference</h3>
              <div class="fq-options fq-options--triple">
                ${this.buildPreferenceButtons('person1', preferences.person1)}
              </div>
            </div>
            <div>
              <h3 class="fq-form-section__title">Person 2 Fasthedspræference</h3>
              <div class="fq-options fq-options--triple">
                ${this.buildPreferenceButtons('person2', preferences.person2)}
              </div>
            </div>
          `}
        </div>

        <div class="fq-step__navigation">
          <button class="fq-btn--secondary" onclick="futonQuizSingleCollection.prevStep()">
            Tilbage
          </button>
          <button 
            id="fq-preference-next" 
            class="fq-btn--quiz"
            onclick="futonQuizSingleCollection.nextStep()"
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
      { 
        value: 'soft', 
        emoji: '☁️', 
        title: 'Blød', 
        description: 'Jeg kan lide at synke ind i futonen' 
      },
      { 
        value: 'medium', 
        emoji: '🌟', 
        title: 'Medium', 
        description: 'Jeg vil have balance mellem komfort og støtte' 
      },
      { 
        value: 'firm', 
        emoji: '🏔️', 
        title: 'Fast', 
        description: 'Jeg har brug for solid støtte' 
      }
    ];

    return preferences.map(preference => `
      <button
        class="${selectedPreference === preference.value ? 'fq-btn--option-selected' : 'fq-btn--option'}"
        onclick="futonQuizSingleCollection.setPreference('${person}', '${preference.value}')"
      >
        <div style="font-size: 2rem;">${preference.emoji}</div>
        <div>
          <div style="font-size: 1.125rem; font-weight: 600;">${preference.title}</div>
          <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground));">${preference.description}</div>
        </div>
      </button>
    `).join('');
  }

  buildContactInfoStep() {
    const { contactInfo } = this.quizData;
    
    return `
      <div class="fq-step">
        <div class="fq-step__header">
          <h2 class="fq-step__title">
            Kontaktoplysninger
          </h2>
          <p class="fq-step__subtitle">
            Indtast dine kontaktoplysninger, så vi kan sende dig dine personlige anbefalinger.
          </p>
        </div>

        <div class="fq-form-section">
          <div class="fq-input-group">
            <label class="fq-input-group__label">Fulde navn *</label>
            <input
              type="text"
              class="fq-input-group__input"
              placeholder="Indtast dit fulde navn"
              value="${contactInfo.name}"
              oninput="futonQuizSingleCollection.updateContactInfo('name', this.value)"
              required
            />
          </div>
          
          <div class="fq-input-group">
            <label class="fq-input-group__label">Email adresse *</label>
            <input
              type="email"
              class="fq-input-group__input"
              placeholder="din@email.dk"
              value="${contactInfo.email}"
              oninput="futonQuizSingleCollection.updateContactInfo('email', this.value)"
              required
            />
          </div>
          
          <div class="fq-input-group">
            <label class="fq-input-group__label">Telefonnummer *</label>
            <input
              type="tel"
              class="fq-input-group__input"
              placeholder="+45 12 34 56 78"
              value="${contactInfo.phone}"
              oninput="futonQuizSingleCollection.updateContactInfo('phone', this.value)"
              required
            />
          </div>
          
          <div class="fq-input-group">
            <label class="fq-input-group__label">Yderligere kommentarer (valgfrit)</label>
            <textarea
              class="fq-input-group__input"
              style="height: 80px; text-align: left; resize: vertical;"
              placeholder="Har du specielle ønsker eller spørgsmål?"
              oninput="futonQuizSingleCollection.updateContactInfo('comments', this.value)"
            >${contactInfo.comments}</textarea>
          </div>
        </div>

        <div class="fq-info-box">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Næste skridt:</h3>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div style="width: 0.5rem; height: 0.5rem; background: hsl(var(--success)); border-radius: 50%;"></div>
              <span>Få personlige produktanbefalinger</span>
            </div>
            <div class="flex items-center gap-2">
              <div style="width: 0.5rem; height: 0.5rem; background: hsl(var(--success)); border-radius: 50%;"></div>
              <span>Kontakt fra vores eksperter</span>
            </div>
            <div class="flex items-center gap-2">
              <div style="width: 0.5rem; height: 0.5rem; background: hsl(var(--success)); border-radius: 50%;"></div>
              <span>Særlige tilbud og rabatter</span>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
            <input
              type="checkbox"
              ${contactInfo.marketingConsent ? 'checked' : ''}
              onchange="futonQuizSingleCollection.updateContactInfo('marketingConsent', this.checked)"
              style="width: 1rem; height: 1rem;"
            />
            <span style="font-size: 0.875rem;">
              Jeg accepterer at modtage markedsføringsmateriale og produktanbefalinger via email og telefon. *
            </span>
          </label>
        </div>

        <div class="fq-step__navigation">
          <button class="fq-btn--secondary" onclick="futonQuizSingleCollection.prevStep()">
            Tilbage
          </button>
          <button 
            id="fq-contact-next"
            class="fq-btn--quiz"
            onclick="futonQuizSingleCollection.nextStep()"
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
      <div class="fq-step">
        <div class="fq-step__header">
          <h2 class="fq-step__title">
            🎉 Dine Personlige Futon Anbefalinger
          </h2>
          <p class="fq-step__subtitle">
            Baseret på dine svar har vi fundet de perfekte futoner til dig.
          </p>
        </div>

        <!-- Loading State -->
        <div id="recommendations-loading" class="text-center">
          <div style="display: inline-block; width: 2rem; height: 2rem; border: 3px solid hsl(var(--muted)); border-top: 3px solid hsl(var(--primary)); border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 1rem; color: hsl(var(--muted-foreground));">Finder dine perfekte matches...</p>
        </div>

        <!-- Recommendations Grid -->
        <div id="recommendations-grid" style="display: none;" class="grid gap-6 mb-8">
        </div>

        <!-- Actions -->
        <div id="recommendations-actions" style="display: none;" class="text-center space-y-4">
          <div class="flex justify-center gap-4">
            <button 
              class="fq-btn--secondary"
              onclick="futonQuizSingleCollection.restart()"
            >
              Tag Test Igen
            </button>
            <a 
              href="/collections/all" 
              class="fq-btn--quiz"
              style="text-decoration: none; display: inline-flex; align-items: center;"
            >
              Se Alle Produkter
            </a>
          </div>
        </div>

        <!-- Empty State -->
        <div id="recommendations-empty" style="display: none;" class="text-center">
          <h2 class="fq-step__title">
            Ingen anbefalinger fundet
          </h2>
          <p class="fq-step__subtitle mb-6">
            Vi kunne ikke finde specifikke produkter der matcher dine præferencer. 
            Prøv at tage testen igen eller kontakt os direkte for personlig vejledning.
          </p>
          <button 
            class="fq-btn--quiz"
            onclick="futonQuizSingleCollection.restart()"
          >
            Tag Test Igen
          </button>
        </div>
      </div>
    `;
  }

  // Quiz navigation methods
  startQuiz() {
    this.currentStep = 1;
    this.showStep(this.currentStep);
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      // If completing contact info step (step 5), send data to Klaviyo
      if (this.currentStep === 5) {
        this.sendToKlaviyo();
      }
      
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  // Data update methods
  setPeopleCount(count) {
    this.quizData.peopleCount = count;
    this.showStep(this.currentStep); // Refresh to update UI
  }

  selectPeopleCount(count) {
    this.setPeopleCount(count);
  }

  updateWeight(person, value) {
    const weight = parseInt(value) || 0;
    this.quizData.weights[person] = weight;
    this.validateWeightStep();
  }

  updateHeight(person, value) {
    const height = parseInt(value) || 0;
    this.quizData.heights[person] = height;
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
    const nextBtn = document.getElementById('fq-weight-next');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  validateSleepPositionStep() {
    const { peopleCount, sleepPositions } = this.quizData;
    const isValid = sleepPositions.person1 && (peopleCount === 1 || sleepPositions.person2);
    const nextBtn = document.getElementById('fq-sleep-next');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  validatePreferenceStep() {
    const { peopleCount, preferences } = this.quizData;
    const isValid = preferences.person1 && (peopleCount === 1 || preferences.person2);
    const nextBtn = document.getElementById('fq-preference-next');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  validateContactInfoStep() {
    const { contactInfo } = this.quizData;
    const isValid = contactInfo.name.trim() && 
                   contactInfo.email.trim() && 
                   contactInfo.phone.trim() && 
                   contactInfo.marketingConsent;
    const nextBtn = document.getElementById('fq-contact-next');
    if (nextBtn) nextBtn.disabled = !isValid;
  }

  /**
   * Display product recommendations
   */
  showRecommendations() {
    setTimeout(() => {
      const loadingElement = document.getElementById('recommendations-loading');
      const gridElement = document.getElementById('recommendations-grid');
      const actionsElement = document.getElementById('recommendations-actions');
      const emptyElement = document.getElementById('recommendations-empty');

      if (loadingElement) {
        loadingElement.style.display = 'none';
      }

      const recommendations = this.generateRecommendations();
      
      if (recommendations.length > 0) {
        if (gridElement) {
          gridElement.style.display = 'grid';
          this.renderRecommendations(recommendations, gridElement);
        }
        if (actionsElement) {
          actionsElement.style.display = 'block';
        }
      } else {
        if (emptyElement) {
          emptyElement.style.display = 'block';
        }
      }
    }, 2000);
  }

  renderRecommendations(recommendations, container) {
    container.innerHTML = '';
    
    recommendations.forEach((product, index) => {
      const productCard = document.createElement('div');
      productCard.className = `fq-card ${index === 0 ? 'fq-card--best-match' : ''}`;
      productCard.style.position = 'relative';
      productCard.style.padding = '1.5rem';
      
      productCard.innerHTML = `
        ${index === 0 ? '<div style="position: absolute; top: -8px; right: -8px; background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">Bedste Match</div>' : ''}
        ${product.featured_image ? `
          <div style="aspect-ratio: 16/9; background: hsl(var(--muted)); overflow: hidden; border-radius: 0.5rem; margin-bottom: 1rem;">
            <img 
              src="${product.featured_image}" 
              alt="${product.title}"
              style="width: 100%; height: 12rem; object-fit: cover; border-radius: 0.5rem;"
              loading="lazy"
            />
          </div>
        ` : ''}
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <div>
              <h3 style="font-size: 1.125rem; font-weight: 600; margin: 0; color: hsl(var(--foreground));">${product.title}</h3>
              ${product.vendor ? `<p style="font-size: 0.875rem; color: hsl(var(--muted-foreground)); margin: 0.25rem 0 0 0;">${product.vendor}</p>` : ''}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
            <div style="font-size: 1.5rem; font-weight: 700; color: hsl(var(--primary));">
              ${this.formatPrice(product.price)}
            </div>
            ${product.compare_at_price && product.compare_at_price > product.price ? `
              <div style="font-size: 0.875rem; color: hsl(var(--muted-foreground)); text-decoration: line-through;">
                ${this.formatPrice(product.compare_at_price)}
              </div>
            ` : ''}
          </div>
          <p style="font-size: 0.875rem; color: hsl(var(--muted-foreground)); margin-bottom: 1rem; line-height: 1.4;">
            ${product.description}
          </p>
          <div class="space-y-2">
            <button 
              class="fq-btn--quiz w-full"
              onclick="futonQuizSingleCollection.addToCart(${product.variants[0].id})"
              ${!product.variants[0].available ? 'disabled' : ''}
            >
              ${product.variants[0].available ? 'Tilføj til kurv' : 'Udsolgt'}
            </button>
            <a 
              href="${product.url}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="fq-btn--secondary w-full"
              style="text-decoration: none; display: flex; align-items: center; justify-content: center;"
            >
              Se detaljer
            </a>
          </div>
        </div>
      `;
      
      container.appendChild(productCard);
    });
  }

  generateRecommendations() {
    if (!this.products || this.products.length === 0) {
      console.warn('No products available for recommendations');
      return [];
    }

    console.log('Generating recommendations with quiz data:', this.quizData);
    console.log('Available products:', this.products.length);
    
    // Score each product based on user preferences
    const scoredProducts = this.products.map(product => {
      const score = this.calculateProductScore(product);
      return { ...product, score };
    });

    // Sort by score (highest first) and return top 3
    const recommendations = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    console.log('Generated recommendations:', recommendations.map(p => ({ title: p.title, score: p.score })));
    
    return recommendations;
  }

  calculateProductScore(product) {
    let score = 0;
    const productTags = (product.tags || []).map(tag => tag.toLowerCase());
    const { peopleCount, sleepPositions, preferences, weights } = this.quizData;

    console.log(`Scoring product "${product.title}" with tags:`, productTags);

    // Base score for having any tags
    if (productTags.length > 0) {
      score += 5;
    }

    // Preference matching (highest weight)
    score += this.calculatePreferenceScore(product, productTags, preferences, peopleCount);

    // Sleep position matching
    score += this.calculateSleepPositionScore(product, productTags, sleepPositions, peopleCount);

    // Weight-based scoring
    score += this.calculateWeightScore(product, productTags, weights, peopleCount);

    // Couples vs single preference
    if (peopleCount === 2) {
      score += this.calculateCouplesScore(product, productTags);
    } else {
      const singleTags = this.tagMappings.single || [];
      const hasSingleMatch = singleTags.some(tag => productTags.includes(tag.toLowerCase()));
      if (hasSingleMatch) score += 10;
    }

    // Additional tag matching bonuses
    score += this.calculateTagMatchingBonus(product, productTags);

    // Penalties for mismatches
    score -= this.calculateMismatchPenalty(product, productTags);

    console.log(`Product "${product.title}" final score: ${score}`);
    return Math.max(0, score); // Ensure score is never negative
  }

  calculatePreferenceScore(product, productTags, preferences, peopleCount) {
    let preferenceScore = 0;
    const firmnessMappings = this.tagMappings.firmness || {};

    // Check person 1 preference
    if (preferences.person1) {
      const matchingTags = firmnessMappings[preferences.person1] || [];
      const hasMatch = matchingTags.some(tag => 
        productTags.includes(tag.toLowerCase())
      );
      if (hasMatch) preferenceScore += 25; // High weight for preference match
    }

    // Check person 2 preference for couples
    if (peopleCount === 2 && preferences.person2) {
      const matchingTags = firmnessMappings[preferences.person2] || [];
      const hasMatch = matchingTags.some(tag => 
        productTags.includes(tag.toLowerCase())
      );
      if (hasMatch) {
        preferenceScore += 25;
      } else if (preferences.person1 && preferences.person2 !== preferences.person1) {
        // For couples with different preferences, look for medium/compromise tags
        // If preferences differ, give bonus to medium firmness products
        const person1Tags = firmnessMappings[preferences.person1] || [];
        const person2Tags = firmnessMappings[preferences.person2] || [];
        const hasMultiMatch = person1Tags.some(tag => productTags.includes(tag.toLowerCase())) &&
                             person2Tags.some(tag => productTags.includes(tag.toLowerCase()));
        if (hasMultiMatch) preferenceScore += 15; // Compromise bonus
      }
    }

    return preferenceScore;
  }

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

  calculateCouplesScore(product, productTags) {
    const couplesTags = this.tagMappings.couples || [];
    const hasMatch = couplesTags.some(tag => 
      productTags.includes(tag.toLowerCase())
    );
    return hasMatch ? 20 : 0;
  }

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

  calculateMismatchPenalty(product, productTags) {
    let penalty = 0;

    // Add logic for penalties if needed
    // For example, penalize products that have tags that strongly contradict user preferences

    return penalty;
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

  /**
   * Send quiz completion data to Klaviyo
   */
  async sendToKlaviyo() {
    console.log('sendToKlaviyo called');
    console.log('Klaviyo config:', window.klaviyoConfig);
    
    try {
      const recommendations = this.generateRecommendations();
      
      if (!window.klaviyoConfig || !window.klaviyoConfig.enabled) {
        console.warn('Klaviyo configuration not found or disabled. Quiz data not sent to Klaviyo.');
        console.log('Quiz data that would be sent:', this.quizData);
        return;
      }

      // Prepare custom properties for the profile
      const customProperties = {
        // Quiz responses
        people_count: this.quizData.peopleCount,
        weight_person1: this.quizData.weights.person1,
        height_person1: this.quizData.heights.person1,
        sleep_position_person1: this.quizData.sleepPositions.person1,
        preference_person1: this.quizData.preferences.person1,
        comments: this.quizData.contactInfo.comments || '',
        
        // Quiz metadata
        quiz_completion_date: new Date().toISOString(),
        quiz_version: 'single-collection-v1.0',
        quiz_source: 'shopify-futon-quiz'
      };

      // Add person 2 data if applicable
      if (this.quizData.peopleCount === 2) {
        customProperties.weight_person2 = this.quizData.weights.person2;
        customProperties.height_person2 = this.quizData.heights.person2;
        customProperties.sleep_position_person2 = this.quizData.sleepPositions.person2;
        customProperties.preference_person2 = this.quizData.preferences.person2;
      }

      // Add recommended product properties
      recommendations.forEach((product, index) => {
        customProperties[`recommended_product_${index + 1}_id`] = product.id;
        customProperties[`recommended_product_${index + 1}_title`] = product.title;
        customProperties[`recommended_product_${index + 1}_price`] = product.price;
        customProperties[`recommended_product_${index + 1}_url`] = product.url;
        customProperties[`recommended_product_${index + 1}_image`] = product.featured_image;
        customProperties[`recommended_product_${index + 1}_score`] = product.score;
      });

      const profileData = {
        data: {
          type: 'profile',
          attributes: {
            email: this.quizData.contactInfo.email,
            first_name: this.quizData.contactInfo.name.split(' ')[0] || '',
            last_name: this.quizData.contactInfo.name.split(' ').slice(1).join(' ') || '',
            phone_number: this.quizData.contactInfo.phone,
            properties: customProperties
          }
        }
      };

      console.log('Attempting to send profile data to Klaviyo:', profileData);

      // Create or update profile
      const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Klaviyo-API-Key ${window.klaviyoConfig.privateKey}`,
          'revision': '2024-10-15'
        },
        body: JSON.stringify(profileData)
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Failed to create/update Klaviyo profile:', profileResponse.status, profileResponse.statusText);
        console.error('Response body:', errorText);
        return;
      }

      const profileResult = await profileResponse.json();
      console.log('Profile created/updated successfully:', profileResult);

      // Add profile to list if list ID is provided
      if (window.klaviyoConfig.listId && this.quizData.contactInfo.marketingConsent) {
        const listSubscription = {
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [{
                  type: 'profile',
                  attributes: {
                    email: this.quizData.contactInfo.email,
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: 'SUBSCRIBED'
                        }
                      }
                    }
                  }
                }]
              }
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: window.klaviyoConfig.listId
                }
              }
            }
          }
        };

        const listResponse = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Klaviyo-API-Key ${window.klaviyoConfig.privateKey}`,
            'revision': '2024-10-15'
          },
          body: JSON.stringify(listSubscription)
        });

        if (listResponse.ok) {
          console.log('Profile successfully added to Klaviyo list');
        } else {
          console.error('Failed to add profile to Klaviyo list:', listResponse.status, listResponse.statusText);
        }
      }

    } catch (error) {
      console.error('Error sending quiz data to Klaviyo:', error);
    }
  }

  restart() {
    this.currentStep = 0;
    this.quizData = {
      peopleCount: 1,
      weights: { person1: 0, person2: 0 },
      heights: { person1: 0, person2: 0 },
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
  }
}

// Auto-initialize when the script loads
let futonQuizSingleCollection;

function initQuiz() {
  console.log('Initializing Futon Quiz (Single Collection)...');
  futonQuizSingleCollection = new FutonQuizSingleCollection();
  
  // Make it globally available for onclick handlers
  window.futonQuizSingleCollection = futonQuizSingleCollection;
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  initQuiz();
}
