
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

class DataBase :

    def __init__(self) -> None:
        self._cred = credentials.Certificate("Python/lc-computer-science-5234b-firebase-adminsdk-mi1yt-330f60f64a.json")
        firebase_admin.initialize_app(self._cred, {'databaseURL':'https://lc-computer-science-5234b-default-rtdb.europe-west1.firebasedatabase.app/'})
        self.ref = db.reference("/")

    def Push(self, data) :
        self.ref.update(data)

    @staticmethod
    def GetDatasetAsADictionary() :
        return db.reference("/Dataset").get()
 
    @staticmethod
    def GetGraphDataAsADictionary() :
        return db.reference("/GraphData").get()
