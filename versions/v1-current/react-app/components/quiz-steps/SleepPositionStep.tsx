import { Button } from "@/components/ui/button";
import { Bed, Moon, RotateCcw } from "lucide-react";

interface SleepPositionStepProps {
  peopleCount: 1 | 2;
  sleepPositions: {
    person1: "side" | "belly-back" | "both";
    person2?: "side" | "belly-back" | "both";
  };
  onChange: (sleepPositions: { person1: "side" | "belly-back" | "both"; person2?: "side" | "belly-back" | "both" }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SleepPositionStep = ({ peopleCount, sleepPositions, onChange, onNext, onPrev }: SleepPositionStepProps) => {
  const updateSleepPosition = (person: "person1" | "person2", position: "side" | "belly-back" | "both") => {
    onChange({
      ...sleepPositions,
      [person]: position,
    });
  };

  const sleepOptions = [
    {
      value: "side" as const,
      label: "På Siden",
      icon: Bed,
      description: "Jeg sover primært på siden"
    },
    {
      value: "belly-back" as const,
      label: "Maven eller Ryggen",
      icon: Moon,
      description: "Jeg sover på maven eller ryggen"
    },
    {
      value: "both" as const,
      label: "Begge Stillinger",
      icon: RotateCcw,
      description: "Jeg skifter mellem forskellige stillinger"
    }
  ];

  return (
    <div id="fq-sleep-position-step" className="fq-step">
      <div className="fq-step__header">
        <h2 className="fq-step__title">
          Hvordan sover du?
        </h2>
        <p className="fq-step__subtitle">
          Din søvestilling påvirker den type støtte og fasthed, du har brug for.
        </p>
      </div>

      <div className="fq-form-section fq-form-section--spaced">
        {/* Person 1 */}
        <div id="fq-sleep-person1">
          <h3 className="fq-form-section__title">
            {peopleCount === 1 ? "Din Soveposition" : "Person 1 Soveposition"}
          </h3>
          <div className="fq-options fq-options--triple">
            {sleepOptions.map((option) => (
                <Button
                  key={option.value}
                  id={`fq-sleep-p1-${option.value}`}
                  variant={sleepPositions.person1 === option.value ? "option-selected" : "option"}
                  size="option"
                  onClick={() => updateSleepPosition("person1", option.value)}
                  className={`${sleepPositions.person1 === option.value ? "fq-btn--option-selected" : "fq-btn--option"} flex-col gap-2 min-h-[10rem] h-auto`}
                >
                  <option.icon className="w-8 h-8" />
                  <div className="text-center px-2 w-full">
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-xs text-muted-foreground leading-tight break-words whitespace-normal">
                      {option.description}
                    </div>
                  </div>
                </Button>
            ))}
          </div>
        </div>

        {/* Person 2 */}
        {peopleCount === 2 && (
          <div id="fq-sleep-person2">
            <h3 className="fq-form-section__title">Person 2 Soveposition</h3>
            <div className="fq-options fq-options--triple">
              {sleepOptions.map((option) => (
                <Button
                  key={option.value}
                  id={`fq-sleep-p2-${option.value}`}
                  variant={sleepPositions.person2 === option.value ? "option-selected" : "option"}
                  size="option"
                  onClick={() => updateSleepPosition("person2", option.value)}
                  className={`${sleepPositions.person2 === option.value ? "fq-btn--option-selected" : "fq-btn--option"} flex-col gap-2 min-h-[10rem] h-auto`}
                >
                  <option.icon className="w-8 h-8" />
                  <div className="text-center px-2 w-full">
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-xs text-muted-foreground leading-tight break-words whitespace-normal">
                      {option.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fq-step__navigation">
        <Button id="fq-sleep-back" variant="secondary" onClick={onPrev}>
          Tilbage
        </Button>
        <Button id="fq-sleep-next" variant="quiz" onClick={onNext} className="fq-btn--quiz">
          Fortsæt
        </Button>
      </div>
    </div>
  );
};