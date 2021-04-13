class CalcController {

    constructor(){
        this._operation = [];
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

    isOperator(value){
        return (['/','*','-','+','%'].indexOf(value) > -1);
    }
     //Pega o última posição do array
     getLastOperation(){
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    pushOperation(value){//responsável por fazer o push no array _operation
        this._operation.push(value);
        if(this._operation.length > 3){
            this.calc();
        }
    }

    calc(){
        let last = this._operation.pop();
        let result = eval(this._operation.join(""));
        this._operation = [result,last];
        this.setLastNumberToDisplay();
    }

    addOperation(value){//value = valor do momento em que o btn foi clicado
        if(isNaN(this.getLastOperation())){//getLastOperation = valor anterior ao value
            //String
            if(this.isOperator(value)){
                this.setLastOperation(value);
            }else if(isNaN(value)){
                //outra coisa
                console.log('a',value);
            }else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }else {
            //se for número, passa os valores para string, concatena e adiciona na posição do array
            if(isNaN(value)){
                this.pushOperation(value);
            }else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
                this.setLastNumberToDisplay();
            }
            
        }
    }

    setLastNumberToDisplay(){
        let lastNumber;
        for(let i = this._operation.length-1; i >= 0; i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }
        }
        this.displayCalc = lastNumber;
    }
   
    clearAll(){
        this._operation = [];
    }

    clearEntry(){
        this._operation.pop();
    }

    setError(){
        this.displayCalc = "Error";
    }

    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
                break;            
            case 'ce':
                this.clearEntry();
                break;
            case 'porcento':
                this.addOperation('%');
                break;            
            case 'divisao':
                this.addOperation('/');
                break;            
            case 'multiplicacao':
                this.addOperation('*');
                break;            
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'soma':
                this.addOperation('+');
                break;            
            case 'igual':
                break;            
            case 'ponto':
                this.addOperation('.');
                break; 
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
        }
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e=>{
                let textBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(textBtn);
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