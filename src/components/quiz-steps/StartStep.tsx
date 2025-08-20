import { Button } from "@/components/ui/button";
import heroImage from "@/assets/futon-hero.jpg";

interface StartStepProps {
  onNext: () => void;
}

export const StartStep = ({ onNext }: StartStepProps) => {
  return (
    <div className="text-center max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <img 
          src={heroImage} 
          alt="Comfortable futon setup" 
          className="w-full h-48 object-cover rounded-2xl"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Find Your Perfect Futon
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Take our personalized quiz to discover the ideal futon for your comfort needs. 
          Based on your sleep preferences, we'll recommend the perfect match from our collection.
        </p>
      </div>

      <div className="bg-muted/30 rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3">What you'll get:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Personalized recommendations</span>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Expert guidance</span>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Perfect comfort match</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          variant="quiz" 
          size="lg" 
          onClick={onNext}
          className="text-base px-12 py-3"
        >
          Start Quiz
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Takes only 2-3 minutes to complete
        </p>
      </div>
    </div>
  );
};