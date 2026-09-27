CREATE TABLE short_urls (
  id VARCHAR(50) PRIMARY KEY,
  long_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT id_length_check CHECK (
    (is_custom = FALSE AND LENGTH(id) = 8)
    OR
    (is_custom = TRUE AND LENGTH(id) BETWEEN 3 AND 50)
  )
);

CREATE TABLE clicks (
  id BIGSERIAL PRIMARY KEY,
  code_id VARCHAR(50) NOT NULL REFERENCES short_urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX clicked_at_indx on clicks(clicked_at);
CREATE INDEX clicked_code_id_indx on clicks(code_id);
