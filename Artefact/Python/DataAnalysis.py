# this file is responsible for all the calculations required for the graphs.
# all the calculated information is pushed to firebase and used by javascript.

from DataBase import *

database = DataBase()
completionRateProperCountryIndex = set([
36 , 50 , 76 , 79 , 100 , 109 ,
112 , 124 , 127 , 131 , 154 , 162 ,
])
datasetDict = database.GetDatasetAsADictionary()


def OOSRCalculation(data) :
    maleRateAverage = (data["OOSR_Lower_Secondary_Age_Male"] + data["OOSR_Pre0Primary_Age_Male"] + data["OOSR_Primary_Age_Male"] + data["OOSR_Upper_Secondary_Age_Male"])/4
    femaleRateAverage = (data["OOSR_Lower_Secondary_Age_Female"] + data["OOSR_Pre0Primary_Age_Female"] + data["OOSR_Primary_Age_Female"] + data["OOSR_Upper_Secondary_Age_Female"])/4

    OOSR_rate = maleRateAverage+femaleRateAverage/2

    return (OOSR_rate, 100 - OOSR_rate, data["Countries and areas"])

def CompletionRateCalculation(data) :
    maleRate = (data["Completion_Rate_Lower_Secondary_Male"] + data["Completion_Rate_Primary_Male"] + data["Completion_Rate_Upper_Secondary_Male"])/3
    femaleRate = (data["Completion_Rate_Lower_Secondary_Female"] + data["Completion_Rate_Primary_Female"] + data["Completion_Rate_Upper_Secondary_Female"])/3
    
    return {"male": maleRate, "female": femaleRate, "country": data["Countries and areas"], "average": femaleRate+maleRate/2}

 
    
def EducationPressureIndex(data) :
    index =  data["Birth_Rate"] - ((data["Gross_Tertiary_Education_Enrollment"] + data["Gross_Primary_Education_Enrollment"])/2)
    
    return (index, data["Countries and areas"])

def GraphCalculations() :   
    
    graphDataset = {
        "List Of Countries" : [],
        "Out Of School Rates" : {},
        "Completion Rate Levels" : {"_ValueListMale": [], "_ValueListFemale": [], "countries" : []},

        "Education Pressure Index" : {"_ValueList" : []},

        "Line Chart" : {"Unemployment_Rate": [], "Education_Enrollment_Rate": {"_ValueList": []}, "Out Of School Rate": []}
    }

    countryIndex = 0
    for country, data in datasetDict.items() :
        
        #Out of school percentage: 
        perCountryOOSR = OOSRCalculation(data)
        graphDataset["Out Of School Rates"][perCountryOOSR[2]] = [perCountryOOSR[1], perCountryOOSR[0]]

        #completion rate levels
        if (completionRateProperCountryIndex.__contains__(countryIndex)):
            perCountryCompletionRateLevel = CompletionRateCalculation(data)
            graphDataset["Completion Rate Levels"]["_ValueListMale"].append(perCountryCompletionRateLevel["male"])
            graphDataset["Completion Rate Levels"]["_ValueListFemale"].append(perCountryCompletionRateLevel["female"])
            graphDataset["Completion Rate Levels"]["countries"].append(perCountryCompletionRateLevel["country"])

        #education spending efficiency 
        perCountryEducationPressureIndex = EducationPressureIndex(data)
        graphDataset["Education Pressure Index"][perCountryEducationPressureIndex[1]] = perCountryEducationPressureIndex[0]
        graphDataset["Education Pressure Index"]["_ValueList"].append(perCountryEducationPressureIndex[0])


        # line chart 
        enrollment = (data["Gross_Primary_Education_Enrollment"] + data["Gross_Tertiary_Education_Enrollment"])/2
        graphDataset["Line Chart"]["Unemployment_Rate"].append(data["Unemployment_Rate"])
        graphDataset["Line Chart"]["Out Of School Rate"].append(perCountryOOSR[0])
        graphDataset["Line Chart"]["Education_Enrollment_Rate"]["_ValueList"].append(enrollment)
        graphDataset["Line Chart"]["Education_Enrollment_Rate"][country] = enrollment

        graphDataset["List Of Countries"].append(country)
        countryIndex += 1

    database.Push({"GraphData" : graphDataset})
    database.Push({"SurveyData" : {

        "TotalSubmissions" : 0,

        "Satisfaction": {
            "false" : 0,
            "true" : 0,
            "runningPercentage" : {
                "satisfied" : 0,
                "notSatisfied": 0
            }
        },
        "StudentOrTeacher" : {
            "false" : 0,
            "true" : 0,
            "runningPercentage" : {
                "student" : 0,
                "teacher" : 0
            }
        },
        "EducationLevelStats" :{
            "PHD" : 0,
            "Masters" : 0,
            "Secondary" : 0,
            "PrePrimary" : 0,
            "ThirdLevel" : 0,
            "Primary" : 0
        },
        "TypeOfSchoolAttendedStats" : {
            "Public" : 0,
            "Private" : 0,
            "HomeSchooled": 0,
            "Religious" : 0
        },
        "NumberOfStudentsStats" : {
            "Default" : 0
        }
    }}) 

GraphCalculations()