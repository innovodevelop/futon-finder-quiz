import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";

interface PeopleCountStepProps {
  value: 1 | 2;
  onChange: (value: 1 | 2) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PeopleCountStep = ({ value, onChange, onNext, onPrev }: PeopleCountStepProps) => {
  return (
    <div id="fq-people-count-step" className="fq-step">
      <div className="futon-quiz__container" style={{ maxWidth: '32rem', margin: '0 auto' }}>
        <div className="futon-quiz__text-center futon-quiz__mb-8">
          <h2 className="futon-quiz__title" style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>
            Hvor mange personer skal bruge denne futon?
          </h2>
          <p className="futon-quiz__description">
            Dette hjælper os med at anbefale den rigtige størrelse og fasthed til dine behov.
          </p>
        </div>

        <div className="futon-quiz__grid futon-quiz__grid--cols-1 futon-quiz__grid--md-cols-2 futon-quiz__gap-4 futon-quiz__mb-8">
          <Button
            id="fq-people-option-1"
            variant="outline"
            onClick={() => onChange(1)}
            className={`futon-quiz__btn futon-quiz__btn--option ${value === 1 ? 'futon-quiz__btn--option-selected' : ''}`}
            style={{ flexDirection: 'column', gap: '0.75rem' }}
          >
            <User className="w-10 h-10" />
            <div>
              <div className="futon-quiz__option-title">Kun Mig</div>
              <div className="futon-quiz__option-description">Enkeltperson brug</div>
            </div>
          </Button>

          <Button
            id="fq-people-option-2"
            variant="outline"
            onClick={() => onChange(2)}
            className={`futon-quiz__btn futon-quiz__btn--option ${value === 2 ? 'futon-quiz__btn--option-selected' : ''}`}
            style={{ flexDirection: 'column', gap: '0.75rem' }}
          >
            <Users className="w-10 h-10" />
            <div>
              <div className="futon-quiz__option-title">To Personer</div>
              <div className="futon-quiz__option-description">Par eller delt brug</div>
            </div>
          </Button>
        </div>

        <div className="futon-quiz__flex futon-quiz__justify-between">
          <Button 
            id="fq-people-back" 
            variant="secondary" 
            onClick={onPrev}
            className="futon-quiz__btn futon-quiz__btn--secondary"
            style={{ height: '2.5rem', padding: '0 1rem' }}
          >
            Tilbage
          </Button>
          <Button 
            id="fq-people-next" 
            variant="quiz" 
            onClick={onNext} 
            className="futon-quiz__btn futon-quiz__btn--primary"
            style={{ height: '2.5rem', padding: '0 1rem' }}
          >
            Fortsæt
          </Button>
        </div>
      </div>
    </div>
  );
};