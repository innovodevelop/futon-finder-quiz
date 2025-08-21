import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizData } from "../FutonQuiz";

interface RecommendationStepProps {
  quizData: QuizData;
  onRestart: () => void;
}

// Sample futon data - in a real app, this would come from the Excel sheet
const futonDatabase = [
  {
    id: 1,
    name: "Cloud Comfort Deluxe",
    type: "Memory Foam",
    firmness: "soft",
    price: "$899",
    suitableFor: {
      weight: { min: 100, max: 200 },
      sleepPosition: ["side", "both"],
      people: [1, 2]
    },
    features: ["Gel-infused memory foam", "Cooling technology", "Motion isolation"],
    image: "🛏️",
    description: "Perfect for side sleepers who love a plush, contouring feel."
  },
  {
    id: 2,
    name: "Balance Pro",
    type: "Hybrid",
    firmness: "medium",
    price: "$1,199",
    suitableFor: {
      weight: { min: 120, max: 250 },
      sleepPosition: ["side", "belly-back", "both"],
      people: [1, 2]
    },
    features: ["Pocket spring coils", "Memory foam top", "Edge support"],
    image: "🏅",
    description: "The perfect balance of comfort and support for all sleep styles."
  },
  {
    id: 3,
    name: "Firm Foundation",
    type: "Innerspring",
    firmness: "hard",
    price: "$799",
    suitableFor: {
      weight: { min: 150, max: 300 },
      sleepPosition: ["belly-back", "both"],
      people: [1, 2]
    },
    features: ["Heavy-duty coils", "Firm support", "Breathable fabric"],
    image: "🏗️",
    description: "Solid support for back and stomach sleepers who prefer firmness."
  },
  {
    id: 4,
    name: "Couples Choice",
    type: "Memory Foam",
    firmness: "medium",
    price: "$1,399",
    suitableFor: {
      weight: { min: 100, max: 280 },
      sleepPosition: ["side", "belly-back", "both"],
      people: [2]
    },
    features: ["Dual comfort zones", "Motion isolation", "Temperature regulation"],
    image: "💑",
    description: "Designed specifically for couples with different preferences."
  }
];

export const RecommendationStep = ({ quizData, onRestart }: RecommendationStepProps) => {
  const getRecommendations = () => {
    return futonDatabase.filter(futon => {
      // Check people count
      if (!futon.suitableFor.people.includes(quizData.peopleCount)) {
        return false;
      }

      // Check weight range (average for couples)
      const avgWeight = quizData.peopleCount === 1 
        ? quizData.weights.person1 
        : (quizData.weights.person1 + (quizData.weights.person2 || 0)) / 2;

      if (avgWeight < futon.suitableFor.weight.min || avgWeight > futon.suitableFor.weight.max) {
        return false;
      }

      // Check sleep position (if any person matches)
      const positions = [quizData.sleepPositions.person1];
      if (quizData.peopleCount === 2 && quizData.sleepPositions.person2) {
        positions.push(quizData.sleepPositions.person2);
      }

      const hasMatchingPosition = positions.some(pos => 
        futon.suitableFor.sleepPosition.includes(pos)
      );

      if (!hasMatchingPosition) {
        return false;
      }

      // Check firmness preference (if any person matches)
      const preferences = [quizData.preferences.person1];
      if (quizData.peopleCount === 2 && quizData.preferences.person2) {
        preferences.push(quizData.preferences.person2);
      }

      const hasMatchingFirmness = preferences.includes(futon.firmness as any);

      return hasMatchingFirmness;
    }).sort((a, b) => {
      // Prioritize futons that match more criteria
      let scoreA = 0;
      let scoreB = 0;

      // Bonus for exact people count match
      if (a.suitableFor.people.length === 1 && a.suitableFor.people[0] === quizData.peopleCount) scoreA += 2;
      if (b.suitableFor.people.length === 1 && b.suitableFor.people[0] === quizData.peopleCount) scoreB += 2;

      return scoreB - scoreA;
    });
  };

  const recommendations = getRecommendations();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          🎉 Dine Perfekte Futon Matches!
        </h2>
        <p className="text-muted-foreground">
          Baseret på dine præferencer, her er vores top anbefalinger til {quizData.contactInfo.name}:
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😅</div>
          <h3 className="text-xl font-semibold mb-2">Ingen Perfekte Matches Fundet</h3>
          <p className="text-muted-foreground mb-6">
            Dine specifikke krav er ret unikke! Vores søvneksperter vil gennemgå dine præferencer og kontakte dig med tilpassede anbefalinger.
          </p>
          <Button variant="quiz" onClick={onRestart}>
            Tag Test Igen
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {recommendations.map((futon, index) => (
              <Card key={futon.id} className={`relative ${index === 0 ? 'ring-2 ring-primary' : ''}`}>
                {index === 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary">
                    Bedste Match
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{futon.image}</span>
                    <div>
                      <CardTitle className="text-lg">{futon.name}</CardTitle>
                      <CardDescription>{futon.type}</CardDescription>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">{futon.price}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{futon.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {futon.firmness.charAt(0).toUpperCase() + futon.firmness.slice(1)} Firmness
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium mb-1">Nøglefunktioner:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                        {futon.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-success/10 border border-success/20 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-success-foreground mb-2">
              ✨ Hvad sker der nu?
            </h3>
            <ul className="text-sm text-success-foreground/80 space-y-1">
              <li>• Vores søvneksperter kontakter dig inden for 24 timer</li>
              <li>• Du modtager detaljerede produktoplysninger og priser</li>
              <li>• Vi planlægger en konsultation for at besvare eventuelle spørgsmål</li>
              <li>• Gratis hjemmeprøvning tilgængelig på alle anbefalede futoner</li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <Button variant="quiz" size="lg">
              Kontakt Vores Eksperter
            </Button>
            <div>
              <Button variant="link" onClick={onRestart}>
                Tag Test Igen
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};