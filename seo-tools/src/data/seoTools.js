// Category colors with an expanded color palette
export const categoryColors = {
  Analytics: { bg: "#e3f2fd", color: "#1976d2" }, // Blue
  SEO: { bg: "#f3e5f5", color: "#7b1fa2" }, // Purple
  WordPress: { bg: "#e8f5e9", color: "#2e7d32" }, // Green
  Tracking: { bg: "#e8eaf6", color: "#3f51b5" }, // Indigo
  Reports: { bg: "#fff3e0", color: "#e65100" }, // Orange
  Backlinks: { bg: "#fce4ec", color: "#c2185b" }, // Pink
  Research: { bg: "#f3e5f5", color: "#7b1fa2" }, // Purple
  PPC: { bg: "#e0f7fa", color: "#006064" }, // Cyan
  Content: { bg: "#f1f8e9", color: "#33691e" }, // Light Green
  Technical: { bg: "#ede7f6", color: "#4527a0" }, // Deep Purple
  Performance: { bg: "#fbe9e7", color: "#d84315" }, // Deep Orange
  Marketing: { bg: "#e1f5fe", color: "#0277bd" }, // Light Blue
  Social: { bg: "#f9fbe7", color: "#827717" }, // Lime
  Tools: { bg: "#efebe9", color: "#4e342e" }, // Brown
  Audit: { bg: "#e0f2f1", color: "#00695c" }, // Teal
  AI: { bg: "#ffebee", color: "#b71c1c" }, // Red
};

