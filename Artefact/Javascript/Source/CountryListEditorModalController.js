
// -------------------------------------------------------------------------------------------------------------------
// This file is accompanied by its explanation file in the explanations folder. (CountryListEditorModalController.txt)
// I would recommend reading that file along side this one to get a complete understanding of the code.
// -------------------------------------------------------------------------------------------------------------------

 
import { ErrorLogger } from "./ErrorLogger.js";

export class CountryListEditorModalController {

   modal;
   EventSystem = new EventTarget();
   parentChart;
   countryList;
   errorLogger;

   constructor (modal, GraphData) {

      if (modal == undefined || GraphData == undefined) {
         return;
      }

      this.GraphData = GraphData;
      this.modal = modal;
      this.errorLogger = new ErrorLogger(document.getElementById("ErrorLogger"))

      this.#InitializeCountryListEditorModal();

      this.modalSaveButton = document.getElementById("Save");
      this.modalSaveButton.addEventListener("click", this.OnSaveButtonClicked.bind(this));

   }

   InitializeModalWithRequestedChart(chart) {

      this.#CleanUp() // removes all the country divs previously placed in the modal.
      this.parentChart = chart;
      this.countryList = chart.data.countryList;
      let countryListContainer = document.getElementById("CountryListContainer");

      for (let country of this.countryList) {

         let countryNameDiv = document.createElement("div");

         countryNameDiv.addEventListener("mousedown", this.HandleRemoveOrAddCountryName.bind(this));

         countryNameDiv.innerHTML = country;
         countryListContainer.append(countryNameDiv);

      }

      this.modal.showModal();
   }

   #InitializeCountryListEditorModal() {

      for (let element of this.modal.children) {

         if (element.className == "controllers") {
            element.addEventListener("mousedown", this.HandleRemoveOrAddCountryName.bind(this));
         }
      }

   }

   HandleRemoveOrAddCountryName(event) {

      let lookUpObject = {

         "Remove" : () => {

            // get the country name the user typed
            let country = this.GetCurrentCountryNameFromInputTag();
            console.log(country)
            // remove the country from the list if its valid
            if (this.CanRemoveCountryFromList(country)) {
               this.countryList = this.countryList.filter((c) => c !== country);
            }

            this.RefreshCountryListVisual();
         },

         "Add" : () => {

            // get the country name the user typed
            let country = this.GetCurrentCountryNameFromInputTag();
            console.log(country)
            // add the country if it is valid
            if (this.CanAddCountryToList(country)) {
               this.countryList.push(country);
            }

            this.RefreshCountryListVisual();

         }

      }

      // if the method is called by actually pressing the remove button
      if (event.target.id != "") {
         lookUpObject[event.target.id]();
         return;
      }

      // if the method is called through clicking a country div
      let country = event.target.innerHTML;
      this.countryList = this.countryList.filter((c) => c !== country);
      this.RefreshCountryListVisual();
      
   }

   // validation for removing a country
   CanRemoveCountryFromList(country) {

      if (country == "") {
         this.errorLogger.ShowNewError("The input field is empty");
         return false;
      }

      if (this.countryList.includes(country)) {
         return true
      }

      this.errorLogger.ShowNewError("Cannot remove a country which is not in the list.");
      return false;
   }

   // validation for adding a country
   CanAddCountryToList(country) {

      if (country == "") {
         this.errorLogger.ShowNewError("The input field is empty");
         return false;
      }
      
      if (this.countryList.includes(country)) {
         this.errorLogger.ShowNewError(`${country} is already in the list.`)
         return false;
      }
      
      if (this.GraphData["Dataset"][country] == undefined) {
         this.errorLogger.ShowNewError(`${country} does not exist in the website's dataset.`);
         return false
      }
      
      if (this.countryList.length == this.parentChart.data.maxLength) {
         this.errorLogger.ShowNewError("Maximum list length reached. Remove a country to add the one you want.");
         return false;
      }

      return true;
   }

   // every time a country is added or removed
   RefreshCountryListVisual() {
      
      let countryListContainer = document.getElementById("CountryListContainer");
      this.#CleanUp();

      // instantiate the new divs for the new country list
      for (let country of this.countryList) {

         let countryNameDiv = document.createElement("div");
         countryNameDiv.innerHTML = country;
         countryNameDiv.addEventListener("mousedown", this.HandleRemoveOrAddCountryName.bind(this));
         countryListContainer.append(countryNameDiv);

      }      
      
   }

   // return the newly created country list as a custom event.
   OnSaveButtonClicked() {

      if (this.countryList.length == 0) {
         this.errorLogger.ShowNewError("The country list is empty, cannot save.");
         return;
      }

      this.modal.close();

      let eventArgs = {
         chart: this.parentChart,
         list: this.countryList
      }
      
      this.EventSystem.dispatchEvent(new CustomEvent("save", {detail: eventArgs}))

   }


   #CleanUp() {
      let countryListContainer = document.getElementById("CountryListContainer");
      countryListContainer.innerHTML = "";
   }


   GetCurrentCountryNameFromInputTag() {
      let inputTag = document.getElementById("CountryInput");
      return inputTag.value.toLowerCase();
   }
}