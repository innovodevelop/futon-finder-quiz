# Klaviyo Integration for Futon Quiz

This guide explains how to set up Klaviyo integration for the futon quiz to automatically send quiz completion data and trigger custom flows.

## Setup Steps

### 1. Get Your Klaviyo Public API Key
1. Log in to your Klaviyo account
2. Go to **Account > Settings > API Keys**
3. Copy your **Public API Key** (starts with `pk_`)

### 2. Configure the Integration in Shopify Theme Editor
1. In your Shopify admin, go to **Online Store > Themes**
2. Click **Customize** on your active theme
3. Navigate to the page where you have the Futon Quiz section
4. Click on the **Futon Quiz Single Collection** section
5. Scroll down to the **Klaviyo Integration** settings
6. Check the **"Enable Klaviyo Integration"** checkbox
7. Paste your Public API Key into the **"Klaviyo Public API Key"** field
8. **Customize Event Name** (optional): Change the event name that will trigger your flows (default: "Futon Quiz Completed")
9. **Add Flow Tags** (optional): Add comma-separated tags to help target specific flows (e.g., "futon-quiz,high-intent")
10. Click **Save**

### 3. Create a Custom Flow in Klaviyo
1. In Klaviyo, go to **Flows** and click **Create Flow**
2. Choose **Create from Scratch**
3. Set the trigger to **Metric** and select your custom event name (default: **"Futon Quiz Completed"**)
   - If you changed the event name in Shopify, use that exact name here
   - Use flow tags to create more targeted flows (e.g., only trigger for events with "high-intent" tag)
4. Build your flow with the desired actions (emails, SMS, etc.)

## Data Sent to Klaviyo

When a user completes the quiz, the following data is automatically sent to Klaviyo:

### Profile Information
- Email address
- Phone number
- First name
- Last name
- Marketing consent preference

### Quiz Responses
- `people_count`: Number of people (1 or 2)
- `weight_person1`: Weight of first person
- `weight_person2`: Weight of second person (if applicable)
- `sleep_position_person1`: Sleep position preference for first person
- `sleep_position_person2`: Sleep position preference for second person (if applicable)
- `preference_person1`: Firmness preference for first person
- `preference_person2`: Firmness preference for second person (if applicable)
- `comments`: Any additional comments from the user

### Product Recommendations
- `recommended_products`: Array of recommended products with details
- `top_recommendation_id`: Product ID of the best match
- `top_recommendation_title`: Title of the best match product

### Metadata
- `quiz_type`: Always "futon_finder"
- `completion_timestamp`: When the quiz was completed
- `shop_domain`: Your shop's domain
- `flow_tags`: Array of tags for flow targeting (if specified in Shopify)
- `quiz_source`: Always "shopify-futon-quiz"

## Custom Flow Ideas

Here are some flow ideas you can create based on the quiz completion:

### 1. **Immediate Recommendations Email**
- Send an email with their personalized product recommendations
- Include product images, descriptions, and direct purchase links
- Add a discount code for first-time buyers

### 2. **Follow-up Sequence**
- Day 1: Send recommendations with testimonials
- Day 3: Educational content about futon care and benefits
- Day 7: Limited-time discount offer
- Day 14: Review request or alternative product suggestions

### 3. **Segmented Flows Based on Preferences**
- Different flows for soft vs. firm preference users
- Couples-specific messaging for 2-person quiz completions
- Weight-specific recommendations and content

### 4. **Abandoned Quiz Recovery**
- Target users who started but didn't complete the quiz
- Send reminder emails with incentives to finish

## Testing the Integration

1. Complete the quiz on your website
2. Check your Klaviyo account under **Analytics > Events** for the "Futon Quiz Completed" event
3. Verify that the profile was created/updated with the quiz data
4. Test your flow triggers to ensure they're working correctly

## Troubleshooting

**Integration not working?**
- Verify your Public API Key is correct and starts with "pk_"
- Ensure the "Enable Klaviyo Integration" checkbox is checked
- Check browser console for any error messages
- Test with a valid email address

**Flow not triggering?**
- Check that your flow trigger matches your custom event name (exact spelling)
- If using flow tags, ensure your flow conditions include the correct tags
- Verify the flow is live and not in draft mode
- Allow a few minutes for events to process in Klaviyo

## Support

If you need help setting up the integration or creating custom flows, please refer to:
- [Klaviyo API Documentation](https://developers.klaviyo.com/en/docs)
- [Klaviyo Flow Builder Guide](https://help.klaviyo.com/hc/en-us/categories/115000430711-Flows)