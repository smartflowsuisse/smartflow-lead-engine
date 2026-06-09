import type { DiscoveryCandidate } from "../types";

export const MOCK_SWISS_COMPANIES: DiscoveryCandidate[] = [
  // ── Zürich ──────────────────────────────────────────────────────────
  { company: "Restaurant Kronenhalle", website: "https://kronenhalle.ch", city: "Zürich", industry: "Gastro" },
  { company: "Zunfthaus zur Waag", website: "https://zunfthaus-zur-waag.ch", city: "Zürich", industry: "Gastro" },
  { company: "Haus Hiltl", website: "https://hiltl.ch", city: "Zürich", industry: "Gastro" },
  { company: "Baltho Küche & Bar", website: "https://baltho.ch", city: "Zürich", industry: "Gastro" },
  { company: "CloudTech AG", website: "https://cloudtech.ch", city: "Zürich", industry: "IT" },
  { company: "Swiss Digital Solutions", website: "https://swissdigital.ch", city: "Zürich", industry: "IT" },
  { company: "Alpine Software GmbH", website: "https://alpinesoftware.ch", city: "Zürich", industry: "IT" },
  { company: "Helvetia Immobilien", website: "https://helvetia-immobilien.ch", city: "Zürich", industry: "Immobilien" },
  { company: "Zürich Property Partners", website: "https://zpp.ch", city: "Zürich", industry: "Immobilien" },
  { company: "Baur au Lac Spa", website: "https://bauraulac.ch", city: "Zürich", industry: "Wellness" },
  { company: "Bauwerk Zürich AG", website: "https://bauwerk-zuerich.ch", city: "Zürich", industry: "Construction" },
  { company: "Elektro Meier GmbH", website: "https://elektro-meier-zuerich.ch", city: "Zürich", industry: "Electricien" },
  { company: "Sanitär Huber AG", website: "https://sanitaer-huber.ch", city: "Zürich", industry: "Plombier" },
  { company: "Wärmetec Zürich", website: "https://waermetec-zuerich.ch", city: "Zürich", industry: "Chauffage" },
  { company: "Praxis am Paradeplatz", website: "https://praxis-paradeplatz.ch", city: "Zürich", industry: "Cabinet médical" },

  // ── Basel ───────────────────────────────────────────────────────────
  { company: "Chez Donati", website: "https://chezdonati.ch", city: "Basel", industry: "Gastro" },
  { company: "Basel IT Consulting", website: "https://baselit.ch", city: "Basel", industry: "IT" },
  { company: "Rhine Valley Tech", website: "https://rhinevalleytech.ch", city: "Basel", industry: "IT" },
  { company: "Basel Immobilien Gruppe", website: "https://basel-immobilien.ch", city: "Basel", industry: "Immobilien" },
  { company: "Café Spitz", website: "https://cafespitz.ch", city: "Basel", industry: "Gastro" },
  { company: "Restaurant Stucki", website: "https://restaurantstucki.ch", city: "Basel", industry: "Gastro" },
  { company: "Basel Bau & Montage", website: "https://basel-bau.ch", city: "Basel", industry: "Construction" },
  { company: "Elektro Basel Nord", website: "https://elektro-basel-nord.ch", city: "Basel", industry: "Electricien" },
  { company: "Plomberie du Rhin", website: "https://plomberie-rhin.ch", city: "Basel", industry: "Plombier" },
  { company: "Chauffage Basel Sàrl", website: "https://chauffage-basel.ch", city: "Basel", industry: "Chauffage" },

  // ── Genève ──────────────────────────────────────────────────────────
  { company: "Le Café du Grütli", website: "https://cafe-grutli.ch", city: "Genève", industry: "Gastro" },
  { company: "Geneva Tech Hub", website: "https://genevatech.ch", city: "Genève", industry: "IT" },
  { company: "Lac Léman Properties", website: "https://lacleman-properties.ch", city: "Genève", industry: "Immobilien" },
  { company: "Restaurant Les Armures", website: "https://lesarmures.ch", city: "Genève", industry: "Gastro" },
  { company: "Immobilier Genève Centre", website: "https://immobilier-geneve.ch", city: "Genève", industry: "Immobilier" },
  { company: "Cabinet médical Eaux-Vives", website: "https://cabinet-eauxvives.ch", city: "Genève", industry: "Cabinet médical" },
  { company: "Construction Léman SA", website: "https://construction-leman.ch", city: "Genève", industry: "Construction" },
  { company: "Électricité Genève Plus", website: "https://electricite-geneve.ch", city: "Genève", industry: "Electricien" },

  // ── Lausanne ────────────────────────────────────────────────────────
  { company: "Lausanne Digital", website: "https://lausanne-digital.ch", city: "Lausanne", industry: "IT" },
  { company: "Restaurant de l'Hôtel de Ville", website: "https://restaurant-hoteldeville.ch", city: "Lausanne", industry: "Gastro" },
  { company: "Vaud Immobilier SA", website: "https://vaud-immobilier.ch", city: "Lausanne", industry: "Immobilien" },
  { company: "Bâtiment Vaudois SA", website: "https://batiment-vaudois.ch", city: "Lausanne", industry: "Construction" },
  { company: "Cabinet médical Lausanne Sud", website: "https://cabinet-lausanne-sud.ch", city: "Lausanne", industry: "Cabinet médical" },

  // ── Bern ────────────────────────────────────────────────────────────
  { company: "Bern Gastro Collective", website: "https://bern-gastro.ch", city: "Bern", industry: "Gastro" },
  { company: "Bundesstadt IT", website: "https://bundesstadt-it.ch", city: "Bern", industry: "IT" },
  { company: "Bern Immobilien Partner", website: "https://bern-immobilien.ch", city: "Bern", industry: "Immobilien" },
  { company: "Alpbau Bern AG", website: "https://alpbau-bern.ch", city: "Bern", industry: "Construction" },
  { company: "Elektro Seeland GmbH", website: "https://elektro-seeland.ch", city: "Bern", industry: "Electricien" },
  { company: "Chauffage Berner Oberland", website: "https://chauffage-oberland.ch", city: "Bern", industry: "Chauffage" },

  // ── Luzern ──────────────────────────────────────────────────────────
  { company: "Luzern Wellness Resort", website: "https://luzern-wellness.ch", city: "Luzern", industry: "Wellness" },
  { company: "Seeblick Restaurant", website: "https://seeblick-luzern.ch", city: "Luzern", industry: "Gastro" },
  { company: "Zentralschweiz Bau AG", website: "https://zsbau-luzern.ch", city: "Luzern", industry: "Construction" },
  { company: "Sanitär Vierwaldstättersee", website: "https://sanitaer-vierwald.ch", city: "Luzern", industry: "Plombier" },

  // ── St. Gallen ──────────────────────────────────────────────────────
  { company: "St. Gallen Software AG", website: "https://sg-software.ch", city: "St. Gallen", industry: "IT" },
  { company: "Ostschweiz Gastro", website: "https://ostschweiz-gastro.ch", city: "St. Gallen", industry: "Gastro" },
  { company: "Bau Ostschweiz GmbH", website: "https://bau-ostschweiz.ch", city: "St. Gallen", industry: "Construction" },
  { company: "Elektro St. Gallen West", website: "https://elektro-sg-west.ch", city: "St. Gallen", industry: "Electricien" },

  // ── Monthey ─────────────────────────────────────────────────────────
  { company: "Bâtiments du Chablais SA", website: "https://batiments-chablais.ch", city: "Monthey", industry: "Construction" },
  { company: "Construction Monthey & Cie", website: "https://construction-monthey.ch", city: "Monthey", industry: "Construction" },
  { company: "Alpes Bâtiment Monthey", website: "https://alpes-batiment-monthey.ch", city: "Monthey", industry: "Construction" },
  { company: "Génie Civil Valaisan", website: "https://genie-civil-valaisan.ch", city: "Monthey", industry: "Construction" },
  { company: "Rénovation Chablais", website: "https://renovation-chablais.ch", city: "Monthey", industry: "Construction" },
  { company: "Électricité Monthey SA", website: "https://electricite-monthey.ch", city: "Monthey", industry: "Electricien" },
  { company: "Plomberie du Chablais", website: "https://plomberie-chablais.ch", city: "Monthey", industry: "Plombier" },
  { company: "Chauffage Monthey Express", website: "https://chauffage-monthey.ch", city: "Monthey", industry: "Chauffage" },
  { company: "Immobilier Monthey Centre", website: "https://immobilier-monthey.ch", city: "Monthey", industry: "Immobilier" },
  { company: "Cabinet médical Monthey", website: "https://cabinet-medical-monthey.ch", city: "Monthey", industry: "Cabinet médical" },
  { company: "Restaurant du Port Monthey", website: "https://restaurant-port-monthey.ch", city: "Monthey", industry: "Gastro" },

  // ── Sion ────────────────────────────────────────────────────────────
  { company: "Électricité Sion Valais", website: "https://electricite-sion.ch", city: "Sion", industry: "Electricien" },
  { company: "Electro Valais Central", website: "https://electro-valais-central.ch", city: "Sion", industry: "Electricien" },
  { company: "Sion Électricité Plus", website: "https://sion-electricite.ch", city: "Sion", industry: "Electricien" },
  { company: "Installations Électriques Sion", website: "https://installations-electriques-sion.ch", city: "Sion", industry: "Electricien" },
  { company: "Valélectro Sàrl", website: "https://valelectro.ch", city: "Sion", industry: "Electricien" },
  { company: "Construction Sion SA", website: "https://construction-sion.ch", city: "Sion", industry: "Construction" },
  { company: "Plomberie Sion & Environs", website: "https://plomberie-sion.ch", city: "Sion", industry: "Plombier" },
  { company: "Chauffage Valais Sion", website: "https://chauffage-valais-sion.ch", city: "Sion", industry: "Chauffage" },
  { company: "Immobilier Sion Capital", website: "https://immobilier-sion.ch", city: "Sion", industry: "Immobilier" },
  { company: "Cabinet médical de Sion", website: "https://cabinet-medical-sion.ch", city: "Sion", industry: "Cabinet médical" },
  { company: "Hôtel de la Planta Sion", website: "https://hotel-planta-sion.ch", city: "Sion", industry: "Gastro" },

  // ── Martigny ────────────────────────────────────────────────────────
  { company: "Bâtiment Martigny SA", website: "https://batiment-martigny.ch", city: "Martigny", industry: "Construction" },
  { company: "Construction Martigny Romande", website: "https://construction-martigny.ch", city: "Martigny", industry: "Construction" },
  { company: "Électricité Martigny", website: "https://electricite-martigny.ch", city: "Martigny", industry: "Electricien" },
  { company: "Plomberie Martigny Express", website: "https://plomberie-martigny.ch", city: "Martigny", industry: "Plombier" },
  { company: "Chauffage Martigny & Combins", website: "https://chauffage-martigny.ch", city: "Martigny", industry: "Chauffage" },
  { company: "Immobilier Martigny Rhône", website: "https://immobilier-martigny.ch", city: "Martigny", industry: "Immobilier" },
  { company: "Cabinet médical Martigny", website: "https://cabinet-martigny.ch", city: "Martigny", industry: "Cabinet médical" },
  { company: "Brasserie du Grand-St-Bernard", website: "https://brasserie-stbernard.ch", city: "Martigny", industry: "Gastro" },

  // ── Vevey ───────────────────────────────────────────────────────────
  { company: "Immobilier Vevey Lac", website: "https://immobilier-vevey-lac.ch", city: "Vevey", industry: "Immobilier" },
  { company: "Agence Immobilière Vevey", website: "https://agence-immobiliere-vevey.ch", city: "Vevey", industry: "Immobilier" },
  { company: "Vevey Properties SA", website: "https://vevey-properties.ch", city: "Vevey", industry: "Immobilier" },
  { company: "Riviera Immobilier Vevey", website: "https://riviera-immobilier-vevey.ch", city: "Vevey", industry: "Immobilier" },
  { company: "Immobilier Vevey Centre-Ville", website: "https://immobilier-vevey-centre.ch", city: "Vevey", industry: "Immobilier" },
  { company: "Construction Vevey SA", website: "https://construction-vevey.ch", city: "Vevey", industry: "Construction" },
  { company: "Électricité Vevey Riviera", website: "https://electricite-vevey.ch", city: "Vevey", industry: "Electricien" },
  { company: "Plomberie Vevey & Montreux", website: "https://plomberie-vevey.ch", city: "Vevey", industry: "Plombier" },
  { company: "Chauffage Vevey Express", website: "https://chauffage-vevey.ch", city: "Vevey", industry: "Chauffage" },
  { company: "Cabinet médical Vevey", website: "https://cabinet-medical-vevey.ch", city: "Vevey", industry: "Cabinet médical" },
  { company: "Café du Rivage Vevey", website: "https://cafe-rivage-vevey.ch", city: "Vevey", industry: "Gastro" },

  // ── Fribourg ────────────────────────────────────────────────────────
  { company: "Construction Fribourg SA", website: "https://construction-fribourg.ch", city: "Fribourg", industry: "Construction" },
  { company: "Bâtiment Fribourgeois", website: "https://batiment-fribourg.ch", city: "Fribourg", industry: "Construction" },
  { company: "Électricité Fribourg", website: "https://electricite-fribourg.ch", city: "Fribourg", industry: "Electricien" },
  { company: "Plomberie Fribourg Nord", website: "https://plomberie-fribourg.ch", city: "Fribourg", industry: "Plombier" },
  { company: "Chauffage Fribourg Sàrl", website: "https://chauffage-fribourg.ch", city: "Fribourg", industry: "Chauffage" },
  { company: "Immobilier Fribourg Centre", website: "https://immobilier-fribourg.ch", city: "Fribourg", industry: "Immobilier" },
  { company: "Cabinet médical Fribourg", website: "https://cabinet-medical-fribourg.ch", city: "Fribourg", industry: "Cabinet médical" },
  { company: "Brasserie de Fribourg", website: "https://brasserie-fribourg.ch", city: "Fribourg", industry: "Gastro" },
  { company: "Fribourg IT Solutions", website: "https://fribourg-it.ch", city: "Fribourg", industry: "IT" },

  // ── Neuchâtel ───────────────────────────────────────────────────────
  { company: "Construction Neuchâtel SA", website: "https://construction-neuchatel.ch", city: "Neuchâtel", industry: "Construction" },
  { company: "Bâtiment Neuchâtelois", website: "https://batiment-neuchatel.ch", city: "Neuchâtel", industry: "Construction" },
  { company: "Électricité Neuchâtel", website: "https://electricite-neuchatel.ch", city: "Neuchâtel", industry: "Electricien" },
  { company: "Plomberie Neuchâtel Lac", website: "https://plomberie-neuchatel.ch", city: "Neuchâtel", industry: "Plombier" },
  { company: "Chauffage Neuchâtel Express", website: "https://chauffage-neuchatel.ch", city: "Neuchâtel", industry: "Chauffage" },
  { company: "Immobilier Neuchâtel Riviera", website: "https://immobilier-neuchatel.ch", city: "Neuchâtel", industry: "Immobilier" },
  { company: "Cabinet médical Neuchâtel", website: "https://cabinet-medical-neuchatel.ch", city: "Neuchâtel", industry: "Cabinet médical" },
  { company: "Hôtel Palafitte Neuchâtel", website: "https://hotel-palafitte.ch", city: "Neuchâtel", industry: "Gastro" },
  { company: "Neuchâtel Tech Lab", website: "https://neuchatel-tech.ch", city: "Neuchâtel", industry: "IT" },

  // ── Cross-region trades (extra coverage) ────────────────────────────
  { company: "Swiss Construction Group", website: "https://swiss-construction.ch", city: "Monthey", industry: "Construction" },
  { company: "Valais Électricité Générale", website: "https://valais-electricite.ch", city: "Martigny", industry: "Electricien" },
  { company: "Romande Plomberie SA", website: "https://romande-plomberie.ch", city: "Vevey", industry: "Plombier" },
  { company: "Chauffage Suisse Romande", website: "https://chauffage-romande.ch", city: "Fribourg", industry: "Chauffage" },
  { company: "Cabinets médicaux Associés", website: "https://cabinets-medical-associes.ch", city: "Neuchâtel", industry: "Cabinet médical" },
  { company: "Immobilier Léman Premium", website: "https://immobilier-leman.ch", city: "Vevey", industry: "Immobilier" },
  { company: "Groupe Bâtiment Valais", website: "https://groupe-batiment-valais.ch", city: "Sion", industry: "Construction" },
  { company: "Électro Chablais Monthey", website: "https://electro-chablais.ch", city: "Monthey", industry: "Electricien" },
  { company: "Plombier Valais Central", website: "https://plombier-valais-central.ch", city: "Sion", industry: "Plombier" },
  { company: "Chauffage Martigny Valais", website: "https://chauffage-martigny-valais.ch", city: "Martigny", industry: "Chauffage" },
];
