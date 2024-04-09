# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Generate database migration file from Entity file `npm run migration:generate {EntityName}`
4. Migration the database file `npm run migration:run`
5. Run `npm start` command
