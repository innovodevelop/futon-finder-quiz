import { Button } from "@/components/ui/button";
import heroImage from "@/assets/futon-hero.jpg";

interface StartStepProps {
  onNext: () => void;
}

export const StartStep = ({ onNext }: StartStepProps) => {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <img
          src={heroImage}
          alt="Comfortable bedroom with beautiful futon"
          className="w-full h-64 object-cover rounded-xl shadow-soft"
        />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
        Find Your Perfect Futon
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        Take our personalized quiz to discover the ideal futon that matches your sleep style, preferences, and needs. 
        In just a few simple steps, we'll recommend the perfect futon for your best night's sleep.
      </p>

      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-foreground mb-3">What to Expect:</h3>
        <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Questions about your sleeping preferences
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Weight and sleep position considerations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Personalized futon recommendations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Takes less than 3 minutes to complete
          </li>
        </ul>
      </div>

      <Button
        variant="quiz"
        size="xl"
        onClick={onNext}
        className="min-w-48"
      >
        Start Quiz
      </Button>
    </div>
  );
};