/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Calendar, User, Eye, ArrowLeft, ArrowRight, Sparkles, ChevronDown, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  date: string;
  author: string;
  readTime: string;
  category: string;
  keywords: string[];
  image: string;
}

export default function BlogSection() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const articles: Article[] = [
    {
      id: 'art-1',
      slug: 'best-interior-designers-mumbai-guide',
      title: 'How to Choose the Best Interior Designers in Mumbai: A Comprehensive Homeowner Guide',
      excerpt: 'Looking to hire interior designers in Mumbai? From custom space planning to selecting turnkey contractors, learn how Monica Interiors guarantees visual sanity and structural excellence.',
      date: 'June 07, 2026',
      author: 'Monica S. (Principal Designer)',
      readTime: '6 min read',
      category: 'Home Improvement & Decor',
      keywords: ['best interior designers in mumbai', 'interior designer in mumbai', 'monica interiors', 'turnkey interior decorators'],
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600',
      content: (
        <div className="space-y-6 text-[#6B625E] font-sans antialiased text-sm sm:text-base leading-relaxed">
          <p className="font-serif italic text-[#3C2A21] text-lg border-l-4 border-[#BFA15F] pl-4 my-4 font-light">
            "Your home is an extension of your life footprint. In a hyper-dense, vibrant city like Mumbai, intelligent space planning and premium modular designs are not luxury options—they are baseline functional requirements."
          </p>
          <p>
            When searching for the <strong>best interior designers in Mumbai</strong>, many homeowners in areas like <em>Bandra, Juhu, Thane, and Navi Mumbai</em> get overwhelmed by the sheer volume of choices. However, true design craft goes way beyond decorative paint and generic catalog pieces. It requires a flawless understanding of local climates, material longevity under humid coastal weather, and absolute structural optimization.
          </p>
          
          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">1. Look for Dedicated Turnkey Execution</h3>
          <p>
            Many design firms operate purely as consulting services, leaving you at the mercy of independent carpenters and plumbing subcontractors. Opting for a <strong>turnkey interior decorator</strong> like <strong>Monica Interiors</strong> ensures absolute visual continuity, rigid pricing locks, and timely delivery of your 2BHK, 3BHK, or Villa properties.
          </p>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">2. Humidity Resistant Material Specifications in Mumbai</h3>
          <p>
            Mumbai’s near-coastal humidity is notoriously punishing on ordinary wooden cabinetry. When we plan customized woodwork and modular storage systems, we strictly enforce high-quality standards:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>BWR & BWP Grade Plywood:</strong> Strictly Boiling Water Resistant or Boiling Water Proof plywood for kitchen cabinet modules and bathroom base units.</li>
            <li><strong>Anti-Rust Cabinet Hardware:</strong> Soft-close, heavy-duty hinges fitted with anti-corrosive stainless steel coatings.</li>
            <li><strong>Lime-wash & Textured Mineral Plaster:</strong> High-breathability visual coatings that prevent moisture entrapment on critical partition walls.</li>
          </ul>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">3. Why Monica Interiors Ranks High on Local Client Trust</h3>
          <p>
            With over 6+ years of specialized luxury residential design, Monica Interiors bridges the gap between raw spatial utility and high-end aesthetic value. For clients looking to balance structural AutoCAD floor plans, custom modular kitchens, and absolute spatial flow orientation, our integrated atelier system provides:
          </p>
          <div className="bg-[#FAF8F5] p-5 rounded border border-[#3C2A21]/10 my-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-[#BFA15F] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#3C2A21]">6+ Years of Proven Excellence</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-[#BFA15F] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#3C2A21]">Coastal-Resilient High BWR Plywood</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-[#BFA15F] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#3C2A21]">100% Supervised Turnkey Fitting</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-5 h-5 text-[#BFA15F] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-[#3C2A21]">Accurate AutoCAD Layout Clearances</span>
            </div>
          </div>
          <p>
            Ultimately, selecting the right partner involves assessing real portfolios, transparent pricing estimates, and directly inspecting past client outcomes. Ready to transform your site in Mumbai? Schedule a <strong>direct design consultation</strong> with us today.
          </p>
        </div>
      )
    },
    {
      id: 'art-2',
      slug: 'interior-design-cost-mumbai-2bhk-3bhk',
      title: 'Cost of 2BHK and 3BHK Interior Design in Mumbai: Turnkey Budget Analysis (2026)',
      excerpt: 'How much does interior design cost for a 2BHK or 3BHK apartment in Mumbai? Read our localized breakdown of modular kitchen cost, false ceilings, and premium finishing materials.',
      date: 'June 02, 2026',
      author: 'Monica S. (Principal Designer)',
      readTime: '8 min read',
      category: 'Cost & Budgeting Guides',
      keywords: ['cost of interior design in mumbai', '2BHK interior design cost Mumbai', '3BHK interior budget Mumbai', 'modular kitchen cost Mumbai'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
      content: (
        <div className="space-y-6 text-[#6B625E] font-sans antialiased text-sm sm:text-base leading-relaxed">
          <p className="font-serif italic text-[#3C2A21] text-lg border-l-4 border-[#BFA15F] pl-4 my-4 font-light">
            “Transparent budgeting is the primary column supporting a successful luxury renovation. Knowing exactly where money goes eliminates on-site halting and compromises.”
          </p>
          <p>
            A common query we answer for clients during layout audits is: <strong>What is the estimated cost of interior design for a 2BHK or 3BHK in Mumbai?</strong>
          </p>
          <p>
            The final price depends on whether you opt for standard furniture fittings, custom veneer woodworking, or complete high-end turnkey execution. To provide a realistic answer for Mumbai and Thane homeowners, here is a detailed breakdown of costs across premium material tiers.
          </p>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">1. Absolute Cost Range by Apartment Type</h3>
          <p>
            Below is the standard, turnkey range for complete home interior transformations in Mumbai, including layout planning, false ceiling, painting, modular kitchen, and wardrobes:
          </p>
          <div className="overflow-x-auto my-4 border border-[#3C2A21]/10 rounded">
            <table className="w-full text-left font-sans text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#3C2A21] text-white">
                  <th className="p-3">Apartment Layout</th>
                  <th className="p-3">Standard Turnkey Tier</th>
                  <th className="p-3">Premium Luxury Tier</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#3C2A21]/5">
                  <td className="p-3 font-semibold text-[#3C2A21]">1BHK Flat</td>
                  <td className="p-3">₹3.5 Lakh – ₹5 Lakh</td>
                  <td className="p-3">₹5.5 Lakh – ₹8 Lakh</td>
                </tr>
                <tr className="border-b border-[#3C2A21]/5 bg-[#FAF8F5]">
                  <td className="p-3 font-semibold text-[#3C2A21]">2BHK Apartment</td>
                  <td className="p-3">₹5.5 Lakh – ₹7.5 Lakh</td>
                  <td className="p-3">₹8 Lakh – ₹14 Lakh</td>
                </tr>
                <tr className="border-b border-[#3C2A21]/5">
                  <td className="p-3 font-semibold text-[#3C2A21]">3BHK Residence</td>
                  <td className="p-3">₹8 Lakh – ₹12 Lakh</td>
                  <td className="p-3">₹13 Lakh – ₹22 Lakh+</td>
                </tr>
                <tr className="bg-[#FAF8F5]">
                  <td className="p-3 font-semibold text-[#3C2A21]">4BHK / Sprawling Luxury Villa</td>
                  <td className="p-3">₹12 Lakh – ₹18 Lakh</td>
                  <td className="p-3">₹20 Lakh – ₹45 Lakh+</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">2. Element-Wise Cost Breakdowns in Mumbai (2026)</h3>
          <p>
            Understanding individual element costs gives you critical modular control over your budget parameters:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>Bespoke Modular Kitchen:</strong> Typically ranges between <strong>₹1.5 Lakh to ₹4.5 Lakh</strong> depending on the choice of BWR/Marine ply, premium quartz counters, soft-close hardware drawer systems, and custom veneer panels.
            </li>
            <li>
              <strong>Modular Wardrobe (8ft x 7ft):</strong> Ranges from <strong>₹65,000 to ₹1.5 Lakh</strong>. Laminate finishes represent the starter tier, whereas back-painted glass sliding systems with hidden warm LEDs represent the luxury tier.
            </li>
            <li>
              <strong>False Ceiling & Lighting Grid:</strong> Averages around <strong>₹90 to ₹140 per sqf</strong>. This includes high-durability gypsum sheets and integrated path lighting coordinates.
            </li>
            <li>
              <strong>Premium Mineral & Textured Painting:</strong> Plaster lime finishes and water-based luxury emulsions cost around <strong>₹25 to ₹65 per sqf</strong>.
            </li>
          </ul>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">3. Avoiding Hidden On-Site Vendor Shocks</h3>
          <p>
            At Monica Interiors, our primary design rule is <strong>Absolute Financial Transparency</strong>. We supply complete detailed material estimates before a single tile is dislodged. When you secure an Atelier consultation package, we provide a localized turnkey budget guide containing exact itemized clearances.
          </p>
        </div>
      )
    },
    {
      id: 'art-3',
      slug: 'ergonomic-space-planning-layouts',
      title: 'Ergonomic Modern Home Space Planning: Strategic Spacing for Mumbai Apartments',
      excerpt: 'Achieving flow and quiet visual harmony in Mumbai apartments requires balancing AutoCAD layout science with practical spatial psychology. Read our space planning masterclass.',
      date: 'May 28, 2026',
      author: 'Monica S. (Principal Designer)',
      readTime: '5 min read',
      category: 'Space Planning & Layout',
      keywords: ['space planning layout mumbai', 'ergonomic spatial arrangement', 'living room planning', 'interior designer mumbai spacing'],
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=600',
      content: (
        <div className="space-y-6 text-[#6B625E] font-sans antialiased text-sm sm:text-base leading-relaxed">
          <p className="font-serif italic text-[#3C2A21] text-lg border-l-4 border-[#BFA15F] pl-4 my-4 font-light">
            “True layout balance is achieved when you step inside and feel an immediate, quiet sense of breathing space—completely free of heavy, crowded pathways.”
          </p>
          <p>
            In space-starved cities, spatial flow and proper zoning layout can make or break your daily emotional health. More and more modern homeowners seek professional space planning to ensure that their premium modern apartments align with sleek ergonomics and natural movement while retaining clean, sophisticated, contemporary aesthetics.
          </p>
          <p>
            At Monica Interiors, we take an architectural, layout-first approach. We ensure that your home layout behaves intuitively with precise clearance guidelines:
          </p>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">1. Main Entrance and Foyer Spacing</h3>
          <p>
            The entrance represents the gateway of visual impression. In Mumbai, flat layouts are often preset by developers, leaving little room for adjustments. To maximize flow:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Ensure the foyer entry pathway is kept entirely clear. Avoid heavy, bulky shoe consoles near doors.</li>
            <li>Incorporate high-luminance, warm lighting fixtures that immediately wash guests with calming light.</li>
            <li>Use reflective surfaces or light wooden accents to artificially dilate narrow entryways.</li>
          </ul>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">2. Kitchen Alignment: The Golden Work Triangle</h3>
          <p>
            A high-performing modular kitchen relies on the <strong>Golden Work Triangle</strong> (the clearance paths between refrigerator, sink, and cooking hob):
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Position the cooking range or smart hob with at least 3 feet of active counter space on either side.</li>
            <li>Place wash basins and dishwashers with clear access to plumbing cols and away from thermal zones.</li>
            <li>Keep food storage and cold chambers grouped at one end of the layout so primary prep tracks remain uninterrupted.</li>
          </ul>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">3. Master Bedroom: Silent Stability &amp; Layout</h3>
          <p>
            A restful bedroom requires quiet luxury. Placing the master suite bed structure away from core draft lines provides stability and deeper sleep:
          </p>
          <p>
            Avoid placing the head of the bed directly under a solid concrete load-bearing beam, as this creates a subconscious sense of compression. In apartments where custom layouts force this setup, we construct a beautiful, fluid false ceiling with curved timber molding to redirect air currents and alleviate visual pressure.
          </p>

          <h3 className="font-serif text-xl text-[#3C2A21] font-semibold mt-6">Strategic Layout Planning is a Click Away</h3>
          <p>
            Whether formatting a compact 1BHK structure, optimizing a sprawling penthouse layout, or layering soft cozy textiles, space planning is the foundation of any project. Schedule a <strong>direct site spatial audit</strong> with Monica Interiors to map your space's true potential.
          </p>
        </div>
      )
    }
  ];

  const handleOpenArticle = (id: string) => {
    setSelectedArticleId(id);
    const element = document.getElementById('journal-section-root');
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - 100,
        behavior: 'smooth'
      });
    }
  };

  const handleCloseArticle = () => {
    setSelectedArticleId(null);
    setTimeout(() => {
      const element = document.getElementById('journal-section-root');
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.pageYOffset - 100,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  const activeArticle = articles.find(a => a.id === selectedArticleId);

  return (
    <div className="border-t border-[#3C2A21]/10 bg-[#FAF8F5]" id="journal-section-root">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* SECTION HEADER */}
        <div className="max-w-3xl flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BFA15F]" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#BFA15F] font-bold">
              Design Journal &amp; Local Interior Advisory
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-[#3C2A21] tracking-tight leading-tight">
            Interior Insights by Monica Interiors
          </h2>
          <p className="font-sans text-sm md:text-base text-[#6B625E] font-light leading-relaxed max-w-2xl">
            Ranked resources and localized guidelines written directly by the principal decorators at Monica Interiors. Designed to answer vital home improvement, ergonomic space planning, modular kitchen design, and cost budgeting questions for homeowners based in Mumbai, Navi Mumbai, Thane, and across India.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!selectedArticleId ? (
            /* BLOG INDEX VIEW */
            <motion.div
              key="blog-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              id="articles-overview-grid"
            >
              {articles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleOpenArticle(article.id)}
                  className="group flex flex-col bg-white border border-[#3C2A21]/10 hover:border-[#BFA15F] overflow-hidden rounded shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  id={`article-card-${article.slug}`}
                >
                  <div className="w-full h-48 overflow-hidden relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-[#1E1714]/85 text-[9px] font-mono font-semibold uppercase text-[#BFA15F] tracking-widest px-2.5 py-1 rounded">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Meta stats */}
                      <div className="flex items-center gap-3 font-sans text-[10px] text-[#A09690] uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#BFA15F]" />
                          {article.date}
                        </span>
                        <span>&bull;</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h3 className="font-serif text-lg font-semibold text-[#3C2A21] group-hover:text-[#BFA15F] transition-colors leading-snug mt-1">
                        {article.title}
                      </h3>
                      
                      <p className="font-sans text-xs sm:text-sm text-[#6B625E] font-light mt-3 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#3C2A21]/5 mt-5 flex items-center justify-between text-xs font-semibold text-[#BFA15F] self-stretch">
                      <span className="font-mono text-[9px] tracking-wider uppercase text-[#A09690]">
                        Written by Principal Designer
                      </span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                        Read advisory &rarr;
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          ) : (
            /* DETAILED SINGLE ARTICLE VIEW */
            <motion.div
              key="blog-details"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-[#3C2A21]/10 rounded-lg shadow-sm overflow-hidden p-6 sm:p-10 max-w-4xl mx-auto"
              id="active-article-view"
            >
              {/* Back breadcrumb */}
              <button
                onClick={handleCloseArticle}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#6B625E] hover:text-[#BFA15F] font-bold font-sans transition-colors mb-6 cursor-pointer"
                id="article-back-to-index-btn"
              >
                <ArrowLeft className="w-4 h-4 text-[#BFA15F]" />
                Back to Design Journal
              </button>

              {/* Cover Art */}
              <div className="w-full h-64 sm:h-96 rounded-md overflow-hidden mb-8">
                <img
                  src={activeArticle?.image}
                  alt={activeArticle?.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Category & Badge */}
              <div className="flex flex-wrap gap-2 items-center mb-4">
                <span className="bg-[#BFA15F]/10 text-[#BFA15F] text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-[#BFA15F]/20">
                  {activeArticle?.category}
                </span>
                
                <span className="font-sans text-xs text-[#A09690] whitespace-nowrap">
                  Updated: June 2026
                </span>
              </div>

              {/* Title display */}
              <h1 className="font-serif text-2xl sm:text-4xl text-[#3C2A21] font-light leading-tight tracking-tight mb-4">
                {activeArticle?.title}
              </h1>

              {/* Detailed author credit metadata line */}
              <div className="flex border-y border-[#3C2A21]/10 py-3 mb-8 items-center justify-between text-xs font-sans text-[#6B625E]">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#BFA15F] flex-shrink-0" />
                  <span className="font-medium text-[#3C2A21]">{activeArticle?.author}</span>
                </div>
                <div className="flex items-center gap-4 text-[#A09690]">
                  <span>{activeArticle?.date}</span>
                  <span>&bull;</span>
                  <span>{activeArticle?.readTime}</span>
                </div>
              </div>

              {/* Render article HTML */}
              <div className="article-body">
                {activeArticle?.content}
              </div>

              {/* Bottom direct book package panel shortcut */}
              <div className="border-t border-[#3C2A21]/10 pt-10 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#3C2A21]">Have questions about your own layout plan?</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#6B625E] font-light mt-1">
                    Book an online consultation directly with Monica interiors and receive customized blueprints.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const ctaBookBtn = document.getElementById('cta-scheduler-book-btn');
                    if (ctaBookBtn) {
                      ctaBookBtn.click();
                    } else {
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                  }}
                  className="whitespace-nowrap bg-[#3C2A21] hover:bg-[#BFA15F] hover:text-[#1E1714] text-white px-6 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest transition-all rounded shadow-md cursor-pointer active:scale-98"
                >
                  Book consultation space
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
