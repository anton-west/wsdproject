import { Router } from "../deps.js";

import * as controller from "./controllers/controller.js"

const router = new Router();

router.get('/login', controller.showLoginPage);
router.post('/login', controller.loginUser);

router.get('/register', controller.showRegisterPage);
router.post('/register', controller.registerUser);

router.get('/behavior/reporting', controller.showReportingPage);
router.post('/behavior/reporting', controller.handleReportData);

router.get('/behavior/summary', controller.showSummaryPage);
router.post('/behavior/summary', controller.summaryPageInput);

export { router };