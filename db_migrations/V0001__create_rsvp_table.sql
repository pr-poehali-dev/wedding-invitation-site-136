CREATE TABLE rsvp (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    diet TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);