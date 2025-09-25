import { Button } from "@/components/ui/button";
import { Cloud, Target, Square, Lightbulb } from "lucide-react";

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
      icon: Cloud,
      description: "Jeg kan lide at synke ned i madras"
    },
    {
      value: "medium" as const,
      label: "Medium",
      icon: Target,
      description: "Jeg foretrækker afbalanceret støtte og komfort"
    },
    {
      value: "hard" as const,
      label: "Fast",
      icon: Square,
      description: "Jeg kan lide en fast, støttende overflade"
    }
  ];

  return (
    <div id="fq-preference-step" className="fq-step">
      <div className="fq-step__header">
        <h2 className="fq-step__title">
          Hvordan foretrækker du at ligge?
        </h2>
        <p className="fq-step__subtitle">
          Din fasthedspræference er afgørende for at finde den perfekte futon til din komfort.
        </p>
      </div>

      <div className="fq-form-section fq-form-section--spaced">
        {/* Person 1 */}
        <div id="fq-preference-person1">
          <h3 className="fq-form-section__title">
            {peopleCount === 1 ? "Din Fasthedspræference" : "Person 1 Fasthedspræference"}
          </h3>
          <div className="fq-options fq-options--triple">
            {firmnesOptions.map((option) => (
              <Button
                key={option.value}
                id={`fq-preference-p1-${option.value}`}
                variant={preferences.person1 === option.value ? "option-selected" : "option"}
                size="option"
                onClick={() => updatePreference("person1", option.value)}
                className={`${preferences.person1 === option.value ? "fq-btn--option-selected" : "fq-btn--option"} flex-col gap-2 min-h-[10rem] h-auto`}
              >
                <option.icon className="w-8 h-8 flex-shrink-0" />
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
          <div id="fq-preference-person2">
            <h3 className="fq-form-section__title">Person 2 Fasthedspræference</h3>
            <div className="fq-options fq-options--triple">
              {firmnesOptions.map((option) => (
                <Button
                  key={option.value}
                  id={`fq-preference-p2-${option.value}`}
                  variant={preferences.person2 === option.value ? "option-selected" : "option"}
                  size="option"
                  onClick={() => updatePreference("person2", option.value)}
                  className={`${preferences.person2 === option.value ? "fq-btn--option-selected" : "fq-btn--option"} flex-col gap-2 min-h-[10rem] h-auto`}
                >
                  <option.icon className="w-8 h-8 flex-shrink-0" />
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

      <div className="fq-info-box">
        <div className="fq-info-box__content">
          <p className="font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Fasthedsguide:
          </p>
          <ul className="space-y-1 ml-4 text-xs">
            <li><strong>Blød:</strong> Perfekt til sidesovere og dem der kan lide en blød følelse</li>
            <li><strong>Medium:</strong> Perfekt balance til de fleste søvestillinger</li>
            <li><strong>Fast:</strong> Ideel til ryg/mave-sovere og tungere personer</li>
          </ul>
        </div>
      </div>

      <div className="fq-step__navigation">
        <Button id="fq-preference-back" variant="secondary" onClick={onPrev}>
          Tilbage
        </Button>
        <Button id="fq-preference-next" variant="quiz" onClick={onNext} className="fq-btn--quiz">
          Fortsæt
        </Button>
      </div>
    </div>
  );
};