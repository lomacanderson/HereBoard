CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    coordinates GEOGRAPHY(Point, 4326)
);

CREATE TABLE visits (
    visit_id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES locations(location_id) ON DELETE CASCADE,
    review TEXT,
    stars SMALLINT CHECK (stars BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE visit_users (
    visit_id INTEGER NOT NULL REFERENCES visits(visit_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (visit_id, user_id)
);

CREATE TABLE followers (
    following_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    followed_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    followed_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (following_user_id, followed_user_id),
    CHECK (following_user_id != followed_user_id)
);

CREATE TABLE media (
    media_id SERIAL PRIMARY KEY,
    visit_id INTEGER NOT NULL REFERENCES visits(visit_id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20)
);