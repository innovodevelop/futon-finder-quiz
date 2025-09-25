import { Button } from "@/components/ui/button";
import heroImage from "@/assets/futon-hero.jpg";

interface StartStepProps {
  onNext: () => void;
}

export const StartStep = ({ onNext }: StartStepProps) => {
  return (
    <div id="fq-start-step" className="fq-start">
      <div className="fq-step__content">
        <img 
          id="fq-start-hero-image"
          src={heroImage} 
          alt="Comfortable futon setup" 
          className="fq-start__hero"
        />
        <h1 className="fq-start__title">
          Find Din Perfekte Futon
        </h1>
        <p className="fq-start__description">
          Tag vores personlige test for at opdage den ideelle futon til dine komfortbehov. 
          Baseret på dine søvnpræferencer anbefaler vi det perfekte match fra vores kollektion.
        </p>
      </div>

      <div className="fq-start__features">
        <h3 className="fq-start__features-title">Hvad du får:</h3>
        <div className="fq-start__features-grid">
          <div className="fq-start__feature">
            <div className="fq-start__feature-dot"></div>
            <span>Personlige anbefalinger</span>
          </div>
          <div className="fq-start__feature">
            <div className="fq-start__feature-dot"></div>
            <span>Ekspert vejledning</span>
          </div>
          <div className="fq-start__feature">
            <div className="fq-start__feature-dot"></div>
            <span>Perfekt komfort match</span>
          </div>
        </div>
      </div>

      <div className="fq-start__cta">
        <Button 
          id="fq-start-button"
          variant="quiz" 
          size="lg" 
          onClick={onNext}
          className="fq-btn--quiz text-base px-12 py-3"
        >
          Start Test
        </Button>
        
        <p className="fq-start__note">
          Tager kun 2-3 minutter at gennemføre
        </p>
      </div>
    </div>
  );
};