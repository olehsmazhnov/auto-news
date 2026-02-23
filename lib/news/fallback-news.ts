import type { NewsItem } from "@/types/news";

const now = new Date();

function daysAgo(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const fallbackNews: NewsItem[] = [
  {
    id: 1,
    title: "Rimac Sets Fresh EV Lap Record at Nurburgring",
    excerpt:
      "Rimac's latest prototype cut more than three seconds from the previous electric production benchmark after a full-power run in changing track conditions.",
    summary:
      "Engineers credited new thermal software and revised aero channels for the jump in consistency during repeated high-speed laps.",
    imageUrl:
      "https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(0),
    viewsLabel: "42K",
    viewCount: 42000,
    category: "Performance",
    isFeatured: true,
    isPopular: true
  },
  {
    id: 2,
    title: "Solid-State Battery Pilot Hits 80 Percent in 9 Minutes",
    excerpt:
      "A supplier consortium confirmed pilot-cell charging results that could meaningfully reduce charging anxiety for long-distance EV drivers.",
    summary:
      "The first partner vehicles using these packs are expected to begin road validation later this year in mixed climates.",
    imageUrl:
      "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(0),
    viewsLabel: "28K",
    viewCount: 28000,
    category: "EV",
    isFeatured: false,
    isPopular: true
  },
  {
    id: 3,
    title: "Mercedes Reveals New Hyper-Screen Cockpit Stack",
    excerpt:
      "The new interior architecture adds an adaptive co-driver panel and a low-glare HUD layer designed for brighter daylight visibility.",
    summary:
      "The platform will roll out first in flagship sedans and then scale to premium crossovers by next model year.",
    imageUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(1),
    viewsLabel: "19K",
    viewCount: 19000,
    category: "Technology",
    isFeatured: false,
    isPopular: true
  },
  {
    id: 4,
    title: "Toyota Expands Hybrid Lineup with 1,000 km Combined Range",
    excerpt:
      "Toyota's new generation hybrid package improves urban efficiency while maintaining highway cruising range for long commutes.",
    summary:
      "The company says software-driven power blending lowered consumption in stop-and-go traffic by double digits.",
    imageUrl:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(1),
    viewsLabel: "16K",
    viewCount: 16000,
    category: "Industry",
    isFeatured: false,
    isPopular: false
  },
  {
    id: 5,
    title: "Pirelli Releases New Winter Compound for Heavy EV SUVs",
    excerpt:
      "The tire maker introduced a reinforced winter sidewall and lower rolling-resistance tread compound tuned for battery-heavy crossovers.",
    summary:
      "Independent braking tests reported shorter wet-snow stopping distances compared with last season's benchmark model.",
    imageUrl:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(2),
    viewsLabel: "12K",
    viewCount: 12000,
    category: "Reviews",
    isFeatured: false,
    isPopular: false
  },
  {
    id: 6,
    title: "Autonomous Freight Pilot Completes 5,000 km Safety Trial",
    excerpt:
      "An interstate commercial pilot with supervised autonomous driving completed overnight routes with no reported critical incidents.",
    summary:
      "Operators highlighted lower fatigue and smoother lane discipline, while regulators requested broader weather-condition data.",
    imageUrl:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(2),
    viewsLabel: "11K",
    viewCount: 11000,
    category: "Technology",
    isFeatured: false,
    isPopular: false
  },
  {
    id: 7,
    title: "Volkswagen Cuts Assembly Energy Use by 18 Percent",
    excerpt:
      "Factory upgrades across two plants delivered lower power draw per vehicle using process heat recovery and smarter robotics scheduling.",
    summary:
      "The rollout is part of a broader program targeting lower manufacturing emissions without reducing output capacity.",
    imageUrl:
      "https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(3),
    viewsLabel: "9.4K",
    viewCount: 9400,
    category: "Industry",
    isFeatured: false,
    isPopular: false
  },
  {
    id: 8,
    title: "Best Compact SUVs of 2026: Real-World Fuel Economy Test",
    excerpt:
      "Our 1,200 km comparison drive ranked the most efficient compact SUVs by mixed-cycle consumption, comfort, and cargo practicality.",
    summary:
      "Three hybrids topped the chart, while one turbo crossover delivered the strongest passing performance.",
    imageUrl:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(3),
    viewsLabel: "21K",
    viewCount: 21000,
    category: "Reviews",
    isFeatured: false,
    isPopular: true
  },
  {
    id: 9,
    title: "Ford Adds NACS Ports Across North American EV Range",
    excerpt:
      "Ford confirmed all new EV launches from next year will include NACS as standard, with adapter support continuing for existing owners.",
    summary:
      "Infrastructure teams expect fewer route-planning gaps for long trips as charging network interoperability improves.",
    imageUrl:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(4),
    viewsLabel: "14K",
    viewCount: 14000,
    category: "EV",
    isFeatured: false,
    isPopular: false
  },
  {
    id: 10,
    title: "Porsche 911 GT3 RS Track Package Tested on US Circuits",
    excerpt:
      "A new cooling package and revised downforce profile helped the GT3 RS post repeatable lap improvements across two technical tracks.",
    summary:
      "Test drivers reported stronger confidence on corner exits and improved tire consistency over longer sessions.",
    imageUrl:
      "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?auto=format&fit=crop&w=1400&q=80",
    publishedAt: daysAgo(4),
    viewsLabel: "24K",
    viewCount: 24000,
    category: "Performance",
    isFeatured: false,
    isPopular: true
  }
];
