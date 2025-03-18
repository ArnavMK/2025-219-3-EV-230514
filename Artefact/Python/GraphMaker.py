import matplotlib.pyplot as plt
from DataBase import *
import numpy as np

database = DataBase()

GraphDataDictionary = database.GetGraphDataAsADictionary()
fig, ax = plt.subplots()

#Education Pressure index start
countries_xAxis = GraphDataDictionary["List Of Countries"][0: 10]
index_yAxis = GraphDataDictionary["Education Pressure Index"]["_ValueList"][0: 10]
barColors = ["red", "yellow", "blue", "green", "brown", "pink", "red", "yellow", "blue", "green", "brown", "pink"]

ax.bar(countries_xAxis, index_yAxis, color=barColors)
ax.set_ylabel("Education Pressure index")
ax.set_xlabel("Countries")
plt.xticks(rotation=25, fontsize=6) 
ax.set_title("Education pressure index")
plt.tight_layout()
#Education pressure index end

 
fig, ax = plt.subplots()


#Out of school rate start
labels = ["Out of school", "In School"]
sizes = [GraphDataDictionary["Out Of School Rates"]["afghanistan"][1], GraphDataDictionary["Out Of School Rates"]["afghanistan"][0]]
explode = [0.1, 0]
ax.pie(sizes, labels=labels, autopct='%1.1f%%', shadow=True, explode=explode)

plt.title(
    label = "Out of School Rates for: " + GraphDataDictionary["List Of Countries"][0],
    fontdict={"fontsize":16},
    pad=20
)
plt.tight_layout()
#out of school rate end




# Completion Rate graph start
labels = GraphDataDictionary["Completion Rate Levels"]["countries"]
men_means = GraphDataDictionary["Completion Rate Levels"]["_ValueListMale"]
female_means = GraphDataDictionary["Completion Rate Levels"]["_ValueListFemale"]

x = np.arange(len(labels))  
width = 0.35  

fig, ax = plt.subplots()
rects1 = ax.bar(x - width/2, men_means, width, label='Men')
rects2 = ax.bar(x + width/2, female_means, width, label='Women')

# Add some text for labels, title and custom x-axis tick labels, etc.
ax.set_ylabel('Rates')
ax.set_xlabel("Countries")
ax.set_title('Completion Rates by gender')
ax.set_xticks(x)
ax.set_xticklabels(labels)
plt.xticks(rotation=45, fontsize=6) 
ax.legend()
plt.tight_layout()
#Completion Rate graph end



#General line chart start
fig, ax =  plt.subplots()

xCountries = GraphDataDictionary["List Of Countries"][56:64]
yUnemployment = GraphDataDictionary["Line Chart"]["Unemployment_Rate"][56:64]
yEnrollment = GraphDataDictionary["Line Chart"]["Education_Enrollment_Rate"]["_ValueList"][56:64]
yOOSR = GraphDataDictionary["Line Chart"]["Out Of School Rate"][56:64]


ax.plot(xCountries, yOOSR, marker="o", color="red")
ax.plot(xCountries, yEnrollment, marker="o", color="blue")
ax.plot(xCountries, yUnemployment, marker="o", color = "orange")

ax.set_xlabel("Countries")
ax.set_ylabel("Rates")
ax.set_title("Compare and contrast")
ax.legend(["OOSR", "Enrollment Rates", "Unemployment Rates"])
plt.xticks(rotation=45, fontsize=6) 
plt.tight_layout()
#General line chart end


plt.show()