# My Budget App

My Budget App is a full-stack application that helps users track their weekly expenses in various categories such as food, coffee, and alcohol. The frontend is built with React and Material-UI, while the backend is powered by Node.js, Express, and MySQL.

## Features

- View a summary of weekly expenses.
- Add or edit expense entries.
- Visualize expenses with stylish icons and cards.
- Responsive design for desktop and mobile use.

## Tech Stack

**Frontend:**

- React
- Material-UI
- React Router
- React Icons
- TypeScript

**Backend:**

- Node.js
- TypeScript
- Express
- MySQL
- Jest (for testing)

Project Structure:

my-budget-app/
├── frontend/ # Front-end (React)
│ ├── package.json
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/  
│ │ ├── App.tsx
│ │ └── ...  
│ └── tsconfig.json  
├── backend/ # Back-end (Node.js)
│ ├── src/
│ │ ├── controllers/
│ │ ├── db/
│ │ ├── routes/
│ │ ├── app.ts
│ │ ├── server.ts  
│ │ └── ...
│ ├── package.json
│ ├── tsconfig.json
│ └── .env
└── README.md

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm or Yarn
- MySQL

### Installing

Clone the repository to your local machine:

```
Make sure you set the database password in the .env file , the database table used here is called "expenses" you can change that in expensesQueries.ts
```

```bash
git clone git@github.com:syedzubi/Billroo_Tech_Assessment.git
cd my-budget-app
```
