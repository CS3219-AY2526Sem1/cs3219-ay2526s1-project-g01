/**
 * AI Assistance Disclosure:
 * Tool: Claude Sonnet 4.5, date: 2025-10-20
 * Purpose: To generate SQL initialization script for question service database schema and seed data.
 * Author Review: Designed the schema, then I checked correctness and performance of the code.
 */

DROP VIEW IF EXISTS questions_view;
DROP TABLE IF EXISTS question_topics;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS test_cases;
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

-- Link table: question topic (many-to-many)
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


-- Insert the sorting topic
INSERT INTO topics (name) VALUES ('sorting');

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
