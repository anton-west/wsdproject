import * as userService from "../../services/userService.js"    //user services
import * as vdService from "../../services/validationService.js"  //validation services
import * as rprtService from "../../services/reportService.js"  //reporting services

////////////////////////////////////////////////////////////////////////////////
//landing page
////////////////////////////////////////////////////////////////////////////////

const showLandingPage = async({render, state, session}) => {
    const data = {
        authenticated: await state.session.get('authenticated'),
        condition: await rprtService.getCondition()
    };
    render('index.ejs', data);
}

////////////////////////////////////////////////////////////////////////////////
//loggin in and registering
////////////////////////////////////////////////////////////////////////////////

const showLoginPage = async({render,state}) => {
    let data = await userService.getLoginData();
    data.authenticated = await state.session.get('authenticated');
    render('login.ejs', data);
}

const showRegisterPage = async ({render,state}) => {
    let data = await userService.getRegistrationData();
    data.authenticated = await state.session.get('authenticated');
    render('register.ejs', data);
}

const showLogoutPage = async({render,state}) => {
    let data = {};
    data.authenticated = await state.session.get('authenticated');
    render('logout.ejs',data);
}

const registerUser = async ({request, render, response}) => {
    let data = await userService.getRegistrationData(request);  //get data
    data = await vdService.validateRegistrationData(data);      //validate data

    //if there are no error keys, then validation succeeded
    if(Object.keys(data.errors).length === 0) {
        userService.addUser(data.email, data.password);
        response.redirect('/auth/login');
    } else {
        render('register.ejs', data);
    }
}

const loginUser = async ({request, response, state, render}) => {
    let data = await userService.getLoginData(request); //get data
    data = await vdService.validateLoginData(data);     //validate data

    //if there are no error keys, then validation succeeded and user can login
    if (Object.keys(data.errors).length === 0) {
        //set some session cookies    
        await state.session.set("authenticated", true)
        await state.session.set("user_id", userService.getUserId(data.email));
        response.redirect('/');
    } else {
        render('login.ejs', data);
    }
}

const logoutUser = async ({state, response}) => {
    state.session.set('authenticated', false);
    response.redirect('/');
}


////////////////////////////////////////////////////////////////////////////////
//reporting
////////////////////////////////////////////////////////////////////////////////

const showReportingPage = async({ render, state }) => {

    let data = await rprtService.getReportData(state.session);
    data.authenticated = await state.session.get('authenticated');

    const user_id = await state.session.get('user_id');
    const morningDone = await rprtService.morningReportDone(user_id);
    const eveningDone = await rprtService.eveningReportDone(user_id);

    data.morningDone = morningDone;
    data.eveningDone = eveningDone;

    console.log(data);

    render('reporting.ejs', data);
}

const handleReportData = async({request, render, state, response}) => {
    const reportData = await rprtService.getReportData(state.session, request);

    console.log(reportData);

    if(Object.keys(reportData.errors).length === 0) {
        rprtService.sendReportData(reportData);
        response.redirect('/behavior/reporting');
    }
    const user_id = await state.session.get('user_id');
    const morningDone = await rprtService.morningReportDone(user_id);
    const eveningDone = await rprtService.eveningReportDone(user_id);

    reportData.morningDone = morningDone;
    reportData.eveningDone = eveningDone;

    render('reporting.ejs', reportData);
}

////////////////////////////////////////////////////////////////////////////////
//summary
////////////////////////////////////////////////////////////////////////////////

const showSummaryPage = async({render, state, monthArg, weekArg}) => {
    let d = new Date();
    let nOfMonth = d.getMonth() + 1;
    if(monthArg != null && monthArg != "") {
        nOfMonth = monthArg;
    }

    let nOfWeek = vdService.getNumberOfWeek();
    if(weekArg != null && weekArg != "") {
        nOfWeek = weekArg;
    }

    const user_id = await state.session.get('user_id');
    const month = await rprtService.getMonthlyData(user_id, nOfMonth);
    const week = await rprtService.getWeeklyData(user_id, nOfWeek);

    const data = {
        nOfMonth: nOfMonth,
        nOfWeek: nOfWeek,
        month: month,
        week: week,
        authenticated: await state.session.get('authenticated'),
    };

    console.log(data);

    render('summary.ejs', data);
}

const summaryPageInput = async({render, state, request}) => {
    const body = request.body();
    const params = await body.value;

    const month = params.get('month');
    const week = params.get('week');

    console.log("month: "+month+", week: "+week);
    
    await showSummaryPage({render, state, monthArg:month, weekArg:week});
}

export { showLandingPage, showLoginPage, showRegisterPage, showLogoutPage, registerUser, loginUser, logoutUser,
    showReportingPage, handleReportData, showSummaryPage, summaryPageInput };