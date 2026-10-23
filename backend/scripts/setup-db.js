// Dynamic Database Adapter for Ken Classes Backend
// Automatically configures Prisma provider for SQLite (Local) or PostgreSQL (Neon / Supabase cloud)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const NEON_DEFAULT_URL = 'file:./dev.db';
const databaseUrl = process.env.DATABASE_URL || NEON_DEFAULT_URL;
process.env.DATABASE_URL = databaseUrl;

console.log('=======================================================');
console.log(' [DB Adapter] Configuring database schema...');
console.log(` [DB Adapter] Target: ${databaseUrl.startsWith('postgres') ? 'PostgreSQL Cloud Database (Neon/Supabase)' : 'SQLite Local Database'}`);

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');

  if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) {
    console.log(' [DB Adapter] Setting provider to "postgresql"...');
    schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  } else {
    console.log(' [DB Adapter] Setting provider to "sqlite"...');
    schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  }

  fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  console.log(' [DB Adapter] Successfully synced schema.prisma datasource.');

  // Find exact local Prisma CLI binary or pin version to avoid legacy CLI resolution
  const localPrisma = path.join(__dirname, '../node_modules/.bin/prisma');
  const prismaCmd = fs.existsSync(localPrisma) ? `"${localPrisma}"` : 'npx --yes prisma@6.19.3';

  console.log(` [DB Adapter] Running Prisma schema push via ${prismaCmd}...`);
  execSync(`${prismaCmd} db push --accept-data-loss`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: process.env,
  });

  console.log(` [DB Adapter] Generating Prisma Client...`);
  execSync(`${prismaCmd} generate`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: process.env,
  });

  console.log(' [DB Adapter] Database setup completed successfully.');
  console.log('=======================================================');
} catch (error) {
  console.error(' [DB Adapter] Error configuring database:', error.message);
  process.exit(1);
}
