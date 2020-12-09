let isMorningReport = 1;

const d = new Date();
const dateString = d.toISOString().substring(0,10);
document.getElementById("date1").value = dateString;
document.getElementById("date2").value = dateString;


const setMorningReport = () => {
    document.getElementById("button").value="click to fill out an evening report instead";
    document.getElementById("morning").style="display:block";
    document.getElementById("evening").style="display:none";
    isMorningReport = 1;
};

const setEveningReport = () => {
    document.getElementById("button").value="click to fill out a morning report instead";
    document.getElementById("morning").style="display:none";
    document.getElementById("evening").style="display:block";
    isMorningReport = 0;
};


const changeReport = () => {
    if(isMorningReport) {
        setEveningReport();
    } else {
        setMorningReport();
    }
};