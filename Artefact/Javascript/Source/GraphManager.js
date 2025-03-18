// -------------------------------------------------------------------------------------------------------------------
// This file is accompanied by its explanation file in the explanations folder. (GraphManager.txt)
// I would recommend reading that file along side this one to get a complete understanding of the code.
// -------------------------------------------------------------------------------------------------------------------




import {CountryListEditorModalController} from "./CountryListEditorModalController.js"


const GENERAL_PIE_CHART_BACKGROUND_COLORS_SET2 = [
   'rgba(255, 99, 132, 0.6)',
   'rgba(255, 159, 64, 0.6)'
]

const GENERAL_PIE_CHART_BORDER_COLORS_SET2 = [
   'rgba(255, 99, 132,0.8)',
   'rgba(255, 159, 64,0.8)'
]
 
const GENERAL_BAR_CHART_BACKGROUND_COLORS = [
   'rgba(255, 99, 132, 0.5)',
   'rgba(255, 159, 64, 0.5)',
   'rgba(255, 205, 86, 0.5)',
   'rgba(75, 192, 192, 0.5)',
   'rgba(54, 162, 235, 0.5)',
   'rgba(153, 102, 255, 0.5)',
   'rgba(201, 203, 207, 0.5)'
]
const GENERAL_BAR_CHART_BORDER_COLORS = [
   'rgba(255, 99, 132, 0.8)',
   'rgba(255, 159, 64, 0.8)',
   'rgba(255, 205, 86, 0.8)',
   'rgba(75, 192, 192, 0.8)',
   'rgba(54, 162, 235, 0.8)',
   'rgba(153, 102, 255, 0.8)',
   'rgba(201, 203, 207, 0.8)'
]

export class GraphManager {

   #Data;
   charts = {};

