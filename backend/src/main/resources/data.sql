-- USERS
INSERT INTO users (id, firstname, lastname, email) VALUES
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'Priya', 'Gill', 'priyagil@my.yorku.ca'),
('ff088084-a0b2-435f-a7a6-1d6df8945956', 'Priya', 'Gill', '2004priyagill@gmail.com'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'Abrar', 'Kassim', 'abrarkassim101@gmail.com');
-- add more eventually with diff names for groups

-------------------------------------------------------
-- ABRAR (6899c10f-f3e4-4101-b7fe-c72cbe0e07ba) DATA
------------------------------------------------------
-- SEPTEMBER 2025 EXPENSES
INSERT INTO expenses (user_id, category, amount, description, date) VALUES
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'GROCERIES', 82.60, 'Weekly grocery shopping', '2025-09-03'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'DINING', 18.75, 'Lunch at food court', '2025-09-05'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'DINING', 35.40, 'Dinner out', '2025-09-10'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'TRANSPORTATION', 30.00, 'Monthly bus pass', '2025-09-01'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'ENTERTAINMENT', 15.00, 'Movie ticket', '2025-09-14'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'SHOPPING', 60.00, 'Clothes purchase', '2025-09-16'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'HEALTH', 25.00, 'Pharmacy purchase', '2025-09-18'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'EDUCATION', 45.00, 'Textbook', '2025-09-20'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'MISCELLANEOUS', 19.50, 'Gift card', '2025-09-25');

-- SEPTEMBER BUDGETS
INSERT INTO budgets (user_id, category, month, max_amount, current_amount) VALUES
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'GROCERIES', '2025-09', 150.00, 82.60),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'DINING', '2025-09', 120.00, 54.15),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'TRANSPORTATION', '2025-09', 80.00, 30.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'ENTERTAINMENT', '2025-09', 70.00, 15.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'SHOPPING', '2025-09', 100.00, 60.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'HEALTH', '2025-09', 50.00, 25.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'EDUCATION', '2025-09', 100.00, 45.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'MISCELLANEOUS', '2025-09', 40.00, 19.50);

-- OCTOBER 2025 EXPENSES
INSERT INTO expenses (user_id, category, amount, description, date) VALUES
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'GROCERIES', 75.25, 'Grocery shopping', '2025-10-03'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'DINING', 22.50, 'Lunch at cafe', '2025-10-05'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'DINING', 60.50, 'Birthday dinner', '2025-10-09'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'TRANSPORTATION', 27.50, 'Uber ride', '2025-10-09'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'ENTERTAINMENT', 25.00, 'Movie night', '2025-10-10'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'SHOPPING', 80.75, 'Hoodie', '2025-10-25'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'EDUCATION', 45.73, 'School supplies', '2025-10-20'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'MISCELLANEOUS', 89.70, 'Office supplies', '2025-10-22');

-- OCTOBER BUDGETS
INSERT INTO budgets (user_id, category, month, max_amount, current_amount) VALUES
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'GROCERIES', '2025-10', 150.00, 75.25),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'DINING', '2025-10', 150.00, 83.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'TRANSPORTATION', '2025-10', 80.00, 27.50),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'ENTERTAINMENT', '2025-10', 80.00, 25.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'SHOPPING', '2025-10', 200.00, 80.75),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'EDUCATION', '2025-10', 120.00, 45.73),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'MISCELLANEOUS', '2025-10', 100.00, 89.70);

-- NOVEMBER 2025 EXPENSES
INSERT INTO expenses (user_id, category, amount, description, date) VALUES
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'GROCERIES', 68.40, 'Weekly groceries', '2025-11-02'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'DINING', 28.50, 'Lunch with friends', '2025-11-03'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'TRANSPORTATION', 30.00, 'Monthly bus pass', '2025-11-01'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'ENTERTAINMENT', 18.99, 'Netflix subscription', '2025-11-01'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'HEALTH', 35.00, 'Pharmacy purchase', '2025-11-05'),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'MISCELLANEOUS', 22.30, 'Gift for coworker', '2025-11-06');

