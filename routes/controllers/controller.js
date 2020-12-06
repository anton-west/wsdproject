import * as service from "../../services/service.js"

const test = ({render}) => {
    render('index.ejs');
}

const showLoginPage = async({render, session, response}) => {
    const authenticated = await session.get('authenticated');
    if(authenticated) {
        response.body = 'you are already logged in';
        return;
    }
    console.log(authenticated);
    render('login.ejs');
}

const showRegisterPage = ({render}) => {
    render('register.ejs');
}

const registerUser = async ({request, response}) => {
    const body = request.body();
    const params = await body.value;

    //TODO: do validation on params

    const email = params.get('email');
    const password = params.get('password');

    if(service.userDoesNotExists(email)) {
        service.addUser(email, password);
        response.body = 'user registered';
    } else  {
        response.body = 'user with given email already exists';
    }
}

const loginUser = async ({request, response, session}) => {
    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');

    if(await service.userDoesNotExists(email)) {
        response.body = 'an user with given email does not exist';
    } else if (await service.tryLogin(email, password)) {
        await session.set("authenticated", true)
        await session.set("user_id", service.getUserId(email));
        response.body = 'you are now logged in';
    } else {
        response.body = 'incorrect password';
    }
}

const showReportingPage = async({render, session, response}) => {
    const authenticated = await session.get('authenticated');

    if(authenticated) {
        render('reporting.ejs');
    } else {
        response.status = 401;
    }
    
}

const handleReportData = async({session, request, response}) => {
    const body = request.body();
    const params = await body.value;

    //get data here

    const date = params.get('date');
    const sleepDur = params.get('sleep duration');
    const sleepQaul = params.get('sleep quality');
    const generalMood = params.get('general mood');

    const data = {
        user_id: await session.get('user_id'),
        date: date,
        sleepDur: Number(sleepDur),
        sleepQaul: Number(sleepQaul),
        generalMood: Number(generalMood)
    };

    console.log(data);
    //send data to db here

    service.sendMorningData(data);

}

export { test, showLoginPage, showRegisterPage, registerUser, loginUser,
    showReportingPage, handleReportData};