// SEO Tools data
export const seoTools = [
  {
    name: "Google Analytics",
    avatar: "GA",
    category: ["Analytics", "Tracking", "Reports"],
    rating: 4.8,
    price: "Free",
    pricingTier: "Free",
    hasPaidPlan: true,
    paidPlanPrice: "$150k+/year",
    link: "https://analytics.google.com",
    description:
      "Comprehensive web analytics platform that tracks website traffic, user behavior, and conversion metrics. Essential for understanding your website's performance and user engagement.",
    icon: "https://www.google.com/analytics/images/ga-icon-1200x1200.png",
  },
  {
    name: "Ahrefs",
    avatar: "AH",
    category: ["SEO", "Backlinks", "Research", "Content"],
    rating: 4.9,
    price: "$99/mo",
    pricingTier: "Premium",
    hasPaidPlan: true,
    paidPlanPrice: "$999/mo",
    link: "https://ahrefs.com",
    description:
      "Powerful SEO toolset for backlink analysis, keyword research, content gap analysis, and competitor research. Known for its extensive backlink database and accurate metrics.",
    icon: "https://cdn.ahrefs.com/favicon-32x32.png",
  },
  {
    name: "SEMrush",
    avatar: "SM",
    category: ["SEO", "PPC", "Content", "Research"],
    rating: 4.7,
    price: "$119/mo",
    pricingTier: "Enterprise",
    hasPaidPlan: true,
    paidPlanPrice: "$449/mo",
    link: "https://www.semrush.com",
    description:
      "All-in-one digital marketing suite offering SEO, content marketing, competitor research, PPC, and social media marketing tools. Comprehensive platform for complete digital marketing needs.",
    icon: "https://www.semrush.com/static/images/favicon/favicon.ico",
  },
  {
    name: "Moz Pro",
    avatar: "MP",
    category: ["SEO", "Analytics", "Research"],
    rating: 4.6,
    price: "$99/mo",
    pricingTier: "Premium",
    hasPaidPlan: true,
    paidPlanPrice: "$599/mo",
    link: "https://moz.com/pro",
    description:
      "User-friendly SEO toolset featuring keyword research, site audits, link building, and rank tracking. Known for its intuitive interface and educational resources.",
    icon: "https://moz.com/favicon.ico",
  },
  {
    name: "Yoast SEO",
    avatar: "YS",
    category: ["WordPress", "SEO", "Content"],
    rating: 4.5,
    price: "Free",
    pricingTier: "Free",
    hasPaidPlan: true,
    paidPlanPrice: "$99/year",
    link: "https://yoast.com",
    description:
      "Popular WordPress SEO plugin that helps optimize content, manage technical SEO elements, and improve readability. Essential for WordPress site optimization.",
    icon: "https://yoast.com/favicon-32x32.png",
  },
  {
    name: "Screaming Frog",
    avatar: "SF",
    category: ["Technical SEO", "Crawling", "Audit"],
    rating: 4.7,
    price: "Free",
    pricingTier: "Free",
    hasPaidPlan: true,
    paidPlanPrice: "£149/year",
    link: "https://www.screamingfrog.co.uk/seo-spider/",
    description:
      "Desktop-based website crawler for technical SEO audits. Identifies broken links, redirects, duplicate content, and other technical issues affecting site performance.",
    icon: "https://www.screamingfrog.co.uk/wp-content/themes/screamingfrog/images/favicon.ico",
  },
  {
    name: "Majestic",
    avatar: "MJ",
    category: ["Backlinks", "Research", "Analytics"],
    rating: 4.4,
    price: "$49.99/mo",
    pricingTier: "Basic",
    hasPaidPlan: true,
    paidPlanPrice: "$399.99/mo",
    link: "https://majestic.com",
    description:
      "Specialized backlink analysis tool with unique metrics like Trust Flow and Citation Flow. Excellent for link building and competitor analysis.",
    icon: "https://majestic.com/favicon.ico",
  },
  {
    name: "GTmetrix",
    avatar: "GT",
    category: ["Performance", "Technical SEO"],
    rating: 4.6,
    price: "Free",
    pricingTier: "Free",
    hasPaidPlan: true,
    paidPlanPrice: "$199/year",
    link: "https://gtmetrix.com",
    description:
      "Website performance testing tool that analyzes page speed, optimization opportunities, and provides detailed performance reports. Essential for technical SEO optimization.",
    icon: "https://gtmetrix.com/favicon.ico",
  },
  {
    name: "Schema Pro",
    avatar: "SP",
    category: ["Schema Markup", "Technical SEO"],
    rating: 4.5,
    price: "$79/year",
    pricingTier: "Basic",
    hasPaidPlan: true,
    paidPlanPrice: "$249/year",
    link: "https://wpschema.com",
    description:
      "WordPress plugin for implementing structured data and schema markup. Helps improve search engine understanding of your content and enhances rich snippets.",
    icon: "https://wpschema.com/wp-content/uploads/2019/03/cropped-schema_pro_logo_512x512-32x32.png",
  },
  {
    name: "BuzzSumo",
    avatar: "BS",
    category: ["Content", "Research", "Social"],
    rating: 4.6,
    price: "$99/mo",
    pricingTier: "Premium",
    hasPaidPlan: true,
    paidPlanPrice: "$499/mo",
    link: "https://buzzsumo.com",
    description:
      "Content research and social media analytics tool. Helps identify trending topics, analyze competitor content, and find influential content creators.",
    icon: "https://buzzsumo.com/favicon.ico",
  },
  {
    name: "Surfer SEO",
    avatar: "SS",
    category: ["Content", "On-Page SEO"],
    rating: 4.7,
    price: "$59/mo",
    pricingTier: "Basic",
    hasPaidPlan: true,
    paidPlanPrice: "$199/mo",
    link: "https://surferseo.com",
    description:
      "On-page SEO analyzer that provides content optimization recommendations based on top-ranking pages. Helps create content that matches search intent.",
    icon: "https://surferseo.com/favicon-32x32.png",
  },
  {
    name: "MarketMuse",
    avatar: "MM",
    category: ["Content", "AI", "Research"],
    rating: 4.5,
    price: "$79/mo",
    pricingTier: "Basic",
    hasPaidPlan: true,
    paidPlanPrice: "$1499/mo",
    link: "https://www.marketmuse.com",
    description:
      "AI-powered content research and optimization tool. Analyzes content gaps, suggests topics, and helps create comprehensive content that ranks well.",
    icon: "https://www.marketmuse.com/favicon.ico",
  },
];

// Pricing tier colors
export const pricingTierColors = {
  Free: { bg: "#e8f5e9", color: "#2e7d32" }, // Green
  Basic: { bg: "#e3f2fd", color: "#1976d2" }, // Blue
  Premium: { bg: "#fff3e0", color: "#e65100" }, // Orange
  Enterprise: { bg: "#f3e5f5", color: "#7b1fa2" }, // Purple
  Custom: { bg: "#f5f5f5", color: "#616161" }, // Grey
};
