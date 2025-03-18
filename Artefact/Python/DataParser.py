# this script will parse the data in the appropriate form for firebase.
import re
from GeoCoder import *
from DataBase import *

# Latitude & Longitude input

coder = Geocoder()
dataBase = DataBase()

LAT_INDEX = 1
LONG_INDEX = 2
COUNTRY_NAME_INDEX = 0

data = open("Data/Global_Education.csv", "r")
header = data.readline().strip().split(",")
parsedData = {}
unwantedColumns = set([
    "Grade_2_3_Proficiency_Math", "Lower_Secondary_End_Proficiency_Math",
    "Lower_Secondary_End_Proficiency_Reading", "Primary_End_Proficiency_Math", "Primary_End_Proficiency_Reading",
    "Youth_15_24_Literacy_Rate_Female", "Youth_15_24_Literacy_Rate_Male", "Latitude ", "Longitude"
]) # using sets for faster lookups: O(1)

def ChangeElementToRespectiveDataType(element : str) :
    if (element.isalpha()) :
        return element
    elif (element.isnumeric() or re.search(r"^[0-9]+\.[0-9]+$",  element)) :
        return float(element)
    else :
        return element

def IsValidCountryName(name) :
    return re.search(r"^[a-zA-Z ]+$", name)
 
def TryGetProperCountryName(line) :

    if (IsValidCountryName(line[COUNTRY_NAME_INDEX])) :
        return line[COUNTRY_NAME_INDEX].lower()

    lat = line[LAT_INDEX]
    long = line[LONG_INDEX]

    return coder.GetCountry(lat, long).lower()

for line in data :
    currentLineDict = {}
    currentLine = line.strip().split(',')

    currentLine[COUNTRY_NAME_INDEX] = TryGetProperCountryName(currentLine)
    currentLine = list(map(ChangeElementToRespectiveDataType, currentLine))

    for i in range(len(header)) :
        if (unwantedColumns.__contains__(header[i])) : continue # skip iteration if the current columns is unwanted
        currentLineDict[header[i]] = currentLine[i]

    parsedData[currentLine[COUNTRY_NAME_INDEX]] = currentLineDict

dataBase.Push({"Dataset" : parsedData})