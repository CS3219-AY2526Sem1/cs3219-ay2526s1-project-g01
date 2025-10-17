CREATE TABLE questions (
	title TEXT, 
	topic TEXT NOT NULL, 
	difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')), 
	description TEXT NOT NULL, 
	constraints TEXT,
	PRIMARY KEY (title)
);

CREATE TABLE test_cases (
	title TEXT,
    index INTEGER, 
    input TEXT NOT NULL,
    output TEXT NOT NULL,
	PRIMARY KEY (title, index),
	FOREIGN KEY (title) REFERENCES questions(title)
);

-- Topic: Sorting
-- Easy Questions
INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Student Scores', 'sorting', 'easy', 'Given an array of student test scores, sort them in ascending order and return the sorted array.', 'Array length: 1 ≤ n ≤ 1000; Score range: 0 ≤ score ≤ 100');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Student Scores', 1, '[85, 92, 78, 95, 88]', '[78, 85, 88, 92, 95]'),
('Sort Student Scores', 2, '[100, 0, 50, 75, 25]', '[0, 25, 50, 75, 100]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Reverse Sort Names', 'sorting', 'easy', 'Given an array of names, sort them in descending alphabetical order (Z to A) and return the sorted array.', 'Array length: 1 ≤ n ≤ 500; Each name contains only letters');

INSERT INTO test_cases (title, index, input, output) VALUES
('Reverse Sort Names', 1, '["Alice", "Charlie", "Bob", "David"]', '["David", "Charlie", "Bob", "Alice"]'),
('Reverse Sort Names', 2, '["Zoe", "Adam", "Maria"]', '["Zoe", "Maria", "Adam"]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Positive Numbers', 'sorting', 'easy', 'Given an array of positive integers, sort them in ascending order. Return the sorted array.', 'Array length: 1 ≤ n ≤ 1000; All numbers are positive integers ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Positive Numbers', 1, '[5, 2, 8, 1, 9]', '[1, 2, 5, 8, 9]'),
('Sort Positive Numbers', 2, '[100, 50, 200, 10]', '[10, 50, 100, 200]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Find Median After Sort', 'sorting', 'easy', 'Given an array of integers, sort it and return the median value. If the array has even length, return the average of the two middle elements.', 'Array length: 1 ≤ n ≤ 1000; -1000 ≤ element ≤ 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Find Median After Sort', 1, '[3, 1, 4, 2, 5]', '3'),
('Find Median After Sort', 2, '[10, 20, 30, 40]', '25');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort and Get Third Largest', 'sorting', 'easy', 'Given an array of distinct integers, sort them and return the third largest number. If there are fewer than 3 numbers, return -1.', 'Array length: 0 ≤ n ≤ 1000; All integers are distinct; -10^6 ≤ element ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort and Get Third Largest', 1, '[7, 2, 9, 4, 11, 5]', '7'),
('Sort and Get Third Largest', 2, '[5, 10]', '-1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Prices Low to High', 'sorting', 'easy', 'Given an array of product prices (as decimals), sort them from lowest to highest and return the sorted array.', 'Array length: 1 ≤ n ≤ 500; 0 ≤ price ≤ 10000.00');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Prices Low to High', 1, '[19.99, 5.50, 12.00, 7.25]', '[5.50, 7.25, 12.00, 19.99]'),
('Sort Prices Low to High', 2, '[100.00, 99.99, 100.01]', '[99.99, 100.00, 100.01]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Even Numbers Only', 'sorting', 'easy', 'Given an array of integers, extract only the even numbers, sort them in ascending order, and return the sorted array of even numbers.', 'Array length: 1 ≤ n ≤ 1000; -1000 ≤ element ≤ 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Even Numbers Only', 1, '[5, 2, 8, 1, 4, 9]', '[2, 4, 8]'),
('Sort Even Numbers Only', 2, '[10, 15, 6, 3, 12]', '[6, 10, 12]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort by String Length', 'sorting', 'easy', 'Given an array of strings, sort them by their length in ascending order. If two strings have the same length, maintain their original relative order.', 'Array length: 1 ≤ n ≤ 500; String length: 1 ≤ len ≤ 100');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort by String Length', 1, '["apple", "pie", "banana", "kiwi"]', '["pie", "kiwi", "apple", "banana"]'),
('Sort by String Length', 2, '["a", "bb", "ccc", "d"]', '["a", "d", "bb", "ccc"]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Absolute Values', 'sorting', 'easy', 'Given an array of integers, sort them by their absolute values in ascending order. If two numbers have the same absolute value, the negative number should come first.', 'Array length: 1 ≤ n ≤ 1000; -10^6 ≤ element ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Absolute Values', 1, '[3, -2, 5, -5, 1]', '[1, -2, 3, -5, 5]'),
('Sort Absolute Values', 2, '[-10, 5, -5, 8]', '[5, -5, 8, -10]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Check If Already Sorted', 'sorting', 'easy', 'Given an array of integers, determine if it is already sorted in non-decreasing order. Return true if sorted, false otherwise.', 'Array length: 1 ≤ n ≤ 1000; -10^6 ≤ element ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Check If Already Sorted', 1, '[1, 2, 3, 4, 5]', 'true'),
('Check If Already Sorted', 2, '[1, 3, 2, 4]', 'false');

