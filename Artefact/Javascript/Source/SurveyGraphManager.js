
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
 
// this ust creates static charts for the survey.
export class SurveyGraphManager {

    #Data;
 
    constructor (Data) {
       this.#Data = Data;
 
       this.CreatePieChart(
          document.getElementById("SatisfactionChart"),
          Object.keys(this.#Data["Satisfaction"]["runningPercentage"]),
          Object.values(this.#Data["Satisfaction"]["runningPercentage"]),
          "doughnut",
          GENERAL_PIE_CHART_BACKGROUND_COLORS,
          GENERAL_PIE_CHART_BORDER_COLORS
       );
       
       this.CreatePieChart(
          document.getElementById("studentTeacherChartCanvas"),
          Object.keys(this.#Data["StudentOrTeacher"]["runningPercentage"]),
          Object.values(this.#Data["StudentOrTeacher"]["runningPercentage"]),
          "pie",
          GENERAL_PIE_CHART_BACKGROUND_COLORS_SET2,
          GENERAL_PIE_CHART_BORDER_COLORS_SET2
       );
 
       this.CreateBarChart(
          Object.keys(this.#Data["EducationLevelStats"]), 
          Object.values(this.#Data["EducationLevelStats"]), 
          document.getElementById("EducationLevelChart"),
          "x"
       );
 
       this.CreateBarChart(
          Object.keys(this.#Data["TypeOfSchoolAttendedStats"]),
          Object.values(this.#Data["TypeOfSchoolAttendedStats"]),
          document.getElementById("EducationTypeChart"),
          "y"
       )
    }
 
    CreatePieChart(canvas, labels, data, type, backgroundColor, borderColor) {
 
       new Chart(canvas, {
          type: type,
          data: {
             labels: labels,
             datasets: [{
                label : "percentage",
                data: data,
                backgroundColor: backgroundColor,
                borderColor : borderColor,
                hoverOffset: 5
             }],
          },
          options: {
             responsive: false,
             maintainAspectRatio : false,
          },
       });
    }
 
    CreateBarChart(labels, data, canvas, indexAxis) {
 
       new Chart(canvas, {
          type: "bar",
          data: {
             labels : labels,
             datasets: [{
                label: 'Number of submissions',
                data: data,
                borderWidth: 1,
                backgroundColor : GENERAL_BAR_CHART_BACKGROUND_COLORS,
                borderColor : GENERAL_BAR_CHART_BORDER_COLORS
             }]
          },
          options: {
             indexAxis: indexAxis,
             responsive: false,
             maintainAspectRatio : false,
             plugins: {
                legend: {
                    display: false
                }
            }
          },
       });
    }
 }