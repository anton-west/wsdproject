import { executeQuery } from "../database/database.js"
import { bcrypt } from "../deps.js"

//check if users is already registered, returns true if the given email does not exist in the database
const userDoesNotExists = async(email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    if(res.rowsOfObjects().length === 0) {
        return true;
    } else {
        return false;
    }
}

//add the user to the database
const addUser = async(email, password) => {
    const hash = await bcrypt.hash(password);
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2)", email, hash);
}

const tryLogin = async(email, password) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    const obj = res.rowsOfObjects()[0];

    const hash = obj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        return false;
    }
    return true;
}

export { userDoesNotExists, addUser, tryLogin }