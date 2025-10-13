# Product Backlog

**1. Setup Login**

As a returning user, I want to securely log in to my account so that I can access my saved data and continue tracking my progress.

Acceptance Criteria:
- The system must allow login using a valid email and password.
- Invalid credentials should trigger an error message.
- Passwords are encrypted and not stored in plain text.

**2. Sign Up**

As a new user, I want to create an account so that I can start using the app.

Acceptance Criteria:
- The signup form should include fields for email, password, and password confirmation.
- The system validates the email format and enforces strong password rules.
- Duplicate emails are not allowed.

**3. Sign Out**

As a logged-in user, I want to sign out of my account so that my personal information remains secure.

Acceptance Criteria:
- A visible “Sign Out” button is available on the main dashboard.
- Clicking “Sign Out” ends the user’s session and redirects to the login page.
- The user cannot access protected pages without logging in again.

**4. Set Goals**

As a user, I want to set personal financial goals so that I can track my progress and stay on budget.

Acceptance Criteria:
- Users can input a goal name and their target amount.
- Goals are saved to the user’s account and visible on their dashboard.
- The app tracks progress toward each goal based on user activity or entered data.

**5. View Group Expenses**

As a user, I can navigate to the “Group Expenses” page from the navigation bar so that I can easily view all shared expenses for my groups in one place.

Acceptance Criteria:
- The navigation bar includes a “Group Expenses” option 
- Clicking “Group Expenses” redirects the user to the Group Expenses page.
- The page displays a list of all groups the user is part of.


**6. Create and Manage Groups**

As a user, I can create a new group and invite members to join using their username once the group is created so that we can collaboratively manage and track our shared expenses.

Acceptance Criteria:
- The user can click a “Create Group” button and enter a group name.
- After creation, the user can invite members by entering their usernames.
- All group members can view shared expenses within that group.

**7. Dashboard - add bar graph of expenses**

As a user, I want to see a bar graph of my expenses for each month so that I can easily understand my spending trends and distribution.

Acceptance Criteria:
- The dashboard displays a bar graph summarizing total expenses per month based on category
- The graph updates automatically when new expenses are added, edited, or deleted.

**8. Piechart with interactive Legend**

As a user, I can click on a category in the pie chart legend to view all expenses belonging to that category so that I can easily see detailed spending for specific areas.

Acceptance Criteria:
- The pie chart shows the percentage of total spending by category for the current month.
- Each category label in the pie chart legend is clickable.
- Clicking a category redirects the user to a filtered list or page showing all expenses for that category.

**9. View the history of expenses**

As a user, I can navigate to the “Expense History” page from the navigation bar so that I can review all my past transactions in one place.

Acceptance Criteria:
- The navigation bar includes a “History” or “Expenses” option, and clicking it redirects the user to a page listing all past expenses.
- Each transaction displays date, category, and amount.
- The transaction history updates automatically when new expenses are added or deleted.

**10. View history of goals/budgets**

As a user, I can navigate to the “Goals/Budget History” page from the navigation bar so that I can view my past goals from previous months.

Acceptance Criteria:
- The navigation bar includes a “Goals/Budget History” option.
- Clicking it opens a page showing all previous goals or budgets the user has set.
- Historical data remains accessible even after goals are completed or expired.

**11. Add and Split Group Expense**

As a user, I can log a shared expense and automatically split the cost among all group members so that everyone knows how much they owe to the person who added the shared expense.

Acceptance Criteria:
- The user can select a group and add a new expense with details.
- The system automatically divides the total expense equally among all members by default.
- The user can manually adjust individual member shares if needed.
- After submission, each member’s balance is updated to reflect how much they owe or are owed.

**12. Dynamic Debt Calculation and Summary**

The system will automatically calculate who owes who within the group and display the results clearly in a message or summary section so that everyone can easily settle balances. For example, instead of showing raw debts: “A owes B $50, B owes C $30”, the user will see optimized transactions: A → C $20.

Acceptance Criteria:
- The system calculates debts automatically whenever a new group expense is added, edited, or deleted.
- The summary displays clear, human-readable results (e.g., “A owes C $20”).
- The summary updates dynamically across all group members.
- If a group has no outstanding debts, the summary shows “All settled” or an equivalent message.

**13. Badges and Achievements**

As a user, I want to view my profile and see all the badges and achievements that I’ve earned, so that I can stay motivated and feel rewarded for keeping up with my budgeting goals.

Criteria Of Satisfaction:
- The profile page should display a list of badges (e.g., “3-Day Streak”, “Stayed Under Monthly Dining Budget”).
- Each badge should have a visual icon and/or title.
- Badges should update automatically when new achievements are unlocked.

**14. Alert Notifications for Budget Limits**

As Stacie (a roommate who shares expenses), I want to receive an alert notification when I’m close to exceeding any of my monthly budgets (ex: shopping, entertainment, groceries), so that I can adjust my spending before going over my limit.

Criteria Of Satisfaction:
- The system must send an alert when a user reaches 80–90% of their budget limit.
- Alerts should appear on a dashboard.
- The notification should include how much remains before hitting the limit.
- The alert should automatically disappear once the budget resets for the next month/period.

**15. Generate End-of-Month Spending Report**

As the traveller, I want to generate an end-of-month spending report that compares this month to previous months, so that I can  plan my future spending better.

Criteria Of Satisfaction:
- The report should display total spending by category (e.g., food, transportation, social).
- Users should see insights like “biggest expense category” or “% change from last month.”

**16. Create a new expense and add tag**

As a user, I want to be able to create a new expense and tag it with a category (like “Food,” “Transportation,” or “Entertainment”) so I can easily track and organize my spending.

Acceptance Criteria:
- The user can select a category from a predefined list.
- The expense is saved and displayed in the dashboard or expense list.
- Each expense shows its assigned category.

**17. Edit/Delete an Expense**

As a user, I want to edit or delete an existing expense so I can fix errors or remove expenses that are no longer relevant.

Acceptance Criteria
- The user can open any existing expense and modify its details
- The changes are saved and reflected in the dashboard and expense list.
- The total and category summaries update automatically after an edit or deletion.

**18. Add Recurring Monthly Expenses**

As a user, I want to set up recurring monthly expenses (like rent or subscriptions) so I don’t have to manually add them every month.

Acceptance Criteria
- The user can mark any expense as recurring monthly
- The recurring expenses automatically appear in future months.

**19. Create Dashboard (current month - default)**

As a user, I want the dashboard to display my current month’s expenses by default so I can quickly see my recent spending and budget progress.

Acceptance Criteria
- When opening the app, the dashboard automatically shows data for the current month.
- The user can view total spending, spending by category, and remaining budget.
- The dashboard updates automatically when new expenses are added, edited, or deleted.

**20. View Profile**

As a user, I want to view my profile to see my personal information and account details, so that I can  manage my account.

Criteria Of Satisfaction:
- Displays name, username, email, account creation date, and profile picture/avatar.
- Includes “Edit” and “Delete Account” options.
- Profile button on navigation bar.
- Also displays badges/achievements.
