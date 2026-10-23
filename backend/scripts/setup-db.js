// Dynamic Database Adapter for Ken Classes Backend
// Automatically configures Prisma provider for SQLite (Local/Render ephemeral) or PostgreSQL (Supabase/Neon free tier)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

console.log('=======================================================');
console.log(' [DB Adapter] Configuring database schema...');
console.log(` [DB Adapter] Target DATABASE_URL: ${databaseUrl.startsWith('postgres') ? 'PostgreSQL Cloud Database' : 'SQLite Local Database'}`);

try {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');

  if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) {
    console.log(' [DB Adapter] Detected PostgreSQL connection string (Supabase/Neon). Setting provider to "postgresql"...');
    schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  } else {
    console.log(' [DB Adapter] Detected SQLite connection string. Setting provider to "sqlite"...');
    schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  }

  fs.writeFileSync(schemaPath, schemaContent, 'utf8');
  console.log(' [DB Adapter] Successfully synced schema.prisma datasource.');

  // Push schema to target database
  console.log(' [DB Adapter] Pushing database schema (prisma db push)...');
  execSync('npx prisma db push --accept-data-loss', {
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
