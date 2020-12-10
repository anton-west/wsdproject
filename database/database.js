import { Client } from "../deps.js";
import { config } from "../config/config.js";

const getClient = () => {
    const DATABASE_URL = Deno.env.toObject().DATABASE_URL;
    
    if(DATABASE_URL) {
        return new Client(DATABASE_URL);
    } else {
        return new Client(config.database);
    }
}
  
const executeQuery = async(query, ...args) => {
    const client = getClient();
    try {
        await client.connect();
        return await client.query(query, ...args);
    } catch (e) {
        console.log(e);
    } finally {
        await client.end();
    }
}

export { executeQuery };