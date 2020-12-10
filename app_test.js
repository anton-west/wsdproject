import { superoak } from "./deps.js"
import { test } from "./deps.js"
import * as userService from "./services/userService.js"
import * as rprtService from "./services/reportService.js"

function compareKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

Deno.test("Call to rprtService.eveningReportDone() returns false for non existent user_id", async () => {
    test.assertEquals(await rprtService.eveningReportDone(-2), false);
});

Deno.test("Call to rprtService.morningReportDone() returns false for non existent user_id", async () => {
    test.assertEquals(await rprtService.morningReportDone(-2), false);
});

Deno.test("Call to rprtService.getCondition() returns boolean", async () => {
    test.assertEquals(typeof await rprtService.getCondition(), "boolean");
});

Deno.test("Call to rprtService.get7DayData() returns correctly formed data object", async () => {
    const testData = {
        sleepDuration: "",
        sleepQuality: "",
        sportDuration: "",
        studyDuration: "",
        generalMood: ""
    }
    test.assertEquals(compareKeys(await rprtService.get7DayData(), testData), true);
});

Deno.test("Call to rprtService.getDayData() returns correctly formed data object", async () => {
    const testData = {
        sleepDuration: "",
        sleepQuality: "",
        sportDuration: "",
        studyDuration: "",
        generalMood: ""
    }
    test.assertEquals(compareKeys(await rprtService.getDayData(), testData), true);
});

Deno.test("Call to rprtService.getMonthlyData() returns correctly formed data object", async () => {
    const testData = {
        sleepDur: "",
        sleepQual: "",
        sportDur: "",
        studyDur: "",
        generalMood: ""
    }
    test.assertEquals(compareKeys(await rprtService.getMonthlyData(-1, 1), testData), true);
});