-- Medium Questions
INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort by Custom Order', 'sorting', 'medium', 'Given an array of integers and a custom order array, sort the integers according to the custom order. Elements not in the custom order should appear at the end in ascending order.', 'Array length: 1 ≤ n ≤ 1000; Custom order length: 1 ≤ m ≤ 100; -1000 ≤ element ≤ 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort by Custom Order', 1, 'array: [5, 2, 8, 1, 9, 2], custom: [2, 5, 1]', '[2, 2, 5, 1, 8, 9]'),
('Sort by Custom Order', 2, 'array: [10, 20, 30, 15], custom: [30, 10]', '[30, 10, 15, 20]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Matrix Diagonally', 'sorting', 'medium', 'Given an m x n matrix, sort each diagonal from top-left to bottom-right in ascending order and return the resulting matrix.', 'Matrix dimensions: 1 ≤ m, n ≤ 100; 1 ≤ element ≤ 100');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Matrix Diagonally', 1, '[[3,3,1,1],[2,2,1,2],[1,1,1,2]]', '[[1,1,1,1],[1,2,2,2],[1,2,3,3]]'),
('Sort Matrix Diagonally', 2, '[[5,4],[3,2]]', '[[2,4],[3,5]]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Pancake Sort Sequence', 'sorting', 'medium', 'Given an array of distinct integers, perform pancake sort and return the sequence of k values (positions) where you flip the first k elements. The goal is to sort the array in ascending order.', 'Array length: 1 ≤ n ≤ 100; All elements are distinct positive integers ≤ 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Pancake Sort Sequence', 1, '[3, 2, 4, 1]', '[4, 2, 3, 2]'),
('Pancake Sort Sequence', 2, '[1, 2, 3]', '[]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Colors Without Library', 'sorting', 'medium', 'Given an array containing only 0s, 1s, and 2s representing red, white, and blue, sort them in-place so all 0s come first, then 1s, then 2s. Do not use any sorting library function.', 'Array length: 1 ≤ n ≤ 1000; Elements are only 0, 1, or 2');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Colors Without Library', 1, '[2, 0, 2, 1, 1, 0]', '[0, 0, 1, 1, 2, 2]'),
('Sort Colors Without Library', 2, '[2, 0, 1]', '[0, 1, 2]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Wiggle Sort Array', 'sorting', 'medium', 'Given an unsorted array, reorder it such that array[0] <= array[1] >= array[2] <= array[3]... Return any valid wiggle-sorted array.', 'Array length: 1 ≤ n ≤ 1000; -10^6 ≤ element ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Wiggle Sort Array', 1, '[3, 5, 2, 1, 6, 4]', '[3, 5, 1, 6, 2, 4]'),
('Wiggle Sort Array', 2, '[1, 2, 3, 4]', '[1, 3, 2, 4]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Minimum Swaps to Sort', 'sorting', 'medium', 'Given an array of distinct integers, find the minimum number of swaps required to sort the array in ascending order.', 'Array length: 1 ≤ n ≤ 1000; All elements are distinct; 1 ≤ element ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Minimum Swaps to Sort', 1, '[4, 3, 2, 1]', '2'),
('Minimum Swaps to Sort', 2, '[2, 8, 5, 4]', '2');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Array by Frequency', 'sorting', 'medium', 'Given an array of integers, sort them by their frequency in descending order. If two elements have the same frequency, the smaller number should come first.', 'Array length: 1 ≤ n ≤ 1000; -1000 ≤ element ≤ 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Array by Frequency', 1, '[1, 1, 2, 2, 2, 3]', '[2, 2, 2, 1, 1, 3]'),
('Sort Array by Frequency', 2, '[5, 5, 4, 6, 4]', '[4, 4, 5, 5, 6]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort Linked List', 'sorting', 'medium', 'Given the head of a linked list, sort it in ascending order and return the head of the sorted list. Represent the linked list as a comma-separated string.', 'List length: 1 ≤ n ≤ 1000; -10^6 ≤ node value ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort Linked List', 1, '4->2->1->3', '1->2->3->4'),
('Sort Linked List', 2, '-1->5->3->4->0', '-1->0->3->4->5');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Rearrange by Index Mapping', 'sorting', 'medium', 'Given an array and an index mapping array where mapping[i] indicates the new position for array[i], rearrange the array according to the mapping and return it.', 'Array length: 1 ≤ n ≤ 1000; Mapping contains valid permutation of indices 0 to n-1');

INSERT INTO test_cases (title, index, input, output) VALUES
('Rearrange by Index Mapping', 1, 'array: [5, 2, 8, 1], mapping: [2, 0, 3, 1]', '[2, 1, 5, 8]'),
('Rearrange by Index Mapping', 2, 'array: [10, 20, 30], mapping: [2, 1, 0]', '[30, 20, 10]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort K Sorted Array', 'sorting', 'medium', 'Given an array where each element is at most k positions away from its target position in sorted array, efficiently sort the array and return it.', 'Array length: 1 ≤ n ≤ 10^5; 0 ≤ k ≤ n; -10^6 ≤ element ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort K Sorted Array', 1, 'array: [3, 2, 1, 5, 4, 6], k: 2', '[1, 2, 3, 4, 5, 6]'),
('Sort K Sorted Array', 2, 'array: [2, 1, 4, 3], k: 1', '[1, 2, 3, 4]');

