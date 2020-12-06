import { Router } from "../deps.js";

import * as controller from "./controllers/controller.js"

const router = new Router();
router.get('/', controller.test);

router.get('/login', controller.showLoginPage);
router.post('/login', controller.loginUser);

router.get('/register', controller.showRegisterPage);
router.post('/register', controller.registerUser);

router.get('/behavior/reporting', controller.showReportingPage);
router.post('/behavior/reporting', controller.handleReportData);


export { router };