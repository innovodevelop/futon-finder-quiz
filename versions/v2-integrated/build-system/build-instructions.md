# V2 Build System Instructions

## Overview
The V2 build system creates Shopify-compatible assets from React components while maintaining the smooth React development experience.

## Build Process

### Development
```bash
# V1 Development (current React app)
npm run dev:v1

# V2 Development (Shopify integration)
npm run dev:v2

# Dual development (both versions)
npm run dev:dual
```

### Production Build
```bash
# Build V1 only
npm run build:v1

# Build V2 only  
npm run build:v2

# Build both versions
npm run deploy:all
```

### Shopify Deployment
```bash
# Deploy V2 to Shopify
npm run deploy:v2

# This will:
# 1. Build React components for Shopify (IIFE format)
# 2. Extract and scope CSS 
# 3. Copy assets to shopify/assets/
# 4. Copy sections to shopify/sections/
```

## File Structure After Build

```
dist/
├── v1/                          # Standard React build
│   ├── index.html
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
└── v2/                          # Shopify-compatible build
    └── shopify-assets/
        ├── futon-quiz-react-v2.js     # Main React bundle (IIFE)
        └── futon-quiz-react-v2.css    # Scoped styles

shopify/
├── assets/
│   ├── futon-quiz-react-v2.js         # Copied from dist/v2/
│   └── futon-quiz-react-v2.css        # Copied from dist/v2/
└── sections/
    ├── futon-quiz-v2.liquid            # React-specific section
    └── futon-quiz-universal.liquid     # Universal section with version selector
```

## Configuration Files

### vite.config.v1.ts
- Standard React app build
- Output: `dist/v1/`
- Target: Modern browsers
- Format: ES modules

### vite.config.v2.ts  
- Shopify integration build
- Output: `dist/v2/shopify-assets/`
- Target: Broader browser support (ES2015)
- Format: IIFE (Immediately Invoked Function Expression)
- Entry: `src/shopify/index-v2.tsx`

## Asset Management

### CSS Handling
- V2 CSS is automatically scoped to prevent theme conflicts
- Uses CSS custom properties for theme integration
- Fallbacks for older browsers

### JavaScript Bundling
- V2 bundles all dependencies (no externals)
- Source maps included for debugging
- Optimized for Shopify's CDN

## Development Workflow

### Local Development
1. Start V2 development server: `npm run dev:v2`
2. Edit React components in `src/`
3. Changes automatically reflect in Shopify-compatible output
4. Test with local Shopify CLI: `shopify theme dev`

### Production Deployment
1. Build V2 assets: `npm run build:v2`
2. Deploy to Shopify: `npm run deploy:v2`
3. Update theme sections to use new assets
4. Test in Shopify admin preview

## Theme Integration

### Section Usage
```liquid
<!-- Use V2 React version -->
{% section 'futon-quiz-v2' %}

<!-- Use universal version with selector -->
{% section 'futon-quiz-universal' %}
```

### Manual Asset Loading
```liquid
<!-- Load V2 assets manually -->
{{ 'futon-quiz-react-v2.css' | asset_url | stylesheet_tag }}
{{ 'futon-quiz-react-v2.js' | asset_url | script_tag }}
```

## Error Handling

### Build Errors
- Check TypeScript compilation in V2 components
- Ensure all Shopify-specific imports are correct
- Verify asset paths and references

### Runtime Errors  
- V2 includes automatic fallback to V1 on errors
- Console logging for debugging
- Graceful degradation for older browsers

## Performance Optimization

### Bundle Size
- Tree shaking enabled
- Code splitting for larger applications
- Compression and minification

### Loading Strategy
- Critical CSS inlined
- Progressive enhancement
- Lazy loading for non-critical components

## Migration Checklist

- [ ] V1 components archived in `versions/v1-current/`
- [ ] V2 build system configured
- [ ] Shopify sections created
- [ ] Theme editor compatibility tested
- [ ] Fallback mechanisms verified
- [ ] Performance benchmarks established
- [ ] Documentation updated