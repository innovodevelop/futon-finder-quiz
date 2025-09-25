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
   * Get recommended products based on quiz results using advanced tag-based scoring
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
    if (!products.length) {
      console.warn('No products available for recommendations');
      return [];
    }

    const scoredProducts = products.map(product => ({
      ...product,
      score: this.calculateAdvancedProductScore(product, quizData)
    }));

    // Sort by score and return top recommendations
    return scoredProducts
      .filter(product => product.score > 0) // Only products with positive scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // Return top 6 recommendations
  }

  /**
   * Advanced scoring system using tags and quiz data (from single collection JS)
   */
  private static calculateAdvancedProductScore(product: any, quizData: any): number {
    let score = 20; // Base score
    const { peopleCount, preferences, sleepPositions, weights } = quizData;
    const productTags = product.tags.map((tag: string) => tag.toLowerCase());

    // === FIRMNESS PREFERENCE SCORING ===
    score += this.calculateFirmnessScore(product, productTags, preferences, peopleCount);

    // === SLEEP POSITION SCORING ===
    score += this.calculateSleepPositionScore(product, productTags, sleepPositions, peopleCount);

    // === WEIGHT-BASED SCORING ===
    score += this.calculateWeightScore(product, productTags, weights, peopleCount);

    // === PEOPLE COUNT SCORING ===
    score += this.calculatePeopleCountScore(product, productTags, peopleCount);

    // === SPECIAL FEATURES SCORING ===
    score += this.calculateSpecialFeaturesScore(product, productTags);

    return Math.max(0, score); // Ensure non-negative score
  }

  private static calculateFirmnessScore(product: any, productTags: string[], preferences: any, peopleCount: number): number {
    let score = 0;
    const tagMappings = {
      soft: ['soft', 'blød', 'myk', 'mjuk'],
      medium: ['medium', 'mellem', 'middel'],
      hard: ['hard', 'hård', 'firm', 'fast']
    };

    // Primary person preference
    const pref1 = preferences.person1;
    if (pref1 && tagMappings[pref1 as keyof typeof tagMappings]) {
      const matchingTags = tagMappings[pref1 as keyof typeof tagMappings];
      if (matchingTags.some(tag => productTags.includes(tag))) {
        score += 60;
      }
    }

    // Secondary person preference (for couples)
    if (peopleCount === 2 && preferences.person2) {
      const pref2 = preferences.person2;
      if (pref2 && tagMappings[pref2 as keyof typeof tagMappings]) {
        const matchingTags = tagMappings[pref2 as keyof typeof tagMappings];
        if (matchingTags.some(tag => productTags.includes(tag))) {
          score += 40;
        }
      }
    }

    return score;
  }

  private static calculateSleepPositionScore(product: any, productTags: string[], sleepPositions: any, peopleCount: number): number {
    let score = 0;
    const positionMappings = {
      side: ['side', 'sideligger', 'side-sleeper'],
      back: ['back', 'rygligger', 'back-sleeper', 'ryg'],
      stomach: ['stomach', 'maveligger', 'stomach-sleeper', 'mave'],
      'belly-back': ['back', 'rygligger', 'back-sleeper', 'ryg', 'stomach', 'maveligger', 'stomach-sleeper', 'mave']
    };

    // Primary person sleep position
    const pos1 = sleepPositions.person1;
    if (pos1 && positionMappings[pos1 as keyof typeof positionMappings]) {
      const matchingTags = positionMappings[pos1 as keyof typeof positionMappings];
      if (matchingTags.some(tag => productTags.includes(tag))) {
        score += 25;
      }
    }

    // Secondary person sleep position (for couples)
    if (peopleCount === 2 && sleepPositions.person2) {
      const pos2 = sleepPositions.person2;
      if (pos2 && positionMappings[pos2 as keyof typeof positionMappings]) {
        const matchingTags = positionMappings[pos2 as keyof typeof positionMappings];
        if (matchingTags.some(tag => productTags.includes(tag))) {
          score += 20;
        }
      }
    }

    return score;
  }

  private static calculateWeightScore(product: any, productTags: string[], weights: any, peopleCount: number): number {
    let score = 0;
    const totalWeight = weights.person1 + (peopleCount === 2 ? (weights.person2 || 0) : 0);
    
    // Weight-based recommendations
    if (totalWeight > 160) { // Heavy weight support
      if (productTags.some(tag => ['firm', 'hard', 'support', 'heavy-duty'].includes(tag))) {
        score += 15;
      }
    } else if (totalWeight < 120) { // Light weight comfort
      if (productTags.some(tag => ['soft', 'comfortable', 'light'].includes(tag))) {
        score += 10;
      }
    }

    return score;
  }

  private static calculatePeopleCountScore(product: any, productTags: string[], peopleCount: number): number {
    let score = 0;
    
    if (peopleCount === 1) {
      if (productTags.some(tag => ['single', 'enkelt', 'individual'].includes(tag))) {
        score += 15;
      }
    } else if (peopleCount === 2) {
      if (productTags.some(tag => ['couple', 'par', 'double', 'dobbelt', 'two-person'].includes(tag))) {
        score += 15;
      }
    }

    return score;
  }

  private static calculateSpecialFeaturesScore(product: any, productTags: string[]): number {
    let score = 0;
    
    // Premium features
    const premiumFeatures = ['memory-foam', 'hukommelseseskum', 'organic', 'økologisk', 'cooling', 'køling'];
    if (premiumFeatures.some(feature => productTags.includes(feature))) {
      score += 10;
    }

    // Quality indicators
    const qualityIndicators = ['premium', 'luxury', 'high-quality', 'bestseller'];
    if (qualityIndicators.some(indicator => productTags.includes(indicator))) {
      score += 8;
    }

    return score;
  }

  /**
   * Legacy method for backward compatibility
   */
  private static calculateMatchScore(product: any, quizData: any): number {
    return this.calculateAdvancedProductScore(product, quizData);
  }
}