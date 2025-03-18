import {CountryListEditorModalController} from "./CountryListEditorModalController.js"

const GENERAL_PIE_CHART_BACKGROUND_COLORS = [
   'rgba(51, 241, 255, 0.6)',
   'rgba(229, 255, 0, 0.6)'
]
const GENERAL_PIE_CHART_BORDER_COLORS = [
   'rgba(64, 248, 233, 0.8)',
   'rgba(255, 238, 0, 0.8)'
]
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
 
export class ObsoleteGraphManager  {

   #Data;
   charts = {};

   constructor (Data) {

      this.#Data = Data;

      this.CreateCompletionRateChart();
      this.CreateLineChart();
      this.CreateOOSRChart();
      this.CreateEducationIndexChart();

      let countryListEditorModal = document.getElementById("EditCountryListModal");
      this.modalController = new CountryListEditorModalController(countryListEditorModal, this.#Data);
      this.modalController.EventSystem.addEventListener("save", (e) => {
         
         let newChart = e.detail.chart;
         newChart.data.countryList = e.detail.list;
         this.RefreshChartWithNewInformation(e.detail.chart);

      });
   
      let allGraphEditorElements = document.getElementsByClassName("GraphEditor");
      this.allCheckBoxes = document.querySelectorAll("input[type='checkbox']");
      this.InitializeAllGraphEditorElements(allGraphEditorElements);

   }
 

   InitializeAllGraphEditorElements(List) {

      for (let element of List) {

         let lookUpObject = {
            "SELECT" : () => {
               
               element.onchange = (event) => {
                  let parentChart = this.GetParentChartFromGraphEditorString(event.target.id).parentChart;
                  parentChart.config.type = event.target.value;
                  this.RefreshChartWithNewInformation(parentChart);
               }
            },

            "BUTTON" : () => {
               
               let buttonType = this.GetParentChartFromGraphEditorString(element.id).firstArgument;
               let parentChart = this.GetParentChartFromGraphEditorString(element.id).parentChart;

               if (buttonType === "CountryListEditor") {

                  element.addEventListener("mousedown", () => {
                     this.modalController.InitializeModalWithRequestedChart(parentChart);
                  });

               }
               else {

                  element.addEventListener("mousedown", () => {
                     this.DownloadChart(parentChart);
                  });

               }
            },

            "INPUT" : () => {

               element.onchange = (event) => {

                  let parentChart = this.GetParentChartFromGraphEditorString(element.id).parentChart; 
                  let datasetIndex = parseInt(this.GetParentChartFromGraphEditorString(element.id).firstArgument);
               
                  parentChart.getDatasetMeta(datasetIndex).hidden = event.target.checked;

                  parentChart.update();  
               }
               
            }
         }
         
         lookUpObject[element.nodeName]();
      }

   }
   ResetAllCheckBoxesToDefaultChecked() {

      this.allCheckBoxes.forEach((checkbox) => {
         checkbox.checked = checkbox.defaultChecked;
      });

   }

   DownloadChart(chart) {
      
      let canvas = chart.data.chartCanvas; // access the canvas from the chart
      let link = document.createElement("a"); 
      link.href = canvas.toDataURL("image/png");
      link.download = `${chart.data.chartName}.png`;
      link.click(); // simulate download.

   }


   RefreshChartWithNewInformation(chart) {

      this.ResetAllCheckBoxesToDefaultChecked();

      let currentChartName = chart.data.chartName;
      let canvas = chart.canvas; // store the canvas before destroying

      if (this.charts[chart.data.chartName]) { // find the reference and delete it
         delete this.charts[chart.data.chartName];
         chart.destroy(); // then destroy the chart
      }

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height); // resetting the canvas

      let lookUpObject = {
         "lineChart" : () => this.CreateLineChart(chart),
         "OOSR" :  () => this.CreateOOSRChart(chart),
         "educationIndex" : () => this.CreateEducationIndexChart(chart),
         "completionRateChart" : () => this.CreateCompletionRateChart(chart)
      }

      lookUpObject[currentChartName]();

   }

   GetParentChartFromGraphEditorString(string) {

      let splitString = string.split("-"); 
      let parentElementID = splitString[1];
      let parentElement = this.charts[parentElementID];
      return {parentChart: parentElement, firstArgument: splitString[0]};

   }

