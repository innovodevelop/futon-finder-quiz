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
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Hvordan sover du?
        </h2>
        <p className="text-muted-foreground">
          Din søvestilling påvirker den type støtte og fasthed, du har brug for.
        </p>
      </div>

      <div className="space-y-8">
        {/* Person 1 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {peopleCount === 1 ? "Din Søvestilling" : "Person 1 Søvestilling"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sleepOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sleepPositions.person1 === option.value ? "option-selected" : "option"}
                  size="option"
                  onClick={() => updateSleepPosition("person1", option.value)}
                  className="flex-col gap-4 h-32"
                >
                  <option.icon className="w-8 h-8" />
                  <div className="text-center px-2 w-full">
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-xs text-muted-foreground leading-tight break-words">
                      {option.description}
                    </div>
                  </div>
                </Button>
            ))}
          </div>
        </div>

        {/* Person 2 */}
        {peopleCount === 2 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Person 2 Søvestilling</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sleepOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sleepPositions.person2 === option.value ? "option-selected" : "option"}
                  size="option"
                  onClick={() => updateSleepPosition("person2", option.value)}
                  className="flex-col gap-4 h-32"
                >
                  <option.icon className="w-8 h-8" />
                  <div className="text-center px-2 w-full">
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-xs text-muted-foreground leading-tight break-words">
                      {option.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={onPrev}>
          Tilbage
        </Button>
        <Button variant="quiz" onClick={onNext}>
          Fortsæt
        </Button>
      </div>
    </div>
  );
};