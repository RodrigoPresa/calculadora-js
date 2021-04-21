class CalcController {

    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastNumber = '';
        this._lastOperator = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._currentDate;
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    initialize(){
        this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });
    }

    pasteFromClipboard(){//Método responsável por colar o valor armazenado na área de transferência do sistema operacional
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);

        });
    }

    copyToClipboard(){//Método responsável por recuperar o valor da área de transferência do sistema operacional
        //cria o elemento que irá armazenar o valor digitado
        let input = document.createElement('input');
        //armazena o valor digitado no value do input
        input.value = this.displayCalc;
        //add input como filho do body
        document.body.appendChild(input);
        //seleciona o value do input
        input.select();
        //responsável por copiar o conteúdo selecionado p/ área de transferência
        document.execCommand("Copy");
        //remove o elemento input (por estar usando SVG, o remove() não permite que o input apareça na tela)
        input.remove();


    }

    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){

        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
        
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

    getResult(){
        try {
            return eval(this._operation.join(""));
        } catch (e) {
            setTimeout(()=>{
                this.setError();
            })
        }        
    }

    calc(){
        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        if(this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if(this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false);
        }
        
        let result = this.getResult();
        

        if(last == '%'){
            result /= 100;
            this._operation = [result];
        }else{
            this._operation = [result];
            if(last) this._operation.push(last);
        }
        
        this.setLastNumberToDisplay();
    }

    addOperation(value){//value = valor do momento em que o btn foi clicado
        if(isNaN(this.getLastOperation())){//getLastOperation = valor anterior ao value
            //String
            if(this.isOperator(value)){
                this.setLastOperation(value);
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
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
            
        }
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        } else{
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){ //Verifica se o último item do array é um operador ou um número e retorna o resultado
        let lastItem;
        for(let i = this._operation.length-1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }
        //mantém o operador da memória caso não encontre o item após o for
        if(!lastItem) lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);        

        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }
   
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    setError(){
        this.displayCalc = "Error";
    }

    execBtn(value){
        this.playAudio();
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
                this.calc();
                break;            
            case 'ponto':
                this.addDot();
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

    initKeyboard(){
        document.addEventListener('keyup', e=>{
            this.playAudio();
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;            
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '%':
                case '/':
                case '*':
                case '-':
                case '+':
                    this.addOperation(e.key);
                    break;                       
                case 'Enter':
                case '=':
                    this.calc();
                    break;            
                case ',':
                case '.':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }        
        });
        
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

        if(value.toString().length > 10){
            this.setError();
            return false;
        }
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