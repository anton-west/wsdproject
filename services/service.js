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

const getUserId = async(email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    const data = res.rowsOfObjects()[0];
    console.log("user id: " + data.id);
    return data.id;
}

const sendMorningData = async(data) =>{
    const str = "INSERT INTO mornings (user_id, date, sleep_amount, sleep_quality, mood) VALUES ($1, $2, $3, $4, $5)"
    await executeQuery(str, data.user_id, data.date, data.sleepDur, data.sleepQaul, data.generalMood);
}

const sendEveningData = async(data) =>{
    const str = "INSERT INTO evenings (user_id, date, sport_amount, study_amount, eating_qaulity, eating_regularity, mood) VALUES ($1, $2, $3, $4, $5, $6, $7)"
    await executeQuery(str, data.user_id, data.date, data.sportAmount, data.studyAmount, data.eatingQual, data.eatingReg,  data.generalMood);
}

export { userDoesNotExists, addUser, tryLogin, getUserId, sendMorningData, sendEveningData}