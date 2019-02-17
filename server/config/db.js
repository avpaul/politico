import { Pool } from 'pg';
import ENV from 'dotenv';

ENV.config();

class Database {
    constructor() {
        this.DB_URL = (process.env.MODE === 'prod') ? process.env.REMOTE_DATABASE_URL : process.env.LOCAL_DATABASE_URL;
        this.pool = new Pool({
            connectionString: this.DB_URL,
        });
        this.pool.on('connect', () => {
            console.log('connected to the database');
        });
        this.pool.on('error', (err, client) => {
            console.error(`unexpected error on idle client ${client}`);
            // process.exit(-1);
        });
        this.pool.on('remove', () => {
            console.log('client removed');
            // process.exit(0);
        });
    }
}

export default new Database();
