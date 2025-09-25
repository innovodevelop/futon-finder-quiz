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
      // Fallback for development - use dummy data
      const dummyProducts: ShopifyProduct[] = [
        {
          id: 1,
          handle: 'premium-futon-deluxe',
          title: 'Premium Futon Deluxe',
          price: 12999,
          compare_at_price: 15999,
          featured_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop',
          url: '/products/premium-futon-deluxe',
          description: 'Perfekt til dig baseret på dine præferencer. Ultra komfortabel med memory foam og organisk bomuldscover.',
          tags: ['premium', 'memory-foam', 'organic', 'medium-firm'],
          vendor: 'SleepWell',
          type: 'Futon',
          variants: [{
            id: 101,
            title: 'Standard',
            price: 12999,
            available: true
          }],
          score: 95
        },
        {
          id: 2,
          handle: 'eco-comfort-futon',
          title: 'Eco Comfort Futon',
          price: 8999,
          compare_at_price: 10999,
          featured_image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&h=400&fit=crop',
          url: '/products/eco-comfort-futon',
          description: 'Miljøvenlig futon fremstillet af bæredygtige materialer. Ideel til dem der værdsætter både komfort og miljø.',
          tags: ['eco-friendly', 'sustainable', 'soft', 'bamboo'],
          vendor: 'GreenSleep',
          type: 'Futon',
          variants: [{
            id: 102,
            title: 'Standard',
            price: 8999,
            available: true
          }],
          score: 87
        },
        {
          id: 3,
          handle: 'firm-support-futon',
          title: 'Firm Support Futon',
          price: 10499,
          featured_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=400&fit=crop',
          url: '/products/firm-support-futon',
          description: 'Ekstra fast støtte til dem der foretrækker en hårdere soveoplevelse. Perfekt til ryg- og mavestillinger.',
          tags: ['firm', 'support', 'orthopedic', 'back-support'],
          vendor: 'SleepWell',
          type: 'Futon',
          variants: [{
            id: 103,
            title: 'Standard',
            price: 10499,
            available: true
          }],
          score: 82
        }
      ];
      
      setRecommendations(dummyProducts);
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
    <div id="fq-recommendation-step" className="fq-step">
      <div className="fq-step__header">
        <h2 className="fq-step__title">
          🎉 Dine Perfekte Futon Matches!
        </h2>
        <p className="fq-step__subtitle">
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
          <Button id="fq-rec-restart" variant="quiz" onClick={onRestart} className="fq-btn--quiz">
            Tag Test Igen
          </Button>
        </div>
      ) : (
        <>
          <div id="fq-recommendations-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredRecommendations.map((product, index) => (
              <Card key={product.id} id={`fq-rec-product-${product.id}`} className={`fq-card relative ${index === 0 ? 'ring-2 ring-primary' : ''}`}>
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
                      id={`fq-rec-add-cart-${product.id}`}
                      onClick={() => handleAddToCart(product.variants[0].id)}
                      disabled={!product.variants[0].available}
                      className="w-full fq-btn--quiz"
                      variant="quiz"
                    >
                      {product.variants[0].available ? 'Tilføj til kurv' : 'Udsolgt'}
                    </Button>
                    <Button 
                      id={`fq-rec-details-${product.id}`}
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

          <div className="fq-info-box bg-success/10 border border-success/20">
            <div className="fq-info-box__content text-success-foreground">
              <h3 className="font-semibold mb-2">
                ✨ Hvad sker der nu?
              </h3>
              <ul className="text-sm text-success-foreground/80 space-y-1 text-left">
                <li>• Vores søvneksperter kontakter dig inden for 24 timer</li>
                <li>• Du modtager detaljerede produktoplysninger og priser</li>
                <li>• Vi planlægger en konsultation for at besvare eventuelle spørgsmål</li>
                <li>• Gratis hjemmeprøvning tilgængelig på alle anbefalede futoner</li>
              </ul>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Button id="fq-rec-contact-experts" variant="quiz" size="lg" className="fq-btn--quiz">
              Kontakt Vores Eksperter
            </Button>
            <div>
              <Button id="fq-rec-retake" variant="link" onClick={onRestart}>
                Tag Test Igen
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};