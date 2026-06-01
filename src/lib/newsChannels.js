/**
 * News Channel Configuration
 * Maps news categories and sources for aggregation
 */

export const NEWS_CATEGORIES = [
  { id: 'general', name: 'General', icon: '📰', color: '#00d4ff' },
  { id: 'technology', name: 'Technology', icon: '💻', color: '#7b2ff7' },
  { id: 'science', name: 'Science', icon: '🔬', color: '#00e676' },
  { id: 'health', name: 'Health', icon: '🏥', color: '#ff4081' },
  { id: 'business', name: 'Business', icon: '💼', color: '#ffd740' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#ff6e40' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#40c4ff' },
];

export const NEWS_CHANNELS = [
  { id: 'bbc-news', name: 'BBC News', country: 'gb', logo: '🇬🇧' },
  { id: 'cnn', name: 'CNN', country: 'us', logo: '🇺🇸' },
  { id: 'al-jazeera-english', name: 'Al Jazeera', country: 'qa', logo: '🌍' },
  { id: 'the-guardian-uk', name: 'The Guardian', country: 'gb', logo: '🇬🇧' },
  { id: 'reuters', name: 'Reuters', country: 'us', logo: '🌐' },
  { id: 'abc-news', name: 'ABC News', country: 'us', logo: '🇺🇸' },
  { id: 'the-times-of-india', name: 'Times of India', country: 'in', logo: '🇮🇳' },
  { id: 'bloomberg', name: 'Bloomberg', country: 'us', logo: '💹' },
];

/**
 * Mock news data for when no API key is available
 */
export const MOCK_NEWS = [
  {
    title: "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
    description: "World leaders at the 2026 Climate Summit have agreed to a landmark deal that commits 195 nations to reduce carbon emissions by 50% before 2035, marking the most ambitious environmental agreement in history.",
    content: "In a groundbreaking session that extended well past midnight, representatives from 195 countries formally signed the Global Carbon Reduction Treaty. The agreement, which has been in negotiation for three years, sets binding targets for emission reductions across all major economic sectors. Environmental scientists have praised the deal as 'the most significant step forward in climate action since the Paris Agreement.' The treaty includes provisions for a $500 billion green technology fund to help developing nations transition to renewable energy sources. By Dr. Sarah Chen, Environmental Policy correspondent.",
    source: "Reuters",
    author: "Dr. Sarah Chen",
    url: "https://reuters.com/climate-summit-2026",
    urlToImage: null,
    publishedAt: new Date().toISOString(),
    category: "science"
  },
  {
    title: "YOU WON'T BELIEVE What This Celebrity Did!! SHOCKING Truth Exposed!!!",
    description: "BREAKING: A-list celebrity caught in massive scandal that Hollywood doesn't want you to see! The truth will blow your mind!",
    content: "Shocking bombshell revelation exposes the devastating truth about this famous celebrity. The elite are trying to cover up this explosive scandal. Wake up people! Share before this gets deleted! They don't want you to know the real truth. This alarming conspiracy has been exposed by a brave whistleblower who risked everything.",
    source: "Daily Buzz Feed",
    author: "",
    url: "http://dailybuzzfeed.click/celebrity-scandal",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    category: "entertainment"
  },
  {
    title: "Federal Reserve Announces Quarter-Point Interest Rate Adjustment",
    description: "The Federal Reserve Board voted unanimously to adjust the federal funds rate by 25 basis points, citing steady economic growth and moderating inflation pressures in its post-meeting statement.",
    content: "Federal Reserve Chair announced the widely anticipated quarter-point rate adjustment during Wednesday's press conference. The decision, supported by all twelve voting members of the Federal Open Market Committee, reflects the central bank's assessment that inflation is trending toward its 2% target. Economic analysts at major financial institutions noted that the move aligns with market expectations. The labor market remains robust with unemployment at 3.8%, while GDP growth continues at a sustainable pace of 2.4%. By Michael Torres, Senior Economics Reporter.",
    source: "Bloomberg",
    author: "Michael Torres",
    url: "https://bloomberg.com/fed-rate-decision",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    category: "business"
  },
  {
    title: "MIRACLE CURE: Doctors HATE This One Weird Trick That Cures Everything!",
    description: "Big Pharma doesn't want you to know about this incredible miracle treatment! Act now before they ban it! Urgent alert!",
    content: "This revolutionary game-changer has been suppressed by big pharma for decades. The sinister conspiracy to hide this miracle cure from the public has been exposed. Do your own research! Mainstream media refuses to cover this because of corrupt pharmaceutical company advertising dollars. This alarming cover-up goes all the way to the top. Open your eyes! Emergency warning: they are trying to censor this information. Share immediately before it's too late!",
    source: "Natural Health Truth",
    author: "",
    url: "http://naturalhealthtruth.biz/miracle-cure",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    category: "health"
  },
  {
    title: "NASA's James Webb Telescope Discovers New Earth-Like Exoplanet in Habitable Zone",
    description: "Astronomers using data from the James Webb Space Telescope have confirmed the existence of a rocky exoplanet within the habitable zone of a nearby star system, approximately 42 light-years from Earth.",
    content: "The discovery, published in the journal Nature Astronomy, represents a significant milestone in the search for potentially habitable worlds beyond our solar system. The planet, designated JWST-2026b, has a radius approximately 1.1 times that of Earth and orbits within the habitable zone of a K-type main sequence star. Spectroscopic analysis suggests the presence of water vapor and carbon dioxide in its atmosphere. Dr. Elena Vasquez, lead author of the study, described the finding as 'one of the most promising candidates for atmospheric characterization we've ever identified.' The research team plans follow-up observations to search for biosignature gases. By Dr. James Park, Science Correspondent.",
    source: "BBC News",
    author: "Dr. James Park",
    url: "https://bbc.com/science/jwst-exoplanet",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    category: "science"
  },
  {
    title: "ALERT: Government Secretly Tracking ALL Citizens Through 5G Towers!!!",
    description: "The deep state has been exposed! Leaked documents reveal a sinister surveillance program. They don't want you to know the truth!",
    content: "Explosive leaked documents have revealed a terrifying government conspiracy. The deep state is using 5G towers to secretly track every citizen. This devastating bombshell was exposed by a brave whistleblower. The elite have been caught red-handed in this outrageous cover-up. Wake up! Open your eyes! The mainstream media is complicit in hiding this alarming truth. Share before this gets censored! Do your own research and you'll see the horrifying truth. Big tech and corrupt government officials are behind this nightmare surveillance scam.",
    source: "Freedom Truth News",
    author: "",
    url: "http://freedomtruthnews.net/5g-tracking",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    category: "technology"
  },
  {
    title: "India's Space Agency Successfully Tests Next-Generation Reusable Launch Vehicle",
    description: "ISRO completed a successful test flight of its Reusable Launch Vehicle Technology Demonstrator, bringing India closer to developing cost-effective access to space.",
    content: "The Indian Space Research Organisation (ISRO) announced the successful completion of its RLV-TD3 mission, a critical step in developing a fully reusable two-stage-to-orbit launch system. The test vehicle reached an altitude of 65 kilometers before successfully executing an autonomous landing at the Chitradurga aeronautical test range. ISRO Chairman Dr. S. Somanath stated that the technology could reduce launch costs by up to 80%, making satellite deployment significantly more affordable. The mission tested advanced thermal protection systems, autonomous navigation, and precision landing capabilities. International space agencies have commended India's progress in reusable launch technology. By Priya Sharma, Space Technology Editor.",
    source: "NDTV",
    author: "Priya Sharma",
    url: "https://ndtv.com/isro-rlv-test",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    category: "technology"
  },
  {
    title: "EXPOSED: Secret Society Controls World Economy - BANNED Information!",
    description: "The truth about the global economic conspiracy has been LEAKED! Shocking evidence of a secret cabal running the world! This is not a drill!",
    content: "A horrifying conspiracy has been uncovered that reveals the devastating truth about who really controls the global economy. This bombshell exposé reveals how a sinister group of elites have orchestrated every major financial crisis. They are evil and corrupt beyond imagination. This alarming scandal proves that nothing is what it seems. The mainstream media is covering this up because they are paid off by the corrupt elite. Share this immediately before they delete it! Wake up sheeple! The government doesn't want you to see this explosive evidence. Do your own research and follow the money!",
    source: "World Truth Network",
    author: "",
    url: "http://worldtruthnetwork.info/secret-society",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    category: "business"
  },
  {
    title: "Premier League Transfer Window: Key Signings and Departures So Far",
    description: "A comprehensive analysis of the major transfers completed in the current Premier League window, with expert insights on how new signings could reshape the title race.",
    content: "The Premier League transfer window has seen significant activity across all major clubs. Manchester City completed a club-record signing, while Arsenal strengthened their midfield with two strategic acquisitions. Liverpool's new sporting director has overseen a rebuild focused on young talent from European leagues. Tactical analysis suggests these moves could significantly impact the dynamics of the title race. Former England manager provides expert commentary on which clubs have improved most effectively. Transfer fees and contract details confirmed through official club announcements. By David Williams, Football Correspondent.",
    source: "BBC News",
    author: "David Williams",
    url: "https://bbc.com/sport/football/transfers",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 28800000).toISOString(),
    category: "sports"
  },
  {
    title: "New AI Model Achieves Breakthrough in Protein Folding Prediction Accuracy",
    description: "Researchers at DeepMind have unveiled a next-generation AI model that predicts protein structures with near-experimental accuracy, potentially accelerating drug discovery timelines significantly.",
    content: "The latest advancement in AI-driven protein structure prediction represents a quantum leap in computational biology. The model, trained on an expanded dataset of experimentally determined protein structures, achieves atomic-level accuracy for over 98% of tested proteins. This breakthrough could dramatically reduce the time and cost associated with early-stage drug discovery, allowing researchers to identify promising drug candidates computationally before expensive laboratory testing. The technology has already been applied to several rare disease research programs, with initial results described as 'transformative' by leading biochemists. The model and its predictions will be made freely available to the research community. By Dr. Rachel Kim, Technology & Science Reporter.",
    source: "The Guardian",
    author: "Dr. Rachel Kim",
    url: "https://theguardian.com/ai-protein-folding",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 32400000).toISOString(),
    category: "technology"
  },
  {
    title: "Doctors Don't Want You To Know: This Common Food DESTROYS Cancer Cells Overnight!",
    description: "URGENT: Scientists accidentally discovered that eating this one food obliterates all cancer cells! Big pharma is trying to suppress this incredible finding!",
    content: "An incredible miracle discovery has revealed that a common household food can annihilate cancer cells. This revolutionary breakthrough has been suppressed by big pharma because it would destroy their billion-dollar cancer treatment industry. The corrupt pharmaceutical companies and sinister medical establishment have conspired to hide this alarming truth from the public. Wake up! Do your own research! Mainstream media won't report on this because of advertising dollars from evil drug companies. This devastating cover-up has been going on for decades. Share this with everyone you know before it gets banned! Act now! Emergency!",
    source: "Health Freedom Daily",
    author: "",
    url: "http://healthfreedomdaily.co/cancer-cure",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 36000000).toISOString(),
    category: "health"
  },
  {
    title: "World Health Organization Updates Global Pandemic Preparedness Guidelines",
    description: "The WHO has released comprehensive updated guidelines for pandemic preparedness, incorporating lessons learned from recent global health emergencies and advancing early warning systems.",
    content: "The World Health Organization released its updated International Health Regulations framework, designed to strengthen global pandemic preparedness and response capabilities. The new guidelines emphasize early detection through improved genomic surveillance networks, streamlined data-sharing protocols between member states, and enhanced coordination mechanisms for rapid response deployment. WHO Director-General outlined key improvements including a new Global Pathogen Surveillance Network that will monitor emerging infectious disease threats in real-time. The framework also addresses equitable vaccine distribution, with binding commitments from member states to contribute to a pandemic response fund. Health policy experts described the updated guidelines as 'a significant improvement over existing frameworks.' By Maria Gonzalez, Global Health Correspondent.",
    source: "Al Jazeera",
    author: "Maria Gonzalez",
    url: "https://aljazeera.com/who-pandemic-guidelines",
    urlToImage: null,
    publishedAt: new Date(Date.now() - 39600000).toISOString(),
    category: "health"
  }
];
