import {ErrorLogger} from "./ErrorLogger.js";


function GetInformationString(info) {
    let string = "";

    for (let arg in info) {
        let value = info[arg];
        string += `, ${value[0]} of ${value[1]}`;
    }
    return string;
}

function GetBasicAssessmentData(data, country) {

    let unemploymentRate = (data["Dataset"][country]["Unemployment_Rate"]).toFixed(2);
    let enrollmentRate = (data["GraphData"]["Line Chart"]["Education_Enrollment_Rate"][country]).toFixed(2);
    let oosr = (data["GraphData"]["Out Of School Rates"][country][1]).toFixed(2);
    let countryInfo =  {
        arg1: ["UR", unemploymentRate],
        arg2: ["ER", enrollmentRate],
        arg3: ["OOSR", oosr]
    }

    let infoString = GetInformationString(countryInfo);


    // predefined ranges i thought would be good evaluation of good, average and bad.
    if (unemploymentRate < 6 && enrollmentRate > 80 && oosr < 10) {return {rate:"good", info: infoString}}
    else if (((unemploymentRate <= 12) && (unemploymentRate >= 6)) && (enrollmentRate >= 60  && enrollmentRate <= 850) && (oosr >= 10 && oosr <= 25)) {return {rate: "average", info: infoString}}
    else return {rate: "bad", info: infoString};
}
 

// this look up data contains all the states of a country for each suggestions. the assess key returns the state of a country (good, average or bad) for the perticular suggestion
let suggestionData = {

    "suggestion1" : {
        good: (country, assessment) => {return `${country} has${assessment}. This country is a great choice if you are looking to study abroad, you will get plenty of opportunities for jobs and projects`},
        average: (country, assessment) => {return `${country} has${assessment}, This country will be an average choice if you are looking to receive top quality education, but you still will get plenty of opportunities`},
        bad: (country, assessment) => {return `${country} has${assessment}, This wont be a very good choice, according to the values, it may be hard to get a job after graduation, these type of countries experience the most brain drain`},
        assess: (data, country) => {
            return GetBasicAssessmentData(data, country);
        }
    },

    "suggestion2" : {
        good: (country, assessment) => {return `${country} has${assessment}. This country will be a bad choice if you are looking for a healthy academic competition, ${country} performs extremely well economically, hence the amount of competition will most likely be insane`},
        average: (country, assessment) => {return `${country} has${assessment}. This country will be ok if you are looking for a healthy academic competition, these figures suggests that you may not get enough opportunities as the country struggles to attract foreign investment, hence it may experience brain drain`},
        bad: (country, assessment) => {return `${country} has${assessment}. This country will be a fantastic choice if you are looking for a healthy academic competition, these values suggest that there is not much pressure, but you will still get plenty of opportunities in the future`},
        assess: (data, country) => {
            return GetBasicAssessmentData(data, country);
        }
    },


    "suggestion3" : {
        good: (country, assessment) => {return `${country} has${assessment}. This country is a great fantastic education quality, you will get plenty of opportunities for jobs and projects`},
        average: (country, assessment) => {return `${country} has${assessment}, This country has an average education quality. Theses figures suggests that there is enough foreign investment and job opportunities`},
        bad: (country, assessment) => {return `${country} has${assessment}, This has a poor education quality, according to the values, it may be hard to get a job after graduation, these type of countries experience the most brain drain`},
        assess: (data, country) => {
            return GetBasicAssessmentData(data, country);
        }
    }
}

// this class follows the same system as the GraphManager. ie. each submit button has its own parent input tag from which the class will take the input from.
export class SuggestionHandler {

    #Data;
    constructor(Data) {

        this.errorLogger = new ErrorLogger(document.getElementById("outsideErrorLogger"))
        this.#Data = Data;

        let allSubmitButtons = Array.from(document.getElementsByClassName("suggestionSubmit"));
        this.InitializeAllSubmitButtons(allSubmitButtons);

    }

    InitializeAllSubmitButtons(list) {

        for (let button of list) {
            button.onclick = this.OnAnySubmitButtonClicked.bind(this);
        }

    }

    OnAnySubmitButtonClicked(event) {

        let {parentInputElement, suggestion: suggestionNumber} = this.GetParentInputTagFromStringId(event.target.id);  
        let infoDiv = document.getElementById(suggestionNumber);

        let country = this.GetFormattedCountryString(parentInputElement.value);
        let currentSuggestion = suggestionData[suggestionNumber];

        if(!this.IsValidCountry(country)) {
            return;
        }

        let countryAssessment = currentSuggestion.assess(this.#Data, country);
        let finalString = currentSuggestion[countryAssessment.rate](country, countryAssessment.info);

        infoDiv.innerHTML = finalString;
    }

    GetParentInputTagFromStringId(string) {

        let splitString = string.split("-"); 
        let parentInputElement = document.getElementById(`${splitString[1]}-input`);

        return {parentInputElement: parentInputElement, suggestion: splitString[1]};
    }

    GetFormattedCountryString(string) {
        return string.toLowerCase();
    }

    IsValidCountry(country) {
        
        if (country == "") {
            this.errorLogger.ShowNewError("The input field is empty");
            return false;
        }

        if (this.#Data["Dataset"][country] === undefined) {
            this.errorLogger.ShowNewError(`The country ${country} does not exits`);
            return false;
        }

        return true;
    }
}