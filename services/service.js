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

const sendEveningData = async(data) => {
    console.log(data);
    const str = "INSERT INTO evenings (user_id, date, sport_amount, study_amount, eating_quality, eating_regularity, mood) VALUES ($1, $2, $3, $4, $5, $6, $7)"
    await executeQuery(str, data.user_id, data.date, data.sportDur, data.studyDur, data.eatingQual, data.eatingReg,  data.generalMood);
}

const precision = 4;

const getMonthlyData = async(user_id, month) => {
    let d = new Date();
    let n = d.getMonth() + 1;
    
    if(month != null) {
        n = month;
    }
   
    const sleep = await executeQuery("SELECT AVG(sleep_amount), AVG(sleep_quality) FROM mornings WHERE EXTRACT(MONTH FROM date) = $1 AND user_id = $2", n, user_id);
    const sportsAndStudy = await executeQuery("SELECT AVG(sport_amount), AVG(study_amount) FROM evenings WHERE EXTRACT(MONTH FROM date) = $1 AND user_id = $2", n, user_id);
    const mood = await executeQuery("SELECT AVG(m.mood) FROM (SELECT user_id, mood, date FROM mornings UNION ALL SELECT user_id, mood, date FROM evenings) AS m WHERE EXTRACT(MONTH FROM date) = $1 AND m.user_id = $2", n, user_id);

    const monthlyData = {
        sleepDur: Number(sleep.rows[0][0]).toPrecision(precision),
        sleepQual: Number(sleep.rows[0][1]).toPrecision(precision),
        sportDur: Number(sportsAndStudy.rows[0][0]).toPrecision(precision),
        studyDur: Number(sportsAndStudy.rows[0][1]).toPrecision(precision),
        generalMood: Number(mood.rows[0][0]).toPrecision(precision)
    }

    console.log(monthlyData);

    return monthlyData;
}

const getWeeklyData = async(user_id, week) => {
    let n = getNumberOfWeek();

    if(week != null) {
        n = week;
    }

    const sleep = await executeQuery("SELECT AVG(sleep_amount), AVG(sleep_quality) FROM mornings WHERE EXTRACT(WEEK FROM date) = $1 AND user_id = $2", n, user_id);
    const sportsAndStudy = await executeQuery("SELECT AVG(sport_amount), AVG(study_amount) FROM evenings WHERE EXTRACT(WEEK FROM date) = $1 AND user_id = $2", n, user_id);
    const mood = await executeQuery("SELECT AVG(m.mood) FROM (SELECT user_id, mood, date FROM mornings UNION ALL SELECT user_id, mood, date FROM evenings) AS m WHERE EXTRACT(WEEK FROM date) = $1 AND m.user_id = $2", n, user_id);

    const weeklyData = {
        sleepDur: Number(sleep.rows[0][0]).toPrecision(precision),
        sleepQual: Number(sleep.rows[0][1]).toPrecision(precision),
        sportDur: Number(sportsAndStudy.rows[0][0]).toPrecision(precision),
        studyDur: Number(sportsAndStudy.rows[0][1]).toPrecision(precision),
        generalMood: Number(mood.rows[0][0]).toPrecision(precision)
    }

    console.log(weeklyData);

    return weeklyData;
}

const getNumberOfWeek = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}



export { userDoesNotExists, addUser, tryLogin, getUserId, sendMorningData, sendEveningData,
    getMonthlyData, getWeeklyData, getNumberOfWeek}