import { createConnection } from 'typeorm';
import { app } from './app';

const port = process.env.PORT || 5000;
(async function () {
    await console.log("Connecting to the database....");
    await createConnection({
        "name": "default",
        "type": "postgres",
        "port": Number(process.env.DB_PORT),
        "host": "localhost",
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "synchronize": true,
        "logging": false,
        "entities": [
            "src/entity/**/*.ts"
        ],
        "migrations": [
            "src/migration/**/*.ts"
        ],
        "subscribers": [
            "src/subscriber/**/*.ts"
        ],
        "cli": {
            "entitiesDir": "src/entity",
            "migrationsDir": "src/migration",
            "subscribersDir": "src/subscriber"
        }
    })
        .catch((err) => {
            throw err;
        })
    console.log("Connected!")
    app.listen(port, () => {
        console.log(`The server is up on http://localhost:${port}`);
    });
})();

