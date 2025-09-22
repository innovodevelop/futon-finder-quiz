# Klaviyo Integration Implementation Guide

## Current Implementation Status

The Futon Quiz now uses a **hybrid approach** for Klaviyo integration:

1. **Public API** (client-side): Basic profile identification and event tracking
2. **Private API** (server-side proxy): Custom properties and list subscription

## What's Working Now

### ✅ Public API Features (Always Works)
- Basic profile identification (name, email, phone)
- Event tracking (Quiz Completed, List Subscription attempts)
- Real-time analytics and behavioral tracking

### ⚠️ Private API Features (Requires Server Implementation)
- Custom properties (quiz responses, recommendations)
- Reliable list subscription
- Advanced profile enrichment

## Server-Side Proxy Implementation Needed

The current implementation includes the client-side code and configuration for a server-side proxy, but **the actual proxy endpoint needs to be implemented**. Here are your options:

### Option 1: Shopify App (Recommended)
Create a Shopify app that handles Klaviyo private API calls:

```javascript
// Example app proxy endpoint: /apps/klaviyo-proxy/profile
app.post('/apps/klaviyo-proxy/profile', async (req, res) => {
  const { data, listId } = req.body;
  const privateKey = process.env.KLAVIYO_PRIVATE_KEY;
  
  // Update profile with custom properties
  const response = await fetch('https://a.klaviyo.com/api/profiles/', {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${privateKey}`,
      'Content-Type': 'application/json',
      'revision': '2024-10-15'
    },
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes: data
      }
    })
  });
  
  // Handle list subscription...
  res.json({ success: true, data: await response.json() });
});
```

### Option 2: Shopify Function/Script
Use Shopify Scripts or Functions (if available in your plan).

### Option 3: External Webhook Service
Use a service like Zapier, Make.com, or a custom webhook handler.

### Option 4: Client-Side Only (Limited)
Keep only the public API features (current fallback behavior).

## Configuration Required

### In Shopify Theme Customizer:
1. **Enable Klaviyo Integration**: ✅ Check the box
2. **Klaviyo Site ID**: Your public Site ID (6-7 characters)
3. **Klaviyo List ID**: Target list for subscribers
4. **Klaviyo Private API Key**: Your private API key (pk_...)

### Current Behavior:
- **With Private Key**: Attempts to use server-side proxy for enhanced features
- **Without Private Key**: Falls back to public API only (basic functionality)

## Testing the Integration

### Debug Mode
Set `window.klaviyoConfig.debug = true` to see detailed logs:

```javascript
// Check current status in browser console
console.log('Klaviyo Config:', window.klaviyoConfig);
console.log('Klaviyo Proxy Available:', !!window.klaviyoProxy);
```

### Verification Steps
1. Complete the quiz with debug mode enabled
2. Check browser console for Klaviyo logs
3. Verify profile appears in Klaviyo dashboard
4. Check if custom properties are set (requires server proxy)
5. Verify list subscription (requires server proxy)

## Migration Path

### Phase 1: Current (Partial Functionality) ✅
- Public API working for basic tracking
- Client-side list subscription (limited reliability)

### Phase 2: Server Proxy Implementation (Full Functionality)
- Implement one of the server-side options above
- Test custom properties and reliable list subscription
- Monitor success rates and error handling

### Phase 3: Optimization
- Fine-tune data structure and properties
- Add additional segmentation data
- Implement advanced Klaviyo features

## Error Handling

The implementation includes comprehensive error handling:
- Graceful degradation when server proxy isn't available
- Fallback to client-side methods when possible
- Detailed logging for troubleshooting
- Quiz flow continues even if Klaviyo fails

## Next Steps

1. **Choose a server-side implementation** (Option 1-4 above)
2. **Test the integration** thoroughly
3. **Monitor Klaviyo dashboard** for data accuracy
4. **Update documentation** based on final implementation

The groundwork is complete - you just need to implement the server-side component to unlock full functionality.