-- Hard Questions
INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Count Inversions During Sort', 'sorting', 'hard', 'Given an array of integers, count the number of inversions during the sorting process. An inversion is a pair of indices (i, j) where i < j but array[i] > array[j]. Return the count.', 'Array length: 1 ≤ n ≤ 10^5; -10^9 ≤ element ≤ 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Count Inversions During Sort', 1, '[8, 4, 2, 1]', '6'),
('Count Inversions During Sort', 2, '[1, 20, 6, 4, 5]', '5');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort with Limited Operations', 'sorting', 'hard', 'Given an array of integers, sort it using only swap operations between adjacent elements. Return the minimum number of operations needed. This is equivalent to counting inversions.', 'Array length: 1 ≤ n ≤ 10^5; All elements are distinct; -10^9 ≤ element ≤ 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort with Limited Operations', 1, '[3, 2, 1]', '3'),
('Sort with Limited Operations', 2, '[5, 1, 4, 2, 3]', '6');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('External Sort Chunks', 'sorting', 'hard', 'Given a large array represented as k sorted chunks, merge all chunks into a single sorted array. Input is a 2D array where each inner array is a sorted chunk.', 'Number of chunks: 1 ≤ k ≤ 1000; Total elements: 1 ≤ n ≤ 10^6; -10^9 ≤ element ≤ 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('External Sort Chunks', 1, '[[1, 4, 7], [2, 5, 8], [3, 6, 9]]', '[1, 2, 3, 4, 5, 6, 7, 8, 9]'),
('External Sort Chunks', 2, '[[10, 20], [5, 15], [1]]', '[1, 5, 10, 15, 20]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Maximize Array After K Swaps', 'sorting', 'hard', 'Given an array and an integer k, perform at most k swaps between any two elements to maximize the array lexicographically. Return the maximum possible array.', 'Array length: 1 ≤ n ≤ 1000; 0 ≤ k ≤ n; 0 ≤ element ≤ 9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Maximize Array After K Swaps', 1, 'array: [1, 2, 9, 4, 5], k: 2', '[9, 5, 1, 4, 2]'),
('Maximize Array After K Swaps', 2, 'array: [3, 2, 1], k: 1', '[3, 2, 1]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort with Reversed Subarrays', 'sorting', 'hard', 'Given an array, you can reverse any subarray any number of times. Return the minimum number of reverse operations needed to sort the array in ascending order.', 'Array length: 1 ≤ n ≤ 1000; All elements are distinct; 1 ≤ element ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort with Reversed Subarrays', 1, '[3, 2, 1, 4, 5]', '1'),
('Sort with Reversed Subarrays', 2, '[4, 3, 2, 1, 5, 6]', '1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Radix Sort Implementation', 'sorting', 'hard', 'Implement radix sort for an array of non-negative integers. Return the sorted array. Your implementation should sort by each digit from least to most significant.', 'Array length: 1 ≤ n ≤ 10^5; 0 ≤ element ≤ 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Radix Sort Implementation', 1, '[170, 45, 75, 90, 802, 24, 2, 66]', '[2, 24, 45, 66, 75, 90, 170, 802]'),
('Radix Sort Implementation', 2, '[329, 457, 657, 839, 436, 720, 355]', '[329, 355, 436, 457, 657, 720, 839]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort by Multiple Criteria', 'sorting', 'hard', 'Given an array of person objects with name, age, and salary, sort by: 1) age descending, 2) salary ascending for same age, 3) name alphabetically for same age and salary. Return array of names in order.', 'Array length: 1 ≤ n ≤ 10^4; Age: 18-100; Salary: 0-1000000; Names are unique');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort by Multiple Criteria', 1, '[{name:"Alice",age:30,salary:50000}, {name:"Bob",age:30,salary:45000}, {name:"Charlie",age:35,salary:60000}]', '["Charlie", "Bob", "Alice"]'),
('Sort by Multiple Criteria', 2, '[{name:"Dave",age:25,salary:50000}, {name:"Eve",age:25,salary:50000}]', '["Dave", "Eve"]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Optimal Task Scheduler with Sort', 'sorting', 'hard', 'Given tasks with execution times and deadlines, sort and schedule them to minimize total lateness. Return the order of task indices that minimizes the maximum lateness. Lateness = completion_time - deadline.', 'Number of tasks: 1 ≤ n ≤ 1000; Execution time: 1 ≤ t ≤ 100; Deadline: 1 ≤ d ≤ 10000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Optimal Task Scheduler with Sort', 1, 'tasks: [{time:3,deadline:6}, {time:2,deadline:8}, {time:1,deadline:9}]', '[0, 1, 2]'),
('Optimal Task Scheduler with Sort', 2, 'tasks: [{time:4,deadline:5}, {time:2,deadline:3}]', '[1, 0]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort with Range Queries', 'sorting', 'hard', 'Given an array and q queries where each query asks to sort a subarray [L, R] in place, process all queries and return the final array. Queries must be processed in order.', 'Array length: 1 ≤ n ≤ 10^4; Number of queries: 1 ≤ q ≤ 1000; 0 ≤ L ≤ R < n; -10^6 ≤ element ≤ 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort with Range Queries', 1, 'array: [5, 3, 8, 1, 9], queries: [[0,2], [2,4]]', '[3, 5, 1, 8, 9]'),
('Sort with Range Queries', 2, 'array: [4, 2, 7, 1], queries: [[1,3]]', '[4, 1, 2, 7]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Parallel Merge Sort Simulation', 'sorting', 'hard', 'Simulate parallel merge sort by calculating the minimum depth of recursion tree needed if you can process k subarrays in parallel at each level. Return the minimum number of parallel steps needed.', 'Array length: 1 ≤ n ≤ 10^6; Parallel processors: 1 ≤ k ≤ 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Parallel Merge Sort Simulation', 1, 'n: 8, k: 2', '4'),
('Parallel Merge Sort Simulation', 2, 'n: 16, k: 4', '3');


--####################################################--

--Topic: Array
-- EASY QUESTIONS (10)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Find Missing Number in Sequence', 'arrays', 'easy', 'Given an array containing n distinct numbers from 0 to n, find the one number that is missing from the array.', '1 <= n <= 10^4; All numbers are unique; Numbers range from 0 to n');

INSERT INTO test_cases (title, index, input, output) VALUES
('Find Missing Number in Sequence', 1, '[3, 0, 1]', '2'),
('Find Missing Number in Sequence', 2, '[9, 6, 4, 2, 3, 5, 7, 0, 1]', '8');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Count Positive Numbers', 'arrays', 'easy', 'Given an array of integers, count how many positive numbers are in the array.', '1 <= array length <= 1000; -1000 <= array[i] <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Count Positive Numbers', 1, '[1, -2, 3, 4, -5]', '3'),
('Count Positive Numbers', 2, '[-1, -2, -3, 0]', '0');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Find Maximum Difference', 'arrays', 'easy', 'Find the maximum difference between any two elements in an array where the larger element appears after the smaller element.', '2 <= array length <= 10^5; -10^9 <= array[i] <= 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Find Maximum Difference', 1, '[2, 7, 9, 5, 1, 3, 5]', '7'),
('Find Maximum Difference', 2, '[10, 6, 4, 2, 1]', '-1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sum of Even Numbers', 'arrays', 'easy', 'Calculate the sum of all even numbers in an array.', '1 <= array length <= 1000; 0 <= array[i] <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sum of Even Numbers', 1, '[1, 2, 3, 4, 5, 6]', '12'),
('Sum of Even Numbers', 2, '[1, 3, 5, 7]', '0');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Remove Duplicates Count', 'arrays', 'easy', 'Given a sorted array, return the count of unique elements.', '0 <= array length <= 10^4; -100 <= array[i] <= 100; Array is sorted in ascending order');

INSERT INTO test_cases (title, index, input, output) VALUES
('Remove Duplicates Count', 1, '[1, 1, 2, 2, 3, 4, 4]', '4'),
('Remove Duplicates Count', 2, '[1, 1, 1, 1]', '1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Find Second Smallest', 'arrays', 'easy', 'Find the second smallest element in an array. If it doesn''t exist, return -1.', '1 <= array length <= 10^5; -10^9 <= array[i] <= 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Find Second Smallest', 1, '[5, 2, 8, 2, 9, 1]', '2'),
('Find Second Smallest', 2, '[7, 7, 7]', '-1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Check Array Sorted', 'arrays', 'easy', 'Return true if the array is sorted in non-decreasing order, false otherwise.', '1 <= array length <= 10^5; -10^9 <= array[i] <= 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Check Array Sorted', 1, '[1, 2, 3, 4, 5]', 'true'),
('Check Array Sorted', 2, '[1, 3, 2, 4]', 'false');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Product Except Self Element', 'arrays', 'easy', 'Given an array and an index, return the product of all elements except the element at that index.', '2 <= array length <= 100; 1 <= array[i] <= 100; 0 <= index < array length');

INSERT INTO test_cases (title, index, input, output) VALUES
('Product Except Self Element', 1, '[2, 3, 4, 5], index=2', '30'),
('Product Except Self Element', 2, '[1, 2, 3], index=0', '6');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Count Pairs with Sum', 'arrays', 'easy', 'Count the number of pairs in an array that sum to a given target value.', '1 <= array length <= 1000; -1000 <= array[i] <= 1000; -2000 <= target <= 2000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Count Pairs with Sum', 1, '[1, 2, 3, 4, 5], target=5', '2'),
('Count Pairs with Sum', 2, '[1, 1, 1, 1], target=2', '6');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Find Peak Element Index', 'arrays', 'easy', 'A peak element is greater than its neighbors. Return the index of any peak element. For edge elements, consider only one neighbor.', '1 <= array length <= 1000; -10^9 <= array[i] <= 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Find Peak Element Index', 1, '[1, 3, 2, 1]', '1'),
('Find Peak Element Index', 2, '[1, 2, 3, 4, 5]', '4');

-- MEDIUM QUESTIONS (10)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Longest Consecutive Sequence Length', 'arrays', 'medium', 'Find the length of the longest consecutive elements sequence in an unsorted array.', '0 <= array length <= 10^5; -10^9 <= array[i] <= 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Longest Consecutive Sequence Length', 1, '[100, 4, 200, 1, 3, 2]', '4'),
('Longest Consecutive Sequence Length', 2, '[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', '9');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Subarray Sum Equals K', 'arrays', 'medium', 'Find the total number of continuous subarrays whose sum equals a given value k.', '1 <= array length <= 2*10^4; -1000 <= array[i] <= 1000; -10^7 <= k <= 10^7');

INSERT INTO test_cases (title, index, input, output) VALUES
('Subarray Sum Equals K', 1, '[1, 2, 3, 4, 5], k=9', '2'),
('Subarray Sum Equals K', 2, '[1, -1, 1, -1, 1], k=0', '6');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Rotate Array K Positions', 'arrays', 'medium', 'Rotate an array to the right by k positions. Return the rotated array.', '1 <= array length <= 10^5; -10^9 <= array[i] <= 10^9; 0 <= k <= 10^5');

INSERT INTO test_cases (title, index, input, output) VALUES
('Rotate Array K Positions', 1, '[1, 2, 3, 4, 5], k=2', '[4, 5, 1, 2, 3]'),
('Rotate Array K Positions', 2, '[1, 2], k=3', '[2, 1]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Find All Duplicates', 'arrays', 'medium', 'Given an array where each element appears once or twice, return all elements that appear twice.', '1 <= array length <= 10^5; 1 <= array[i] <= array length');

INSERT INTO test_cases (title, index, input, output) VALUES
('Find All Duplicates', 1, '[4, 3, 2, 7, 8, 2, 3, 1]', '[2, 3]'),
('Find All Duplicates', 2, '[1, 1, 2]', '[1]');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Maximum Subarray Sum', 'arrays', 'medium', 'Find the contiguous subarray with the maximum sum and return that sum.', '1 <= array length <= 10^5; -10^4 <= array[i] <= 10^4');

INSERT INTO test_cases (title, index, input, output) VALUES
('Maximum Subarray Sum', 1, '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', '6'),
('Maximum Subarray Sum', 2, '[5, 4, -1, 7, 8]', '23');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Three Sum Zero Count', 'arrays', 'medium', 'Count the number of unique triplets in the array that sum to zero.', '3 <= array length <= 3000; -10^5 <= array[i] <= 10^5');

INSERT INTO test_cases (title, index, input, output) VALUES
('Three Sum Zero Count', 1, '[-1, 0, 1, 2, -1, -4]', '2'),
('Three Sum Zero Count', 2, '[0, 0, 0, 0]', '1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Longest Mountain Length', 'arrays', 'medium', 'A mountain is a subarray that increases then decreases with at least 3 elements. Find the length of the longest mountain.', '3 <= array length <= 10^4; 0 <= array[i] <= 10^4');

INSERT INTO test_cases (title, index, input, output) VALUES
('Longest Mountain Length', 1, '[2, 1, 4, 7, 3, 2, 5]', '5'),
('Longest Mountain Length', 2, '[2, 2, 2]', '0');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Find Missing Ranges', 'arrays', 'medium', 'Given a sorted array and a range [lower, upper], return the count of missing ranges.', '0 <= array length <= 100; -10^9 <= array[i] <= 10^9; Array is sorted; lower <= upper');

INSERT INTO test_cases (title, index, input, output) VALUES
('Find Missing Ranges', 1, '[0, 1, 3, 50, 75], lower=0, upper=99', '3'),
('Find Missing Ranges', 2, '[], lower=1, upper=1', '1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Container With Most Water', 'arrays', 'medium', 'Given an array of heights, find two lines that together with the x-axis form a container that holds the most water. Return the maximum area.', '2 <= array length <= 10^5; 0 <= height[i] <= 10^4');

INSERT INTO test_cases (title, index, input, output) VALUES
('Container With Most Water', 1, '[1, 8, 6, 2, 5, 4, 8, 3, 7]', '49'),
('Container With Most Water', 2, '[1, 1]', '1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sort by Frequency', 'arrays', 'medium', 'Sort array elements by their frequency in descending order. If two elements have same frequency, sort by value in ascending order.', '1 <= array length <= 100; -100 <= array[i] <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sort by Frequency', 1, '[1, 1, 2, 2, 2, 3]', '[2, 2, 2, 1, 1, 3]'),
('Sort by Frequency', 2, '[4, 5, 6, 5, 4, 3]', '[4, 4, 5, 5, 3, 6]');

-- HARD QUESTIONS (10)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Median of Two Sorted Arrays', 'arrays', 'hard', 'Find the median of two sorted arrays. The overall run time complexity should be O(log(m+n)).', '0 <= array1.length <= 1000; 0 <= array2.length <= 1000; 1 <= m + n <= 2000; -10^6 <= array[i] <= 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Median of Two Sorted Arrays', 1, '[1, 3], [2]', '2.0'),
('Median of Two Sorted Arrays', 2, '[1, 2], [3, 4]', '2.5');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Minimum Window Subsequence', 'arrays', 'hard', 'Given arrays A and B, find the minimum length contiguous subarray in A that contains all elements of B in order (not necessarily consecutive). Return the length or -1 if impossible.', '1 <= A.length <= 2*10^4; 1 <= B.length <= 100; B.length <= A.length; 1 <= A[i], B[i] <= 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Minimum Window Subsequence', 1, 'A=[7, 2, 5, 1, 3, 5, 7, 9], B=[2, 5, 7]', '4'),
('Minimum Window Subsequence', 2, 'A=[1, 2, 3], B=[4, 5]', '-1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Maximum Sum of K Subarrays', 'arrays', 'hard', 'Partition an array into k non-overlapping subarrays such that the sum of the sums of these k subarrays is maximized. Return the maximum sum.', '1 <= array length <= 1000; 1 <= k <= 100; k <= array length; -1000 <= array[i] <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES
('Maximum Sum of K Subarrays', 1, '[1, -2, 3, 4, -5, 8], k=2', '15'),
('Maximum Sum of K Subarrays', 2, '[1, 2, 3, 4], k=2', '10');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Shortest Subarray with Sum at Least K', 'arrays', 'hard', 'Find the length of the shortest non-empty contiguous subarray with sum at least K. Return -1 if no such subarray exists.', '1 <= array length <= 10^5; -10^5 <= array[i] <= 10^5; 1 <= K <= 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Shortest Subarray with Sum at Least K', 1, '[2, -1, 2, 3], K=5', '2'),
('Shortest Subarray with Sum at Least K', 2, '[1, 2, 3, 4], K=15', '-1');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Count Inversions', 'arrays', 'hard', 'Count the number of inversions in an array. An inversion is a pair of indices (i, j) where i < j and array[i] > array[j].', '1 <= array length <= 10^5; 1 <= array[i] <= 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('Count Inversions', 1, '[8, 4, 2, 1]', '6'),
('Count Inversions', 2, '[1, 2, 3, 4, 5]', '0');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Maximum Rectangle Area', 'arrays', 'hard', 'Given an array representing heights of bars in a histogram, find the area of the largest rectangle that can be formed.', '1 <= array length <= 10^5; 0 <= heights[i] <= 10^4');

INSERT INTO test_cases (title, index, input, output) VALUES
('Maximum Rectangle Area', 1, '[2, 1, 5, 6, 2, 3]', '10'),
('Maximum Rectangle Area', 2, '[2, 4]', '4');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Trapping Rain Water', 'arrays', 'hard', 'Given an array representing elevation heights, compute how much water can be trapped after raining.', '1 <= array length <= 2*10^4; 0 <= height[i] <= 10^5');

INSERT INTO test_cases (title, index, input, output) VALUES
('Trapping Rain Water', 1, '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', '6'),
('Trapping Rain Water', 2, '[4, 2, 0, 3, 2, 5]', '9');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Best Meeting Point Sum', 'arrays', 'hard', 'Given an array of positions on a number line where people are located, find the position for a meeting that minimizes the total travel distance for everyone. Return the minimum total distance.', '1 <= array length <= 10^4; 0 <= positions[i] <= 10^6');

INSERT INTO test_cases (title, index, input, output) VALUES
('Best Meeting Point Sum', 1, '[1, 3, 5, 7, 9]', '8'),
('Best Meeting Point Sum', 2, '[1, 10, 100]', '99');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Maximum XOR of Two Numbers', 'arrays', 'hard', 'Find the maximum XOR of any two numbers in the array.', '1 <= array length <= 2*10^4; 0 <= array[i] <= 2^31 - 1');

INSERT INTO test_cases (title, index, input, output) VALUES
('Maximum XOR of Two Numbers', 1, '[3, 10, 5, 25, 2, 8]', '28'),
('Maximum XOR of Two Numbers', 2, '[14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]', '127');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Sliding Window Maximum', 'arrays', 'hard', 'Given an array and a window size k, find the maximum element in each sliding window as it moves from left to right. Return an array of maximums.', '1 <= array length <= 10^5; 1 <= k <= array length; -10^4 <= array[i] <= 10^4');

INSERT INTO test_cases (title, index, input, output) VALUES
('Sliding Window Maximum', 1, '[1, 3, -1, -3, 5, 3, 6, 7], k=3', '[3, 3, 5, 5, 6, 7]'),
('Sliding Window Maximum', 2, '[1, -1], k=1', '[1, -1]');


--####################################################--


-- Topic: Dynamic Programming
-- EASY DIFFICULTY QUESTIONS (10)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Count Ways to Sum', 'Dynamic Programming', 'easy', 'Given a target integer n, count the number of ways to reach n by adding 1, 2, or 3 at each step. Order matters.', '1 <= n <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Count Ways to Sum', 1, '4', '7'),
('Count Ways to Sum', 2, '3', '4');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Maximum Sum Subarray', 'Dynamic Programming', 'easy', 'Given an array of integers, find the maximum sum of any contiguous subarray.', '1 <= array length <= 1000, -100 <= array[i] <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Maximum Sum Subarray', 1, '[-2,1,-3,4,-1,2,1,-5,4]', '6'),
('Maximum Sum Subarray', 2, '[5,4,-1,7,8]', '23');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Paint Fence', 'Dynamic Programming', 'easy', 'You have a fence with n posts. You can paint each post with k colors. No more than 2 adjacent posts can have the same color. Count the total number of ways to paint the fence.', '1 <= n <= 50, 1 <= k <= 10');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Paint Fence', 1, 'n=3, k=2', '6'),
('Paint Fence', 2, 'n=4, k=3', '66');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Min Cost Path', 'Dynamic Programming', 'easy', 'Given a 2D grid of costs, find the minimum cost to reach the bottom-right corner from the top-left corner. You can only move right or down.', '1 <= rows, cols <= 100, 1 <= cost[i][j] <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Min Cost Path', 1, '[[1,3,1],[1,5,1],[4,2,1]]', '7'),
('Min Cost Path', 2, '[[1,2],[3,4]]', '8');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Climbing Steps with Cost', 'Dynamic Programming', 'easy', 'You are climbing stairs. Each step has a cost. You can climb 1 or 2 steps at a time. Find the minimum cost to reach the top. You can start from step 0 or step 1.', '2 <= cost.length <= 1000, 0 <= cost[i] <= 999');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Climbing Steps with Cost', 1, '[10,15,20]', '15'),
('Climbing Steps with Cost', 2, '[1,100,1,1,1,100,1,1,99,1]', '6');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Maximum Alternating Sum', 'Dynamic Programming', 'easy', 'Given an array of integers, find the maximum alternating sum. An alternating sum is computed by alternately adding and subtracting elements in a subsequence.', '1 <= array length <= 100, 1 <= array[i] <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Maximum Alternating Sum', 1, '[4,2,5,3]', '7'),
('Maximum Alternating Sum', 2, '[5,6,7,8]', '8');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Count Binary Strings', 'Dynamic Programming', 'easy', 'Count the number of binary strings of length n that do not have consecutive 1s.', '1 <= n <= 30');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Count Binary Strings', 1, '3', '5'),
('Count Binary Strings', 2, '4', '8');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Minimum Jumps', 'Dynamic Programming', 'easy', 'Given an array where each element represents the maximum jump length from that position, find the minimum number of jumps to reach the end.', '1 <= array length <= 100, 0 <= array[i] <= 50');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Minimum Jumps', 1, '[2,3,1,1,4]', '2'),
('Minimum Jumps', 2, '[2,1,3,2,1,1]', '3');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('House Robber Linear', 'Dynamic Programming', 'easy', 'Given an array of house values, find the maximum sum you can rob without robbing two adjacent houses.', '1 <= array length <= 100, 0 <= array[i] <= 400');

