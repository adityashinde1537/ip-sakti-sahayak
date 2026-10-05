CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    authority TEXT NOT NULL,
    jurisdiction TEXT NOT NULL CHECK (jurisdiction IN ('India', 'International', 'Both')),
    canonical_url TEXT,
    version_label TEXT,
    effective_date DATE,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    access_type TEXT NOT NULL DEFAULT 'public',
    checksum TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS source_chunks (
    id BIGSERIAL PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    citation_locator TEXT,
    embedding vector(768),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (source_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS source_chunks_embedding_idx
ON source_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE IF NOT EXISTS access_consents (
    id BIGSERIAL PRIMARY KEY,
    subject_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    purpose TEXT NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_events (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    actor_id TEXT,
    request_id TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
