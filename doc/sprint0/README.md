## Motivation

The Budget & Expense Tracker will be made to help people manage money in a simple and fair way. Many young adults, like roommates or friends, find it hard to keep track of shared costs such as rent, groceries, or trip expenses. People often forget who paid last or how much each person owes, which can lead to stress or confusion.

Most apps only help with personal budgets or just with splitting bills but not both. This project brings the two together in a website. It helps users track their own spending, split group costs fairly, and see where their money is going.

The goal is to make money management clear and fair. With simple charts and goals, the tracker will help people stay organized and avoid money problems with friends.

## Installation

### Prerequisites:
- Node.js (v18+ recommended)  
- npm (comes with Node.js)  
- Java 17+ 
- Maven (for building the Spring Boot backend)

### Backend Setup:
1. Navigate to the backend directory: `cd backend`
2. Build the project: `mvn clean install -DskipTests`
3. Run the Spring Boot server: `mvn spring-boot:run`
4. The backend should now be running on: http://localhost:8080

### Frontend Setup:
1. Open a new terminal window and navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. The frontend should now be running on: http://localhost:3000

## Contribution

### Task Management:
We use Jira to assign and track all tickets, user stories, and bugs. Each branch corresponds to a Jira ticket, ensuring clear linkage between development work and project requirements.

### Pull Requests:

Once a feature or fix is complete:
- A pull request (PR) is created from the feature or fix branch into the develop branch.

- The PR is reviewed by at least one team member before merging.

- The main branch is updated only near the end of each sprint to maintain a clean, production-ready state.

### Summary of Our Git Flow:
| Branch Type | Example Name                           | Purpose                     | Merge Into             |
| ----------- | -------------------------------------- | --------------------------- | ---------------------- |
| `main`      | `main`                                 | Stable & Production-ready code       | —                      |
| `develop`   | `develop`                              | Integration of all features | `main` (end of each sprint) |
| `feature`   | `feature/E3TXS-19-add-login` | New features or stories     | `develop`              |
| `fix`       | `fix/E3TXS-19-resolve-login-error`     | Bug fixes                   | `develop`              |

- Feature (and fix) branches are named using the Jira ticket number, following the format: `feature/<Jira-ticket-ID>-<short-description>`.
  
### Contribution Process:

1. Check your assigned Jira ticket.
2. Create a branch from develop following the naming conventions.
3. Commit and push changes regularly to this branch.
4. Open a pull request into develop branch when the task is complete.
5. Wait for code review and approval before merging.


