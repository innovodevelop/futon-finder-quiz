import { Button } from "@/components/ui/button";

interface PreferenceStepProps {
  peopleCount: 1 | 2;
  preferences: {
    person1: "soft" | "medium" | "hard";
    person2?: "soft" | "medium" | "hard";
  };
  onChange: (preferences: { person1: "soft" | "medium" | "hard"; person2?: "soft" | "medium" | "hard" }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PreferenceStep = ({ peopleCount, preferences, onChange, onNext, onPrev }: PreferenceStepProps) => {
  const updatePreference = (person: "person1" | "person2", preference: "soft" | "medium" | "hard") => {
    onChange({
      ...preferences,
      [person]: preference,
    });
  };

  const firmnesOptions = [
    {
      value: "soft" as const,
      label: "Soft",
      emoji: "☁️",
      description: "I like to sink into my mattress"
    },
    {
      value: "medium" as const,
      label: "Medium",
      emoji: "🎯",
      description: "I prefer balanced support and comfort"
    },
    {
      value: "hard" as const,
      label: "Firm",
      emoji: "🧱",
      description: "I like a firm, supportive surface"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          How do you prefer to lay?
        </h2>
        <p className="text-muted-foreground">
          Your firmness preference is crucial for finding the perfect futon for your comfort.
        </p>
      </div>

      <div className="space-y-8">
        {/* Person 1 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {peopleCount === 1 ? "Your Firmness Preference" : "Person 1 Firmness Preference"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {firmnesOptions.map((option) => (
              <Button
                key={option.value}
                variant={preferences.person1 === option.value ? "option-selected" : "option"}
                size="option"
                onClick={() => updatePreference("person1", option.value)}
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
            <h3 className="text-xl font-semibold mb-4">Person 2 Firmness Preference</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {firmnesOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={preferences.person2 === option.value ? "option-selected" : "option"}
                  size="option"
                  onClick={() => updatePreference("person2", option.value)}
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

      <div className="bg-muted/50 rounded-lg p-4 mb-8 mt-8">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">💡 Firmness Guide:</p>
          <ul className="space-y-1 ml-4">
            <li><strong>Soft:</strong> Great for side sleepers and those who like a plush feel</li>
            <li><strong>Medium:</strong> Perfect balance for most sleeping positions</li>
            <li><strong>Firm:</strong> Ideal for back/stomach sleepers and heavier individuals</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
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