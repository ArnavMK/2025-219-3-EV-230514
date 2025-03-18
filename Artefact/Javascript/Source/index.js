import { DataBase } from "./Database.js";
import { EarthController } from "./EarthController.js";
import { CustomContextMenu } from "./CustomContextMenu.js";

let data = new DataBase();
let canvas = document.getElementById("earthCanvas");
let earth = new EarthController(canvas);
let menu = new CustomContextMenu();

earth.OnAnyCountryClicked.addEventListener("country", (event) => { 

    let clickedCountry = event.detail;
    let completeData = data.TryGetAllData();

    let menuConfig = {
        unemployment : completeData["Dataset"][clickedCountry]["Unemployment_Rate"],
        name: clickedCountry,
        OOSR: completeData["GraphData"]["Out Of School Rates"][clickedCountry][1],
        Enrollment : completeData["GraphData"]["Line Chart"]["Education_Enrollment_Rate"][clickedCountry]
    }

    menu.UpdateMenuContent(menuConfig);
    menu.ShowMenu();
    
});
 