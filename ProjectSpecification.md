# Project Specification: Polling App with QR Code Sharing (AI-Assisted Development)

## 1. Introduction & Project Goal
This project involves building a **Polling Application with QR Code Sharing** as part of the *AI for Developers* program.  

The application allows users to:
- Register
- Create polls
- Share them via unique links and QR codes for others to vote on  

The primary goal of building this project within the course is to provide **practical, step-by-step experience** in leveraging various **AI-powered development tools** across the entire software development lifecycle.  

We will actively use AI tools for planning, UI generation, code writing, testing, debugging, and deployment as we build this application together.  

---

## 2. Core Application Features

### Poll Management (for logged-in users)
- Create a new poll with a question and multiple answer options.  
- View a dashboard listing polls created by the user.  
- View the results of a specific poll.  
- Edit or delete created polls.  

### Voting Mechanism
- Public access to polls via unique URLs.  
- Interface for users to vote on a poll option.  
- Implementation to handle vote recording (and potentially prevent multiple votes).  

### Sharing & Access
- Automatic generation of a unique, shareable link for each created poll.  
- QR code generation and display encoding the unique poll link.  

### User Authentication
- User registration (using **Supabase Auth**).  
- User login/logout.  

### Results Display
- Visual representation of vote counts or percentages for each poll option (e.g., on the poll page).  

---

## 3. User Roles within the Application
- **Poll Creator (Registered User)**  
  Logs in, creates/manages polls, shares polls (link/QR), views results.  
- **Voter (Registered or Anonymous User)**  
  Accesses a poll via link/QR code, casts a vote.  

---

## 4. Technical Foundation
- **Platform:** Web Application  
- **Architecture:** Full-stack application built using **Next.js**  
- **Data Persistence:** Supabase (database service for user data, polls, and votes)  
- **Key Functionality:** QR code generation and unique link handling  
- **Deployment:** Vercel  

---

## 5. AI Tool Integration During Development
Throughout the course modules, we will integrate and demonstrate the use of various AI tools:  

- **Planning & Design**: Using AI chat (e.g., ChatGPT, Claude) to help structure data models, define API routes, and outline user flows.  
- **UI Generation**: Using tools like **v0.dev** to rapidly create and iterate on UI components (forms, displays, layouts) with **shadcn/ui**.  
- **Code Generation & Assistance**: Leveraging AI code assistants (e.g., Cursor, Zed, Trae, GitHub Copilot) extensively within the IDE for:  
  - Next.js components (React)  
  - API route handlers  
  - Database interaction logic (Supabase client)  
  - Utility functions  
- **Testing**: Using AI to generate test ideas, unit test structures (Jest/Vitest), and integration tests for API routes.  
- **Debugging**: Utilizing AI debugging features in IDEs or prompting AI chat tools to understand errors, refactor code, or explain complex segments.  

---

## 6. Chosen Technology Stack
- **Framework:** Next.js (App Router)  
- **Database & Auth:** Supabase  
- **Utility Libraries:** shadcn, qrcodejs, etc.  
- **Deployment Platform:** Vercel  

---

## 7. Project Outcomes
Upon completion of the relevant course modules, the outcomes will be:  

- **Completed Source Code**  
  - Git repository (e.g., GitHub) containing the full source code of the polling application.  
  - Commit history reflecting the AI-assisted development process.  

- **Live Deployed Application**  
  - A publicly accessible URL showcasing the functional, deployed application on Vercel.  

- **Comprehensive README.md**  
  - Explaining the project’s purpose and features.  
  - Instructions for setting up and running the project locally.  
  - Details of the technology stack used.  
  - Key examples and explanations of AI tool integration during the build process.  
