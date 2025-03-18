import { DataBase } from "./Database.js";
import { EarthController } from "./EarthController.js";
import { GraphManager } from "./GraphManager.js";
import {ObsoleteGraphManager} from "./ObsoleteGraphManager.js"
import {CustomContextMenu} from "./CustomContextMenu.js"
import { SuggestionHandler } from "./SuggestionHandler.js";

let allDrawerButtons = document.getElementsByClassName("drawerHandle");
let allSecondDrawerButtons = document.getElementsByClassName("secondCloseDrawerButton")

for (let button of allDrawerButtons) {
    button.addEventListener("mousedown", () => HandleDrawerButtonClick(button.parentNode));
}

for (let button of allSecondDrawerButtons) {
    button.addEventListener("mousedown", () => HandleDrawerButtonClick(button.parentNode.parentNode))
}

function HandleDrawerButtonClick(parentElement) {

    const content = parentElement.getElementsByClassName('drawerContent')[0];
    const isActive = parentElement.classList.contains('active');
    let allDrawers = document.getElementsByClassName("drawer");

    for (let drawer of allDrawers) {
        drawer.classList.remove('active');
        drawer.getElementsByClassName('drawerContent')[0].style.maxHeight = '0';
    }

    if (!isActive) {
        parentElement.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
    }
} 

let earth = new EarthController(document.getElementById("earthCanvas")); 
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

// once the data has been received then we make the graphs
let data = new DataBase();
data.AccessData.then((args) => {
    new GraphManager(args);
    new SuggestionHandler(args)
});
