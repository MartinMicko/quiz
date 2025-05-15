CREATE DATABASE mmaquiz;

\c mmaquiz

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL
);

INSERT INTO questions (question_text) VALUES
('Who is known as The Notorious?'),
('What year was UFC founded?'),
('Which fighter holds the record for most title defenses?');
