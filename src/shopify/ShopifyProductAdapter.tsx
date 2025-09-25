import React from 'react';

export class ShopifyProductAdapter {
  /**
   * Adapt Shopify product data for React components
   */
  static adaptProductsForReact(products: any[], shopConfig: any) {
    return products.map(product => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      price: this.formatPrice(product.price, shopConfig.currency),
      compareAtPrice: product.compare_at_price 
        ? this.formatPrice(product.compare_at_price, shopConfig.currency)
        : null,
      images: product.images?.map((image: any) => ({
        src: image.src,
        alt: image.alt || product.title,
        width: image.width,
        height: image.height,
      })) || [],
      variants: product.variants?.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: this.formatPrice(variant.price, shopConfig.currency),
        available: variant.available,
        sku: variant.sku,
        options: variant.options,
      })) || [],
      tags: product.tags || [],
      collections: product.collections || [],
      url: `/products/${product.handle}`,
      // Quiz-specific properties
      firmness: this.extractFirmness(product.tags),
      suitability: this.extractSuitability(product.tags),
      features: this.extractFeatures(product.description, product.tags),
    }));
  }

  /**
   * Format price according to shop currency
   */
  private static formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: currency || 'DKK',
    }).format(price / 100); // Shopify prices are in cents
  }

  /**
   * Extract firmness from product tags
   */
  private static extractFirmness(tags: string[]): 'soft' | 'medium' | 'hard' | null {
    const firmnessTags = tags.filter(tag => 
      ['soft', 'medium', 'hard', 'blød', 'mellem', 'hård'].includes(tag.toLowerCase())
    );
    
    if (firmnessTags.length === 0) return null;
    
    const tag = firmnessTags[0].toLowerCase();
    if (tag === 'soft' || tag === 'blød') return 'soft';
    if (tag === 'medium' || tag === 'mellem') return 'medium';
    if (tag === 'hard' || tag === 'hård') return 'hard';
    
    return null;
  }

  /**
   * Extract suitability from product tags
   */
  private static extractSuitability(tags: string[]): {
    singlePerson: boolean;
    couples: boolean;
    sideSleeperFriendly: boolean;
    backSleeperFriendly: boolean;
    stomachSleeperFriendly: boolean;
  } {
    const lowercaseTags = tags.map(tag => tag.toLowerCase());
    
    return {
      singlePerson: lowercaseTags.some(tag => 
        ['single', 'enkelt', 'single-person'].includes(tag)
      ),
      couples: lowercaseTags.some(tag => 
        ['couples', 'par', 'double', 'dobbelt'].includes(tag)
      ),
      sideSleeperFriendly: lowercaseTags.some(tag => 
        ['side-sleeper', 'side', 'sideligger'].includes(tag)
      ),
      backSleeperFriendly: lowercaseTags.some(tag => 
        ['back-sleeper', 'back', 'rygligger'].includes(tag)
      ),
      stomachSleeperFriendly: lowercaseTags.some(tag => 
        ['stomach-sleeper', 'belly', 'maveligger'].includes(tag)
      ),
    };
  }

  /**
   * Extract features from description and tags
   */
  private static extractFeatures(description: string, tags: string[]): string[] {
    const features: string[] = [];
    const lowercaseDesc = description.toLowerCase();
    const lowercaseTags = tags.map(tag => tag.toLowerCase());
    
    // Common feature keywords
    const featureMap = {
      'memory foam': 'Memory Foam',
      'hukommelseseskum': 'Memory Foam',
      'cooling': 'Køling',
      'køling': 'Køling',
      'breathable': 'Åndbar',
      'åndbar': 'Åndbar',
      'organic': 'Økologisk',
      'økologisk': 'Økologisk',
      'hypoallergenic': 'Hypoallergenisk',
      'hypoallergenisk': 'Hypoallergenisk',
    };
    
    // Check description and tags for features
    Object.entries(featureMap).forEach(([keyword, feature]) => {
      if (lowercaseDesc.includes(keyword) || lowercaseTags.includes(keyword)) {
        features.push(feature);
      }
    });
    
    return [...new Set(features)]; // Remove duplicates
  }

  /**
   * Get recommended products based on quiz results
   */
  static getRecommendations(
    products: any[], 
    quizData: {
      peopleCount: 1 | 2;
      preferences: { person1: string; person2?: string };
      sleepPositions: { person1: string; person2?: string };
      weights: { person1: number; person2?: number };
    }
  ) {
    return products
      .filter(product => {
        // Filter by firmness preference
        const primaryFirmness = quizData.preferences.person1;
        if (product.firmness && product.firmness !== primaryFirmness) {
          // For couples, check if either preference matches
          if (quizData.peopleCount === 2 && quizData.preferences.person2) {
            return product.firmness === quizData.preferences.person2;
          }
          return false;
        }
        
        // Filter by people count suitability
        if (quizData.peopleCount === 1 && !product.suitability.singlePerson) {
          return false;
        }
        if (quizData.peopleCount === 2 && !product.suitability.couples) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Prioritize by match score
        const scoreA = this.calculateMatchScore(a, quizData);
        const scoreB = this.calculateMatchScore(b, quizData);
        return scoreB - scoreA;
      })
      .slice(0, 3); // Return top 3 matches
  }

  /**
   * Calculate match score for product recommendation
   */
  private static calculateMatchScore(product: any, quizData: any): number {
    let score = 0;
    
    // Firmness match
    if (product.firmness === quizData.preferences.person1) score += 50;
    if (quizData.peopleCount === 2 && product.firmness === quizData.preferences.person2) score += 50;
    
    // Sleep position suitability
    const sleepPos1 = quizData.sleepPositions.person1;
    if (sleepPos1 === 'side' && product.suitability.sideSleeperFriendly) score += 30;
    if (sleepPos1 === 'belly-back' && product.suitability.backSleeperFriendly) score += 30;
    
    if (quizData.peopleCount === 2 && quizData.sleepPositions.person2) {
      const sleepPos2 = quizData.sleepPositions.person2;
      if (sleepPos2 === 'side' && product.suitability.sideSleeperFriendly) score += 30;
      if (sleepPos2 === 'belly-back' && product.suitability.backSleeperFriendly) score += 30;
    }
    
    // People count match
    if (quizData.peopleCount === 1 && product.suitability.singlePerson) score += 20;
    if (quizData.peopleCount === 2 && product.suitability.couples) score += 20;
    
    return score;
  }
}