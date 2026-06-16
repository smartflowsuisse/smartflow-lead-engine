export type RetailLanguage = "en" | "fr" | "de";

export const retailLanguageLabels: Record<RetailLanguage, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
};

export const retailAuditMessages: Record<RetailLanguage, string> = {
  en: "Hello, I noticed that many retail businesses lose time on product catalog updates, supplier invoices, price changes, promotions, and daily reporting. SmartFlow Suisse has prepared a Retail Automation Starter with ready-to-demo workflows for catalog updates, supplier document processing, promotion tracking, and sales reporting. We can offer a free workflow audit and show where automation could save time before proposing any implementation.",
  fr: "Bonjour, j’ai remarqué que de nombreux commerces perdent du temps avec les mises à jour de catalogue, les factures fournisseurs, les changements de prix, les promotions et les rapports quotidiens. SmartFlow Suisse a préparé un Retail Automation Starter avec des workflows prêts à démontrer pour les mises à jour de catalogue, le traitement des documents fournisseurs, le suivi des promotions et les rapports de vente. Nous pouvons proposer un audit gratuit de vos workflows afin d’identifier où l’automatisation pourrait vous faire gagner du temps avant toute proposition d’implémentation.",
  de: "Guten Tag, ich habe gesehen, dass viele Handelsunternehmen viel Zeit mit Produktkatalogen, Lieferantenrechnungen, Preisänderungen, Aktionen und täglichen Berichten verlieren. SmartFlow Suisse hat einen Retail Automation Starter mit vorbereiteten Workflows für Katalogaktualisierung, Lieferantendokumente, Aktionsverfolgung und Verkaufsberichte vorbereitet. Wir können einen kostenlosen Workflow-Audit anbieten und zeigen, wo Automatisierung Zeit sparen kann, bevor wir eine Umsetzung vorschlagen.",
};

export const retailTemplates = [
  {
    title: "Catalog Update Workflow",
    description:
      "Update product names, prices, barcodes, images, and categories from supplier files or internal exports.",
    outcome: "Clean product catalog update",
    value: "Faster catalog maintenance and fewer manual errors",
  },
  {
    title: "Supplier Invoice Processing",
    description:
      "Extract supplier, amount, VAT, product references, delivery dates, and approval status from PDF invoices.",
    outcome: "Review-ready supplier invoice summary",
    value: "Better purchasing and accounting control",
  },
  {
    title: "Promotion Price Tracking",
    description:
      "Track temporary discounts, promotion periods, old prices, new prices, and automatic return to regular pricing.",
    outcome: "Clear promotion price schedule",
    value: "Less risk of wrong prices during and after promotions",
  },
  {
    title: "Daily Sales Summary",
    description:
      "Summarize daily sales, product groups, anomalies, missing data, and key performance indicators.",
    outcome: "Daily retail performance report",
    value: "Better visibility on store performance",
  },
];

export const retailImplementationSteps = [
  {
    title: "Audit retail workflow",
    description:
      "Map catalog, pricing, supplier invoices, promotions, reporting, and approval steps before building automation.",
  },
  {
    title: "Collect sample files",
    description:
      "Use real product exports, supplier invoices, price lists, promotion files, and sales reports for testing.",
  },
  {
    title: "Confirm retail tools",
    description:
      "Confirm POS, accounting, spreadsheet, Saby/SBIS, Shopify, WooCommerce, CRM, or other store systems.",
  },
  {
    title: "Build n8n / Make workflow",
    description:
      "Create the first working automation with AI document review and structured outputs.",
  },
  {
    title: "Test with real retail data",
    description:
      "Check extraction quality, price logic, product matching, missing fields, and approval flow before delivery.",
  },
  {
    title: "Train owner / admin",
    description:
      "Show the client how to review outputs, approve updates, correct data, and request support.",
  },
  {
    title: "Start monthly support",
    description:
      "Monitor workflows, fix issues, update templates, and add improvements under retainer.",
  },
];

export const retailProposalSummary = [
  "Retail Automation Starter — Proposal Summary",
  "",
  "We can help your retail business reduce manual work around product catalogs, supplier invoices, price changes, promotions, and daily reporting.",
  "",
  "Package:",
  "- Catalog Update Workflow",
  "- Supplier Invoice Processing",
  "- Promotion Price Tracking",
  "- Daily Sales Summary",
  "- Implementation checklist from workflow audit to monthly support",
  "",
  "Offer range:",
  "CHF 4'000–10'000 + monthly support retainer",
  "",
  "Next step:",
  "Free workflow audit to identify where automation can save time before implementation.",
].join("\n");

export const retailClientIntakeChecklist = [
  "Retail Automation Starter — Client Intake Checklist",
  "",
  "Please prepare the following before the workflow audit:",
  "",
  "1. Product catalog export",
  "2. Supplier invoices or delivery documents",
  "3. Price lists and promotion examples",
  "4. Daily or weekly sales reports",
  "5. Current tools used by the team: POS, accounting, spreadsheet, Saby/SBIS, Shopify, WooCommerce, CRM, or other systems",
  "6. Approval rules: who reviews, changes, approves, or receives alerts",
  "7. Main pain points: wrong prices, manual updates, missing product data, slow reporting, or unclear responsibilities",
  "",
  "Goal:",
  "Use these materials to identify where automation can save time before implementation.",
].join("\n");
