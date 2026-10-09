import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'infopilot.db');

export async function initDb() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      lastUpdated TEXT NOT NULL,
      content TEXT,
      summary TEXT,
      metadata TEXT,
      isDemo INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS conflicts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      description TEXT,
      sourceA TEXT,
      sourceB TEXT,
      differenceHighlight TEXT,
      whyItMatters TEXT,
      recommendedAction TEXT,
      actionCreated INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS actions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      source TEXT,
      reason TEXT,
      priority TEXT,
      status TEXT,
      due TEXT,
      why TEXT,
      relatedConflict TEXT,
      relatedConflictId TEXT,
      recommendedNextStep TEXT,
      createdAt TEXT
    );
  `);

  return db;
}
