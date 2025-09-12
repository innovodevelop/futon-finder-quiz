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
      <div className="fq-step__header">
        <h2 className="fq-step__title">
          Hvor mange personer skal bruge denne futon?
        </h2>
        <p className="fq-step__subtitle">
          Dette hjælper os med at anbefale den rigtige størrelse og fasthed til dine behov.
        </p>
      </div>

      <div className="fq-options">
        <Button
          id="fq-people-option-1"
          variant={value === 1 ? "option-selected" : "option"}
          size="option"
          onClick={() => onChange(1)}
          className={value === 1 ? "fq-btn--option-selected" : "fq-btn--option"}
        >
          <User className="w-10 h-10" />
          <div>
            <div className="font-semibold">Kun Mig</div>
            <div className="text-sm text-muted-foreground">Enkeltperson brug</div>
          </div>
        </Button>

        <Button
          id="fq-people-option-2"
          variant={value === 2 ? "option-selected" : "option"}
          size="option"
          onClick={() => onChange(2)}
          className={value === 2 ? "fq-btn--option-selected" : "fq-btn--option"}
        >
          <Users className="w-10 h-10" />
          <div>
            <div className="font-semibold">To Personer</div>
            <div className="text-sm text-muted-foreground">Par eller delt brug</div>
          </div>
        </Button>
      </div>

      <div className="fq-step__navigation">
        <Button id="fq-people-back" variant="secondary" onClick={onPrev}>
          Tilbage
        </Button>
        <Button id="fq-people-next" variant="quiz" onClick={onNext} className="fq-btn--quiz">
          Fortsæt
        </Button>
      </div>
    </div>
  );
};