import { DataBase } from "./Database.js";
import { SurveyGraphManager } from "./SurveyGraphManager.js"
import { ErrorLogger } from "./ErrorLogger.js";

let Survey = {};
let submitButton = document.getElementById("Submit");
let database = new DataBase();
let resultsButton = document.getElementById("ResultsButton");
let graphContainer = document.getElementById("ChartContainer");
let errorLogger = new ErrorLogger(document.getElementById("ErrorLogger"));

resultsButton.addEventListener("mousedown", CreateSurveyResultGraphs);

submitButton.addEventListener("mousedown", HandleSubmitButtonClicked);
 
function IsValidAverageClassSize(value) {
    let number = parseInt(value);

    if (isNaN(number)) {
        Survey = {};
        errorLogger.ShowNewError("The Average class size has to be a number");
        return false;
    }
    else if (number <= 0) {
        Survey = {};
        errorLogger.ShowNewError("The average class size cannot be zero or a negative number");
        return false;
    }
    else if (number > 60) {
        Survey = {};
        errorLogger.ShowNewError("That's too big of a number for class size");
        return false;
    }

    return true;
}

function IsValidCountryName(allData, value) {
    
    if (allData["Dataset"][value.toLowerCase()] == undefined) {
        Survey = {};
        errorLogger.ShowNewError(`The country ${value.toLowerCase()} does not exist`);
        return false;
    }

    return true;

}

function IsThisFieldEmpty(value) {
    if (value == "") {
        errorLogger.ShowNewError("All written fields must be filled");
        Survey = {};
        return true;
    }

    return false;
}

// takes care of the validation and the calculation of the data from the survey.
// it takes real time data and appends the current user's information to the dictionary.
function HandleSubmitButtonClicked() {
          
    let allInfoFields = document.getElementsByClassName("info");
    let allData = database.TryGetAllData();

    for (let element of allInfoFields) {
        
        if (IsThisFieldEmpty(element.value)) return;

        let value = element.type == "checkbox" ? String(element.checked) : element.value;

        if (element.id == "Country") {
            if(!IsValidCountryName(allData, value)) return;
        }

        if (element.id == "AverageClassSize") {
            if (!IsValidAverageClassSize(value)) return;
        }

        Survey[element.id] = value;
    }

    let currentSurveyData = allData["SurveyData"];

    currentSurveyData["TotalSubmissions"] += 1
    currentSurveyData["Satisfaction"][Survey.Satisfaction] += 1; // one is just a random value to increase the length of the list
    currentSurveyData["StudentOrTeacher"][Survey.StudentOrTeacherBool] += 1; // one is just a random value to increase the length of the list

    currentSurveyData["EducationLevelStats"][Survey.EducationLevel] += 1
    currentSurveyData["TypeOfSchoolAttendedStats"][Survey.SchoolType] += 1

    currentSurveyData["NumberOfStudentsStats"][Survey.Country] = parseInt(Survey.AverageClassSize);

    let percentageSatisfactionTrue = ((currentSurveyData["Satisfaction"].true)/currentSurveyData["TotalSubmissions"]) * 100;
    let percentageStudentsTrue = ((currentSurveyData["StudentOrTeacher"].true)/currentSurveyData["TotalSubmissions"]) * 100;

    currentSurveyData["Satisfaction"]["runningPercentage"]["satisfied"] = percentageSatisfactionTrue;
    currentSurveyData["Satisfaction"]["runningPercentage"]["notSatisfied"] = 100 - percentageSatisfactionTrue;
    currentSurveyData["StudentOrTeacher"]["runningPercentage"]["student"] = percentageStudentsTrue; 
    currentSurveyData["StudentOrTeacher"]["runningPercentage"]["teacher"] = 100 - percentageStudentsTrue; 

    database.UpdateWithNewInfo("/SurveyData", currentSurveyData);
    submitButton.disabled = true;
    resultsButton.removeAttribute("hidden");
}


function CreateSurveyResultGraphs() {
    let surveyData = database.TryGetAllData()["SurveyData"];
    new SurveyGraphManager(surveyData);
    graphContainer.style.display = "grid";
    graphContainer.scrollIntoView({behavior : "smooth"})
    resultsButton.disabled = true;
}