INSERT INTO test_cases (title, index, input, output) VALUES 
('House Robber Linear', 1, '[1,2,3,1]', '4'),
('House Robber Linear', 2, '[2,7,9,3,1]', '12');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Count Palindromic Substrings', 'Dynamic Programming', 'easy', 'Given a string, count the number of palindromic substrings in it.', '1 <= string length <= 100, string contains only lowercase letters');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Count Palindromic Substrings', 1, 'abc', '3'),
('Count Palindromic Substrings', 2, 'aaa', '6');

-- MEDIUM DIFFICULTY QUESTIONS (10)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Longest Bitonic Subsequence', 'Dynamic Programming', 'medium', 'Find the length of the longest bitonic subsequence. A bitonic subsequence first increases then decreases.', '1 <= array length <= 1000, 1 <= array[i] <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Longest Bitonic Subsequence', 1, '[1,11,2,10,4,5,2,1]', '6'),
('Longest Bitonic Subsequence', 2, '[12,11,40,5,3,1]', '5');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Partition Equal Subset Sum', 'Dynamic Programming', 'medium', 'Determine if an array can be partitioned into two subsets with equal sum.', '1 <= array length <= 200, 1 <= array[i] <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Partition Equal Subset Sum', 1, '[1,5,11,5]', 'true'),
('Partition Equal Subset Sum', 2, '[1,2,3,5]', 'false');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Box Stacking Problem', 'Dynamic Programming', 'medium', 'Given n boxes with dimensions (height, width, depth), find the maximum height stack. A box can only be placed on another if both width and depth are strictly smaller.', '1 <= n <= 100, 1 <= dimensions <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Box Stacking Problem', 1, '[(4,6,7),(1,2,3),(4,5,6),(10,12,32)]', '60'),
('Box Stacking Problem', 2, '[(1,1,1),(2,2,2),(3,3,3)]', '6');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Count Ways to Decode', 'Dynamic Programming', 'medium', 'A message containing letters A-Z is encoded as numbers 1-26. Given a digit string, count the number of ways to decode it. 0 cannot start a code.', '1 <= string length <= 100, string contains only digits');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Count Ways to Decode', 1, '12', '2'),
('Count Ways to Decode', 2, '226', '3');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Maximum Product Subarray', 'Dynamic Programming', 'medium', 'Given an integer array, find the contiguous subarray with the largest product.', '1 <= array length <= 1000, -10 <= array[i] <= 10');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Maximum Product Subarray', 1, '[2,3,-2,4]', '6'),
('Maximum Product Subarray', 2, '[-2,0,-1]', '0');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Min Deletions for Palindrome', 'Dynamic Programming', 'medium', 'Find the minimum number of deletions needed to make a string a palindrome.', '1 <= string length <= 500, string contains only lowercase letters');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Min Deletions for Palindrome', 1, 'aebcbda', '2'),
('Min Deletions for Palindrome', 2, 'geeksforgeeks', '8');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Egg Drop Problem', 'Dynamic Programming', 'medium', 'Given n eggs and k floors, find the minimum number of egg drops needed to find the critical floor in the worst case.', '1 <= n <= 10, 1 <= k <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Egg Drop Problem', 1, 'n=2, k=10', '4'),
('Egg Drop Problem', 2, 'n=3, k=14', '4');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Longest Common Subsequence with K Mismatches', 'Dynamic Programming', 'medium', 'Find the length of the longest common subsequence of two strings allowing at most k mismatches.', '1 <= string length <= 500, 0 <= k <= 10');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Longest Common Subsequence with K Mismatches', 1, 's1="abc", s2="adc", k=1', '3'),
('Longest Common Subsequence with K Mismatches', 2, 's1="abcd", s2="efgh", k=2', '2');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Wildcard Pattern Matching', 'Dynamic Programming', 'medium', 'Implement wildcard pattern matching with support for ? (matches any single character) and * (matches any sequence of characters including empty).', '0 <= string length <= 2000, 0 <= pattern length <= 2000');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Wildcard Pattern Matching', 1, 's="aa", p="a"', 'false'),
('Wildcard Pattern Matching', 2, 's="adceb", p="*a*b"', 'true');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Maximum Sum Rectangle', 'Dynamic Programming', 'medium', 'Given a 2D matrix of integers, find the rectangle with the maximum sum.', '1 <= rows, cols <= 100, -100 <= matrix[i][j] <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Maximum Sum Rectangle', 1, '[[1,2,-1],[-3,-1,2],[2,3,4]]', '12'),
('Maximum Sum Rectangle', 2, '[[-1,-2],[-3,-4]]', '-1');

