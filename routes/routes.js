import { Router } from "../deps.js";

import * as userController from "./controllers/userController.js"

const router = new Router();

router.get('/auth/login', userController.showLoginPage);
router.post('/auth/login', userController.loginUser);

router.get('/auth/registration', userController.showRegisterPage);
router.post('/auth/registration', userController.registerUser);

router.get('/behavior/reporting', userController.showReportingPage);
router.post('/behavior/reporting', userController.handleReportData);

router.get('/behavior/summary', userController.showSummaryPage);
router.post('/behavior/summary', userController.summaryPageInput);

export { router };