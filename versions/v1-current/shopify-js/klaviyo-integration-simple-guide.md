# Simplified Klaviyo Integration Guide

## Overview
This integration uses Klaviyo's native client-side APIs to eliminate the need for server-side proxies while maintaining full functionality.

## Setup Steps

### 1. Configure Klaviyo in Shopify Theme
Add to your theme's `settings_schema.json`:

```json
{
  "name": "Klaviyo Integration",
  "settings": [
    {
      "type": "text",
      "id": "klaviyo_site_id", 
      "label": "Klaviyo Site ID (Public)",
      "info": "Find this in Klaviyo Settings > API Keys"
    },
    {
      "type": "text",
      "id": "klaviyo_list_id",
      "label": "Klaviyo List ID", 
      "info": "The list ID where quiz subscribers will be added"
    },
    {
      "type": "checkbox",
      "id": "klaviyo_enabled",
      "label": "Enable Klaviyo Integration",
      "default": false
    },
    {
      "type": "checkbox", 
      "id": "klaviyo_debug",
      "label": "Enable Debug Logging",
      "default": false
    }
  ]
}
```

### 2. Initialize Klaviyo in Your Theme
Add to your `theme.liquid` before the closing `</head>` tag:

```html
{% if settings.klaviyo_enabled and settings.klaviyo_site_id != blank %}
<!-- Klaviyo Tracking Script -->
<script async type="text/javascript" src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id={{ settings.klaviyo_site_id }}"></script>

<script>
// Configure Klaviyo for quiz integration
window.klaviyoConfig = {
  enabled: {{ settings.klaviyo_enabled | json }},
  siteId: {{ settings.klaviyo_site_id | json }},
  listId: {{ settings.klaviyo_list_id | json }},
  debug: {{ settings.klaviyo_debug | json }}
};
</script>
{% endif %}
```

### 3. How It Works

**Profile Creation & Updates:**
- Uses `https://a.klaviyo.com/client/profiles/` endpoint
- Creates/updates profiles with quiz data as custom properties
- No private API key needed for basic profile operations

**List Subscriptions:**
- Uses `https://a.klaviyo.com/client/subscriptions/` endpoint  
- Adds users to specified lists with proper consent tracking
- Handles double opt-in compliance automatically

**Event Tracking:**
- Uses standard Klaviyo tracking (`window.klaviyo.push()`)
- Tracks quiz completion, step progress, and user actions
- All events include rich metadata for segmentation

### 4. Benefits of This Approach

✅ **No Server Required:** Everything runs client-side  
✅ **Secure:** Only uses public APIs, no private keys exposed  
✅ **Compliant:** Handles GDPR/consent properly  
✅ **Reliable:** Uses Klaviyo's native, well-tested endpoints  
✅ **Simple:** Easy to set up and maintain  

### 5. Data Collected

**Profile Properties:**
- Basic info (name, email, phone)
- Quiz responses (preferences, measurements, etc.)
- Quiz metadata (completion date, version, source)
- Product recommendations with details

**Events Tracked:**
- Quiz completion with full details
- Individual step completion
- List subscription success/failure
- Product interactions

## Troubleshooting

**Profiles created but not added to list:**
- Check that `klaviyo_list_id` is correctly set
- Verify user gave marketing consent  
- Check browser console for API errors

**No profiles created:**
- Verify `klaviyo_site_id` is correct (not private key)
- Ensure Klaviyo script is loading properly
- Check network requests in browser dev tools

**Debug Mode:**
Enable debug in theme settings to see detailed console logs of all Klaviyo operations.