   constructor (Data) {

      this.#Data = Data;
      if (Data == undefined) {
         return;
      }

      // create all vanilla charts
      this.CreateCompletionRateChart();
      this.CreateLineChart();
      this.CreateOOSRChart();
      this.CreateEducationIndexChart();

      // subscribe to the save event to know when the a country list is saved.
      let countryListEditorModal = document.getElementById("EditCountryListModal");
      this.modalController = new CountryListEditorModalController(countryListEditorModal, this.#Data);
      this.modalController.EventSystem.addEventListener("save", this.HandleNewCountryListSaved.bind(this))
   
      let allGraphEditorElements = document.getElementsByClassName("GraphEditor");
      this.allCheckBoxes = Array.from(document.querySelectorAll("input[type='checkbox']"));
      this.InitializeAllGraphEditorElements(allGraphEditorElements);

   }
 
   // filters through all the graphEditor elements and subscribe to the respective events
   InitializeAllGraphEditorElements(List) {

      let lookUpObject = {
         "SELECT" : (element) => element.onchange = this.HandleTypeChanges.bind(this), 

         "BUTTON" : (element) => {
            
            let {firstArgument: buttonType, parentChart: parentChart} = this.GetParentChartFromGraphEditorString(element.id);

            if (buttonType === "CountryListEditor") { // if the country editor button
               element.addEventListener("mousedown", () => 
                  this.modalController.InitializeModalWithRequestedChart(parentChart));
            }
            else { // if down load chart button
               element.addEventListener("mousedown", () => this.DownloadChart(parentChart));
            }
         },

         "INPUT" : (element) => element.onchange = this.HandleLegendChanges.bind(this)
      }

      for (let element of List) {
         lookUpObject[element.nodeName](element);
      }

   }

   // updates the new country list
   HandleNewCountryListSaved(e) {

      let chart = e.detail.chart;
      chart.data.countryList = e.detail.list;
      this.RefreshChart(e.detail.chart);

   }

   // handles the type changes for the parent chart.
   HandleTypeChanges(event) {

      let parentChart = this.GetParentChartFromGraphEditorString(event.target.id).parentChart;
      parentChart.config.type = event.target.value;
      parentChart.data.hasTypeChanged = true;
      this.RefreshChart(parentChart);

   }

   // handles the legend changes
   HandleLegendChanges(event) {

      let {parentChart, firstArgument: datasetIndex} = this.GetParentChartFromGraphEditorString(event.target.id);
      datasetIndex = parseInt(datasetIndex); 
      parentChart.getDatasetMeta(datasetIndex).hidden = !event.target.checked;
      this.RefreshChart(parentChart);

   }

   // whenever the type changes Chart.js does not remember what datasets were hidden hence this just puts them back to default.
   ResetChartCheckBoxesToDefaultChecked(chart) {
      
      let checkboxes = chart.canvas.parentNode.querySelectorAll("input[type='checkbox']");

      checkboxes.forEach((checkbox) => {
         checkbox.checked = checkbox.defaultChecked;
      });

   }
   
   // downloads the chart
   DownloadChart(chart) {
      
      let link = document.createElement("a");
      link.href = chart.toBase64Image();   // chart is not destroyed
      link.download = `${chart.data.chartName}.png`; 
      link.click(); // simulate download

   }

   // called every time a chart needs to update
   RefreshChart(chart) {

      if (chart.data.hasTypeChanged) {
         this.ResetChartCheckBoxesToDefaultChecked(chart);
         chart.data.hasTypeChanged = false;
      }
      
      chart.options.scales = {}; // reset the scales to avoid clipping when type changes
      chart.update(); // updates the chart instead of destroying.

   }

   // splits the element id and gets the parent chart from the dictionary.
   GetParentChartFromGraphEditorString(string) { 

      let splitString = string.split("-"); 
      let parentElementID = splitString[1];
      let parentElement = this.charts[parentElementID];

      if (parentElement == undefined) {
         return new Error("The graph editor string has a mismatched chart name");
      }

      return {parentChart: parentElement, firstArgument: splitString[0]};

   }


   CreateCompletionRateChart() {
      const completionRatesCanvas = document.getElementById("chart3")
   
      const completionRateChart = new Chart(completionRatesCanvas, {
         type: "bar",
         data: {
            chartCanvas: completionRatesCanvas,
            chartName: "completionRateChart",
            hasTypeChanged: false,
            labels: this.#Data["GraphData"]["Completion Rate Levels"]["countries"],
            datasets: [
               { 
               label: 'Male',
               data: this.#Data["GraphData"]["Completion Rate Levels"]["_ValueListMale"],
               borderWidth: 1,
               backgroundColor : [
                  'rgba(56, 162, 235, 0.59)',
               ],
               borderColor : [
                  'rgba(56, 162, 235, 0.8)',
               ]
            },
            {
               label: 'Female',
               data: this.#Data["GraphData"]["Completion Rate Levels"]["_ValueListFemale"],
               borderWidth: 1,
               backgroundColor : [
                  'rgba(154, 102, 255, 0.59)',
               ],
               borderColor : [
                  'rgba(154, 102, 255, 0.8)',
               ]
            }
         ]
         },
         options : {
            scales: {
               y: {
                  position: "left",
                  title : {
                     display: true,
                     text: "Pressure Index"
                  }
               },
               x : {
                  title : {
                     display: true, text: "Countries"
                  }
               }
            }
         }
      });

      this.charts["completionRateChart"] = completionRateChart;
   }

   CreateEducationIndexChart() {

      const EducationPressureIndexCanvas = document.getElementById('chart1');
      const defaultLabels =  this.#Data["GraphData"]["List Of Countries"].slice(10, 20);

      const EducationPressureIndexChart = new Chart(EducationPressureIndexCanvas, {
         type: "bar",
         data: {
            chartCanvas: EducationPressureIndexCanvas,
            chartName : "educationIndex",
            maxLength: 14,
            completeData: this.#Data,
            countryList: defaultLabels,
            labels: defaultLabels,
            datasets: [{
               label: 'Pressure Index',
               data: this.#Data["GraphData"]["Education Pressure Index"]["_ValueList"].slice(10, 20),
               borderWidth: 1,
               backgroundColor : GENERAL_BAR_CHART_BACKGROUND_COLORS,
               borderColor : GENERAL_BAR_CHART_BORDER_COLORS
            }]
         },
         options: {
            scales: {
               y: {
                  beginAtZero: true,
                  position: "left",
                  title : {
                     display: true,
                     text: "Pressure Index"
                  }
               },
               x : {
                  beginAtZero: true,
                  title : {
                     display: true, text: "Countries"
                  }
               }
            }
         }
      });

      // automatically gets the information from countryList key.
      Object.defineProperty(EducationPressureIndexChart.data.datasets[0], "data", {
         get: function() {

            let data = [];
            EducationPressureIndexChart.data.labels = EducationPressureIndexChart.data.countryList; // set labels

            for (let country of EducationPressureIndexChart.data.countryList) {
               data.push(EducationPressureIndexChart.data.completeData["GraphData"]["Education Pressure Index"][country]);
            }
            return data; // but making sure to return the value that should correspond to chart js data key.
         }
      });

      this.charts["educationIndex"] = EducationPressureIndexChart;
   }

   CreateOOSRChart() {

      const OOSRCanvas = document.getElementById('chart2');

      const chart = new Chart(OOSRCanvas, {
         type: "pie",
         data: {
            chartName : "OOSR",
            completeData: this.#Data,
            chartCanvas: OOSRCanvas,
            maxLength : 1,
            countryList : ["india"],
            labels: ["In school", "Out of school"],
            datasets: [{
               label : "percentage",
               backgroundColor: GENERAL_PIE_CHART_BACKGROUND_COLORS_SET2,
               borderColor : GENERAL_PIE_CHART_BORDER_COLORS_SET2,
               hoverOffset: 5,
               data: this.#Data["GraphData"]["Out Of School Rates"]["india"]
            }],
         },
         options: {
            responsive: false,
            maintainAspectRatio : false,
            plugins : {
               title : {
                  display : true,
                  text: `OOSR`
               }
            },
         },
      });

      Object.defineProperty(chart.data.datasets[0], "data", {         
         get: function () {
            chart.options.plugins.title.text = `OOSR - ${chart.data.countryList[0]}`;
            return chart.data.completeData["GraphData"]["Out Of School Rates"][chart.data.countryList[0]];
         }
      });



      this.charts["OOSR"] = chart;
   }

   CreateLineChart() { 
      
      const lineChartCanvas = document.getElementById("chart4");
      
      const lineChart = new Chart(lineChartCanvas, {
         type: "line",
         data: {
            chartCanvas: lineChartCanvas,
            completeData: this.#Data,
            chartName: "lineChart",
            hasTypeChanged: false,
            maxLength: 14,
            countryList : this.#Data["GraphData"]["List Of Countries"].slice(65, 79),
            labels: this.#Data["GraphData"]["List Of Countries"].slice(65, 79),
            datasets: 
            [
            {
               label: "Unemployment Rate",
               data: this.#Data["GraphData"]["Line Chart"]["Unemployment_Rate"].slice(65, 79),
               borderWidth: 1.4,
               hidden: false,
               backgroundColor : [
                  'rgba(54, 162, 235, 0.6)',
               ],
               borderColor : [
                  'rgba(54, 162, 235, 1)'
               ],
               tension: 0.2
            },
            {
               label: "Enrollment Rate",
               data: this.#Data["GraphData"]["Line Chart"]["Education_Enrollment_Rate"]["_ValueList"].slice(65, 79),
               borderWidth: 1.4,
               hidden: true,
               backgroundColor : [
                  'rgba(23, 134, 123, 0.6)',
               ],
               borderColor : [
                  'rgba(23, 134, 123, 1)'
               ],
               tension: 0.2
            },
            {
               label: "Out of school rate",
               data: this.#Data["GraphData"]["Line Chart"]["Out Of School Rate"].slice(65, 79),
               borderWidth: 1.4,
               hidden: true,
               backgroundColor : [
                  'rgba(223, 58, 52, 0.6)',
               ],
               borderColor : [
                  'rgba(223, 58, 52,1)'
               ],
               tension: 0.2
            }
         ]
         },
         options: {
            plugins: {
               legend: {
                   display: false
               }
           },
           scales: {
               y: {
                  position: "left",
                  title : {
                     display: true,
                     text: "Pressure Index"
                  }
               },
               x : {
                  title : {
                     display: true, text: "Countries"
                  }
               }
            }
         }
      });

      // dynamic getter to update those properties which depend on the properties above them.
      Object.defineProperty(lineChart.data.datasets[0], "data", {
         get: function() {
            let unemploymentData = [];
            let enrollmentData = [];
            let OOSRData = [];
            lineChart.data.labels = lineChart.data.countryList;

            for (let country of lineChart.data.countryList) {
               unemploymentData.push(lineChart.data.completeData["Dataset"][country]["Unemployment_Rate"]);
               enrollmentData.push(lineChart.data.completeData["GraphData"]["Line Chart"]["Education_Enrollment_Rate"][country]); 
               OOSRData.push(lineChart.data.completeData["GraphData"]["Out Of School Rates"][country][1]); 
            }
            
            lineChart.data.datasets[1].data = enrollmentData; //setting data for the enrollment set
            lineChart.data.datasets[2].data = OOSRData; // setting data for the OOSR set
            return unemploymentData; // but making sure that i am returning the data this getter corresponds to
         }
      });
 
      this.charts["lineChart"] = lineChart;
   }
}

