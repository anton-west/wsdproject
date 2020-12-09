import * as userService from "../../services/userService.js"    //user services
import * as vdService from "../../services/validationService.js"  //validation services
import * as rprtService from "../../services/reportService.js"  //reporting services

////////////////////////////////////////////////////////////////////////////////
//loggin in and registering
////////////////////////////////////////////////////////////////////////////////

const showLoginPage = async({render}) => {
    render('login.ejs', await userService.getLoginData());
}

const showRegisterPage = async ({render}) => {
    render('register.ejs', await userService.getRegistrationData());
}

const showLogoutPage = async({render}) => {
    render('logout.ejs');
}

const registerUser = async ({request, render}) => {
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

const loginUser = async ({request, response, session, render}) => {
    let data = await userService.getLoginData(request); //get data
    data = await vdService.validateLoginData(data);     //validate data

    //if there are no error keys, then validation succeeded and user can login
    if (Object.keys(data.errors).length === 0) {
        //set some session cookies    
        await session.set("authenticated", true)
        await session.set("user_id", userService.getUserId(data.email));
        response.redirect('/behavior/summary');
    } else {
        render('login.ejs', data);
    }
}

const logoutUser = async ({session, response}) => {
    session.set('authenticated', false);
    response.redirect('/');
}


////////////////////////////////////////////////////////////////////////////////
//reporting
////////////////////////////////////////////////////////////////////////////////

const showReportingPage = async({ render, session }) => {

    const morningDone = await rprtService.morningReportDone(session);
    const eveningDone = await rprtService.eveningReportDone(session);

    const data = {
        morningDone: morningDone,
        eveningDone: eveningDone
    };  

    render('reporting.ejs', data);
}

const handleReportData = async({request, session}) => {
    const reportData = await rprtService.getReportData(request, session);
    rprtService.sendReportData(reportData);
}

////////////////////////////////////////////////////////////////////////////////
//summary
////////////////////////////////////////////////////////////////////////////////

const showSummaryPage = async({render, session, monthArg, weekArg}) => {
    let d = new Date();
    let nOfMonth = d.getMonth() + 1;
    if(monthArg != null && monthArg != "") {
        nOfMonth = monthArg;
    }

    let nOfWeek = vdService.getNumberOfWeek();
    if(weekArg != null && weekArg != "") {
        nOfWeek = weekArg;
    }

    const user_id = await session.get('user_id');
    const month = await rprtService.getMonthlyData(user_id, nOfMonth);
    const week = await rprtService.getWeeklyData(user_id, nOfWeek);

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

export { showLoginPage, showRegisterPage, showLogoutPage, registerUser, loginUser, logoutUser,
    showReportingPage, handleReportData, showSummaryPage, summaryPageInput };