# Version 2 - React-Shopify Integration

This folder contains the enhanced React-Shopify integrated implementation.

## Structure

### react-source/
Enhanced React components optimized for Shopify integration:
- Shopify-aware components
- Theme editor compatibility
- Product data adapters
- Progressive enhancement

### shopify-integrated/
Shopify integration files:
- Enhanced Liquid sections
- Version-aware asset loading
- Theme editor schema
- Configuration bridges

### build-system/
Build configuration and deployment scripts:
- Vite configurations for Shopify output
- Asset bundling for theme compatibility
- Development workflow tools

## Key Features
- **Single codebase**: React components generate both React app and Shopify assets
- **Theme editor compatible**: Full customization through Shopify admin
- **Progressive enhancement**: Graceful fallback to V1 if needed
- **Performance optimized**: Modern bundling with tree shaking

## Development
```bash
npm run dev:v2          # Development mode
npm run build:v2        # Production build
npm run deploy:v2       # Deploy to Shopify
```

## Migration Path
Merchants can choose between V1 and V2 through theme editor settings with automatic fallback capabilities.