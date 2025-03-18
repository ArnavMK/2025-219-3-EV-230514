
// this is for the showing the information about a country when the user clicks the a country marker on the earth controller
export class CustomContextMenu {
 
    isActive = false;

    constructor () {
        this.customMenuElement = document.getElementById("customMenu");
        document.addEventListener("mousemove", this.#UpdateMenuPositionWithMouse.bind(this));
        
        this.HideMenu();    
    }

    #UpdateMenuPositionWithMouse(event) {
        if (event.offsetY >= 0) this.customMenuElement.style.top = `${event.clientY - 70}px`;
        if (event.offsetX  <= window.innerWidth) this.customMenuElement.style.left = `${event.clientX}px`;
    }

    UpdateMenuContent(data) {
        
        this.customMenuElement.innerHTML = `${data.name} <br> Unemployment: ${data.unemployment}% <br> Out of school rate: ${data.OOSR}% <br> Enrollment rates: ${Math.round(data.Enrollment)}%`;

    }
 
    IsActive() {
        return this.isActive;
    }

    HideMenu() {

        this.customMenuElement.style.opacity = "0";
        this.isActive = false;
        setTimeout(() => {
            this.customMenuElement.style.display = "none";
        }, 400);

    }

    ShowMenu() {

        this.isActive = true;

        this.customMenuElement.style.opacity = "1";
        this.customMenuElement.style.display = "block";

        setTimeout(this.HideMenu.bind(this), 5000) // will make the menu disappear after 5s
    }
}