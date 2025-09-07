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

  const updateHeight = (person: "person1" | "person2", height: number) => {
    onChange(weights, {
      ...heights,
      [person]: height,
    });
  };

  const isValid = weights.person1 > 0 && heights.person1 > 0 && 
    (peopleCount === 1 || (weights.person2 && weights.person2 > 0 && heights.person2 && heights.person2 > 0));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Hvad er {peopleCount === 1 ? "din vægt og højde" : "jeres vægt og højde"}?
        </h2>
        <p className="text-muted-foreground">
          Vægt og højde hjælper vores medarbejdere med at give dig personlig rådgivning.
        </p>
      </div>

      <div className={`mb-6 ${peopleCount === 2 ? "space-y-8" : "space-y-6"}`}>
        {/* Person 1 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {peopleCount === 1 ? "Dine oplysninger" : "Person 1 oplysninger"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight1" className="text-base font-medium">
                Vægt (kg)
              </Label>
              <Input
                id="weight1"
                type="number"
                placeholder="Indtast vægt i kg"
                value={weights.person1 || ""}
                onChange={(e) => updateWeight("person1", parseInt(e.target.value) || 0)}
                min="35"
                max="180"
                className="h-12 text-center text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height1" className="text-base font-medium">
                Højde (cm)
              </Label>
              <Input
                id="height1"
                type="number"
                placeholder="Indtast højde i cm"
                value={heights.person1 || ""}
                onChange={(e) => updateHeight("person1", parseInt(e.target.value) || 0)}
                min="140"
                max="220"
                className="h-12 text-center text-lg"
              />
            </div>
          </div>
        </div>

        {peopleCount === 2 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Person 2 oplysninger</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight2" className="text-base font-medium">
                  Vægt (kg)
                </Label>
                <Input
                  id="weight2"
                  type="number"
                  placeholder="Indtast vægt i kg"
                  value={weights.person2 || ""}
                  onChange={(e) => updateWeight("person2", parseInt(e.target.value) || 0)}
                  min="35"
                  max="180"
                  className="h-12 text-center text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height2" className="text-base font-medium">
                  Højde (cm)
                </Label>
                <Input
                  id="height2"
                  type="number"
                  placeholder="Indtast højde i cm"
                  value={heights.person2 || ""}
                  onChange={(e) => updateHeight("person2", parseInt(e.target.value) || 0)}
                  min="140"
                  max="220"
                  className="h-12 text-center text-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-muted/30 rounded-2xl p-4 mb-6">
        <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Vægt og højde bruges kun som reference for vores medarbejdere ved personlig rådgivning.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onPrev}>
          Tilbage
        </Button>
        <Button 
          variant="quiz" 
          onClick={onNext}
          disabled={!isValid}
        >
          Fortsæt
        </Button>
      </div>
    </div>
  );
};