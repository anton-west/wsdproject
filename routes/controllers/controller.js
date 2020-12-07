import * as service from "../../services/service.js"

//login and registering
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

//reporting
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

    if(params.has('sleep duration')) {

        const data = {
            user_id: await session.get('user_id'),
            date: params.get('date'),
            sleepDur: Number(params.get('sleep duration')),
            sleepQaul: Number(params.get('sleep quality')),
            generalMood: Number(params.get('general mood'))
        };
        
        service.sendMorningData(data);
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
        
        service.sendEveningData(data);
    }
}

//summaries

const showSummaryPage = async({render, session}) => {
    const authenticated = await session.get('authenticated');

    if(!authenticated) {
        return
    }
    const user_id = await session.get('user_id');
    const month = await service.getMonthlyData(user_id, null);
    const week = await service.getWeeklyData(user_id, null);

    const data = {
        month: month,
        week: week
    };

    console.log(data);

    render('summary.ejs', data);
}

export { showLoginPage, showRegisterPage, registerUser, loginUser,
    showReportingPage, handleReportData, showSummaryPage};