-- HARD DIFFICULTY QUESTIONS (10)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Edit Distance with Operations Cost', 'Dynamic Programming', 'hard', 'Find minimum cost to convert string s1 to s2. Insert costs a, delete costs b, replace costs c.', '1 <= string length <= 500, 1 <= a,b,c <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Edit Distance with Operations Cost', 1, 's1="horse", s2="ros", a=1, b=1, c=1', '3'),
('Edit Distance with Operations Cost', 2, 's1="intention", s2="execution", a=2, b=3, c=1', '5');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Burst Balloons', 'Dynamic Programming', 'hard', 'Given n balloons with values, burst them to maximize coins. When you burst balloon i, you get arr[left]*arr[i]*arr[right] coins. Assume arr[-1]=arr[n]=1.', '1 <= n <= 300, 0 <= arr[i] <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Burst Balloons', 1, '[3,1,5,8]', '167'),
('Burst Balloons', 2, '[1,5]', '10');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Interleaving String Check', 'Dynamic Programming', 'hard', 'Given strings s1, s2, s3, check if s3 is formed by interleaving s1 and s2 while preserving the order of characters.', '0 <= s1.length, s2.length <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Interleaving String Check', 1, 's1="aabcc", s2="dbbca", s3="aadbbcbcac"', 'true'),
('Interleaving String Check', 2, 's1="aabcc", s2="dbbca", s3="aadbbbaccc"', 'false');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Optimal BST Construction', 'Dynamic Programming', 'hard', 'Given n keys and their search frequencies, construct a BST that minimizes the total search cost.', '1 <= n <= 100, 1 <= frequency[i] <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Optimal BST Construction', 1, 'keys=[10,12,20], freq=[34,8,50]', '142'),
('Optimal BST Construction', 2, 'keys=[10,12], freq=[50,50]', '150');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Regular Expression Matching Extended', 'Dynamic Programming', 'hard', 'Implement regex matching with . (any char), * (0+ of previous), and + (1+ of previous).', '1 <= string length <= 1000, 1 <= pattern length <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Regular Expression Matching Extended', 1, 's="aa", p="a+"', 'true'),
('Regular Expression Matching Extended', 2, 's="mississippi", p="mis*is*.p+."', 'true');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Matrix Chain Multiplication 3D', 'Dynamic Programming', 'hard', 'Given dimensions of n 3D matrices, find the minimum number of scalar multiplications needed to compute their product.', '2 <= n <= 100, 1 <= dimensions <= 500');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Matrix Chain Multiplication 3D', 1, '[(10,20,30),(30,40,50),(50,60,70)]', '87000'),
('Matrix Chain Multiplication 3D', 2, '[(5,10,15),(15,20,25)]', '3750');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Palindrome Partitioning with Min Cuts', 'Dynamic Programming', 'hard', 'Given a string, partition it into substrings such that every substring is a palindrome. Find the minimum cuts needed.', '1 <= string length <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Palindrome Partitioning with Min Cuts', 1, 'aab', '1'),
('Palindrome Partitioning with Min Cuts', 2, 'aabababaxx', '3');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Count Distinct Subsequences', 'Dynamic Programming', 'hard', 'Given two strings s and t, count the number of distinct subsequences of s that equal t.', '1 <= s.length <= 1000, 1 <= t.length <= 1000');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Count Distinct Subsequences', 1, 's="rabbbit", t="rabbit"', '3'),
('Count Distinct Subsequences', 2, 's="babgbag", t="bag"', '5');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Maximize Expression Value', 'Dynamic Programming', 'hard', 'Given an array, maximize |arr[a] - arr[b]| + |arr[b] - arr[c]| + |arr[c] - arr[d]| where a < b < c < d.', '4 <= array length <= 10000, 1 <= arr[i] <= 1000000');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Maximize Expression Value', 1, '[3,9,10,1,30,40]', '76'),
('Maximize Expression Value', 2, '[1,2,3,4,5]', '6');

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES 
('Minimum Path Sum with K Moves', 'Dynamic Programming', 'hard', 'Given a grid, find minimum sum path from top-left to bottom-right with exactly k moves. You can move in all 4 directions.', '1 <= rows, cols <= 50, k <= 100, 1 <= grid[i][j] <= 100');

