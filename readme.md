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


# Project Structure

- **src/**
  - **config/**
    - `db.config.ts` – Database connection configuration.
  - **db/**
    - **models/** – Contains database models.
  - **schema/**
    - `schema.ts` – GraphQL schema definitions and resolvers.
  - **server.ts** – Apollo Server setup for GraphQL.
  - **helpers/** – Helper functions used throughout the application.
  - **middleware/** – Middleware functions for request handling.
  - **repositories/** – Repositories for data access (handles database interactions).
  - **resolvers/** – GraphQL resolvers to handle requests.
  - **routes/** – Express (or other framework) routes for API endpoints.
  - **services/** – Service layer for business logic.
  - **specs/** – Test specifications or related files.
  - **types/** – TypeScript types and interfaces.
  - `index.ts` – Main entry point of the application.

- **.env** – Environment variables for configuration.

- **package.json** – NPM dependencies, scripts, and project metadata.

- **tsconfig.json** – TypeScript configuration for compiling TypeScript files.

- **drizzle.config.ts** – Drizzle ORM configuration file.

