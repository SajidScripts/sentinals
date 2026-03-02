-- Sentinals Database Migration
-- Creates all tables, enums, and indexes

-- Enums
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionStatus" AS ENUM ('FREE', 'TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "LogSeverity" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'MICROSOFT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'FREE',
  "authProvider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
  "authProviderId" TEXT,
  "stripeCustomerId" TEXT UNIQUE,
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS "projects" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
  "config" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Logs table
CREATE TABLE IF NOT EXISTS "logs" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "projectId" TEXT NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "severity" "LogSeverity" NOT NULL DEFAULT 'INFO',
  "metadata" JSONB,
  "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "token" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "family" TEXT NOT NULL,
  "revoked" BOOLEAN NOT NULL DEFAULT false,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");
CREATE INDEX IF NOT EXISTS "idx_users_sub" ON "users"("subscriptionStatus");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_auth" ON "users"("authProvider", "authProviderId");
CREATE INDEX IF NOT EXISTS "idx_projects_userid" ON "projects"("userId");
CREATE INDEX IF NOT EXISTS "idx_projects_status" ON "projects"("status");
CREATE INDEX IF NOT EXISTS "idx_projects_userid_status" ON "projects"("userId", "status");
CREATE INDEX IF NOT EXISTS "idx_logs_projectid" ON "logs"("projectId");
CREATE INDEX IF NOT EXISTS "idx_logs_projectid_ts" ON "logs"("projectId", "timestamp" DESC);
CREATE INDEX IF NOT EXISTS "idx_logs_severity" ON "logs"("severity");
CREATE INDEX IF NOT EXISTS "idx_logs_projectid_sev" ON "logs"("projectId", "severity");
CREATE INDEX IF NOT EXISTS "idx_rt_token" ON "refresh_tokens"("token");
CREATE INDEX IF NOT EXISTS "idx_rt_userid" ON "refresh_tokens"("userId");
CREATE INDEX IF NOT EXISTS "idx_rt_family" ON "refresh_tokens"("family");

-- Prisma migrations tracking table
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" TEXT PRIMARY KEY,
  "checksum" TEXT NOT NULL,
  "finished_at" TIMESTAMPTZ,
  "migration_name" TEXT NOT NULL,
  "logs" TEXT,
  "rolled_back_at" TIMESTAMPTZ,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "applied_steps_count" INT NOT NULL DEFAULT 0
);