   CreateCompletionRateChart(chart = undefined) {
      const CompletionRatesCanvas = document.getElementById("chart3")
   
      let type = chart == undefined ? "bar" : chart.config.type;

      let newChart = new Chart(CompletionRatesCanvas, {
         type: type,
         data: {
            chartCanvas: CompletionRatesCanvas,
            chartName: "completionRateChart",
            labels: this.#Data["GraphData"]["Completion Rate Levels"]["countries"],
            datasets: [
               {
               label: 'Male',
               data: this.#Data["GraphData"]["Completion Rate Levels"]["_ValueListMale"],
               borderWidth: 1,
               backgroundColor : [
                  'rgba(255, 99, 132, 0.5)',
               ],
               borderColor : [
                  'rgba(255, 99, 132, 0.8)',
               ]
            },
            {
               label: 'Female',
               data: this.#Data["GraphData"]["Completion Rate Levels"]["_ValueListFemale"],
               borderWidth: 1,
               backgroundColor : [
                  'rgba(75, 192, 192, 0.5)',
               ],
               borderColor : [
                  'rgba(75, 192, 192, 0.8)',
               ]
            }
         ]
         },
      });

      this.charts["completionRateChart"] = newChart;
   }

   CreateEducationIndexChart(chart = undefined) {

      
      const EducationPressureIndexCanvas = document.getElementById('chart1');

      let type;
      let labels;
      let data = [];

      if (chart == undefined) {
         type = "bar";
         labels = this.#Data["GraphData"]["List Of Countries"].slice(10,20);
      }
      else 
      {
         type = chart.config.type;
         labels = chart.data.countryList;
      }

      for (let country of labels) {
         data.push(this.#Data["GraphData"]["Education Pressure Index"][country]);
      }

      let EducationPressureIndexChart = new Chart(EducationPressureIndexCanvas, {
         type: type,
         data: {
            chartCanvas: EducationPressureIndexCanvas,
            chartName : "educationIndex",
            maxLength: 14,
            countryList: labels,
            labels: labels,
            datasets: [{
               label: 'Pressure Index',
               data: data,
               borderWidth: 1,
               backgroundColor : GENERAL_BAR_CHART_BACKGROUND_COLORS,
               borderColor : GENERAL_BAR_CHART_BORDER_COLORS
            }]
         },
         options: {
            scales: {
            y: {
               beginAtZero: true
            }
            }
         }
      });

      this.charts["educationIndex"] = EducationPressureIndexChart;
   }

   CreateOOSRChart(chart = undefined) {

      const OOSRcanvas = document.getElementById('chart2');
      let type;
      let countryList = [];

      if (chart == undefined) {
         type = "pie";
         countryList.push("Australia");
      }
      else {
         type = chart.config.type;
         countryList = chart.data.countryList;
      }

      let OOSRchart = new Chart(OOSRcanvas, {
         type: type,
         data: {
            chartName : "OOSR",
            chartCanvas: OOSRcanvas,
            maxLength : 1,
            countryList : countryList,
            labels: ["In school", "Out of school"],
            datasets: [{
               label : "percentage",
               data: this.#Data["GraphData"]["Out Of School Rates"][countryList[0]],
               backgroundColor: GENERAL_PIE_CHART_BACKGROUND_COLORS_SET2,
               borderColor : GENERAL_PIE_CHART_BORDER_COLORS_SET2,
               hoverOffset: 5
            }],
         },
         options: {
            responsive: false,
            maintainAspectRatio : false,
            plugins : {
               title : {
                  display : true,
                  text : `OOSR - ${countryList[0]}`
               }
            }
         },
      });

      this.charts["OOSR"] = OOSRchart;
   }

   CreateLineChart(chart = undefined) {
      
      const lineChartCanvas = document.getElementById("chart4");

      let unemploymentRateData = [];
      let OOSRrate = [];
      let enrollmentRates = [];
      let labels;
      let type;

      if (chart == undefined) {
         labels = this.#Data["GraphData"]["List Of Countries"].slice(65,79);
         type = "line";
      }
      else {
         labels = chart.data.countryList;
         type = chart.config.type;
      }

      for (let country of labels) {
         unemploymentRateData.push(this.#Data["Dataset"][country]["Unemployment_Rate"]);
         OOSRrate.push(this.#Data["GraphData"]["Out Of School Rates"][country][1]);
         enrollmentRates.push(this.#Data["GraphData"]["Line Chart"]["Education_Enrollment_Rate"][country]);
      }

      let lineChart = new Chart(lineChartCanvas, {
         type: type,
         data: {
            chartCanvas: lineChartCanvas,
            chartName: "lineChart",
            maxLength: 14,
            countryList : labels,
            labels: labels,
            datasets: 
            [
            {
               label: "Unemployment Rate",
               data: unemploymentRateData,
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
               data: enrollmentRates,
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
               data: OOSRrate,
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
           }
         }
      });


      this.charts["lineChart"] = lineChart;
   }
}