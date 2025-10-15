CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT,
    topic TEXT
);

INSERT INTO questions (title, description, difficulty, topic) VALUES
('TEST QUESTION', 'DESCRIPTION OF TEST', 'HARD', 'CIRITICAL THINKING LOL'),
('Two Sum', 'Find two numbers that add up to a target.', 'Easy', 'Array'),
('Reverse Linked List', 'Reverse a singly linked list.', 'Medium', 'Linked List'),
('LRU Cache', 'Design and implement a data structure for Least Recently Used (LRU) cache.', 'Hard', 'Design');


CREATE TABLE questions (
	title TEXT, 
	topic TEXT, 
	difficulty TEXT, 
	description TEXT, 
	constraints TEXT,
	PRIMARY KEY (title)
);

CREATE TABLE test_cases (
	title TEXT,
    index INTEGER, 
    input TEXT,
    output TEXT,
	PRIMARY KEY (title, index),
	FOREIGN KEY (title) REFERENCES questions(title)
);