-- NOVEMBER BUDGETS
INSERT INTO budgets (user_id, category, month, max_amount, current_amount) VALUES
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'GROCERIES', '2025-11', 200.00, 68.40),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'DINING', '2025-11', 150.00, 28.50),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'TRANSPORTATION', '2025-11', 80.00, 30.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'ENTERTAINMENT', '2025-11', 50.00, 18.99),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'HEALTH', '2025-11', 70.00, 35.00),
('6899c10f-f3e4-4101-b7fe-c72cbe0e07ba', 'MISCELLANEOUS', '2025-11', 60.00, 22.30);

--------------------------------------------------------
-- PRIYA (71de7585-31f5-4c05-bd94-c5f9eb26a023) DATA
-------------------------------------------------------

-- SEPTEMBER 2025 EXPENSES
INSERT INTO expenses (user_id, category, amount, description, date) VALUES
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'GROCERIES', 82.30, 'Weekly groceries', '2025-09-07'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'DINING', 25.75, 'Brunch with friends', '2025-09-10'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'DINING', 12.99, 'Takeout dinner', '2025-09-18'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'TRANSPORTATION', 30.00, 'Monthly bus pass', '2025-09-01'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'ENTERTAINMENT', 18.99, 'Netflix subscription', '2025-09-01'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'SHOPPING', 95.00, 'New backpack', '2025-09-15'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'HEALTH', 32.00, 'Pharmacy items', '2025-09-20'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'EDUCATION', 55.00, 'Online course fee', '2025-09-25'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'MISCELLANEOUS', 20.50, 'Stationery', '2025-09-28');

-- SEPTEMBER BUDGETS
INSERT INTO budgets (user_id, category, month, max_amount, current_amount) VALUES
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'GROCERIES', '2025-09', 200.00, 147.70),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'DINING', '2025-09', 100.00, 38.74),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'TRANSPORTATION', '2025-09', 80.00, 30.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'ENTERTAINMENT', '2025-09', 50.00, 18.99),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'SHOPPING', '2025-09', 150.00, 95.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'HEALTH', '2025-09', 80.00, 32.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'EDUCATION', '2025-09', 100.00, 55.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'MISCELLANEOUS', '2025-09', 50.00, 20.50);

-- OCTOBER 2025 EXPENSES
INSERT INTO expenses (user_id, category, amount, description, date) VALUES
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'GROCERIES', 77.80, 'Weekly grocery shopping', '2025-10-04'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'DINING', 22.50, 'Lunch at cafe', '2025-10-08'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'TRANSPORTATION', 30.00, 'Monthly bus pass', '2025-10-01'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'ENTERTAINMENT', 25.00, 'Movie night', '2025-10-10'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'SHOPPING', 120.00, 'Clothes', '2025-10-20'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'HEALTH', 40.00, 'Pharmacy', '2025-10-15'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'EDUCATION', 60.00, 'Course materials', '2025-10-22'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'MISCELLANEOUS', 30.00, 'Gift', '2025-10-28');

-- OCTOBER BUDGETS
INSERT INTO budgets (user_id, category, month, max_amount, current_amount) VALUES
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'GROCERIES', '2025-10', 200.00, 77.80),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'DINING', '2025-10', 100.00, 22.50),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'TRANSPORTATION', '2025-10', 80.00, 30.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'ENTERTAINMENT', '2025-10', 50.00, 25.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'SHOPPING', '2025-10', 150.00, 120.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'HEALTH', '2025-10', 80.00, 40.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'EDUCATION', '2025-10', 100.00, 60.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'MISCELLANEOUS', '2025-10', 50.00, 30.00);

-- November 2025 EXPENSES
INSERT INTO expenses (user_id, category, amount, description, date) VALUES
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'GROCERIES', 64.25, 'Weekly groceries at No Frills', '2025-11-02'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'DINING', 18.50, 'Lunch on campus', '2025-11-03'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'ENTERTAINMENT', 18.99, 'Netflix subscription', '2025-11-01'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'TRANSPORTATION', 30.00, 'TTC monthly pass', '2025-11-01'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'HEALTH', 22.75, 'Pharmacy items', '2025-11-04'),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'MISCELLANEOUS', 15.00, 'Small gift for classmate', '2025-11-05');

-- November 2025 BUDGETS
INSERT INTO budgets (user_id, category, month, max_amount, current_amount) VALUES
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'GROCERIES', '2025-11', 180.00, 64.25),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'TRANSPORTATION', '2025-11', 60.00, 30.00),
('71de7585-31f5-4c05-bd94-c5f9eb26a023', 'MISCELLANEOUS', '2025-11', 40.00, 15.00);
