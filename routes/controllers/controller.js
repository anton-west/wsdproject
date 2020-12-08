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

    if(service.userDoesNotExists(email) === true) {
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

    if(await service.userDoesNotExists(email) === true) {
        response.body = 'an user with given email does not exist';
    } else if (await service.tryLogin(email, password) === true) {
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

    if(params.has('morning')) {

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

const showSummaryPage = async({render, session, monthArg, weekArg}) => {
    const authenticated = await session.get('authenticated');

    if(!authenticated) {
        return
    }

    let d = new Date();
    let nOfMonth = d.getMonth() + 1;
    if(monthArg != null && monthArg != "") {
        nOfMonth = monthArg;
    }

    let nOfWeek = service.getNumberOfWeek();
    if(weekArg != null && weekArg != "") {
        nOfWeek = weekArg;
    }

    const user_id = await session.get('user_id');
    const month = await service.getMonthlyData(user_id, nOfMonth);
    const week = await service.getWeeklyData(user_id, nOfWeek);

    const data = {
        nOfMonth: nOfMonth,
        nOfWeek: nOfWeek,
        month: month,
        week: week
    };

    console.log(data);

    render('summary.ejs', data);
}

const summaryPageInput = async({render, session, request}) => {
    const body = request.body();
    const params = await body.value;

    const month = params.get('month');
    const week = params.get('week');

    console.log("month: "+month+", week: "+week);

    await showSummaryPage({render, session, monthArg:month, weekArg:week});
}

export { showLoginPage, showRegisterPage, registerUser, loginUser,
    showReportingPage, handleReportData, showSummaryPage, summaryPageInput};