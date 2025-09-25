# Version 1 - Current Stable Implementation

This folder contains the current stable implementation of the Futon Quiz system as of the time when version 2 development began.

## Structure

### react-app/
Contains the React application source code from `src/` folder:
- Modern React components with TypeScript
- Tailwind CSS styling with design system
- Component-based architecture
- Quiz flow management

### shopify-js/
Contains the Shopify JavaScript implementation from `shopify/` folder:
- JavaScript-based quiz logic
- Liquid template files
- Shopify theme integration
- Asset files (CSS, JS)

## Purpose
This version serves as:
- **Fallback system**: If V2 fails, merchants can revert to this stable version
- **Reference implementation**: Preserve working functionality during V2 development
- **Backup**: Complete working system archived before major changes
- **Comparison baseline**: Performance and functionality comparison with V2

## Deployment
This version can be deployed independently using:
```bash
npm run deploy:v1
```

## Git Tag
Tagged as `v1-stable` for easy access and rollback.