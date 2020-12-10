import { Router } from "../deps.js";

import * as userController from "./controllers/userController.js"
import * as apiController from "./controllers/apiController.js"

const router = new Router();

router.get('/', userController.showLandingPage);

router.get('/auth/login', userController.showLoginPage);
router.get('/auth/logout', userController.showLogoutPage);
router.post('/auth/login', userController.loginUser);
router.post('/auth/logout', userController.logoutUser);

router.get('/auth/registration', userController.showRegisterPage);
router.post('/auth/registration', userController.registerUser);

router.get('/behavior/reporting', userController.showReportingPage);
router.post('/behavior/reporting', userController.handleReportData);

router.get('/behavior/summary', userController.showSummaryPage);
router.post('/behavior/summary', userController.summaryPageInput);

router.get('/api/summary', apiController.weekAverage;

export { router };