INSERT INTO test_cases (title, index, input, output) VALUES 
('Minimum Path Sum with K Moves', 1, 'grid=[[1,2,3],[4,5,6]], k=4', '13'),
('Minimum Path Sum with K Moves', 2, 'grid=[[1,1],[1,1]], k=2', '3');




--####################################################--


-- Topic: Hash Table
-- EASY QUESTIONS (10)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('First Unique Character', 'Hash Table', 'easy', 'Given a string, find the first non-repeating character and return its index. If no such character exists, return -1.', '1 <= s.length <= 10^5; s consists of only lowercase English letters'),
('Employee Department Count', 'Hash Table', 'easy', 'Given a list of employee records where each record contains [employee_id, department], return the count of employees in each department as a dictionary.', '1 <= records.length <= 1000; department names are non-empty strings'),
('Missing Number in Sequence', 'Hash Table', 'easy', 'Given an array containing n distinct numbers from 0 to n, find the one missing number. Use a hash-based approach.', '1 <= n <= 10^4; array contains n numbers from range [0, n]'),
('Character Frequency Map', 'Hash Table', 'easy', 'Given a string, return a dictionary containing the frequency of each character in the string.', '0 <= s.length <= 10^5; s consists of printable ASCII characters'),
('Check Anagram', 'Hash Table', 'easy', 'Determine if two strings are anagrams of each other using a hash table approach.', '1 <= s.length, t.length <= 5 * 10^4; s and t consist of lowercase English letters'),
('Sum of Unique Elements', 'Hash Table', 'easy', 'Given an integer array, return the sum of all unique elements (elements that appear exactly once).', '1 <= nums.length <= 100; 1 <= nums[i] <= 100'),
('First Duplicate', 'Hash Table', 'easy', 'Given an array of integers, find the first element that appears twice. Return -1 if no duplicates exist.', '1 <= arr.length <= 10^5; 1 <= arr[i] <= 10^6'),
('Majority Element', 'Hash Table', 'easy', 'Find the element that appears more than n/2 times in an array. You may assume such element always exists.', '1 <= nums.length <= 5 * 10^4; -10^9 <= nums[i] <= 10^9'),
('Valid Parentheses Pairs', 'Hash Table', 'easy', 'Given a string containing only parentheses characters "()[]{}", determine if the input string is valid using a hash map for bracket matching.', '1 <= s.length <= 10^4; s consists of parentheses only'),
('Complement Pair Exists', 'Hash Table', 'easy', 'Given an array of integers and a target sum, determine if there exists a pair of numbers that add up to the target.', '2 <= nums.length <= 10^4; -10^9 <= nums[i] <= 10^9; -10^9 <= target <= 10^9');

