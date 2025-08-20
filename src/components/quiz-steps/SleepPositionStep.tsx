import { Button } from "@/components/ui/button";

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
      label: "On the Side",
      emoji: "🛌",
      description: "I primarily sleep on my side"
    },
    {
      value: "belly-back" as const,
      label: "Belly or Back",
      emoji: "😴",
      description: "I sleep on my belly or back"
    },
    {
      value: "both" as const,
      label: "Both Positions",
      emoji: "🔄",
      description: "I switch between different positions"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          How do you sleep?
        </h2>
        <p className="text-muted-foreground">
          Your sleeping position affects the type of support and firmness you need.
        </p>
      </div>

      <div className="space-y-8">
        {/* Person 1 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {peopleCount === 1 ? "Your Sleep Position" : "Person 1 Sleep Position"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sleepOptions.map((option) => (
              <Button
                key={option.value}
                variant={sleepPositions.person1 === option.value ? "option-selected" : "option"}
                size="option"
                onClick={() => updateSleepPosition("person1", option.value)}
                className="flex-col gap-3 h-24"
              >
                <div className="text-3xl">{option.emoji}</div>
                <div className="text-center">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Person 2 */}
        {peopleCount === 2 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Person 2 Sleep Position</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sleepOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sleepPositions.person2 === option.value ? "option-selected" : "option"}
                  size="option"
                  onClick={() => updateSleepPosition("person2", option.value)}
                  className="flex-col gap-3 h-24"
                >
                  <div className="text-3xl">{option.emoji}</div>
                  <div className="text-center">
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={onPrev}>
          Back
        </Button>
        <Button variant="quiz" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};