import * as service from "../../services/service.js"

const test = ({render}) => {
    render('index.ejs');
}

const showLoginPage = ({render}) => {
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

const loginUser = async ({request, response}) => {
    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');

    if(await service.userDoesNotExists(email)) {
        response.body = 'an user with given email does not exist';
    } else if (await service.tryLogin(email, password)) {
        response.body = 'you are now logged in';
    } else {
        response.body = 'incorrect password';
    }
}

export { test, showLoginPage, showRegisterPage, registerUser, loginUser };