INSERT INTO test_cases (title, index, input, output) VALUES
('First Unique Character', 1, '{"s": "leetcode"}', '0'),
('First Unique Character', 2, '{"s": "aabbcc"}', '-1'),
('Employee Department Count', 1, '{"records": [[1, "Engineering"], [2, "HR"], [3, "Engineering"], [4, "Sales"], [5, "Engineering"]]}', '{"Engineering": 3, "HR": 1, "Sales": 1}'),
('Employee Department Count', 2, '{"records": [[1, "IT"], [2, "IT"]]}', '{"IT": 2}'),
('Missing Number in Sequence', 1, '{"nums": [3, 0, 1]}', '2'),
('Missing Number in Sequence', 2, '{"nums": [9,6,4,2,3,5,7,0,1]}', '8'),
('Character Frequency Map', 1, '{"s": "hello"}', '{"h": 1, "e": 1, "l": 2, "o": 1}'),
('Character Frequency Map', 2, '{"s": "aaa"}', '{"a": 3}'),
('Check Anagram', 1, '{"s": "listen", "t": "silent"}', 'true'),
('Check Anagram', 2, '{"s": "hello", "t": "world"}', 'false'),
('Sum of Unique Elements', 1, '{"nums": [1,2,3,2]}', '4'),
('Sum of Unique Elements', 2, '{"nums": [1,1,1,1]}', '0'),
('First Duplicate', 1, '{"arr": [2,5,1,2,3,5]}', '2'),
('First Duplicate', 2, '{"arr": [1,2,3,4,5]}', '-1'),
('Majority Element', 1, '{"nums": [3,2,3]}', '3'),
('Majority Element', 2, '{"nums": [2,2,1,1,1,2,2]}', '2'),
('Valid Parentheses Pairs', 1, '{"s": "()[]{}"}', 'true'),
('Valid Parentheses Pairs', 2, '{"s": "([)]"}', 'false'),
('Complement Pair Exists', 1, '{"nums": [2,7,11,15], "target": 9}', 'true'),
('Complement Pair Exists', 2, '{"nums": [1,2,3], "target": 10}', 'false');

-- MEDIUM QUESTIONS (9)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Group Shifted Strings', 'Hash Table', 'medium', 'Given an array of strings, group strings that are shifted versions of each other. For example, "abc" and "bcd" are shifted versions.', '1 <= strings.length <= 200; 1 <= strings[i].length <= 50; strings[i] consists of lowercase English letters'),
('Longest Consecutive Sequence', 'Hash Table', 'medium', 'Given an unsorted array of integers, find the length of the longest consecutive elements sequence using hash table.', '0 <= nums.length <= 10^5; -10^9 <= nums[i] <= 10^9'),
('Top K Frequent Elements', 'Hash Table', 'medium', 'Given an integer array, return the k most frequent elements. You may return the answer in any order.', '1 <= nums.length <= 10^5; k is in range [1, number of unique elements]'),
('Valid Sudoku', 'Hash Table', 'medium', 'Determine if a 9x9 Sudoku board is valid using hash tables to track row, column, and sub-box constraints.', 'board.length == 9; board[i].length == 9; board[i][j] is a digit 1-9 or "."'),
('Encode and Decode Strings', 'Hash Table', 'medium', 'Design an algorithm to encode a list of strings to a single string and decode it back. Use hash-based length encoding.', '1 <= strs.length <= 200; 0 <= strs[i].length <= 200; strs[i] contains any possible characters'),
('Find All Anagrams', 'Hash Table', 'medium', 'Given two strings s and p, find all start indices of p''s anagrams in s using a sliding window hash approach.', '1 <= s.length, p.length <= 3 * 10^4; s and p consist of lowercase English letters'),
('Longest Substring K Distinct', 'Hash Table', 'medium', 'Find the length of the longest substring with at most k distinct characters using hash table.', '1 <= s.length <= 5 * 10^4; 0 <= k <= 50; s consists of English letters'),
('Four Sum Count', 'Hash Table', 'medium', 'Given four integer arrays, compute how many tuples (i,j,k,l) exist such that nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.', '1 <= n <= 200; -2^28 <= nums[i][j] <= 2^28'),
('Fraction to Recurring Decimal', 'Hash Table', 'medium', 'Given numerator and denominator of a fraction, return the fraction in string format. If the decimal part is repeating, enclose it in parentheses using hash table to detect cycles.', '-2^31 <= numerator, denominator <= 2^31 - 1; denominator != 0');

