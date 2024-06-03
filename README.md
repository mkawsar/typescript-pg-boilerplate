# Node.js TypeScript TypeORM PostgreSQL Project

This project is a simple example of a Node.js application using TypeScript, TypeORM for database operations, and PostgreSQL as the database.

## Features
- User Registration
- User authentication
- Role managment
- Express.js server setup

## Requirements

Ensure you have the following software installed on your machine:

- Node.js
- npm (Node Package Manager)
- TypeScript
- TypeORM
- PostgreSQL
- JWT (Json Web Token)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mkawsar/typescript-pg-boilerplate.git
   cd typescript-pg-boilerplate
   ```
2. Install the project dependency
    ```bash
    npm install
    ```
## Configuration
1. Database Configuration: Edit the ormconfig.json file to set up your PostgreSQL connection settings.
    ```json
    {
        "type": "postgres",
        "host": "******",
        "port": 5432,
        "username": "******",
        "password": "******",
        "database": "******",
        "entities": ["./src/entity/*.ts"],
        "migrations": ["./src/migration/*.ts"],
        "cli": {
            "entitiesDir": "./src/entity",
            "migrationsDir": "./src/migration"
        }
    }
    ```

2. Environment Variables: If applicable, set environment variables such as `DATABASE_URL` to customize database connections.

3. Create environment file and setup database, SMTP and change to dev to prod mode.
    ```bash
    cp .env.example .env
    ```

## Usage
1. Generate database migration file from Entity file
    ```bash
    npm run migration:generate {EntityName}
    ```
2. Migration the database files
    ```bash
    npm run migration:run
    ```
3. Compile TypeScript: Compile the TypeScript code to JavaScript.
    ```bash
    npm run build
    ```
4. Start the Application: Run the compiled JavaScript code.
    ```bash
    npm run start:dev
    ```
5. API Endpoints: Once the server is running, you can access the API endpoints:
    * POST `/api/v1/user/registration`
    * POST `/api/v1/user/account/verification`
    * POST `/api/v1/auth/login`
    * GET `/api/v1/auth/user`
    * GET `/api/v1/user/list`
    * DELETE `/api/v1/auth/logout`
6. Get all route list
    * GET `/routes`

## Contributing
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/foo-bar`).
3. Make your changes.
4. Commit your changes (git commit -am `Add some feature`).
5. Push to the branch (`git push origin feature/foo-bar`).
6. Create a new Pull Request.

