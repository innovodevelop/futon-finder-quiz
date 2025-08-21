import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizData } from "../FutonQuiz";

interface RecommendationStepProps {
  quizData: QuizData;
  onRestart: () => void;
}

// Shopify product interface
interface ShopifyProduct {
  id: number;
  handle: string;
  title: string;
  price: number;
  compare_at_price?: number;
  featured_image?: string;
  url: string;
  description: string;
  tags: string[];
  vendor: string;
  type: string;
  variants: Array<{
    id: number;
    title: string;
    price: number;
    available: boolean;
  }>;
  score?: number;
}

export const RecommendationStep = ({ quizData, onRestart }: RecommendationStepProps) => {
  const [recommendations, setRecommendations] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get recommendations from Shopify integration
    if (typeof window !== 'undefined' && (window as any).shopifyQuizIntegration) {
      const shopifyIntegration = (window as any).shopifyQuizIntegration;
      const shopifyRecommendations = shopifyIntegration.getRecommendations(quizData);
      setRecommendations(shopifyRecommendations);
      setIsLoading(false);
      
      // Submit quiz data to Shopify
      shopifyIntegration.submitQuizData(quizData).catch((error: any) => {
        console.error('Error submitting quiz data:', error);
      });
    } else {
      // Fallback for development - use sample data
      setRecommendations([]);
      setIsLoading(false);
    }
  }, [quizData]);

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK'
    }).format(priceInCents / 100);
  };

  const handleAddToCart = (variantId: number) => {
    if (typeof window !== 'undefined' && (window as any).shopifyQuizIntegration) {
      (window as any).shopifyQuizIntegration.addToCart(variantId);
    }
  };

  const getRecommendations = () => {
    return recommendations.filter(product => {
      // Products are already filtered by Shopify integration
      return true;
    }).sort((a, b) => (b.score || 0) - (a.score || 0));
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏳</div>
        <h3 className="text-xl font-semibold mb-2">Finder Dine Perfekte Matches...</h3>
        <p className="text-muted-foreground">
          Vi analyserer dine præferencer og finder de bedste produkter til dig.
        </p>
      </div>
    );
  }

  const filteredRecommendations = getRecommendations();

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

      {filteredRecommendations.length === 0 ? (
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
            {filteredRecommendations.map((product, index) => (
              <Card key={product.id} className={`relative ${index === 0 ? 'ring-2 ring-primary' : ''}`}>
                {index === 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary">
                    Bedste Match
                  </Badge>
                )}
                {product.featured_image && (
                  <div className="aspect-w-16 aspect-h-9 bg-muted">
                    <img 
                      src={product.featured_image} 
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      {product.vendor && <CardDescription>{product.vendor}</CardDescription>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </div>
                    {product.compare_at_price && product.compare_at_price > product.price && (
                      <div className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compare_at_price)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  {product.tags.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleAddToCart(product.variants[0].id)}
                      disabled={!product.variants[0].available}
                      className="w-full"
                      variant="quiz"
                    >
                      {product.variants[0].available ? 'Tilføj til kurv' : 'Udsolgt'}
                    </Button>
                    <Button 
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        Se detaljer
                      </a>
                    </Button>
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