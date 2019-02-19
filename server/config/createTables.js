import db from './db';

class Tables {
    // sql query for creating all tables
    constructor() {
        this.TABLES = [
            `CREATE TABLE IF NOT EXISTS
         users(
            id SERIAL PRIMARY KEY,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255)  NOT NULL,
            othername VARCHAR(255),
            email VARCHAR(255) NOT NULL UNIQUE,
            phoneNumber INTEGER UNIQUE,
            passportUrl TEXT UNIQUE,
            userProfile TEXT,
            isAdmin BOOLEAN DEFAULT false,
            salt TEXT NOT NULL,
            hash TEXT NOT NULL
         );
        `,

            `CREATE TABLE IF NOT EXISTS
        parties(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            hqAddress VARCHAR(255) NOT NULL UNIQUE,
            logoUrl TEXT ,
            description TEXT
        );
        `,

            `CREATE TABLE IF NOT EXISTS
        offices(
            id SERIAL PRIMARY KEY,
            type VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL ,
            description TEXT
        );
        `,

            `CREATE TABLE IF NOT EXISTS
        candidates(
            id SERIAL PRIMARY KEY,
            office SERIAL REFERENCES offices ON DELETE CASCADE ON UPDATE CASCADE,
            candidate SERIAL REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE
        );
        `,
            `CREATE TABLE IF NOT EXISTS
        votes(
            id SERIAL PRIMARY KEY,
            createdon TIMESTAMP,
            createdby TIMESTAMP,
            office SERIAL,
            candidate SERIAL,
            PRIMARY KEY (office,createdby),
            FOREIGN KEY(candidate,office) REFERENCES candidates(candidate,office) ON DELETE CASCADE ON UPDATE CASCADE
        );
        `,
            `CREATE TABLE IF NOT EXISTS
        petitions(
            id SERIAL PRIMARY KEY,
            createdOn TIMESTAMP,
            createdBy TIMESTAMP REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
            office SERIAL REFERENCES offices ON DELETE CASCADE ON UPDATE CASCADE,
            description TEXT
        );
        `];
        this.createTables();
    }

    createTables() {
        this.TABLES.forEach(async (table) => {
            await db.pool.query(table)
                .then((res) => {
                    console.log(res);
                    db.pool.end();
                })
                .catch((err) => {
                    console.log(err.message);
                    db.pool.end();
                });
        });
    }
}

export default new Tables();
