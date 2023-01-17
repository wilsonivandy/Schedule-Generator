\echo 'Delete and recreate schedule_generator db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE schedule_generator;
CREATE DATABASE schedule_generator;
\connect schedule_generator

\i schedule-schema.sql
\i schedule-seed.sql

\echo 'Delete and recreate schedule_generator_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE schedule_generator_test;
CREATE DATABASE schedule_generator_test;
\connect schedule_generator_test

\i schedule-schema.sql
