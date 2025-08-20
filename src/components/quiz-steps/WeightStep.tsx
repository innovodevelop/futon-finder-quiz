import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WeightStepProps {
  peopleCount: 1 | 2;
  weights: {
    person1: number;
    person2?: number;
  };
  onChange: (weights: { person1: number; person2?: number }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const WeightStep = ({ peopleCount, weights, onChange, onNext, onPrev }: WeightStepProps) => {
  const updateWeight = (person: "person1" | "person2", weight: number) => {
    onChange({
      ...weights,
      [person]: weight,
    });
  };

  const isValid = weights.person1 > 0 && (peopleCount === 1 || (weights.person2 && weights.person2 > 0));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          What's {peopleCount === 1 ? "your weight" : "your weights"}?
        </h2>
        <p className="text-muted-foreground">
          Weight helps us determine the right firmness and support level for optimal comfort.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="weight1" className="text-base font-medium">
            {peopleCount === 1 ? "Your Weight" : "Person 1 Weight"} (kg)
          </Label>
          <Input
            id="weight1"
            type="number"
            placeholder="Enter weight in kg"
            value={weights.person1 || ""}
            onChange={(e) => updateWeight("person1", parseInt(e.target.value) || 0)}
            min="35"
            max="180"
            className="h-12 text-center text-lg"
          />
        </div>

        {peopleCount === 2 && (
          <div className="space-y-2">
            <Label htmlFor="weight2" className="text-base font-medium">
              Person 2 Weight (kg)
            </Label>
            <Input
              id="weight2"
              type="number"
              placeholder="Enter weight in kg"
              value={weights.person2 || ""}
              onChange={(e) => updateWeight("person2", parseInt(e.target.value) || 0)}
              min="35"
              max="180"
              className="h-12 text-center text-lg"
            />
          </div>
        )}
      </div>

      <div className="bg-muted/30 rounded-2xl p-4 mb-6">
        <p className="text-sm text-muted-foreground text-center">
          💡 Your weight information helps us recommend the right firmness level for proper spinal alignment and comfort.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onPrev}>
          Back
        </Button>
        <Button 
          variant="quiz" 
          onClick={onNext}
          disabled={!isValid}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};