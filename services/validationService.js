import { executeQuery } from "../database/database.js"
import { bcrypt } from "../deps.js"
import { vs } from "../deps.js"

////////////////////////////////////////////////////////////////////////////////
//validasaur rules here
////////////////////////////////////////////////////////////////////////////////

const registrationRules = {
    email: [vs.required, vs.isEmail],
    password: [vs.required, vs.minLength(4)],
};

const loginRules = {
    email: [vs.required, vs.isEmail],
    password: [vs.required]
};

const morningRules = {
    date: [vs.required, vs.isDate],
    sleepDur: [vs.required, vs.minNumber(0)],
    sleepQual: [vs.required, vs.numberBetween(1, 5)],
    generalMood: [vs.required, vs.numberBetween(1, 5)]
};

const eveningRules = {
    date: [vs.required, vs.isDate],
    sportDur: [vs.required, vs.minNumber(0)],
    studyDur: [vs.required, vs.minNumber(0)],
    eatingReg: [vs.required, vs.numberBetween(1, 5)],
    eatingQual: [vs.required, vs.numberBetween(1, 5)],
    generalMood: [vs.required, vs.numberBetween(1, 5)]
};

////////////////////////////////////////////////////////////////////////////////
//validation functions here
////////////////////////////////////////////////////////////////////////////////

export const getNumberOfWeek = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export const userExists = async (email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);

    if(res.rowsOfObjects().length === 0) {
        return false;
    } else {
        return true;
    }
}

export const passwordMatches = async(email, password) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    const obj = res.rowsOfObjects()[0];

    const hash = obj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (passwordCorrect) {
        return true;
    } else {
        return false;
    }
}

export const validateRegistrationData = async (data) => {
    const [passes, errors] = await vs.validate(data, registrationRules);
    data.errors = errors;
    
    if(passes && data.password != data.verification) {
        data.errors.verification = {required: "password does not match verification" };
    }
    const user = await userExists(data.email);
    if(passes && user) {
        data.errors.email = {required: "email is already registered" };
    }

    return data;
}

export const validateLoginData = async (data) => {
    const [passes, errors] = await vs.validate(data, loginRules);
    data.errors = errors;

    if(passes && ! await userExists(data.email)) {
            data.errors.email = {required: "wrong password or email" };
    } else if(passes && ! await passwordMatches(data.email, data.password)) {
            data.errors.email = {required: "wrong password or email" };
    }
    return data;
}

export const validateMorningData = async (data) => {
    const [passes, errors] = await vs.validate(data, morningRules);
    data.errors = errors;

    return data;
}

export const validateEveningData = async (data) => {
    const [passes, errors] = await vs.validate(data, eveningRules);
    data.errors = errors;

    return data;
}