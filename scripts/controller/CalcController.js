class CalcController {

    constructor(){
        this._locale = "pt-BR";
        this._currentDate;
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){
        this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    //método criado para tratar múltiplos eventos
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false);
        });
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e=>{
                console.log(btn.className.baseVal.replace("btn-",""));
            });

            this.addEventListenerAll(btn,"mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer";
            });
        });
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
}