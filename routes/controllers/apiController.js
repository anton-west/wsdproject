import * as vdService from "../../services/validationService.js"  //validation services
import * as rprtService from "../../services/reportService.js"  //reporting services

const weekAverage = async ({response}) => {
    const data = await rprtService.get7DayData();

    response.body = data;
}

const AverageOnDay = async ({params, response}) => {
    
    const date = params.year + "-" + params.month + "-" + params.day

    const result = await rprtService.getDayData(date);

    response.body = result;
}

export { weekAverage, AverageOnDay }