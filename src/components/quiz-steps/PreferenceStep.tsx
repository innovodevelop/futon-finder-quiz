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
      label: "Blød",
      emoji: "☁️",
      description: "Jeg kan lide at synke ned i madras"
    },
    {
      value: "medium" as const,
      label: "Medium",
      emoji: "🎯",
      description: "Jeg foretrækker afbalanceret støtte og komfort"
    },
    {
      value: "hard" as const,
      label: "Fast",
      emoji: "🧱",
      description: "Jeg kan lide en fast, støttende overflade"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Hvordan foretrækker du at ligge?
        </h2>
        <p className="text-muted-foreground">
          Din fasthedspræference er afgørende for at finde den perfekte futon til din komfort.
        </p>
      </div>

      <div className="space-y-8">
        {/* Person 1 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {peopleCount === 1 ? "Din Fasthedspræference" : "Person 1 Fasthedspræference"}
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
            <h3 className="text-xl font-semibold mb-4">Person 2 Fasthedspræference</h3>
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
          <p className="font-medium mb-2">💡 Fasthedsguide:</p>
          <ul className="space-y-1 ml-4">
            <li><strong>Blød:</strong> Perfekt til sidesovere og dem der kan lide en blød følelse</li>
            <li><strong>Medium:</strong> Perfekt balance til de fleste søvestillinger</li>
            <li><strong>Fast:</strong> Ideel til ryg/mave-sovere og tungere personer</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
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