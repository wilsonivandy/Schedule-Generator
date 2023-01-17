CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  event_name VARCHAR(50) NOT NULL,
  event_start_time TIMESTAMPTZ,
  event_end_time TIMESTAMPTZ,
  event_duration INTEGER NOT NULL, 
  event_location VARCHAR(200),
  event_priority INT NOT NULL,
  event_isFlexible BOOLEAN NOT NULL
);

CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  schedule_date VARCHAR(25) NOT NULL,
  schedule_start_time TIMESTAMPTZ NOT NULL,
  schedule_end_time TIMESTAMPTZ NOT NULL
);

CREATE TABLE schedule_events (
  schedule_id INTEGER REFERENCES schedules ON DELETE CASCADE,
  event_id INTEGER REFERENCES events ON DELETE CASCADE,
  PRIMARY KEY (schedule_id, event_id),
  event_order INTEGER NOT NULL,
  event_start_time TIMESTAMPTZ NOT NULL,
  event_end_time TIMESTAMPTZ NOT NULL
);

CREATE TABLE event_tripDurations (
  event_id1 INTEGER REFERENCES events ON DELETE CASCADE,
  event_id2 INTEGER REFERENCES events ON DELETE CASCADE,
  trip_duration INTEGER NOT NULL,
  trip_distance INTEGER NOT NULL
);

CREATE TABLE groups (
  id serial PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  chosen_id INTEGER
);

CREATE TABLE schedule_groups (
  group_id INTEGER REFERENCES groups ON DELETE CASCADE,
  schedule_id INTEGER REFERENCES schedules ON DELETE CASCADE,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  schedule_name VARCHAR(25) NOT NULL,
  schedule_date VARCHAR(25) NOT NULL,
  schedule_start_time TIMESTAMPTZ NOT NULL,
  schedule_end_time TIMESTAMPTZ NOT NULL,
  total_distance FLOAT,
  total_duration FLOAT
);


