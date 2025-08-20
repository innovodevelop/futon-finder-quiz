import { Button } from "@/components/ui/button";

interface PeopleCountStepProps {
  value: 1 | 2;
  onChange: (value: 1 | 2) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PeopleCountStep = ({ value, onChange, onNext, onPrev }: PeopleCountStepProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          How many people will use this futon?
        </h2>
        <p className="text-muted-foreground">
          This helps us recommend the right size and firmness for your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button
          variant={value === 1 ? "option-selected" : "option"}
          size="option"
          onClick={() => onChange(1)}
          className="flex-col gap-3"
        >
          <div className="text-4xl">👤</div>
          <div>
            <div className="font-semibold">Just Me</div>
            <div className="text-sm text-muted-foreground">Single person use</div>
          </div>
        </Button>

        <Button
          variant={value === 2 ? "option-selected" : "option"}
          size="option"
          onClick={() => onChange(2)}
          className="flex-col gap-3"
        >
          <div className="text-4xl">👥</div>
          <div>
            <div className="font-semibold">Two People</div>
            <div className="text-sm text-muted-foreground">Couples or shared use</div>
          </div>
        </Button>
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