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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Hvor mange personer skal bruge denne futon?
        </h2>
        <p className="text-muted-foreground">
          Dette hjælper os med at anbefale den rigtige størrelse og fasthed til dine behov.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button
          variant={value === 1 ? "option-selected" : "option"}
          size="option"
          onClick={() => onChange(1)}
          className="flex-col gap-3"
        >
          <User className="w-10 h-10" />
          <div>
            <div className="font-semibold">Kun Mig</div>
            <div className="text-sm text-muted-foreground">Enkeltperson brug</div>
          </div>
        </Button>

        <Button
          variant={value === 2 ? "option-selected" : "option"}
          size="option"
          onClick={() => onChange(2)}
          className="flex-col gap-3"
        >
          <Users className="w-10 h-10" />
          <div>
            <div className="font-semibold">To Personer</div>
            <div className="text-sm text-muted-foreground">Par eller delt brug</div>
          </div>
        </Button>
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