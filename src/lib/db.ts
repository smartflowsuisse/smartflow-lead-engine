import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "leads.db");

let db: Database.Database | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      website TEXT,
      email TEXT,
      phone TEXT,
      city TEXT,
      industry TEXT,
      lead_score INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'New Lead',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lead_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL UNIQUE,
      website_quality INTEGER NOT NULL DEFAULT 0,
      mobile_friendliness INTEGER NOT NULL DEFAULT 0,
      speed_score INTEGER NOT NULL DEFAULT 0,
      seo_score INTEGER NOT NULL DEFAULT 0,
      has_contact_form INTEGER NOT NULL DEFAULT 0,
      trust_score INTEGER NOT NULL DEFAULT 0,
      quick_wins TEXT NOT NULL DEFAULT '[]',
      automation_opportunities TEXT NOT NULL DEFAULT '[]',
      raw_analysis TEXT NOT NULL DEFAULT '{}',
      analyzed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score);
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

    CREATE TABLE IF NOT EXISTS lead_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_lead_tasks_lead ON lead_tasks(lead_id);
    CREATE INDEX IF NOT EXISTS idx_lead_tasks_due ON lead_tasks(due_date);

    CREATE TABLE IF NOT EXISTS lead_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      activity_type TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);
    CREATE INDEX IF NOT EXISTS idx_lead_activities_created ON lead_activities(created_at);
  `);

  runMigrations(database);
}

function runMigrations(database: Database.Database) {
  const columns = database
    .prepare("PRAGMA table_info(leads)")
    .all() as Array<{ name: string }>;
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has("contacted_at")) {
    database.exec("ALTER TABLE leads ADD COLUMN contacted_at TEXT");
  }

  if (!columnNames.has("contacted_language")) {
    database.exec("ALTER TABLE leads ADD COLUMN contacted_language TEXT");
  }

  if (!columnNames.has("contact_page_url")) {
    database.exec("ALTER TABLE leads ADD COLUMN contact_page_url TEXT");
  }

  if (!columnNames.has("email_confidence")) {
    database.exec("ALTER TABLE leads ADD COLUMN email_confidence INTEGER");
  }

  if (!columnNames.has("phone_confidence")) {
    database.exec("ALTER TABLE leads ADD COLUMN phone_confidence INTEGER");
  }

  if (!columnNames.has("outreach_status")) {
    database.exec(
      "ALTER TABLE leads ADD COLUMN outreach_status TEXT NOT NULL DEFAULT 'New'"
    );
    database.exec(
      "CREATE INDEX IF NOT EXISTS idx_leads_outreach_status ON leads(outreach_status)"
    );
  }
}

export function getDb(): Database.Database {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
