# Futon Quiz - Styling Implementation Guide

## Overview
The Futon Quiz uses a **scoped CSS approach** to prevent conflicts with your site's existing styles. All quiz styles are contained within the `.futon-quiz-section` class and use the `fq-` prefix.

## Files Structure

### 1. Core Style File
- **File**: `shopify/assets/futon-quiz-styles.css`
- **Purpose**: Contains all scoped styles for the quiz
- **Scope**: All styles are prefixed with `.futon-quiz-section` to prevent conflicts

### 2. Section File  
- **File**: `shopify/sections/futon-quiz-blocks.liquid`
- **Purpose**: Main quiz structure with Shopify blocks
- **Classes**: Uses `fq-` prefixed classes exclusively

### 3. JavaScript File
- **File**: `shopify/assets/futon-quiz-blocks.js` 
- **Purpose**: Quiz logic and interactions
- **Integration**: References scoped CSS classes

## Styling Approach

### CSS Scoping Strategy
```css
.futon-quiz-section {
  /* All quiz variables scoped here */
  --fq-primary: 247 49% 47%;
  --fq-background: 0 0% 100%;
  /* ... */
  
  /* All nested styles */
  .fq-btn { /* styles */ }
  .fq-input { /* styles */ }
  /* ... */
}
```

### Class Naming Convention
- **Prefix**: All classes use `fq-` prefix
- **Components**: `fq-btn`, `fq-input`, `fq-card`
- **Utilities**: `fq-flex`, `fq-grid`, `fq-text-center`
- **States**: `fq-btn-primary`, `fq-btn-selected`

## Key Features

### 1. Complete Isolation
- Uses `all: initial` reset to prevent inheritance
- Scoped CSS variables prevent color conflicts  
- Prefixed classes avoid naming collisions

### 2. Responsive Design
```css
@media (min-width: 768px) {
  .fq-md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

### 3. Dark Mode Support
```css
.futon-quiz-section[data-theme="dark"] {
  --fq-background: 222.2 84% 4.9%;
  --fq-foreground: 210 40% 98%;
}
```

### 4. Animation System
```css
.fq-fade-in {
  animation: fqFadeIn 0.3s ease-out;
}

@keyframes fqFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Implementation Steps

### 1. Upload Files
```bash
# Upload to your Shopify theme
/assets/futon-quiz-styles.css
/assets/futon-quiz-blocks.js  
/sections/futon-quiz-blocks.liquid
```

### 2. Create Collections
- `soft-futones` - Soft futon products
- `medium-futones` - Medium firmness products  
- `hard-futones` - Firm futon products
- `couple-futones` - Couple-specific products

### 3. Add Section to Page
1. Go to Theme Customizer
2. Add "Futon Quiz Blocks" section
3. Configure blocks and settings
4. Publish changes

## Customization

### Colors
Modify CSS variables in `futon-quiz-styles.css`:
```css
.futon-quiz-section {
  --fq-primary: YOUR_PRIMARY_COLOR;
  --fq-secondary: YOUR_SECONDARY_COLOR;
  /* ... */
}
```

### Typography
Update font family:
```css
.futon-quiz-section {
  font-family: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Spacing & Layout
Adjust container and component spacing:
```css
.fq-container {
  max-width: YOUR_MAX_WIDTH;
  padding: YOUR_PADDING;
}
```

## Conflict Prevention

### High Specificity
The scoped approach uses high CSS specificity to override any global styles:
```css
.futon-quiz-section .fq-btn {
  /* High specificity ensures these styles win */
}
```

### CSS Reset
Each component includes necessary resets:
```css
.futon-quiz-section .fq-btn {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  /* Reset any global button styles */
}
```

### Namespace Protection
All JavaScript also uses scoped selectors:
```javascript
// Always target within quiz scope
document.querySelector('.futon-quiz-section .fq-btn-primary')
```

## Testing Checklist

- [ ] Quiz displays correctly on your site
- [ ] No style conflicts with existing theme
- [ ] Responsive design works on all devices
- [ ] Dark mode compatibility (if applicable)
- [ ] Form submissions work correctly
- [ ] Product recommendations display properly
- [ ] Cart integration functions
- [ ] Progress indicators animate smoothly

## Browser Support
- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

## Performance Notes
- CSS file is ~15KB (minified)
- JavaScript is ~8KB (minified)
- Uses modern CSS features (CSS Grid, Custom Properties)
- Optimized for mobile-first loading