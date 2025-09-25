import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";

interface WeightStepProps {
  peopleCount: 1 | 2;
  weights: {
    person1: number;
    person2?: number;
  };
  heights: {
    person1: number;
    person2?: number;
  };
  onChange: (weights: { person1: number; person2?: number }, heights: { person1: number; person2?: number }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const WeightStep = ({ peopleCount, weights, heights, onChange, onNext, onPrev }: WeightStepProps) => {
  const updateWeight = (person: "person1" | "person2", weight: number) => {
    onChange({
      ...weights,
      [person]: weight,
    }, heights);
  };

  const safeHeights = {
    person1: heights?.person1 ?? 0,
    person2: heights?.person2,
  };

  const updateHeight = (person: "person1" | "person2", height: number) => {
    const nextHeights = {
      person1: heights?.person1 ?? 0,
      person2: heights?.person2,
    } as { person1: number; person2?: number };
    nextHeights[person] = height;
    onChange(weights, nextHeights);
  };

  // Height is optional and not required for validation
  const isValid = weights.person1 > 0 &&
    (peopleCount === 1 || (weights.person2 && weights.person2 > 0));

  return (
    <div id="fq-weight-step" className="fq-step">
      <div className="futon-quiz__container" style={{ maxWidth: '32rem', margin: '0 auto' }}>
        <div className="futon-quiz__text-center futon-quiz__mb-8">
          <h2 className="futon-quiz__title" style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>
            {peopleCount === 1 ? "Hvad er din vægt?" : "Hvad er jeres vægt?"}
          </h2>
          <p className="futon-quiz__description">
            Dette hjælper os med at anbefale den rigtige fasthed og støtte til dine behov.
          </p>
        </div>

        <div className={`futon-quiz__mb-6 ${peopleCount === 2 ? 'futon-quiz__grid futon-quiz__grid--cols-1 futon-quiz__grid--md-cols-2 futon-quiz__gap-6' : 'futon-quiz__space-y-4'}`}>
          <div>
            <Label className="futon-quiz__option-title futon-quiz__mb-4" style={{ display: 'block' }}>
              {peopleCount === 1 ? "Din vægt (kg)" : "Person 1 vægt (kg)"}
            </Label>
            <Input
              type="number"
              className="futon-quiz__input"
              placeholder="Indtast vægt i kg"
              value={weights.person1 || ""}
              onChange={(e) => updateWeight("person1", parseInt(e.target.value) || 0)}
              min="30"
              max="200"
            />
          </div>
          
          {peopleCount === 2 && (
            <div>
              <Label className="futon-quiz__option-title futon-quiz__mb-4" style={{ display: 'block' }}>
                Person 2 vægt (kg)
              </Label>
              <Input
                type="number"
                className="futon-quiz__input"
                placeholder="Indtast vægt i kg"
                value={weights.person2 || ""}
                onChange={(e) => updateWeight("person2", parseInt(e.target.value) || 0)}
                min="30"
                max="200"
              />
            </div>
          )}
        </div>

        <div className="futon-quiz__info-box futon-quiz__mb-6">
          <div className="futon-quiz__flex futon-quiz__items-center futon-quiz__gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="futon-quiz__option-description">
              Vægt hjælper os med at anbefale den rigtige fasthed for optimal komfort og støtte.
            </span>
          </div>
        </div>

        <div className="futon-quiz__flex futon-quiz__justify-between">
          <Button 
            variant="secondary" 
            onClick={onPrev}
            className="futon-quiz__btn futon-quiz__btn--secondary"
            style={{ height: '2.5rem', padding: '0 1rem' }}
          >
            Tilbage
          </Button>
          <Button 
            variant="quiz" 
            onClick={onNext}
            disabled={!isValid}
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