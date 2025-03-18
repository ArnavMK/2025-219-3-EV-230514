
// -------------------------------------------------------------------------------------------------------------------
// This file is accompanied by its explanation file in the explanations folder. (ErrorLogger.txt)
// I would recommend reading that file along side this one to get a complete understanding of the code.
// -------------------------------------------------------------------------------------------------------------------


export class ErrorLogger {

    isFree;

    constructor(loggerElement) {

        this.loggerElement = loggerElement;
        this.errorList = new Map();
        this.isFree = true;
        this.loggerElement.style.opacity = "0";

    }
 
    ShowNewError(errorMessage) {

        this.errorList.set(errorMessage, errorMessage);

        if (this.isFree) {

            this.loggerElement.style.opacity = "1";
            this.loggerElement.innerHTML = errorMessage;
            setTimeout(() => this.#HideErrorLogger(errorMessage), 5000);
            this.isFree = false;

        }
        
    }

    #HideErrorLogger(errorMessage) {

        this.errorList.delete(errorMessage);
        this.loggerElement.style.opacity = "0";
        this.isFree = true;
        
        if (this.errorList.size > 0) {

            // to give enough time for the animation to complete
            setTimeout(() =>  this.ShowNewError(this.errorList.entries().next().value[0]), 402);
        }
    }

}