INSERT INTO test_cases (title, index, input, output) VALUES
('Group Shifted Strings', 1, '{"strings": ["abc","bcd","acef","xyz","az","ba","a","z"]}', '[["acef"],["a","z"],["abc","bcd","xyz"],["az","ba"]]'),
('Group Shifted Strings', 2, '{"strings": ["a","b","c"]}', '[["a"],["b"],["c"]]'),
('Longest Consecutive Sequence', 1, '{"nums": [100,4,200,1,3,2]}', '4'),
('Longest Consecutive Sequence', 2, '{"nums": [0,3,7,2,5,8,4,6,0,1]}', '9'),
('Top K Frequent Elements', 1, '{"nums": [1,1,1,2,2,3], "k": 2}', '[1,2]'),
('Top K Frequent Elements', 2, '{"nums": [4,1,1,1,2,2,3], "k": 2}', '[1,2]'),
('Valid Sudoku', 1, '{"board": [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]}', 'true'),
('Valid Sudoku', 2, '{"board": [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]}', 'false'),
('Encode and Decode Strings', 1, '{"strs": ["hello","world"]}', '"5#hello5#world"'),
('Encode and Decode Strings', 2, '{"strs": ["a","bc","def"]}', '"1#a2#bc3#def"'),
('Find All Anagrams', 1, '{"s": "cbaebabacd", "p": "abc"}', '[0,6]'),
('Find All Anagrams', 2, '{"s": "abab", "p": "ab"}', '[0,1,2]'),
('Longest Substring K Distinct', 1, '{"s": "eceba", "k": 2}', '3'),
('Longest Substring K Distinct', 2, '{"s": "aa", "k": 1}', '2'),
('Four Sum Count', 1, '{"nums1": [1,2], "nums2": [-2,-1], "nums3": [-1,2], "nums4": [0,2]}', '2'),
('Four Sum Count', 2, '{"nums1": [0], "nums2": [0], "nums3": [0], "nums4": [0]}', '1'),
('Fraction to Recurring Decimal', 1, '{"numerator": 1, "denominator": 2}', '"0.5"'),
('Fraction to Recurring Decimal', 2, '{"numerator": 2, "denominator": 3}', '"0.(6)"');

-- HARD QUESTIONS (10)

INSERT INTO questions (title, topic, difficulty, description, constraints) VALUES
('Substring Concatenation All Words', 'Hash Table', 'hard', 'Given a string s and an array of words, find all starting indices where s contains a concatenation of all words (in any order) using hash table.', '1 <= s.length <= 10^4; 1 <= words.length <= 5000; 1 <= words[i].length <= 30; all words have same length'),
('Minimum Window Substring', 'Hash Table', 'hard', 'Given strings s and t, return the minimum window substring of s that contains all characters in t using hash table tracking.', '1 <= s.length, t.length <= 10^5; s and t consist of uppercase and lowercase English letters'),
('Palindrome Pairs', 'Hash Table', 'hard', 'Given a list of unique words, find all pairs of distinct indices (i,j) such that concatenating words[i] + words[j] forms a palindrome.', '1 <= words.length <= 5000; 0 <= words[i].length <= 300; words[i] consists of lowercase English letters'),
('Alien Dictionary', 'Hash Table', 'hard', 'Given a sorted dictionary of an alien language, derive the order of characters using hash table and topological sort.', '1 <= words.length <= 100; 1 <= words[i].length <= 100; words[i] consists of lowercase English letters'),
('Count Distinct Substrings', 'Hash Table', 'hard', 'Given a string, count the number of distinct substrings using rolling hash technique.', '1 <= s.length <= 5000; s consists of lowercase English letters'),
('Max Points on Line', 'Hash Table', 'hard', 'Given n points on a 2D plane, find the maximum number of points that lie on the same straight line using hash map for slope storage.', '1 <= points.length <= 300; points[i].length == 2; -10^4 <= xi, yi <= 10^4'),
('Longest Duplicate Substring', 'Hash Table', 'hard', 'Given a string s, find the longest duplicate substring using binary search with rolling hash.', '2 <= s.length <= 5 * 10^4; s consists of lowercase English letters'),
('Bus Routes', 'Hash Table', 'hard', 'You are given an array routes where routes[i] is a bus route. Find minimum buses needed to travel from source to target using hash-based BFS.', '1 <= routes.length <= 500; 1 <= routes[i].length <= 10^5; 0 <= routes[i][j] < 10^6'),
('Shortest Path All Keys', 'Hash Table', 'hard', 'Given a 2D grid with keys and locks, find shortest path to collect all keys using hash table to track state (position + keys collected).', '1 <= grid.length, grid[i].length <= 30; grid consists of characters: ".", "#", "@", lowercase letters, uppercase letters'),
('Word Squares', 'Hash Table', 'hard', 'Given an array of unique strings, return all word squares you can build using hash table for efficient prefix lookup.', '1 <= words.length <= 1000; 1 <= words[i].length <= 4; all words have same length');

INSERT INTO test_cases (title, index, input, output) VALUES
('Substring Concatenation All Words', 1, '{"s": "barfoothefoobarman", "words": ["foo","bar"]}', '[0,9]'),
('Substring Concatenation All Words', 2, '{"s": "wordgoodgoodgoodbestword", "words": ["word","good","best","word"]}', '[]'),
('Minimum Window Substring', 1, '{"s": "ADOBECODEBANC", "t": "ABC"}', '"BANC"'),
('Minimum Window Substring', 2, '{"s": "a", "t": "a"}', '"a"'),
('Palindrome Pairs', 1, '{"words": ["abcd","dcba","lls","s","sssll"]}', '[[0,1],[1,0],[3,2],[2,4]]'),
('Palindrome Pairs', 2, '{"words": ["bat","tab","cat"]}', '[[0,1],[1,0]]'),
('Alien Dictionary', 1, '{"words": ["wrt","wrf","er","ett","rftt"]}', '"wertf"'),
('Alien Dictionary', 2, '{"words": ["z","x"]}', '"zx"'),
('Count Distinct Substrings', 1, '{"s": "abab"}', '7'),
('Count Distinct Substrings', 2, '{"s": "aaa"}', '3'),
('Max Points on Line', 1, '{"points": [[1,1],[2,2],[3,3]]}', '3'),
('Max Points on Line', 2, '{"points": [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]}', '4'),
('Longest Duplicate Substring', 1, '{"s": "banana"}', '"ana"'),
('Longest Duplicate Substring', 2, '{"s": "abcd"}', '""'),
('Bus Routes', 1, '{"routes": [[1,2,7],[3,6,7]], "source": 1, "target": 6}', '2'),
('Bus Routes', 2, '{"routes": [[7,12],[4,5,15],[6],[15,19],[9,12,13]], "source": 15, "target": 12}', '-1'),
('Shortest Path All Keys', 1, '{"grid": ["@.a..","###.#","b.A.B"]}', '8'),
('Shortest Path All Keys', 2, '{"grid": ["@..aA","..B#.","....b"]}', '6'),
('Word Squares', 1, '{"words": ["area","lead","wall","lady","ball"]}', '[["wall","area","lead","lady"],["ball","area","lead","lady"]]'),
('Word Squares', 2, '{"words": ["abat","baba","atan","atal"]}', '[["baba","abat","baba","atan"],["baba","abat","baba","atal"]]');




--####################################################--

UPDATE questions 
SET topic = LOWER(topic);

