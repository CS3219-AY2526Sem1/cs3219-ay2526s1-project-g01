/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-10-20
 * Purpose: To generate SQL initialization script for question service database schema and seed data.
 * Author Review: Designed the schema, then I checked correctness and performance of the code.
 */

DROP VIEW IF EXISTS question_difficulties_view;
DROP TABLE IF EXISTS test_cases;
DROP TABLE IF EXISTS question_topics;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS attempts;
DROP TABLE IF EXISTS questions;

-- Questions table (one difficulty per question)
CREATE TABLE questions (
    id SERIAL,
    title TEXT NOT NULL UNIQUE,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
    description TEXT NOT NULL,
    question_constraints TEXT,
	PRIMARY KEY (id)
);

-- Topics table (many topics per question)
CREATE TABLE topics (
    id SERIAL,
    name TEXT NOT NULL UNIQUE,
	PRIMARY KEY (id)
);

-- Link table: question ↔ topic (many-to-many)
CREATE TABLE question_topics (
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    topic_id INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, topic_id)
);

-- Test cases table
CREATE TABLE test_cases (
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    index INTEGER NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    PRIMARY KEY (question_id, index)
);

CREATE TABLE attempts (
    id SERIAL,
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    user_id INT NOT NULL,
    attempted_date DATE,
    PRIMARY KEY (id)
);


-- Insert the sorting topic
INSERT INTO topics (name) VALUES ('Sorting');

-- EASY QUESTIONS (1-10)

