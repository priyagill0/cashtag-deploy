# Product Backlog

COMPLETED TASKS

**1. Add Recurring Monthly Expenses**

As Stacie, who manages shared apartment expenses with her roomates, I want to set up recurring monthly expenses such as rent, wifi or subscriptions so that I do not have to manually add them every month. This helps me stay organized and avoid confusion about which bills are paid or still pending.
Acceptance Criteria
- The user can mark any expense as recurring monthly
- The recurring expenses automatically appear in future months.

**2. Create Dashboard (current month - default)**

As Jordan, who wants a quick overview of his spending, I want my dashboard to show the current month’s expenses and budgets by default so I can see how I am doing without filtering or searching manually.

Acceptance Criteria
- When opening the app, the dashboard automatically shows data for the current month.
- The user can view total spending, spending by category, and remaining budget.
- The dashboard updates automatically when new expenses are added, edited, or deleted.

**3. View Group Expenses**

As Stacie, who shares bills and groceries with her roommates, I want to navigate to a “Group Expenses” page where I can view all shared expenses in one place so that I can easily keep track of who paid for what and stay fair among everyone.

Acceptance Criteria:
- The navigation bar includes a “Group Expenses” option 
- Clicking “Group Expenses” redirects the user to the Group Expenses page.
- The page displays a list of all groups the user is part of.

**4. View, Create and Manage Groups**

As Sarah who travels frequently and shares expenses with friends, I want to create and manage groups. I can invite users to join so that I can organize trip costs and keep all shared expenses with my friends in one place

Acceptance Criteria:
- The user can click a “Create Group” button and enter a group name.
- After creation, the user can invite members by entering their usernames.
- All group members can view shared expenses within that group.

**5. Piechart with interactive Legend**

As Jordan, a visual learner, who prefers seeing where the money is going, I want to click on categories in a pie chart legend to view all my expenses for that category easily.

Acceptance Criteria:
- The pie chart shows the percentage of total spending by category for the current month.
- Each category label in the pie chart legend is clickable.
- Clicking a category redirects the user to a filtered list or page showing all expenses for that category.

**6. Add and Split Group Expense**

As Stacie, who usually pays for group groceries or utilities that are shared, I want to enter a shared expense and have the software automatically split the cost among my roommates so that everyone can see how much they owe to avoid confusion.

Acceptance Criteria:
- The user can select a group and add a new expense with details.
- The system automatically divides the total expense equally among all members by default.
- The user can manually adjust individual member shares if needed.
- After submission, each member’s balance is updated to reflect how much they owe or are owed.

**7. Set Budgets**

As a university student, Jordan, who is trying to get control over his spending, I want to set personal financial goals and budgets so I can track my progress, know where my money goes, and I feel more confident about balancing my social life while also saving.

Acceptance Criteria:
- Users can input a category for the budget and their target amount.
- Budgets are saved to the user’s account, and reset every month.
- The app tracks progress toward each budget based on user activity or entered data (expenses).
- Only 1 budget allowed per expense category.

**8. View Budget Progress**

As Jordan Nguyen (a visually oriented student), I want to see progress bars for each spending category so I can easily tell how close I am to exceeding my budget.

Acceptance Criteria:
- Dashboard shows progress bars by category.
- Each bar displays spending amount vs. budget limit.
- Updates automatically when expenses are edited/deleted/added.



SPRINT 3 TASKS

**1. View history of goals/budgets**

As Stacie (an organized employee who likes to track her finances and stay on top of her budgets), I can navigate to the “Goals/Budget History” page from the navigation bar so that I can view my past goals from previous months.

Acceptance Criteria:
- The navigation bar includes a “Goals/Budget History” option.
- Clicking it opens a page showing all previous goals or budgets the user has set.
- Historical data remains accessible even after goals are completed or expired.

**2. Badges and Achievements**

As Sarah Ren (a tech-savvy traveller who likes achievements to be motivated to budget), I want to view my profile and see all the badges and achievements that I’ve earned, so that I can stay motivated and feel rewarded for keeping up with my budgeting goals.
Acceptance Criteria:
- The profile page should display a list of badges (e.g., “3-Day Streak”, “Stayed Under Monthly Dining Budget”).
- Each badge should have a visual icon and/or title.
- Badges should update automatically when new achievements are unlocked.

**3. Alert Notifications for Budget Limits**

As Stacie (a roommate who shares expenses), I want to receive an alert notification when I’m close to exceeding any of my monthly budgets (ex: shopping, entertainment, groceries), so that I can adjust my spending before going over my limit.

Acceptance Criteria:
- The system must send an alert when a user reaches 80–90% of their budget limit.
- Alerts should appear on a dashboard.
- The notification should include how much remains before hitting the limit.
- The alert should automatically disappear once the budget resets for the next month/period.

**4. Generate End-of-Month Spending Report**

As Sarah (the traveller), I want to generate an end-of-month spending report that compares this month to previous months, so that I can  plan my future spending better.

Acceptance Criteria:
- The report should display total spending by category (e.g., food, transportation, social).
- Users should see insights like “biggest expense category” or “% change from last month.”

**5. View Profile**

As a user, I want to view my profile to see my personal information and account details, so that I can  manage my account.

Criteria Of Satisfaction:
- Displays name, username, email, account creation date, and profile picture/avatar.
- Includes “Edit” and “Delete Account” options.
- Profile button on navigation bar.
- Also displays badges/achievements.

**6. Sign Out**

As Sarah, who travels and accesses her account from different devices and networks, I want to be able to sign out of my account from anywhere so that my data and group expense details stay private even if I am using public devices. 

Acceptance Criteria:
- A visible “Sign Out” button is available on the main dashboard.
- Clicking “Sign Out” ends the user’s session and redirects to the login page.
- The user cannot access protected pages without logging in again.

**7. Dynamic Debt Calculation and Summary**

As Stacie, who shares bills and groceries with her roommates, I want the system to calculate and summarize who owes who within our group so that everyone can see the final amounts. I want a summary that makes splitting costs and paying each other back quick and easy to access.

Acceptance Criteria:
- The system calculates debts automatically whenever a new group expense is added, edited, or deleted.
- The summary displays clear, human-readable results (e.g., “A owes C $20”).
- The summary updates dynamically across all group members.
- If a group has no outstanding debts, the summary shows “All settled” or an equivalent message.
