import ENV from 'dotenv';
import db from './db';

ENV.config();

class Setup {
    constructor() {
        this.pool = db.pool;
        this.createTables();
    }

    async createTables() {
        const users = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            firstName VARCHAR(255),
            lastName VARCHAR(255),
            otherName VARCHAR(255),
            email VARCHAR(255) NOT NULL UNIQUE,
            phoneNumber INTEGER UNIQUE,
            passportUrl TEXT UNIQUE,
            userProfile TEXT,
            isAdmin BOOLEAN DEFAULT false,
            party TEXT,
            address TEXT,
            salt TEXT NOT NULL,
            hash TEXT NOT NULL
        );`;

        await this.pool.query(users)
            .then((res) => {
                // console.log(res);
            })
            .catch((error) => {
                console.log(error.message);
            });

        const parties = `
        CREATE TABLE IF NOT EXISTS parties (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            hqAddress VARCHAR(255) NOT NULL UNIQUE,
            logoUrl TEXT ,
            description TEXT
        );`;

        await  this.pool.query(parties)
            .then((res) => {
                // console.log(res);
            })
            .catch((error) => {
                console.log(error.message);
            });

        const office = `
        CREATE TABLE IF NOT EXISTS offices (
            id SERIAL PRIMARY KEY,
            type VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT
        );`;

        await this.pool.query(office)
            .then((res) => {
                // console.log(res);
            })
            .catch((error) => {
                console.log(error.message);
            });

        const candidate = `
        CREATE TABLE IF NOT EXISTS candidates (
            id SERIAL NOT NULL,
            office SERIAL REFERENCES offices(id),
            candidate SERIAL REFERENCES users(id),
            PRIMARY KEY(office,candidate)
        );`;

        await this.pool.query(candidate)
            .then((res) => {
                // console.log(res);
            })
            .catch((error) => {
                console.log(error.message);
            });

        const votes = `
        CREATE TABLE IF NOT EXISTS votes (
            id SERIAL,
            createdon TIMESTAMP,
            createdby SERIAL,
            office SERIAL,
            candidate SERIAL,
            PRIMARY KEY (office,createdby),
            FOREIGN KEY(candidate,office) REFERENCES candidates(candidate,office) ON DELETE CASCADE ON UPDATE CASCADE
        );`;

        await this.pool.query(votes)
            .then((res) => {
                // console.log(res);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
}

export default new Setup();
