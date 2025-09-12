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
      <div className="fq-step__header">
        <h2 className="fq-step__title">
          Hvad er {peopleCount === 1 ? "din vægt og højde" : "jeres vægt og højde"}?
        </h2>
        <p className="fq-step__subtitle">
          Vægt og højde hjælper vores medarbejdere med at give dig personlig rådgivning.
        </p>
      </div>

      <div className={`fq-form-section ${peopleCount === 2 ? "fq-form-section--spaced" : ""}`}>
        {/* Person 1 */}
        <div id="fq-weight-person1">
          <h3 className="fq-form-section__title">
            {peopleCount === 1 ? "Dine oplysninger" : "Person 1 oplysninger"}
          </h3>
          <div className="fq-inputs-grid">
            <div className="fq-input-group">
              <Label htmlFor="fq-weight1" className="fq-input-group__label">
                Vægt (kg)
              </Label>
              <Input
                id="fq-weight1"
                type="number"
                placeholder="Indtast vægt i kg"
                value={weights.person1 || ""}
                onChange={(e) => updateWeight("person1", parseInt(e.target.value) || 0)}
                min="35"
                max="180"
                className="fq-input-group__input"
              />
            </div>
            <div className="fq-input-group">
              <Label htmlFor="fq-height1" className="fq-input-group__label">
                Højde (cm)
              </Label>
              <Input
                id="fq-height1"
                type="number"
                placeholder="Indtast højde i cm"
                value={safeHeights.person1 || ""}
                onChange={(e) => updateHeight("person1", parseInt(e.target.value) || 0)}
                min="140"
                max="220"
                className="fq-input-group__input"
              />
            </div>
          </div>
        </div>

        {peopleCount === 2 && (
          <div id="fq-weight-person2">
            <h3 className="fq-form-section__title">Person 2 oplysninger</h3>
            <div className="fq-inputs-grid">
              <div className="fq-input-group">
                <Label htmlFor="fq-weight2" className="fq-input-group__label">
                  Vægt (kg)
                </Label>
                <Input
                  id="fq-weight2"
                  type="number"
                  placeholder="Indtast vægt i kg"
                  value={weights.person2 || ""}
                  onChange={(e) => updateWeight("person2", parseInt(e.target.value) || 0)}
                  min="35"
                  max="180"
                  className="fq-input-group__input"
                />
              </div>
              <div className="fq-input-group">
                <Label htmlFor="fq-height2" className="fq-input-group__label">
                  Højde (cm)
                </Label>
                <Input
                  id="fq-height2"
                  type="number"
                  placeholder="Indtast højde i cm"
                  value={safeHeights.person2 || ""}
                  onChange={(e) => updateHeight("person2", parseInt(e.target.value) || 0)}
                  min="140"
                  max="220"
                  className="fq-input-group__input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fq-info-box">
        <p className="fq-info-box__content">
          <Lightbulb className="w-4 h-4" />
          Vægt og højde bruges kun som reference for vores medarbejdere ved personlig rådgivning.
        </p>
      </div>

      <div className="fq-step__navigation">
        <Button id="fq-weight-back" variant="secondary" onClick={onPrev}>
          Tilbage
        </Button>
        <Button 
          id="fq-weight-next"
          variant="quiz" 
          onClick={onNext}
          disabled={!isValid}
          className="fq-btn--quiz"
        >
          Fortsæt
        </Button>
      </div>
    </div>
  );
};