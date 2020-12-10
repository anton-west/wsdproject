import * as vdService from "../../services/validationService.js"  //validation services
import * as rprtService from "../../services/reportService.js"  //reporting services

const weekAverage = async ({response}) => {
    const data = await rprtService.get7DayData();

    response.body = data;
}

const AverageOnDay = async ({params, response}) => {
    
    const date = new Date(
        Number(params.year), 
        Number(params.month) - 1, 
        Number(params.day)
    ).toISOString().substring(0,10);
    
    const result = await rprtService.getDayData(date);

    response.body = result;
}

export { weekAverage, AverageOnDay }