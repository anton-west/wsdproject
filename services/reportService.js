import { executeQuery } from "../database/database.js"
/**
 * Functions that handle inserting and retrieving
 * report data from the database go here
 */

 export const sendReportData = async(data) => {
     if(data.hasOwnProperty('morning')) {
        sendMorningData(data);
     } else {
        sendEveningData(data);
     }
 }

 //insert user specific morning report to db
const sendMorningData = async(data) =>{
    const str = "INSERT INTO mornings (user_id, date, sleep_amount, sleep_quality, mood) VALUES ($1, $2, $3, $4, $5)"
    executeQuery(str, data.user_id, data.date, data.sleepDur, data.sleepQaul, data.generalMood);
}

//insert user specific evening report to db
const sendEveningData = async(data) => {
    const str = "INSERT INTO evenings (user_id, date, sport_amount, study_amount, eating_quality, eating_regularity, mood) VALUES ($1, $2, $3, $4, $5, $6, $7)"
    executeQuery(str, data.user_id, data.date, data.sportDur, data.studyDur, data.eatingQual, data.eatingReg,  data.generalMood);
}

const precision = 4;

//get user specific monthly average data from db
export const getMonthlyData = async(user_id, month) => {
   
    const sleepDur = await executeQuery("SELECT AVG(sleep_amount) FROM mornings WHERE EXTRACT(MONTH FROM date) = $1 AND user_id = $2", month, user_id);
    const sleepQual = await executeQuery("SELECT AVG(sleep_quality) FROM mornings WHERE EXTRACT(MONTH FROM date) = $1 AND user_id = $2", month, user_id);
    const sportDur = await executeQuery("SELECT AVG(sport_amount), AVG(study_amount) FROM evenings WHERE EXTRACT(MONTH FROM date) = $1 AND user_id = $2", month, user_id);
    const studyDur = await executeQuery("SELECT AVG(study_amount) FROM evenings WHERE EXTRACT(MONTH FROM date) = $1 AND user_id = $2", month, user_id);
    const mood = await executeQuery("SELECT AVG(m.mood) FROM (SELECT user_id, mood, date FROM mornings UNION ALL SELECT user_id, mood, date FROM evenings) AS m WHERE EXTRACT(MONTH FROM date) = $1 AND m.user_id = $2", month, user_id);

    const monthlyData = {
        sleepDur: Number(sleepDur.rows[0][0]).toPrecision(precision),
        sleepQual: Number(sleepQual.rows[0][0]).toPrecision(precision),
        sportDur: Number(sportDur.rows[0][0]).toPrecision(precision),
        studyDur: Number(studyDur.rows[0][0]).toPrecision(precision),
        generalMood: Number(mood.rows[0][0]).toPrecision(precision)
    }

    console.log(monthlyData);

    return monthlyData;
}

//get user specific weekly average data from db
export const getWeeklyData = async(user_id, week) => { 

    const sleepDur = await executeQuery("SELECT AVG(sleep_amount) FROM mornings WHERE EXTRACT(WEEK FROM date) = $1 AND user_id = $2", week, user_id);
    const sleepQual = await executeQuery("SELECT AVG(sleep_quality) FROM mornings WHERE EXTRACT(WEEK FROM date) = $1 AND user_id = $2", week, user_id);
    const sportDur = await executeQuery("SELECT AVG(sport_amount), AVG(study_amount) FROM evenings WHERE EXTRACT(WEEK FROM date) = $1 AND user_id = $2", week, user_id);
    const studyDur = await executeQuery("SELECT AVG(study_amount) FROM evenings WHERE EXTRACT(WEEK FROM date) = $1 AND user_id = $2", week, user_id);
    const mood = await executeQuery("SELECT AVG(m.mood) FROM (SELECT user_id, mood, date FROM mornings UNION ALL SELECT user_id, mood, date FROM evenings) AS m WHERE EXTRACT(WEEK FROM date) = $1 AND m.user_id = $2", week, user_id);

    const weeklyData = {
        sleepDur: Number(sleepDur.rows[0][0]).toPrecision(precision),
        sleepQual: Number(sleepQual.rows[0][0]).toPrecision(precision),
        sportDur: Number(sportDur.rows[0][0]).toPrecision(precision),
        studyDur: Number(studyDur.rows[0][0]).toPrecision(precision),
        generalMood: Number(mood.rows[0][0]).toPrecision(precision)
    }

    console.log(weeklyData);

    return weeklyData;
}

export const getReportData = async(request, session) => {
    const body = request.body();
    const params = await body.value;

    if(params.has('morning')) {
        const data = {
            user_id: await session.get('user_id'),
            date: params.get('date'),
            sleepDur: Number(params.get('sleep duration')),
            sleepQaul: Number(params.get('sleep quality')),
            generalMood: Number(params.get('general mood'))
        };
        
        return data;
    } else {
        const data = {
            user_id: await session.get('user_id'),
            date: params.get('date'),
            sportDur: Number(params.get('sport duration')),
            studyDur: Number(params.get('study duration')),
            eatingReg: Number(params.get('eating regularity')),
            eatingQual: Number(params.get('eating quality')),
            generalMood: Number(params.get('general mood'))
        };

        return data;
    }
}

export const morningReportDone = async(session) => {
    const user_id = await session.get('user_id');

    const d = new Date();
    const dateString= d.toISOString().substring(0,10);

    const res = await executeQuery("SELECT * FROM mornings WHERE date = $1 AND user_id = $2", dateString, user_id);
    if(res.rowsOfObjects().length > 0) {
        return true;
    } else {
        return false;
    }
}

export const eveningReportDone = async(session) => {
    const user_id = await session.get('user_id');

    const d = new Date();
    const dateString= d.toISOString().substring(0, 10);

    const res = await executeQuery("SELECT * FROM evenings WHERE date = $1 AND user_id = $2", dateString, user_id);
    if(res.rowsOfObjects().length > 0) {
        return true;
    } else {
        return false;
    }
}