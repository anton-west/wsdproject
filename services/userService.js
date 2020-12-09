import { executeQuery } from "../database/database.js"
import { bcrypt } from "../deps.js"
import { validateRegistrationData, validateLoginData, userExists, passwordMatches } from "./validationService.js"
/**
 * Functions that handle inserting and retrieving
 * user info from the database go here
 * 
 * Functions that also help with handling user
 * actions go here
 */


//add the user to the database
export const addUser = async(email, password) => {
    const hash = await bcrypt.hash(password);
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2)", email, hash);
}

export const getUserId = async(email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    const data = res.rowsOfObjects()[0];
    console.log("user id: " + data.id);
    return data.id;
}

export const getRegistrationData = async(request) => {

    const data = {
        email: '',
        password: '',
        verification: '',

        errors: {}
    }
    if(request) {
        const body = request.body();
        const params = await body.value;

        data.email = params.get('email');
        data.password = params.get('password');
        data.verification = params.get('verification');
    }
    
    return data;
}

export const getLoginData = async(request) => {

    const data = {
        email: '',
        password: '',

        errors: {}
    }
    if(request) {
        const body = request.body();
        const params = await body.value;

        data.email = params.get('email');
        data.password = params.get('password');
    }
    
    return data;
}