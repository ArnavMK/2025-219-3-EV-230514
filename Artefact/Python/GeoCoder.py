import requests

class Geocoder :

    api_key = ""

    def __init__(self):
        self.api_key = "9df47359b252454f8ce7851be0170475"
     
    def GetCountry(self, lat, long) :
                
        url = f"https://api.opencagedata.com/geocode/v1/json?q={lat}+{long}&key={self.api_key}"

        response = requests.get(url)

        if response.status_code == 200: # if the response is valid

            data = response.json()

            if data['results']: # if the data has received results
                country = data['results'][0]['components']['country']  # return the country name
                return country
            else: # if the data has not received results
                print("LocationNotFound: No results found for the given coordinates.")
                return LookupError("could not find the location of the coordinates provided")
                
        else: # if the response is not valid
            print("Error:", response.status_code, response.text) 
            return ConnectionRefusedError("Could not connect to the open cage database")

