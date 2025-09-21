# Klaviyo Integration Guide - Profile-Based Approach

This guide explains how to integrate the Futon Quiz with Klaviyo using a **profile-based approach**. Instead of just triggering events, this integration creates or updates customer profiles with detailed quiz data and adds them to a specific Klaviyo list.

## Benefits of Profile-Based Integration

- **Rich Customer Data**: All quiz responses are stored as custom properties on the customer profile
- **List Management**: Customers are automatically added to a designated list for targeted campaigns
- **Data Persistence**: Customer preferences are saved long-term, not just as one-time events
- **Better Segmentation**: Use quiz data for advanced audience segmentation

## Setup Instructions

### 1. Get Your Klaviyo Private API Key
1. Log into your Klaviyo account
2. Go to **Account** → **Settings** → **API Keys**
3. Click **Create Private API Key**
4. Give it a name like "Futon Quiz Integration"
5. Ensure it has **Full Access** or at least permissions for:
   - Profiles: Read/Write
   - Lists: Read/Write
6. Copy the Private API Key (starts with `sk_`)

⚠️ **Important**: Use a **Private API Key**, not a Public API Key, as we need write permissions for profiles and lists.

### 2. Get Your Klaviyo List ID
1. In Klaviyo, go to **Lists & Segments**
2. Create a new list or select an existing one (e.g., "Futon Quiz Completers")
3. Click on the list name
4. The List ID will be visible in the URL: `https://www.klaviyo.com/lists/XyZ123` (XyZ123 is your List ID)

### 3. Configure in Shopify
1. In your Shopify admin, go to **Online Store** → **Themes**
2. Click **Customize** on your active theme
3. Navigate to the page where you've added the Futon Quiz section
4. Click on the **Futon Quiz** section
5. Scroll down to the **Klaviyo Integration** settings
6. Check the **"Enable Klaviyo Integration"** checkbox
7. Paste your **Private API Key** into the **"Klaviyo Private API Key"** field
8. Paste your **List ID** into the **"Klaviyo List ID"** field
9. Click **Save**

## Data Stored in Klaviyo Profiles

When a customer completes the quiz, the following custom properties are added to their Klaviyo profile:

### Basic Quiz Data
- `people_count`: Number of people (1 or 2)
- `comments`: Any additional comments from the customer

### Person 1 Data
- `weight_person1`: Weight in kg
- `height_person1`: Height in cm
- `sleep_position_person1`: Sleep position preference
- `preference_person1`: Firmness preference

### Person 2 Data (if applicable)
- `weight_person2`: Weight in kg
- `height_person2`: Height in cm  
- `sleep_position_person2`: Sleep position preference
- `preference_person2`: Firmness preference

### Recommended Products
For each recommended product (up to 3):
- `recommended_product_1_id`: Product ID
- `recommended_product_1_title`: Product name
- `recommended_product_1_price`: Product price
- `recommended_product_1_url`: Product URL
- `recommended_product_1_image`: Product image URL
- `recommended_product_1_score`: Recommendation score

### Metadata
- `quiz_completion_date`: When the quiz was completed
- `quiz_version`: Version of the quiz
- `quiz_source`: Always "shopify-futon-quiz"

## Using the Data for Campaigns

### 1. Segmentation Examples
Create segments based on quiz data:
- **Soft Preference Segment**: `preference_person1 = "soft"`
- **Couples Segment**: `people_count = 2`
- **High-Value Prospects**: Customers who were recommended premium products

### 2. Personalized Email Campaigns
- Send follow-up emails with the specific products they were recommended
- Create different messaging for couples vs. individuals
- Tailor content based on firmness preferences

### 3. Abandoned Cart Flows
- If customers don't purchase their recommended products, trigger abandoned cart emails
- Include their quiz results in the email for personalized messaging

## Troubleshooting

**Profile not being created?**
- Verify you're using a Private API Key (not Public)
- Check that the API key has proper permissions
- Ensure marketing consent was given in the quiz

**Not being added to list?**
- Verify the List ID is correct
- Check that the customer gave marketing consent
- Ensure the list exists and is active in Klaviyo

**Missing custom properties?**
- Check the browser console for any API errors
- Verify all quiz steps were completed before submission

## Security Note

The Private API Key is processed server-side through Shopify's Liquid templating, so it's not exposed to the client browser. This approach is secure for e-commerce use cases.