-- Question 1
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort Array in Ascending Order', 'easy', 'Given an array of integers, return the array sorted in ascending order.', 'Array length: 1 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (1, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(1, 1, '[5, 2, 8, 1, 9]', '[1, 2, 5, 8, 9]'),
(1, 2, '[-3, 0, -1, 5, 2]', '[-3, -1, 0, 2, 5]');

-- Question 2
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort String Characters', 'easy', 'Given a string, return a new string with all characters sorted in alphabetical order.', 'String length: 1 ≤ n ≤ 1000; Contains only lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES (2, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(2, 1, '"hello"', '"ehllo"'),
(2, 2, '"sorting"', '"ginorst"');

-- Question 3
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Check if Array is Sorted', 'easy', 'Given an array of integers, return true if the array is sorted in non-decreasing order, false otherwise.', 'Array length: 1 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (3, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(3, 1, '[1, 2, 3, 4, 5]', 'true'),
(3, 2, '[1, 3, 2, 4]', 'false');

-- Question 4
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort Array by Absolute Value', 'easy', 'Given an array of integers, sort the array by the absolute value of each element in ascending order.', 'Array length: 1 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (4, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(4, 1, '[3, -5, 1, -2, 4]', '[1, -2, 3, 4, -5]'),
(4, 2, '[-10, 5, -3, 8]', '[-3, 5, 8, -10]');

-- Question 5
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Find Kth Smallest Element', 'easy', 'Given an unsorted array and an integer k, return the kth smallest element in the array (1-indexed).', 'Array length: 1 ≤ n ≤ 1000; 1 ≤ k ≤ n; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (5, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(5, 1, '[7, 10, 4, 3, 20, 15], k=3', '7'),
(5, 2, '[5, 2, 8, 1], k=2', '2');

-- Question 6
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort Even Numbers Only', 'easy', 'Given an array of integers, sort only the even numbers in ascending order while keeping odd numbers in their original positions.', 'Array length: 1 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (6, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(6, 1, '[8, 3, 6, 1, 2, 9]', '[2, 3, 6, 1, 8, 9]'),
(6, 2, '[5, 10, 3, 4, 7]', '[5, 4, 3, 10, 7]');

-- Question 7
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Merge Two Sorted Arrays', 'easy', 'Given two sorted arrays, merge them into one sorted array.', 'Array lengths: 0 ≤ n, m ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (7, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(7, 1, '[1, 3, 5], [2, 4, 6]', '[1, 2, 3, 4, 5, 6]'),
(7, 2, '[1, 2, 3], []', '[1, 2, 3]');

-- Question 8
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort by Digit Sum', 'easy', 'Given an array of positive integers, sort them by the sum of their digits in ascending order. If two numbers have the same digit sum, maintain their original relative order.', 'Array length: 1 ≤ n ≤ 1000; Array elements: 1 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (8, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(8, 1, '[12, 21, 3, 111]', '[3, 12, 21, 111]'),
(8, 2, '[10, 100, 19, 28]', '[10, 100, 19, 28]');

-- Question 9
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Separate Positive and Negative', 'easy', 'Given an array of integers, rearrange it so that all negative numbers come before positive numbers. Maintain the relative order within each group.', 'Array length: 1 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (9, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(9, 1, '[3, -1, 4, -2, 5]', '[-1, -2, 3, 4, 5]'),
(9, 2, '[1, 2, -3, -4]', '[-3, -4, 1, 2]');

-- Question 10
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort Array in Descending Order', 'easy', 'Given an array of integers, return the array sorted in descending order.', 'Array length: 1 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (10, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(10, 1, '[5, 2, 8, 1, 9]', '[9, 8, 5, 2, 1]'),
(10, 2, '[3, 3, 1, 2]', '[3, 3, 2, 1]');

-- MEDIUM QUESTIONS (11-20)

-- Question 11
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort by Frequency and Value', 'medium', 'Given an array of integers, sort them by frequency in descending order. If two numbers have the same frequency, sort them by value in ascending order.', 'Array length: 1 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (11, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(11, 1, '[1, 1, 2, 2, 2, 3]', '[2, 2, 2, 1, 1, 3]'),
(11, 2, '[4, 5, 6, 5, 4, 3]', '[4, 4, 5, 5, 3, 6]');

-- Question 12
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Wave Sort Array', 'medium', 'Given an unsorted array, sort it into a wave-like array such that arr[0] >= arr[1] <= arr[2] >= arr[3] <= arr[4]...', 'Array length: 2 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (12, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(12, 1, '[1, 2, 3, 4, 5]', '[2, 1, 4, 3, 5]'),
(12, 2, '[10, 5, 6, 3, 2, 20]', '[10, 5, 6, 2, 20, 3]');

-- Question 13
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort Colors (Dutch Flag Problem)', 'medium', 'Given an array with only values 0, 1, and 2 (representing red, white, and blue), sort them in-place so that objects of the same color are adjacent, in the order 0, 1, 2.', 'Array length: 1 ≤ n ≤ 1000; Array elements: arr[i] ∈ {0, 1, 2}');

INSERT INTO question_topics (question_id, topic_id) VALUES (13, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(13, 1, '[2, 0, 2, 1, 1, 0]', '[0, 0, 1, 1, 2, 2]'),
(13, 2, '[2, 0, 1]', '[0, 1, 2]');

-- Question 14
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort Matrix Diagonally', 'medium', 'Given an m x n matrix, sort each diagonal from top-left to bottom-right in ascending order and return the resulting matrix.', 'Matrix dimensions: 1 ≤ m, n ≤ 100; Matrix elements: -10^6 ≤ matrix[i][j] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (14, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(14, 1, '[[3,3,1,1],[2,2,1,2],[1,1,1,2]]', '[[1,1,1,1],[1,2,2,2],[1,2,3,3]]'),
(14, 2, '[[5,4],[3,2]]', '[[3,4],[5,2]]');

-- Question 15
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Minimum Swaps to Sort', 'medium', 'Given an array of distinct integers, find the minimum number of swaps needed to sort the array in ascending order.', 'Array length: 1 ≤ n ≤ 1000; Array contains distinct integers: 1 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (15, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(15, 1, '[4, 3, 2, 1]', '2'),
(15, 2, '[1, 5, 4, 3, 2]', '2');

-- Question 16
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort by Custom Comparator', 'medium', 'Given an array of strings, sort them by length in ascending order. If two strings have the same length, sort them lexicographically.', 'Array length: 1 ≤ n ≤ 1000; String length: 1 ≤ len ≤ 100; Contains only lowercase letters');

INSERT INTO question_topics (question_id, topic_id) VALUES (16, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(16, 1, '["apple", "pie", "a", "banana"]', '["a", "pie", "apple", "banana"]'),
(16, 2, '["dog", "cat", "bird", "ant"]', '["ant", "cat", "dog", "bird"]');

-- Question 17
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Pancake Sorting', 'medium', 'Given an array of integers, sort it using only flip operations. A flip operation reverses the order of elements from index 0 to k. Return the sequence of k values for each flip.', 'Array length: 1 ≤ n ≤ 100; Array elements: 1 ≤ arr[i] ≤ 100; All elements are distinct');

INSERT INTO question_topics (question_id, topic_id) VALUES (17, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(17, 1, '[3, 2, 4, 1]', '[3, 4, 2, 3, 1, 2, 1]'),
(17, 2, '[1, 2, 3]', '[]');

-- Question 18
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort Linked List', 'medium', 'Given the head of a linked list, sort it in ascending order and return the sorted list.', 'List length: 0 ≤ n ≤ 5000; Node values: -10^6 ≤ val ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (18, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(18, 1, '[4, 2, 1, 3]', '[1, 2, 3, 4]'),
(18, 2, '[-1, 5, 3, 4, 0]', '[-1, 0, 3, 4, 5]');

-- Question 19
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Relative Sort Array', 'medium', 'Given two arrays arr1 and arr2, sort arr1 such that the relative ordering of items in arr1 matches arr2. Elements that do not appear in arr2 should be placed at the end in ascending order.', 'Array lengths: 1 ≤ arr1.length ≤ 1000, 1 ≤ arr2.length ≤ 1000; Array elements: 0 ≤ arr1[i], arr2[i] ≤ 1000');

INSERT INTO question_topics (question_id, topic_id) VALUES (19, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(19, 1, 'arr1=[2,3,1,3,2,4,6,7,9,2,19], arr2=[2,1,4,3,9,6]', '[2,2,2,1,4,3,3,9,6,7,19]'),
(19, 2, 'arr1=[5,4,3,2,1], arr2=[3,1]', '[3,1,2,4,5]');

-- Question 20
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Wiggle Sort', 'medium', 'Given an integer array, reorder it such that arr[0] < arr[1] > arr[2] < arr[3]... Maintain the property that every odd-indexed element is greater than its adjacent elements.', 'Array length: 1 ≤ n ≤ 1000; Array elements: -10^6 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (20, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(20, 1, '[3, 5, 2, 1, 6, 4]', '[3, 5, 1, 6, 2, 4]'),
(20, 2, '[1, 2, 3, 4]', '[1, 4, 2, 3]');

-- HARD QUESTIONS (21-30)

-- Question 21
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Count Inversions', 'hard', 'Given an array of integers, count the number of inversions. An inversion is a pair of indices (i, j) where i < j and arr[i] > arr[j].', 'Array length: 1 ≤ n ≤ 100000; Array elements: -10^9 ≤ arr[i] ≤ 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES (21, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(21, 1, '[2, 4, 1, 3, 5]', '3'),
(21, 2, '[5, 4, 3, 2, 1]', '10');

-- Question 22
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Maximum Gap', 'hard', 'Given an unsorted array, find the maximum difference between successive elements in its sorted form. Return 0 if the array contains less than 2 elements.', 'Array length: 1 ≤ n ≤ 100000; Array elements: 0 ≤ arr[i] ≤ 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES (22, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(22, 1, '[3, 6, 9, 1]', '3'),
(22, 2, '[10]', '0');

-- Question 23
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Count Smaller Numbers After Self', 'hard', 'Given an integer array, return an array where each element counts[i] is the number of smaller elements to the right of arr[i].', 'Array length: 1 ≤ n ≤ 100000; Array elements: -10^9 ≤ arr[i] ≤ 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES (23, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(23, 1, '[5, 2, 6, 1]', '[2, 1, 1, 0]'),
(23, 2, '[8, 1, 2, 2, 3]', '[4, 0, 0, 0, 0]');

-- Question 24
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Sort Transformed Array', 'hard', 'Given a sorted array of integers and three integers a, b, c, apply the quadratic function f(x) = ax² + bx + c to each element and return the result in sorted order.', 'Array length: 1 ≤ n ≤ 10000; Array is sorted; Array elements: -100 ≤ arr[i] ≤ 100; Coefficients: -100 ≤ a, b, c ≤ 100');

INSERT INTO question_topics (question_id, topic_id) VALUES (24, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(24, 1, 'arr=[-4,-2,2,4], a=1, b=3, c=5', '[3, 9, 15, 33]'),
(24, 2, 'arr=[-4,-2,2,4], a=-1, b=3, c=5', '[-23, -5, 1, 7]');

-- Question 25
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Reverse Pairs', 'hard', 'Given an integer array, return the number of reverse pairs. A reverse pair is a pair (i, j) where i < j and arr[i] > 2 * arr[j].', 'Array length: 1 ≤ n ≤ 50000; Array elements: -10^9 ≤ arr[i] ≤ 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES (25, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(25, 1, '[1, 3, 2, 3, 1]', '2'),
(25, 2, '[2, 4, 3, 5, 1]', '3');

-- Question 26
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Smallest Range Covering K Lists', 'hard', 'Given k sorted lists of integers, find the smallest range that includes at least one number from each list. The range [a,b] is smaller than [c,d] if b-a < d-c or if b-a == d-c and a < c.', 'Number of lists: 1 ≤ k ≤ 3500; List length: 1 ≤ len ≤ 50; Elements: -10^5 ≤ arr[i][j] ≤ 10^5');

INSERT INTO question_topics (question_id, topic_id) VALUES (26, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(26, 1, '[[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]', '[20,24]'),
(26, 2, '[[1,2,3],[1,2,3],[1,2,3]]', '[1,1]');

-- Question 27
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Minimum Operations to Sort by Swapping Adjacent', 'hard', 'Given an array of distinct integers, find the minimum number of adjacent swaps needed to sort the array in ascending order.', 'Array length: 1 ≤ n ≤ 100000; Array contains distinct integers: 1 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (27, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(27, 1, '[3, 2, 1]', '3'),
(27, 2, '[1, 5, 4, 3, 2]', '6');

-- Question 28
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Find Kth Smallest in Sorted Matrix', 'hard', 'Given an n x n matrix where each row and column is sorted in ascending order, find the kth smallest element.', 'Matrix size: 1 ≤ n ≤ 300; 1 ≤ k ≤ n²; Matrix elements: -10^9 ≤ matrix[i][j] ≤ 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES (28, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(28, 1, 'matrix=[[1,5,9],[10,11,13],[12,13,15]], k=8', '13'),
(28, 2, 'matrix=[[-5]], k=1', '-5');

-- Question 29
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Merge K Sorted Lists', 'hard', 'Given k sorted linked lists, merge them into one sorted linked list and return the head.', 'Number of lists: 0 ≤ k ≤ 10000; Total nodes: 0 ≤ total ≤ 10000; Node values: -10^4 ≤ val ≤ 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES (29, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(29, 1, '[[1,4,5],[1,3,4],[2,6]]', '[1,1,2,3,4,4,5,6]'),
(29, 2, '[]', '[]');

-- Question 30
INSERT INTO questions (title, difficulty, description, question_constraints) VALUES
('Optimal Partition to Minimize Maximum Sum', 'hard', 'Given a sorted array and integer k, partition the array into k non-empty consecutive subarrays such that the maximum sum among these subarrays is minimized. After partitioning, you can sort each subarray independently. Return the minimum possible maximum sum.', 'Array length: 1 ≤ n ≤ 500; 1 ≤ k ≤ n; Array elements: 1 ≤ arr[i] ≤ 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES (30, 1);

INSERT INTO test_cases (question_id, index, input, output) VALUES
(30, 1, 'arr=[1,4,1,5,7,3,6,1,9,9,3], k=4', '15'),
(30, 2, 'arr=[2,2,2,2,2], k=2', '6');





---------------------------------

-- First, insert the 'Arrays' topic if it doesn't exist
INSERT INTO topics (name) VALUES ('Arrays') ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- EASY QUESTIONS (31-40)
-- ============================================================================

-- Question 31: Find Maximum Element
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(31, 'Find Maximum Element', 'easy', 'Write a function that takes an array of integers and returns the maximum element in the array.', '1 <= array.length <= 10^4, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(31, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(31, 1, '[3, 7, 2, 9, 1]', '9'),
(31, 2, '[-5, -2, -10, -1]', '-1');

-- Question 32: Count Even Numbers
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(32, 'Count Even Numbers', 'easy', 'Write a function that counts how many even numbers are present in an array of integers.', '0 <= array.length <= 10^4, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(32, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(32, 1, '[1, 2, 3, 4, 5, 6]', '3'),
(32, 2, '[7, 9, 11, 13]', '0');

-- Question 33: Reverse Array In Place
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(33, 'Reverse Array In Place', 'easy', 'Write a function that reverses an array in place and returns it. You must modify the original array without creating a new one.', '0 <= array.length <= 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES
(33, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(33, 1, '[1, 2, 3, 4, 5]', '[5, 4, 3, 2, 1]'),
(33, 2, '[10, 20]', '[20, 10]');

-- Question 34: Find Sum of Array
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(34, 'Find Sum of Array', 'easy', 'Write a function that calculates and returns the sum of all elements in an integer array.', '0 <= array.length <= 10^4, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(34, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(34, 1, '[1, 2, 3, 4, 5]', '15'),
(34, 2, '[-1, -2, -3]', '-6');

-- -- Question 35: Check if Array is Sorted
-- INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
-- (35, 'Check if Array is Sorted', 'easy', 'Write a function that returns true if an array is sorted in non-decreasing order, false otherwise.', '1 <= array.length <= 10^4, -10^9 <= array[i] <= 10^9');

-- INSERT INTO question_topics (question_id, topic_id) VALUES
-- (35, (SELECT id FROM topics WHERE name = 'Arrays'));
INSERT INTO question_topics (question_id, topic_id) VALUES (3, 2);


-- INSERT INTO test_cases (question_id, index, input, output) VALUES
-- (35, 1, '[1, 2, 3, 4, 5]', 'true'),
-- (35, 2, '[1, 3, 2, 4]', 'false');

-- Question 36: Find First Duplicate
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(36, 'Find First Duplicate', 'easy', 'Write a function that returns the first element that appears more than once in an array. If no duplicates exist, return -1.', '1 <= array.length <= 10^4, 1 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(36, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(36, 1, '[2, 5, 3, 5, 1]', '5'),
(36, 2, '[1, 2, 3, 4]', '-1');

-- Question 37: Remove Target Element
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(37, 'Remove Target Element', 'easy', 'Write a function that removes all occurrences of a target value from an array and returns the new length. Modify the array in-place.', '0 <= array.length <= 10^4, -10^9 <= array[i], target <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(37, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(37, 1, '{"array": [3, 2, 2, 3, 4], "target": 3}', '3'),
(37, 2, '{"array": [1, 1, 1, 1], "target": 1}', '0');

-- Question 38: Find Missing Number
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(38, 'Find Missing Number', 'easy', 'Given an array containing n distinct numbers from 0 to n, find the one number that is missing from the array.', '1 <= n <= 10^4, array.length = n, 0 <= array[i] <= n');

INSERT INTO question_topics (question_id, topic_id) VALUES
(38, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(38, 1, '[3, 0, 1]', '2'),
(38, 2, '[0, 1, 2, 3, 5]', '4');

-- -- Question 39: Merge Two Sorted Arrays
-- INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
-- (39, 'Merge Two Sorted Arrays', 'easy', 'Write a function that merges two sorted arrays into one sorted array.', '0 <= array1.length, array2.length <= 10^4, -10^9 <= array1[i], array2[i] <= 10^9');

-- INSERT INTO question_topics (question_id, topic_id) VALUES
-- (39, (SELECT id FROM topics WHERE name = 'Arrays'));

-- INSERT INTO test_cases (question_id, index, input, output) VALUES
-- (39, 1, '{"array1": [1, 3, 5], "array2": [2, 4, 6]}', '[1, 2, 3, 4, 5, 6]'),
-- (39, 2, '{"array1": [1, 2], "array2": [3, 4]}', '[1, 2, 3, 4]');

-- Question 40: Find Second Largest
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(40, 'Find Second Largest', 'easy', 'Write a function that finds the second largest element in an array. If it doesn''t exist, return -1.', '1 <= array.length <= 10^4, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(40, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(40, 1, '[5, 2, 8, 1, 9]', '8'),
(40, 2, '[7, 7, 7]', '-1');

-- ============================================================================
-- MEDIUM QUESTIONS (41-50)
-- ============================================================================

-- Question 41: Rotate Array K Times
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(41, 'Rotate Array K Times', 'medium', 'Write a function that rotates an array to the right by k steps. Modify the array in-place.', '1 <= array.length <= 10^5, -10^9 <= array[i] <= 10^9, 0 <= k <= 10^5');

INSERT INTO question_topics (question_id, topic_id) VALUES
(41, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(41, 1, '{"array": [1, 2, 3, 4, 5], "k": 2}', '[4, 5, 1, 2, 3]'),
(41, 2, '{"array": [1, 2], "k": 3}', '[2, 1]');

-- Question 42: Find Subarray with Target Sum
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(42, 'Find Subarray with Target Sum', 'medium', 'Write a function that finds a continuous subarray whose sum equals a target value. Return the start and end indices, or [-1, -1] if no such subarray exists.', '1 <= array.length <= 10^5, 1 <= array[i] <= 10^9, 1 <= target <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(42, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(42, 1, '{"array": [1, 2, 3, 4, 5], "target": 9}', '[1, 3]'),
(42, 2, '{"array": [1, 2, 3], "target": 10}', '[-1, -1]');

-- Question 43: Remove Duplicates from Sorted Array
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(43, 'Remove Duplicates from Sorted Array', 'medium', 'Given a sorted array, remove duplicates in-place such that each element appears only once and return the new length. Do not use extra space.', '0 <= array.length <= 10^4, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(43, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(43, 1, '[1, 1, 2, 2, 3]', '3'),
(43, 2, '[0, 0, 0, 0]', '1');

-- Question 44: Find Peak Element
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(44, 'Find Peak Element', 'medium', 'A peak element is an element that is strictly greater than its neighbors. Find and return the index of any peak element. Assume array[-1] and array[n] are negative infinity.', '1 <= array.length <= 10^5, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(44, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(44, 1, '[1, 2, 3, 1]', '2'),
(44, 2, '[1, 2, 1, 3, 5, 6, 4]', '5');

-- Question 45: Product of Array Except Self
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(45, 'Product of Array Except Self', 'medium', 'Write a function that returns an array where each element at index i is the product of all elements in the original array except the one at i. Do not use division.', '2 <= array.length <= 10^5, -30 <= array[i] <= 30');

INSERT INTO question_topics (question_id, topic_id) VALUES
(45, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(45, 1, '[1, 2, 3, 4]', '[24, 12, 8, 6]'),
(45, 2, '[2, 3, 4, 5]', '[60, 40, 30, 24]');

-- Question 46: Find All Pairs with Target Sum
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(46, 'Find All Pairs with Target Sum', 'medium', 'Write a function that finds all unique pairs of elements in an array that sum to a target value. Return the pairs as an array of arrays.', '2 <= array.length <= 10^4, -10^9 <= array[i] <= 10^9, -10^9 <= target <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(46, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(46, 1, '{"array": [2, 7, 11, 15, 3, 6], "target": 9}', '[[2, 7], [3, 6]]'),
(46, 2, '{"array": [1, 1, 1, 1], "target": 2}', '[[1, 1]]');

-- Question 47: Maximum Subarray Length with Sum K
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(47, 'Maximum Subarray Length with Sum K', 'medium', 'Find the length of the longest subarray whose sum equals k. Return 0 if no such subarray exists.', '1 <= array.length <= 10^5, -10^9 <= array[i] <= 10^9, -10^9 <= k <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(47, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(47, 1, '{"array": [1, -1, 5, -2, 3], "k": 3}', '4'),
(47, 2, '{"array": [1, 2, 3], "k": 10}', '0');

-- Question 48: Move Zeros to End
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(48, 'Move Zeros to End', 'medium', 'Write a function that moves all zeros in an array to the end while maintaining the relative order of non-zero elements. Modify the array in-place.', '1 <= array.length <= 10^4, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(48, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(48, 1, '[0, 1, 0, 3, 12]', '[1, 3, 12, 0, 0]'),
(48, 2, '[0, 0, 1]', '[1, 0, 0]');

-- Question 49: Find Majority Element
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(49, 'Find Majority Element', 'medium', 'Find the element that appears more than n/2 times in an array. You may assume such an element always exists.', '1 <= array.length <= 10^5, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(49, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(49, 1, '[3, 2, 3]', '3'),
(49, 2, '[2, 2, 1, 1, 1, 2, 2]', '2');

-- Question 50: Container With Most Water
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(50, 'Container With Most Water', 'medium', 'Given an array of heights, find two lines that together with the x-axis form a container that holds the most water. Return the maximum area.', '2 <= array.length <= 10^5, 0 <= array[i] <= 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES
(50, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(50, 1, '[1, 8, 6, 2, 5, 4, 8, 3, 7]', '49'),
(50, 2, '[1, 1]', '1');

-- ============================================================================
-- HARD QUESTIONS (51-60)
-- ============================================================================

-- Question 51: Minimum Window Subarray Sum
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(51, 'Minimum Window Subarray Sum', 'hard', 'Find the minimal length of a contiguous subarray whose sum is greater than or equal to a target value. Return 0 if no such subarray exists.', '1 <= array.length <= 10^5, 1 <= array[i] <= 10^4, 1 <= target <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(51, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(51, 1, '{"array": [2, 3, 1, 2, 4, 3], "target": 7}', '2'),
(51, 2, '{"array": [1, 1, 1, 1], "target": 10}', '0');

-- Question 52: Longest Increasing Subsequence Length
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(52, 'Longest Increasing Subsequence Length', 'hard', 'Find the length of the longest strictly increasing subsequence in an array. A subsequence maintains relative order but elements need not be contiguous.', '1 <= array.length <= 2500, -10^4 <= array[i] <= 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES
(52, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(52, 1, '[10, 9, 2, 5, 3, 7, 101, 18]', '4'),
(52, 2, '[7, 7, 7, 7]', '1');

-- Question 53: Median of Two Sorted Arrays
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(53, 'Median of Two Sorted Arrays', 'hard', 'Find the median of two sorted arrays. The overall run time complexity should be O(log(m+n)).', '0 <= array1.length, array2.length <= 1000, 1 <= array1.length + array2.length <= 2000, -10^6 <= array1[i], array2[i] <= 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES
(53, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(53, 1, '{"array1": [1, 3], "array2": [2]}', '2.0'),
(53, 2, '{"array1": [1, 2], "array2": [3, 4]}', '2.5');

-- Question 54: Trapping Rain Water
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(54, 'Trapping Rain Water', 'hard', 'Given an array representing elevation heights, compute how much water can be trapped after raining.', '1 <= array.length <= 2 * 10^4, 0 <= array[i] <= 10^5');

INSERT INTO question_topics (question_id, topic_id) VALUES
(54, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(54, 1, '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', '6'),
(54, 2, '[4, 2, 0, 3, 2, 5]', '9');

-- Question 55: Maximum Sum of Three Subarrays
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(55, 'Maximum Sum of Three Subarrays', 'hard', 'Find three non-overlapping subarrays of length k with maximum sum. Return the starting indices of these subarrays.', '1 <= array.length <= 2 * 10^4, 1 <= k <= array.length / 3, 1 <= array[i] <= 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES
(55, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(55, 1, '{"array": [1, 2, 1, 2, 6, 7, 5, 1], "k": 2}', '[0, 3, 5]'),
(55, 2, '{"array": [1, 2, 1, 2, 1, 2, 1, 2, 1], "k": 2}', '[0, 2, 4]');

-- Question 56: First Missing Positive Integer
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(56, 'First Missing Positive Integer', 'hard', 'Find the smallest missing positive integer in an unsorted array. Your algorithm should run in O(n) time and use O(1) extra space.', '1 <= array.length <= 10^5, -2^31 <= array[i] <= 2^31 - 1');

INSERT INTO question_topics (question_id, topic_id) VALUES
(56, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(56, 1, '[1, 2, 0]', '3'),
(56, 2, '[3, 4, -1, 1]', '2');

-- Question 57: Maximum Rectangle in Histogram
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(57, 'Maximum Rectangle in Histogram', 'hard', 'Given an array of heights representing a histogram, find the area of the largest rectangle that can be formed.', '1 <= array.length <= 10^5, 0 <= array[i] <= 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES
(57, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(57, 1, '[2, 1, 5, 6, 2, 3]', '10'),
(57, 2, '[2, 4]', '4');

-- Question 58: Count Inversions in Array
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(58, 'Count Inversions in Array', 'hard', 'Count the number of inversions in an array. An inversion is a pair (i, j) where i < j and array[i] > array[j].', '1 <= array.length <= 5 * 10^4, -10^9 <= array[i] <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(58, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(58, 1, '[2, 4, 1, 3, 5]', '3'),
(58, 2, '[5, 4, 3, 2, 1]', '10');

-- Question 59: Sliding Window Maximum
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(59, 'Sliding Window Maximum', 'hard', 'Given an array and a window size k, return an array of the maximum values in each sliding window of size k.', '1 <= array.length <= 10^5, -10^4 <= array[i] <= 10^4, 1 <= k <= array.length');

INSERT INTO question_topics (question_id, topic_id) VALUES
(59, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(59, 1, '{"array": [1, 3, -1, -3, 5, 3, 6, 7], "k": 3}', '[3, 3, 5, 5, 6, 7]'),
(59, 2, '{"array": [1, -1], "k": 1}', '[1, -1]');

-- Question 60: Maximum Subarray Sum with One Deletion
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(60, 'Maximum Subarray Sum with One Deletion', 'hard', 'Find the maximum sum of a non-empty subarray where you are allowed to delete at most one element from it.', '1 <= array.length <= 10^5, -10^4 <= array[i] <= 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES
(60, (SELECT id FROM topics WHERE name = 'Arrays'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(60, 1, '[1, -2, 0, 3]', '4'),
(60, 2, '[1, -2, -2, 3]', '3');



-------------------------------------


-- First, ensure the Dynamic Programming topic exists
INSERT INTO topics (name) VALUES ('Dynamic Programming') ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- EASY QUESTIONS (61-70)
-- =============================================================================

-- Question 61: Paint Fence
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(61, 'Paint Fence', 'easy', 'You have a fence with n posts. Each post must be painted with one of k colors. You cannot paint more than 2 adjacent posts with the same color. Return the number of ways to paint the fence.', '1 ≤ n ≤ 50, 1 ≤ k ≤ 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(61, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(61, 1, '{"n": 3, "k": 2}', '6'),
(61, 2, '{"n": 4, "k": 3}', '66');

-- Question 62: Maximum Sum Non-Adjacent Elements
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(62, 'Maximum Sum Non-Adjacent Elements', 'easy', 'Given an array of positive integers, find the maximum sum of elements such that no two selected elements are adjacent in the array.', '1 ≤ array length ≤ 1000, 1 ≤ array[i] ≤ 10000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(62, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(62, 1, '{"arr": [3, 2, 7, 10]}', '13'),
(62, 2, '{"arr": [5, 1, 3, 5, 7, 2]}', '15');

-- Question 63: Count Ways to Climb Stairs with Variable Steps
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(63, 'Count Ways to Climb Stairs with Variable Steps', 'easy', 'You are climbing a staircase with n steps. You can take 1, 2, or 3 steps at a time. Return the number of distinct ways to reach the top.', '1 ≤ n ≤ 30');

INSERT INTO question_topics (question_id, topic_id) VALUES
(63, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(63, 1, '{"n": 4}', '7'),
(63, 2, '{"n": 5}', '13');

-- Question 64: Minimum Cost to Paint Houses
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(64, 'Minimum Cost to Paint Houses', 'easy', 'There are n houses in a row. Each house can be painted red, blue, or green. The cost of painting each house with a certain color is different. No two adjacent houses can have the same color. Find the minimum cost to paint all houses.', '1 ≤ n ≤ 100, 1 ≤ cost[i][j] ≤ 1000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(64, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(64, 1, '{"costs": [[17, 2, 17], [16, 16, 5], [14, 3, 19]]}', '10'),
(64, 2, '{"costs": [[7, 6, 2], [8, 4, 3]]}', '5');

-- Question 65: Count Binary Strings Without Consecutive Ones
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(65, 'Count Binary Strings Without Consecutive Ones', 'easy', 'Given a positive integer n, count all possible binary strings of length n that do not have consecutive 1s.', '1 ≤ n ≤ 40');

INSERT INTO question_topics (question_id, topic_id) VALUES
(65, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(65, 1, '{"n": 3}', '5'),
(65, 2, '{"n": 4}', '8');

-- Question 66: Minimum Coins to Make Sum
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(66, 'Minimum Coins to Make Sum', 'easy', 'Given an array of coin denominations and a target sum, find the minimum number of coins needed to make that sum. Return -1 if it is not possible.', '1 ≤ coins.length ≤ 12, 1 ≤ coins[i] ≤ 100, 1 ≤ sum ≤ 1000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(66, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(66, 1, '{"coins": [1, 2, 5], "sum": 11}', '3'),
(66, 2, '{"coins": [3, 7], "sum": 10}', '-1');

-- Question 67: Maximum Profit Selling Fruits
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(67, 'Maximum Profit Selling Fruits', 'easy', 'You have n days to sell fruits. Each day you can pick one fruit basket worth price[i] or skip the day. After picking, you must skip the next day. Find the maximum profit you can earn.', '1 ≤ n ≤ 500, 0 ≤ price[i] ≤ 1000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(67, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(67, 1, '{"prices": [5, 1, 3, 6]}', '11'),
(67, 2, '{"prices": [2, 4, 1, 7, 3]}', '11');

-- Question 68: Reach Target with Addition and Subtraction
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(68, 'Reach Target with Addition and Subtraction', 'easy', 'You start at position 0 on a number line. You can move forward or backward by 1, 2, or 3 units. Find the minimum number of moves to reach position n.', '1 ≤ n ≤ 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(68, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(68, 1, '{"n": 7}', '3'),
(68, 2, '{"n": 10}', '4');

-- Question 69: Count Decodings
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(69, 'Count Decodings', 'easy', 'A message containing letters A-Z is encoded to numbers using A=1, B=2, ..., Z=26. Given a string of digits, count the number of ways to decode it.', '1 ≤ s.length ≤ 100, s contains only digits');

INSERT INTO question_topics (question_id, topic_id) VALUES
(69, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(69, 1, '{"s": "12"}', '2'),
(69, 2, '{"s": "226"}', '3');

-- Question 70: Minimum Path Sum in Triangle
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(70, 'Minimum Path Sum in Triangle', 'easy', 'Given a triangle array, return the minimum path sum from top to bottom. For each step, you can move to an adjacent number on the row below.', '1 ≤ triangle.length ≤ 200, triangle[i].length == i + 1');

INSERT INTO question_topics (question_id, topic_id) VALUES
(70, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(70, 1, '{"triangle": [[2], [3, 4], [6, 5, 7]]}', '10'),
(70, 2, '{"triangle": [[-10]]}', '-10');

-- =============================================================================
-- MEDIUM QUESTIONS (71-80)
-- =============================================================================

-- Question 71: Longest Palindromic Subsequence Length
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(71, 'Longest Palindromic Subsequence Length', 'medium', 'Given a string s, find the length of the longest palindromic subsequence in it. A subsequence is a sequence that can be derived by deleting some or no elements without changing the order.', '1 ≤ s.length ≤ 1000, s consists only of lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(71, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(71, 1, '{"s": "bbbab"}', '4'),
(71, 2, '{"s": "cbbd"}', '2');

-- Question 72: Count Distinct Subsequences
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(72, 'Count Distinct Subsequences', 'medium', 'Given two strings s and t, return the number of distinct subsequences of s which equals t. A subsequence of a string is formed by deleting some characters without disturbing the relative positions.', '1 ≤ s.length, t.length ≤ 1000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(72, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(72, 1, '{"s": "rabbbit", "t": "rabbit"}', '3'),
(72, 2, '{"s": "babgbag", "t": "bag"}', '5');

-- Question 73: Optimal Game Strategy
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(73, 'Optimal Game Strategy', 'medium', 'Given an array of coin values, two players take turns picking a coin from either end. Each player plays optimally to maximize their total. Return the maximum value the first player can collect.', '1 ≤ coins.length ≤ 100, 1 ≤ coins[i] ≤ 1000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(73, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(73, 1, '{"coins": [5, 3, 7, 10]}', '15'),
(73, 2, '{"coins": [8, 15, 3, 7]}', '22');

-- Question 74: Minimum Deletions to Make String Palindrome
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(74, 'Minimum Deletions to Make String Palindrome', 'medium', 'Given a string, find the minimum number of deletions required to make the string a palindrome.', '1 ≤ s.length ≤ 1000, s consists only of lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(74, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(74, 1, '{"s": "aebcbda"}', '2'),
(74, 2, '{"s": "geeksforgeeks"}', '8');

-- Question 75: Rod Cutting Maximum Profit
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(75, 'Rod Cutting Maximum Profit', 'medium', 'Given a rod of length n and an array of prices where prices[i] represents the price of a rod of length i+1, find the maximum profit obtainable by cutting the rod and selling the pieces.', '1 ≤ n ≤ 100, 1 ≤ prices[i] ≤ 10000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(75, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(75, 1, '{"n": 8, "prices": [1, 5, 8, 9, 10, 17, 17, 20]}', '22'),
(75, 2, '{"n": 4, "prices": [3, 5, 8, 9]}', '10');

-- Question 76: Count Paths in Matrix with Obstacles
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(76, 'Count Paths in Matrix with Obstacles', 'medium', 'Given an m x n grid where 1 represents an obstacle and 0 represents an empty cell, count the number of paths from top-left to bottom-right. You can only move right or down.', '1 ≤ m, n ≤ 100, grid[i][j] is 0 or 1');

INSERT INTO question_topics (question_id, topic_id) VALUES
(76, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(76, 1, '{"grid": [[0, 0, 0], [0, 1, 0], [0, 0, 0]]}', '2'),
(76, 2, '{"grid": [[0, 1], [0, 0]]}', '1');

-- Question 77: Longest Common Subsequence of Three Strings
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(77, 'Longest Common Subsequence of Three Strings', 'medium', 'Given three strings, find the length of the longest common subsequence present in all three strings.', '1 ≤ s1.length, s2.length, s3.length ≤ 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(77, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(77, 1, '{"s1": "abcd", "s2": "abec", "s3": "agbc"}', '2'),
(77, 2, '{"s1": "geeks", "s2": "geeksfor", "s3": "geeksforgeeks"}', '5');

-- Question 78: Maximum Product Subarray
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(78, 'Maximum Product Subarray', 'medium', 'Given an integer array, find the contiguous subarray within the array which has the largest product. Return the product value.', '1 ≤ nums.length ≤ 2 * 10^4, -10 ≤ nums[i] ≤ 10');

INSERT INTO question_topics (question_id, topic_id) VALUES
(78, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(78, 1, '{"nums": [2, 3, -2, 4]}', '6'),
(78, 2, '{"nums": [-2, 0, -1]}', '0');

-- Question 79: Partition Array for Maximum Sum
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(79, 'Partition Array for Maximum Sum', 'medium', 'Given an array, partition it into contiguous subarrays of length at most k. After partitioning, each element becomes the maximum of its subarray. Return the largest sum possible.', '1 ≤ arr.length ≤ 500, 1 ≤ k ≤ arr.length, 1 ≤ arr[i] ≤ 10^5');

INSERT INTO question_topics (question_id, topic_id) VALUES
(79, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(79, 1, '{"arr": [1, 15, 7, 9, 2, 5, 10], "k": 3}', '84'),
(79, 2, '{"arr": [1, 4, 1, 5, 7, 3, 6, 1, 9, 9, 3], "k": 4}', '83');

-- Question 80: Count Square Submatrices with All Ones
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(80, 'Count Square Submatrices with All Ones', 'medium', 'Given an m x n binary matrix filled with 0s and 1s, count the number of square submatrices that have all 1s.', '1 ≤ m, n ≤ 300, matrix[i][j] is 0 or 1');

INSERT INTO question_topics (question_id, topic_id) VALUES
(80, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(80, 1, '{"matrix": [[0, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]]}', '15'),
(80, 2, '{"matrix": [[1, 0, 1], [1, 1, 0], [1, 1, 0]]}', '7');

-- =============================================================================
-- HARD QUESTIONS (81-90)
-- =============================================================================

-- Question 81: Burst Balloons Maximum Coins
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(81, 'Burst Balloons Maximum Coins', 'hard', 'You have n balloons indexed 0 to n-1, each with a number on it. You burst balloons to collect coins. When you burst balloon i, you get nums[i-1] * nums[i] * nums[i+1] coins. Return the maximum coins you can collect by bursting all balloons.', '1 ≤ nums.length ≤ 300, 0 ≤ nums[i] ≤ 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(81, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(81, 1, '{"nums": [3, 1, 5, 8]}', '167'),
(81, 2, '{"nums": [1, 5]}', '10');

-- Question 82: Edit Distance with Custom Costs
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(82, 'Edit Distance with Custom Costs', 'hard', 'Given two strings and costs for insert (costInsert), delete (costDelete), and replace (costReplace) operations, find the minimum cost to convert string s1 to s2.', '1 ≤ s1.length, s2.length ≤ 500, 1 ≤ costInsert, costDelete, costReplace ≤ 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(82, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(82, 1, '{"s1": "horse", "s2": "ros", "costInsert": 2, "costDelete": 3, "costReplace": 5}', '12'),
(82, 2, '{"s1": "intention", "s2": "execution", "costInsert": 1, "costDelete": 1, "costReplace": 1}', '5');

-- Question 83: Minimum Cost to Merge Stones
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(83, 'Minimum Cost to Merge Stones', 'hard', 'There are n piles of stones in a row. In each move, you can merge exactly k consecutive piles into one pile, and the cost is the sum of stones in these piles. Return the minimum cost to merge all piles into one, or -1 if impossible.', '1 ≤ stones.length ≤ 30, 2 ≤ k ≤ 30, 1 ≤ stones[i] ≤ 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(83, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(83, 1, '{"stones": [3, 2, 4, 1], "k": 2}', '20'),
(83, 2, '{"stones": [3, 5, 1, 2, 6], "k": 3}', '25');

-- Question 84: Wildcard Pattern Matching with Multiple Wildcards
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(84, 'Wildcard Pattern Matching with Multiple Wildcards', 'hard', 'Given a string s and a pattern p where ? matches any single character and * matches any sequence of characters (including empty), determine if the pattern matches the entire string.', '0 ≤ s.length ≤ 2000, 0 ≤ p.length ≤ 2000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(84, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(84, 1, '{"s": "adceb", "p": "*a*b"}', 'true'),
(84, 2, '{"s": "acdcb", "p": "a*c?b"}', 'false');

-- Question 85: Maximum Profit in Job Scheduling
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(85, 'Maximum Profit in Job Scheduling', 'hard', 'Given n jobs where each job has a start time, end time, and profit value, find the maximum profit you can achieve if you cannot do overlapping jobs.', '1 ≤ n ≤ 5 * 10^4, 1 ≤ startTime[i] < endTime[i] ≤ 10^9, 1 ≤ profit[i] ≤ 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES
(85, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(85, 1, '{"startTime": [1, 2, 3, 3], "endTime": [3, 4, 5, 6], "profit": [50, 10, 40, 70]}', '120'),
(85, 2, '{"startTime": [1, 2, 3, 4, 6], "endTime": [3, 5, 10, 6, 9], "profit": [20, 20, 100, 70, 60]}', '150');

-- Question 86: Count Palindromic Substrings with question_Constraints
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(86, 'Count Palindromic Substrings with question_Constraints', 'hard', 'Given a string s and an integer k, count the number of palindromic substrings of length at least k. A substring is palindromic if it reads the same forward and backward.', '1 ≤ s.length ≤ 1000, 1 ≤ k ≤ s.length');

INSERT INTO question_topics (question_id, topic_id) VALUES
(86, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(86, 1, '{"s": "aabba", "k": 2}', '7'),
(86, 2, '{"s": "abcba", "k": 3}', '3');

-- Question 87: Minimum Window Subsequence
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(87, 'Minimum Window Subsequence', 'hard', 'Given strings s and t, find the minimum contiguous substring window in s that contains all characters of t as a subsequence. Return the minimum window, or empty string if none exists.', '1 ≤ s.length ≤ 2 * 10^4, 1 ≤ t.length ≤ 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(87, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(87, 1, '{"s": "abcdebdde", "t": "bde"}', '"bcde"'),
(87, 2, '{"s": "fgrqsqsnodwmxzkzxwqegkndaa", "t": "kzed"}', '"kzxwqegknd"');

-- Question 88: Distinct Ways to Climb Stairs with Obstacles
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(88, 'Distinct Ways to Climb Stairs with Obstacles', 'hard', 'You are climbing n stairs. You can take 1, 2, or 3 steps at a time. Some stairs are broken (obstacles). Given an array of broken stair positions, return the number of ways to reach the top.', '1 ≤ n ≤ 10^5, 0 ≤ obstacles.length ≤ n');

INSERT INTO question_topics (question_id, topic_id) VALUES
(88, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(88, 1, '{"n": 7, "obstacles": [3, 5]}', '10'),
(88, 2, '{"n": 10, "obstacles": [2, 4, 7]}', '29');

-- Question 89: Maximum Score from Performing Multiplication Operations
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(89, 'Maximum Score from Performing Multiplication Operations', 'hard', 'Given two integer arrays nums and multipliers, you perform m operations. In each operation, pick an element from either end of nums and multiply it with multipliers[i]. Return the maximum score possible.', '1 ≤ m ≤ 1000, m ≤ nums.length ≤ 10^5, -1000 ≤ nums[i], multipliers[i] ≤ 1000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(89, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(89, 1, '{"nums": [1, 2, 3], "multipliers": [3, 2, 1]}', '14'),
(89, 2, '{"nums": [-5, -3, -3, -2, 7, 1], "multipliers": [-10, -5, 3, 4, 6]}', '102');

-- Question 90: Minimum Insertions to Form Palindrome
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(90, 'Minimum Insertions to Form Palindrome', 'hard', 'Given a string s, you can insert any character at any position. Find the minimum number of insertions needed to make the string a palindrome.', '1 ≤ s.length ≤ 1000, s consists of lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(90, (SELECT id FROM topics WHERE name = 'Dynamic Programming'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(90, 1, '{"s": "abc"}', '2'),
(90, 2, '{"s": "racecar"}', '0');


--------------------


-- First, insert the hash table topic if it doesn't exist
INSERT INTO topics (name) VALUES ('Hash Table') ON CONFLICT (name) DO NOTHING;

-- EASY QUESTIONS (91-100)

-- Question 91: Character Frequency Counter
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(91, 'Character Frequency Counter', 'easy', 'Write a function that takes a string and returns a hash table (dictionary/map) containing the frequency of each character in the string. Ignore case sensitivity.', '1 <= string length <= 1000
String contains only alphabetic characters and spaces');

INSERT INTO question_topics (question_id, topic_id) VALUES
(91, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(91, 1, '{"s": "hello"}', '{"h": 1, "e": 1, "l": 2, "o": 1}'),
(91, 2, '{"s": "Programming"}', '{"p": 1, "r": 2, "o": 1, "g": 2, "a": 1, "m": 2, "i": 1, "n": 1}');

-- Question 92: First Unique Character
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(92, 'First Unique Character', 'easy', 'Given a string, find the first non-repeating character and return its index. If it doesn''t exist, return -1. Use a hash table to track character frequencies.', '1 <= string length <= 10^5
String contains only lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(92, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(92, 1, '{"s": "leetcode"}', '0'),
(92, 2, '{"s": "aabbcc"}', '-1');

-- Question 93: Check Anagram
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(93, 'Check Anagram', 'easy', 'Determine if two strings are anagrams of each other using a hash table. Two strings are anagrams if they contain the same characters with the same frequencies.', '1 <= string length <= 5000
Strings contain only lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(93, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(93, 1, '{"s1": "listen", "s2": "silent"}', 'true'),
(93, 2, '{"s1": "hello", "s2": "world"}', 'false');

-- Question 94: Sum Pair Exists
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(94, 'Sum Pair Exists', 'easy', 'Given an array of integers and a target sum, determine if there exist two distinct elements in the array that sum to the target. Use a hash table for O(n) time complexity.', '2 <= array length <= 10^4
-10^9 <= array elements <= 10^9
-10^9 <= target <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(94, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(94, 1, '{"arr": [2, 7, 11, 15], "target": 9}', 'true'),
(94, 2, '{"arr": [1, 2, 3, 4], "target": 10}', 'false');

-- Question 95: Remove Duplicates from Array
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(95, 'Remove Duplicates from Array', 'easy', 'Given an array of integers, return a new array with all duplicate elements removed, preserving the original order. Use a hash table to track seen elements.', '1 <= array length <= 10^4
-10^6 <= array elements <= 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES
(95, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(95, 1, '{"arr": [1, 2, 2, 3, 4, 4, 5]}', '[1, 2, 3, 4, 5]'),
(95, 2, '{"arr": [5, 5, 5, 5]}', '[5]');

-- Question 96: Word Pattern Match
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(96, 'Word Pattern Match', 'easy', 'Given a pattern and a string of words, determine if the words follow the same pattern. Each letter in the pattern must map to exactly one unique word.', '1 <= pattern length <= 300
1 <= number of words <= 300
Pattern contains only lowercase letters
Words contain only lowercase letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(96, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(96, 1, '{"pattern": "abba", "words": "dog cat cat dog"}', 'true'),
(96, 2, '{"pattern": "abba", "words": "dog cat cat fish"}', 'false');

-- Question 97: Intersection of Two Arrays
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(97, 'Intersection of Two Arrays', 'easy', 'Given two arrays, return their intersection (elements that appear in both arrays). Each element in the result should appear only once. Use a hash table for efficient lookup.', '1 <= array length <= 1000
0 <= array elements <= 1000');

INSERT INTO question_topics (question_id, topic_id) VALUES
(97, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(97, 1, '{"arr1": [1, 2, 2, 3], "arr2": [2, 2, 3, 4]}', '[2, 3]'),
(97, 2, '{"arr1": [4, 9, 5], "arr2": [9, 4, 9, 8, 4]}', '[4, 9]');

-- Question 98: Group Numbers by Frequency
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(98, 'Group Numbers by Frequency', 'easy', 'Given an array of integers, return a hash table where keys are the frequencies and values are arrays of numbers that appear that many times.', '1 <= array length <= 1000
-100 <= array elements <= 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(98, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(98, 1, '{"arr": [1, 2, 2, 3, 3, 3]}', '{"1": [1], "2": [2], "3": [3]}'),
(98, 2, '{"arr": [5, 5, 6, 6, 7]}', '{"2": [5, 6], "1": [7]}');

-- Question 99: Count Distinct Elements in Window
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(99, 'Count Distinct Elements in Window', 'easy', 'Given an array and a window size k, return an array containing the count of distinct elements in each window of size k. Use a hash table to track elements in the current window.', '1 <= array length <= 10^5
1 <= k <= array length
0 <= array elements <= 10^6');

INSERT INTO question_topics (question_id, topic_id) VALUES
(99, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(99, 1, '{"arr": [1, 2, 1, 3, 4, 2, 3], "k": 3}', '[2, 3, 3, 3, 3]'),
(99, 2, '{"arr": [1, 1, 1, 1], "k": 2}', '[1, 1, 1]');

-- Question 100: Check Subset
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(100, 'Check Subset', 'easy', 'Given two arrays, determine if the second array is a subset of the first array (all elements of the second array exist in the first array). Use a hash table for efficient checking.', '1 <= array length <= 10^5
-10^9 <= array elements <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(100, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(100, 1, '{"arr1": [1, 2, 3, 4, 5], "arr2": [2, 4]}', 'true'),
(100, 2, '{"arr1": [1, 2, 3], "arr2": [4, 5]}', 'false');

-- MEDIUM QUESTIONS (101-110)

-- Question 101: Group Anagrams
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(101, 'Group Anagrams', 'medium', 'Given an array of strings, group the anagrams together. Return a list of groups where each group contains strings that are anagrams of each other. Use a hash table with sorted strings as keys.', '1 <= array length <= 10^4
1 <= string length <= 100
Strings contain only lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(101, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(101, 1, '{"strs": ["eat", "tea", "tan", "ate", "nat", "bat"]}', '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]'),
(101, 2, '{"strs": ["a", "b", "a"]}', '[["a", "a"], ["b"]]');

-- Question 102: Longest Consecutive Sequence
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(102, 'Longest Consecutive Sequence', 'medium', 'Given an unsorted array of integers, find the length of the longest consecutive elements sequence. Your algorithm should run in O(n) time using a hash table.', '0 <= array length <= 10^5
-10^9 <= array elements <= 10^9');

INSERT INTO question_topics (question_id, topic_id) VALUES
(102, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(102, 1, '{"arr": [100, 4, 200, 1, 3, 2]}', '4'),
(102, 2, '{"arr": [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]}', '9');

-- Question 103: Subarray Sum Equals K
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(103, 'Subarray Sum Equals K', 'medium', 'Given an array of integers and an integer k, find the total number of continuous subarrays whose sum equals k. Use a hash table to store cumulative sums for O(n) time complexity.', '1 <= array length <= 2 * 10^4
-1000 <= array elements <= 1000
-10^7 <= k <= 10^7');

INSERT INTO question_topics (question_id, topic_id) VALUES
(103, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(103, 1, '{"arr": [1, 1, 1], "k": 2}', '2'),
(103, 2, '{"arr": [1, 2, 3, -3, 1, 1, 1], "k": 3}', '5');

-- Question 104: Top K Frequent Elements
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(104, 'Top K Frequent Elements', 'medium', 'Given an array of integers, return the k most frequent elements. Use a hash table to count frequencies and return elements in any order.', '1 <= array length <= 10^5
1 <= k <= number of distinct elements
-10^4 <= array elements <= 10^4');

INSERT INTO question_topics (question_id, topic_id) VALUES
(104, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(104, 1, '{"arr": [1, 1, 1, 2, 2, 3], "k": 2}', '[1, 2]'),
(104, 2, '{"arr": [4, 4, 4, 5, 5, 6], "k": 1}', '[4]');

-- Question 105: Four Sum Count
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(105, 'Four Sum Count', 'medium', 'Given four arrays A, B, C, D of equal length, compute how many tuples (i, j, k, l) exist such that A[i] + B[j] + C[k] + D[l] = 0. Use hash tables to achieve O(n^2) time complexity.', '1 <= array length <= 200
-2^28 <= array elements <= 2^28');

INSERT INTO question_topics (question_id, topic_id) VALUES
(105, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(105, 1, '{"A": [1, 2], "B": [-2, -1], "C": [-1, 2], "D": [0, 2]}', '2'),
(105, 2, '{"A": [0], "B": [0], "C": [0], "D": [0]}', '1');

-- Question 106: Clone Graph with Hash Table
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(106, 'Clone Graph with Hash Table', 'medium', 'Given a reference to a node in a connected undirected graph, return a deep copy of the graph. Use a hash table to map original nodes to their clones to handle cycles.', '1 <= number of nodes <= 100
Each node value is unique
0 <= node.val <= 99
Graph is connected');

INSERT INTO question_topics (question_id, topic_id) VALUES
(106, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(106, 1, '{"adjList": [[2, 4], [1, 3], [2, 4], [1, 3]]}', '[[2, 4], [1, 3], [2, 4], [1, 3]]'),
(106, 2, '{"adjList": [[2], [1]]}', '[[2], [1]]');

-- Question 107: Design Hash Map with Chaining
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(107, 'Design Hash Map with Chaining', 'medium', 'Design a HashMap without using any built-in hash table libraries. Implement put(key, value), get(key), and remove(key) methods. Use an array with linked list chaining for collision resolution.', '0 <= key, value <= 10^6
At most 10^4 calls will be made to put, get, and remove');

INSERT INTO question_topics (question_id, topic_id) VALUES
(107, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(107, 1, '{"operations": ["put", "get", "remove", "get"], "params": [[1, 1], [1], [1], [1]]}', '[null, 1, null, -1]'),
(107, 2, '{"operations": ["put", "put", "get"], "params": [[1, 2], [2, 3], [1]]}', '[null, null, 2]');

-- Question 108: Minimum Window Substring Frequency
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(108, 'Minimum Window Substring Frequency', 'medium', 'Given two strings s and t, find the minimum window in s that contains all characters of t with their required frequencies. Use hash tables to track character counts.', '1 <= s.length, t.length <= 10^5
s and t consist of uppercase and lowercase English letters
Answer is guaranteed to be unique');

INSERT INTO question_topics (question_id, topic_id) VALUES
(108, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(108, 1, '{"s": "ADOBECODEBANC", "t": "ABC"}', '"BANC"'),
(108, 2, '{"s": "a", "t": "aa"}', '""');

-- Question 109: Find Duplicate Subtrees
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(109, 'Find Duplicate Subtrees', 'medium', 'Given the root of a binary tree, return all duplicate subtrees. Use a hash table to store serialized subtree structures and count their occurrences.', '1 <= number of nodes <= 5000
-200 <= node.val <= 200');

INSERT INTO question_topics (question_id, topic_id) VALUES
(109, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(109, 1, '{"tree": [1, 2, 3, 4, null, 2, 4, null, null, 4]}', '[[2, 4], [4]]'),
(109, 2, '{"tree": [2, 1, 1]}', '[[1]]');

-- Question 110: Brick Wall Least Cuts
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(110, 'Brick Wall Least Cuts', 'medium', 'A wall consists of rows of bricks of various widths. Find a vertical line that cuts through the fewest bricks. Use a hash table to count edge positions across all rows.', '1 <= wall.length <= 10^4
1 <= wall[i].length <= 10^4
1 <= wall[i][j] <= 2^31 - 1
Sum of each row width is the same');

INSERT INTO question_topics (question_id, topic_id) VALUES
(110, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(110, 1, '{"wall": [[1, 2, 2, 1], [3, 1, 2], [1, 3, 2], [2, 4], [3, 1, 2], [1, 3, 1, 1]]}', '2'),
(110, 2, '{"wall": [[1], [1], [1]]}', '3');

-- HARD QUESTIONS (111-120)

-- Question 111: LRU Cache Implementation
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(111, 'LRU Cache Implementation', 'hard', 'Design a data structure that implements a Least Recently Used (LRU) cache with O(1) time complexity for both get and put operations. Use a hash table combined with a doubly linked list.', '1 <= capacity <= 3000
0 <= key <= 10^4
0 <= value <= 10^5
At most 2 * 10^5 calls to get and put');

INSERT INTO question_topics (question_id, topic_id) VALUES
(111, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(111, 1, '{"capacity": 2, "operations": ["put", "put", "get", "put", "get", "get"], "params": [[1, 1], [2, 2], [1], [3, 3], [2], [3]]}', '[null, null, 1, null, -1, 3]'),
(111, 2, '{"capacity": 1, "operations": ["put", "get", "put", "get"], "params": [[1, 1], [1], [2, 2], [1]]}', '[null, 1, null, -1]');

-- Question 112: Alien Dictionary Order
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(112, 'Alien Dictionary Order', 'hard', 'Given a sorted dictionary of an alien language, derive the order of characters in this language. Use hash tables to build a graph of character dependencies and perform topological sort.', '1 <= words.length <= 100
1 <= words[i].length <= 20
words[i] consists of only lowercase English letters
words are sorted lexicographically');

INSERT INTO question_topics (question_id, topic_id) VALUES
(112, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(112, 1, '{"words": ["wrt", "wrf", "er", "ett", "rftt"]}', '"wertf"'),
(112, 2, '{"words": ["z", "x"]}', '"zx"');

-- Question 113: Longest Substring with K Distinct Characters
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(113, 'Longest Substring with K Distinct Characters', 'hard', 'Find the length of the longest substring that contains at most k distinct characters. Use a hash table with a sliding window approach to track character frequencies.', '1 <= s.length <= 5 * 10^4
0 <= k <= 50
s consists of English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(113, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(113, 1, '{"s": "eceba", "k": 2}', '3'),
(113, 2, '{"s": "aa", "k": 1}', '2');

-- Question 114: All Anagrams in String
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(114, 'All Anagrams in String', 'hard', 'Given strings s and p, find all start indices of p''s anagrams in s. Use hash tables with a sliding window to achieve O(n) time complexity.', '1 <= s.length, p.length <= 3 * 10^4
s and p consist of lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(114, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(114, 1, '{"s": "cbaebabacd", "p": "abc"}', '[0, 6]'),
(114, 2, '{"s": "abab", "p": "ab"}', '[0, 1, 2]');

-- Question 115: Substring Concatenation of All Words
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(115, 'Substring Concatenation of All Words', 'hard', 'Given a string s and an array of words, find all starting indices where a substring is a concatenation of each word exactly once. Use hash tables to track word frequencies and matches.', '1 <= s.length <= 10^4
1 <= words.length <= 5000
1 <= words[i].length <= 30
s and words[i] consist of lowercase English letters
All words[i] have the same length');

INSERT INTO question_topics (question_id, topic_id) VALUES
(115, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(115, 1, '{"s": "barfoothefoobarman", "words": ["foo", "bar"]}', '[0, 9]'),
(115, 2, '{"s": "wordgoodgoodgoodbestword", "words": ["word", "good", "best", "good"]}', '[8]');

-- Question 116: Max Points on a Line
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(116, 'Max Points on a Line', 'hard', 'Given n points on a 2D plane, find the maximum number of points that lie on the same straight line. Use a hash table to group points by slope for each point.', '1 <= points.length <= 300
points[i].length == 2
-10^4 <= xi, yi <= 10^4
All points are unique');

INSERT INTO question_topics (question_id, topic_id) VALUES
(116, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(116, 1, '{"points": [[1, 1], [2, 2], [3, 3]]}', '3'),
(116, 2, '{"points": [[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]}', '4');

-- Question 117: Optimal Account Balancing
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(117, 'Optimal Account Balancing', 'hard', 'Given transactions between people, find the minimum number of transactions required to settle all debts. Use hash tables to track net balances and backtracking to find optimal settlement.', '1 <= transactions.length <= 8
transactions[i].length == 3
0 <= from, to < 12
from != to
1 <= amount <= 100');

INSERT INTO question_topics (question_id, topic_id) VALUES
(117, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(117, 1, '{"transactions": [[0, 1, 10], [2, 0, 5]]}', '2'),
(117, 2, '{"transactions": [[0, 1, 10], [1, 0, 1], [1, 2, 5], [2, 0, 5]]}', '1');

-- Question 118: Employee Free Time
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(118, 'Employee Free Time', 'hard', 'Given a list of employee schedules representing working intervals, find all common free time intervals for all employees. Use hash tables to merge and track intervals efficiently.', '1 <= schedule.length <= 50
1 <= schedule[i].length <= 50
0 <= schedule[i][j].start < schedule[i][j].end <= 10^8
Intervals are sorted in each schedule');

INSERT INTO question_topics (question_id, topic_id) VALUES
(118, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(118, 1, '{"schedule": [[[1, 2], [5, 6]], [[1, 3]], [[4, 10]]]}', '[[3, 4]]'),
(118, 2, '{"schedule": [[[1, 3], [6, 7]], [[2, 4]], [[2, 5], [9, 12]]]}', '[[5, 6], [7, 9]]');

-- Question 119: Number of Matching Subsequences
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(119, 'Number of Matching Subsequences', 'hard', 'Given a string s and an array of words, return the number of words that are subsequences of s. Use hash tables to preprocess character positions in s for efficient matching.', '1 <= s.length <= 5 * 10^4
1 <= words.length <= 5000
1 <= words[i].length <= 50
s and words[i] consist of only lowercase English letters');

INSERT INTO question_topics (question_id, topic_id) VALUES
(119, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(119, 1, '{"s": "abcde", "words": ["a", "bb", "acd", "ace"]}', '3'),
(119, 2, '{"s": "dsahjpjauf", "words": ["ahjpjau", "ja", "ahbwzgqnuk", "tnmlanowax"]}', '2');

-- Question 120: Design Time-Based Key-Value Store
INSERT INTO questions (id, title, difficulty, description, question_constraints) VALUES
(120, 'Design Time-Based Key-Value Store', 'hard', 'Design a time-based key-value data structure that can store multiple values for the same key at different timestamps and retrieve the value at a given timestamp. Use hash tables with binary search.', '1 <= key.length, value.length <= 100
key and value consist of lowercase English letters and digits
1 <= timestamp <= 10^7
All timestamps are strictly increasing
At most 2 * 10^5 calls to set and get');

INSERT INTO question_topics (question_id, topic_id) VALUES
(120, (SELECT id FROM topics WHERE name = 'hash table'));

INSERT INTO test_cases (question_id, index, input, output) VALUES
(120, 1, '{"operations": ["set", "get", "get", "set", "get"], "params": [["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4]]}', '[null, "bar", "bar", null, "bar2"]'),
(120, 2, '{"operations": ["set", "set", "get"], "params": [["love", "high", 10], ["love", "low", 20], ["love", 5]]}', '[null, null, ""]');
