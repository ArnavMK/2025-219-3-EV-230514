import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get, update, child } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

export class DataBase {
 
    DatabaseDictionary;
    AccessData;

    constructor () {

        const firebaseConfig = {
            apiKey: "AIzaSyBWiTbg1IMTEeEUoZbGciIzTUm5ur1HczE",
            authDomain: "lc-computer-science-5234b.firebaseapp.com",
            databaseURL: "https://lc-computer-science-5234b-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "lc-computer-science-5234b",
            storageBucket: "lc-computer-science-5234b.firebasestorage.app",
            messagingSenderId: "851755881306",
            appId: "1:851755881306:web:b685da518cfec7f33cd963"
        };
        
        this.app = initializeApp(firebaseConfig);
        this.dataBase = getDatabase()
        this.firebaseRef = ref(this.dataBase);

        
        get(this.firebaseRef).then((snapshot) => {
            this.DatabaseDictionary = snapshot.val();
        });

        this.AccessData = new Promise(this.#GetGraphData.bind(this));        
    }


    TryGetAllData() {
        if (this.DatabaseDictionary == undefined) {
            return new Error("snapshot is not yet defined! try again later")
        } 
        return this.DatabaseDictionary;
    }

    #GetGraphData(resolve) {

        get(this.firebaseRef).then((snapshot) => {
            resolve(snapshot.val())
        });
    }

    UpdateWithNewInfo(path, info) {
        update(ref(this.dataBase, path), info);
    }

}