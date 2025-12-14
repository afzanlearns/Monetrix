# Assets Directory Structure

Place your SVG/PNG images in the following structure:

```
assets/
├── logo.svg                    # Main logo for navbar and footer
└── icons/
    ├── revenue-analysis.svg     # Hero section - Revenue Analysis card
    ├── profit-tracking.svg      # Hero section - Profit Tracking card
    ├── trend-insights.svg       # Hero section - Trend Insights card
    ├── ai-recommendations.svg   # Hero section - AI Recommendations card
    ├── data-driven.svg          # About section - Data-Driven Insights
    ├── modern-design.svg        # About section - Modern & Elegant
    ├── ai-powered.svg           # About section - AI-Powered Support
    ├── secure.svg               # About section - Secure & Private
    ├── profit-loss.svg          # Services - Profit & Loss Analysis
    ├── trend-comparison.svg     # Services - Trend Comparisons
    ├── ai-insights.svg          # Services - AI-Powered Insights
    ├── export-reports.svg       # Services - Exportable Reports
    ├── financial-assistant.svg  # Services - Financial Assistant
    ├── interactive-dashboard.svg # Services - Interactive Dashboards
    ├── email.svg                # Contact - Email icon
    ├── live-chat.svg            # Contact - Live Chat icon
    └── response-time.svg        # Contact - Response Time icon
```

## Image Specifications

- **Format**: SVG preferred, PNG acceptable
- **Size**: 
  - Logo: 40x40px (navbar), 32x32px (footer)
  - Hero card icons: 32x32px
  - About card icons: 48x48px
  - Service icons: 48x48px
  - Contact icons: 24x24px
- **Color**: Images will be automatically colored using CSS filters. Use monochrome/black SVG for best results.
- **Background**: Transparent preferred

## Fallback Behavior

If images are not found, the CSS will display a subtle placeholder background. Make sure to add your images to maintain a professional appearance.

