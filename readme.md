# Project Setup Guide

This project demonstrates a setup with **Apollo Server**, **Drizzle ORM**, and **GraphQL** using **Node.js** and **TypeScript**.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Version 16 or above)
- [npm](https://www.npmjs.com/) (Package manager for Node.js)
- A PostgreSQL (or any compatible) database

## 2. Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository_url>
cd <project_folder>
```

## 3. Install Dependencies

```bash
npm npm install
```

## 4. Configure Enviromental Variables

Create a .env file in the root of your project and add your database connection string.

```bash
Database_url = "Your database URL"
```

## 5. Project Structure

The project is organized as follows:
drizzle/ ├── src/ │ ├── config/ │ │ └── db.config.ts # Database connection │ ├── db/ │ │ └── models/ # Database models │ ├── schema/ │ │ └── schema.ts # GraphQL schema definitions and resolvers │ ├── server.ts # Apollo Server setup │ ├── helpers/ # Helper functions │ ├── middleware/ # Middleware functions │ ├── repositories/ # Repositories for data access │ ├── resolvers/ # GraphQL resolvers │ ├── routes/ # Express or other routes │ ├── services/ # Service layer for business logic │ ├── specs/ # Test specifications │ ├── types/ # TypeScript types │ └── index.ts # Main entry point ├── .env # Environment variables ├── package.json # NPM dependencies and scripts ├── tsconfig.json # TypeScript configuration └── drizzle.config.ts # Drizzle ORM configuration

