import { getDb, closeDb } from "../src/lib/db";
import { createLead, saveLeadAnalysis } from "../src/lib/leads";
import { analyzeWebsite } from "../src/lib/ai-analysis";
import { calculateLeadScore } from "../src/lib/scoring";

const sampleLeads = [
  {
    company: "Alpine Consulting GmbH",
    website: "https://example.com",
    email: "info@alpine-consulting.ch",
    phone: "+41 44 123 45 67",
    city: "Zürich",
    industry: "Consulting",
    status: "New Lead" as const,
    notes: "Potential automation client — manual processes identified.",
  },
  {
    company: "Bergrestaurant Sonnenberg",
    website: "https://example.org",
    email: "reservation@sonnenberg.ch",
    phone: "+41 41 987 65 43",
    city: "Luzern",
    industry: "Gastro & Tourism",
    status: "Contacted" as const,
    notes: "Interested in online booking automation.",
  },
  {
    company: "TechHandel AG",
    website: "https://example.net",
    email: "sales@techhandel.ch",
    phone: "+41 21 555 12 34",
    city: "Lausanne",
    industry: "Retail & E-commerce",
    status: "Follow Up" as const,
  },
  {
    company: "Müller & Partner Rechtsanwälte",
    website: "https://example.edu",
    email: "kanzlei@mueller-partner.ch",
    city: "Bern",
    industry: "Legal Services",
    status: "Analyzed" as const,
  },
  {
    company: "Swiss Digital Solutions",
    website: "https://example.io",
    email: "hello@swissdigital.ch",
    phone: "+41 31 222 33 44",
    city: "Basel",
    industry: "Technology",
    status: "Proposal Sent" as const,
    notes: "Proposal sent for CRM + chatbot package.",
  },
  {
    company: "Genève Immobilier SA",
    website: "https://example.ch",
    email: "contact@geneve-immo.ch",
    city: "Genève",
    industry: "Real Estate",
    status: "Client" as const,
    notes: "Signed contract — website + lead automation.",
  },
];

async function seed() {
  console.log("🌱 Seeding SmartFlow Lead Engine database...\n");

  getDb();

  for (const data of sampleLeads) {
    const lead = createLead(data);
    console.log(`  ✓ Created: ${lead.company} (${lead.city})`);

    if (data.website) {
      try {
        const analysis = await analyzeWebsite(data.website, data.industry);
        const score = calculateLeadScore(analysis);
        saveLeadAnalysis(lead.id, {
          websiteQuality: analysis.websiteQuality,
          mobileFriendliness: analysis.mobileFriendliness,
          speedScore: analysis.speedScore,
          seoScore: analysis.seoScore,
          hasContactForm: analysis.hasContactForm,
          trustScore: analysis.trustScore,
          quickWins: analysis.quickWins,
          automationOpportunities: analysis.automationOpportunities,
          rawAnalysis: analysis.details,
          leadScore: score,
        });
        console.log(`    → Analyzed (score: ${score})`);
      } catch {
        console.log(`    → Analysis skipped`);
      }
    }
  }

  closeDb();
  console.log("\n✅ Seed complete! Run `npm run dev` to start the app.\n");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
