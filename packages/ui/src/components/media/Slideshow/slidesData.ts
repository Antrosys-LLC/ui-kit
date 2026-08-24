export interface SlideItem {
  id: string;
  number: string; // e.g. "#01"
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  speakerNotes: string;
}

export const SLIDES_DATA: SlideItem[] = [
  {
    id: "strategy-planning",
    number: "#01",
    title: "Strategy & Planning",
    category: "Brand Architecture",
    description: "Formulating cohesive brand positioning, market segmentation, and comprehensive digital roadmaps for high-growth enterprise products.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop",
    accentColor: "#0284C7",
    tags: ["UX Research", "Brand Identity", "Roadmap"],
    metrics: [
      { label: "User Retention", value: "+142%" },
      { label: "Market Growth", value: "3.5x" }
    ],
    speakerNotes: "In this phase, we analyze existing market positioning and formulate clear digital touchpoints. Emphasize how customer journeys translate into visual design architecture."
  },
  {
    id: "design-development",
    number: "#02",
    title: "Design & Development",
    category: "Digital Craftsmanship",
    description: "Crafting pixel-perfect design systems, high-fidelity interactive prototypes, and accessible modern front-end components.",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop",
    accentColor: "#16A34A",
    tags: ["UI Systems", "React / Next.js", "Prototyping"],
    metrics: [
      { label: "Component Reuse", value: "88%" },
      { label: "Lighthouse Score", value: "99/100" }
    ],
    speakerNotes: "Focus on component reusability and tokenized design systems. Demonstrate how Framer Motion animations elevate user engagement without degrading performance."
  },
  {
    id: "launch-growth",
    number: "#03",
    title: "Launch & Growth",
    category: "Scale & Marketing",
    description: "Executing high-impact product launches backed by real-time telemetry, conversion optimization, and dynamic viral campaigns.",
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop",
    accentColor: "#DC2626",
    tags: ["Product Hunt", "Conversion", "Analytics"],
    metrics: [
      { label: "Day 1 Users", value: "50k+" },
      { label: "Conversion Rate", value: "14.2%" }
    ],
    speakerNotes: "Highlight launch metrics and customer acquisition channels. Notice how dark moody streetwear aesthetic resonated with Gen-Z early adopters."
  },
  {
    id: "ongoing-support",
    number: "#04",
    title: "Ongoing Support",
    category: "Product Evolution",
    description: "Continuous continuous-integration testing, performance profiling, and iterative feature rollouts for sustained market leadership.",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop",
    accentColor: "#475569",
    tags: ["CI/CD", "Performance", "SLA"],
    metrics: [
      { label: "Uptime SLA", value: "99.99%" },
      { label: "Avg Resolution", value: "< 15min" }
    ],
    speakerNotes: "Explain our long-term client retainer model. Continuous optimization ensures the application remains zero-latency under peak loads."
  },
  {
    id: "brand-positioning",
    number: "#05",
    title: "Brand Positioning",
    category: "Creative Direction",
    description: "Developing iconic aesthetic identities and editorial fashion campaigns that create lasting emotional resonance.",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop",
    accentColor: "#EA580C",
    tags: ["Editorial", "Typography", "Lookbook"],
    metrics: [
      { label: "Brand Recall", value: "+84%" },
      { label: "Social Impression", value: "2.4M" }
    ],
    speakerNotes: "Detail the editorial photoshoot concept. Neutral tones paired with crisp typography position the brand as premium yet accessible."
  },
  {
    id: "eco-packaging",
    number: "#06",
    title: "Eco Packaging",
    category: "Sustainable Design",
    description: "Designing zero-waste, biodegradable physical packaging and tactile unboxing experiences for eco-conscious consumer brands.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
    accentColor: "#15803D",
    tags: ["Sustainability", "Packaging", "3D Render"],
    metrics: [
      { label: "Plastic Reduced", value: "100%" },
      { label: "Design Award", value: "Red Dot '25" }
    ],
    speakerNotes: "Highlight eco-friendly material selections. Organic cotton, unbleached canvas, and water-based dyes reduced carbon footprint by 65%."
  },
  {
    id: "beverage-packaging",
    number: "#07",
    title: "Product Packaging",
    category: "3D & Motion Craft",
    description: "High-octane 3D product visualizations, fluid simulation commercials, and dynamic point-of-sale retail packaging.",
    imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1000&auto=format&fit=crop",
    accentColor: "#E11D48",
    tags: ["WebGL", "Three.js", "CGI"],
    metrics: [
      { label: "Engagement", value: "+210%" },
      { label: "Click Through", value: "8.7%" }
    ],
    speakerNotes: "Discuss WebGL fluid simulation techniques used in the interactive 3D product viewer. Notice the rich specular highlights and strawberry particles."
  }
];
