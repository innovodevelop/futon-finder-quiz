# Tag-Based Product Selection System

## Overview

The new tag-based system uses **one collection** with **product tags** instead of multiple collections for flexible product categorization and recommendations.

## Key Benefits

✅ **Single Collection Management** - All products in one place
✅ **Multi-Attribute Products** - Products can have multiple firmness levels, suitabilities
✅ **Flexible Categorization** - Easy to add new criteria without creating collections
✅ **Advanced Scoring** - Sophisticated matching algorithm using multiple factors
✅ **Better Couples Support** - Products can work for different preferences simultaneously

## Product Tagging Strategy

### Required Tags Structure

#### Firmness Tags
```
soft, blød, plush          → Soft products
medium, medium-fast        → Medium firmness products  
hard, fast, firm, stiv     → Hard/firm products
```

#### Sleep Position Tags
```
side-sleeper, sideligger    → Good for side sleepers
back-sleeper, rygligger     → Good for back sleepers
stomach-sleeper, maveligger → Good for stomach sleepers
```

#### Couples/Size Tags
```
couples, par, double       → Good for couples
single, enkelt            → Single person products
king, queen               → Size-specific recommendations
```

#### Weight Support Tags
```
light-weight, let, under-70kg     → Light weight support
heavy-weight, tung, over-90kg     → Heavy weight support
plus-size, stor-størelse          → Plus size support
```

#### Quality/Feature Tags
```
premium, luxury           → Premium products (bonus scoring)
organic, natural         → Natural materials
comfortable, supportive  → Comfort features
ergonomic, pressure-relief → Ergonomic features
```

## Example Product Tagging

### Product: "Premium Medium-Firm Couples Futon"
**Tags:** `medium, couples, par, premium, supportive, side-sleeper, back-sleeper, heavy-weight`

**Result:** This product will score highly for:
- Couples seeking medium firmness
- Side or back sleepers
- Heavier individuals
- Anyone wanting premium quality

### Product: "Soft Single Organic Futon" 
**Tags:** `soft, blød, single, organic, natural, light-weight, side-sleeper`

**Result:** Perfect for:
- Single person wanting soft firmness
- Side sleepers
- Lighter weight individuals  
- Eco-conscious customers

## Scoring Algorithm

### Base Score: 20 points

### Firmness Matching
- **Perfect match:** +25 points per person
- **Compromise match (couples):** +15 points additional
- **Mismatch penalty:** -30 points

### Sleep Position Matching
- **Position match:** +15 points per person

### Weight-Based Scoring
- **Light weight match (<70kg):** +10 points
- **Heavy weight match (>90kg):** +15 points

### Couples Bonuses
- **Couples tag match:** +20 points
- **Multi-preference support:** +15 points

### Quality Bonuses
- **Premium/luxury tags:** +5 points
- **Comfort/support tags:** +5 points

### Penalties
- **Single-only for couples:** -30 points
- **Couples-only for singles:** -20 points

## Implementation Steps

### 1. Create Product Collection
```liquid
<!-- In Shopify Admin -->
Create collection: "Futon Quiz Products"
Add all products you want to recommend
```

### 2. Tag Your Products
Apply relevant tags to each product based on the tagging strategy above.

### 3. Configure Section Settings
```liquid
<!-- In theme customizer -->
- Select your "Futon Quiz Products" collection
- Configure tag mappings for your language/terms
- Customize firmness, sleep position, and couples tags
```

### 4. Advanced Customization

#### Custom Tag Mappings
```javascript
// Modify in section settings
"soft_tags": "soft,blød,plush,mjuk,morbido"
"couples_tags": "couples,par,couple,doble,pareja"
```

#### Scoring Adjustments
```javascript
// In futon-quiz-single-collection.js
calculateFirmnessScore() {
  // Adjust scoring weights
  if (hasMatch) firmnessScore += 30; // Increase from 25
}
```

## Migration from Multi-Collection System

### Current System Problems
- Products in multiple collections = duplicate management
- Can't handle products with multiple firmness levels
- Hard to add new criteria (weight, sleep position combinations) 
- Couples products limited to separate collection

### Migration Steps

1. **Audit Current Products**
   - List all products across soft/medium/hard/couples collections
   - Identify overlap and duplicates

2. **Create Master Collection**
   - Create new "Futon Quiz Products" collection
   - Add all unique products

3. **Tag Products Strategically**
   - Apply multiple relevant tags per product
   - Use consistent naming conventions

4. **Test Recommendations**
   - Use tag-based system to verify scoring
   - Adjust tag mappings as needed

5. **Deploy New System**
   - Replace old quiz section with tag-based version
   - Monitor recommendation quality

## Advanced Features

### Multi-Language Support
```liquid
"soft_tags": "soft,blød,mjuk,morbido,doux"
"medium_tags": "medium,mellem,medel,medio,moyen"
```

### Custom Scoring Rules
```javascript
// Weight difference bonus for couples
if (peopleCount === 2) {
  const weightDiff = Math.abs(person1Weight - person2Weight);
  if (weightDiff < 20) score += 10; // Similar weights bonus
}
```

### Analytics Integration
```javascript
// Track recommendation performance
gtag('event', 'quiz_recommendation', {
  product_id: product.id,
  score: product.score,
  user_preferences: JSON.stringify(this.quizData)
});
```

## Troubleshooting

### No Recommendations Found
- Check tag mappings match product tags exactly
- Verify collection has products with appropriate tags
- Review minimum score threshold

### Poor Recommendation Quality  
- Audit product tagging accuracy
- Adjust scoring weights for different factors
- Add more specific tags for edge cases

### Performance Issues
- Limit collection size (50-100 products max)
- Optimize tag matching algorithms
- Cache product data appropriately