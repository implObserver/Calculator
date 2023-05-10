const MINBRACKETS = 2;
const smallAreaText = document.querySelector('.calculator__display__small-area__text');
const largeAreaText = document.querySelector('.calculator__display__large-area__text');
const numbersButtons = Array.from(document.querySelectorAll('.calculator__buttons__numbers'));
const operandsButtons = Array.from(document.querySelectorAll('.calculator__buttons__operands'));
const leftBracket = document.querySelector('#start-bracket__40');
const rightBracket = document.querySelector('#end-bracket__41');
const buttnMinus = document.querySelector('#minus__45');
const buttonEqual = document.querySelector('#equal__61')
const buttonDelete = document.querySelector('#delete');
const buttonRemove = document.querySelector('#remove');
const buttonDot = document.querySelector('#dot__46');

const operands = ['\367', '\327', '+-'];
let bracketCounter;
let isDisabled;
let isCalculated;

const regulars = {
    validateRegular: '(\\.-)|(\\(\\))|([\\367\\327\\050+-]$)',
    twoMinus: '(\\-\\-)',
    mainHandler: '(((?<=[\\367\\327\\+\\-])\\-)*(^\\-)*(\\d*\\.*)\\d+)|((?<=(\\d+.*))[\\367\\327+-])',
}

defaultPreset();

leftBracket.addEventListener('click', e => {
    if (isCalculated) {
        defaultPreset();
    }
    bracketCounter += 1;
    largeAreaText.textContent += getSymbol(e);
    setDisabledRightBrecket(false)
    setDisabledMinus(false);
})

rightBracket.addEventListener('click', e => {
    bracketCounter -= 1;
    if (bracketCounter == 0) {
        setDisabledRightBrecket(true);
    }
    largeAreaText.textContent += getSymbol(e);
    setDisabledMinus(true);
})

buttonDelete.addEventListener('click', clearAreas);

buttonRemove.addEventListener('click', e => {
    let removableText = largeAreaText.textContent;
    bracketing(removableText.slice(-1));
    largeAreaText.textContent = removableText.slice(0, -1);
})

function bracketing(symbol) {
    if (symbol === '\50') {
        bracketCounter -= 1;
        setDisabledRightBrecket(true);
    }
    if (symbol === '\51') {
        bracketCounter += 1;
        setDisabledRightBrecket(false);
    }
}

buttnMinus.addEventListener('click', e => {
    if (isCalculated) {
        defaultPreset();
    }
    largeAreaText.textContent += getSymbol(e);
    setDisabledMinus(true);
    setDisabledDot(false);
})

for (button of numbersButtons) {
    button.addEventListener('click', e => {
        if (isDisabled) {
            setDisabledOperands(false);
        }
        if (isCalculated) {
            defaultPreset('');
        }
        setDisabledMinus(false);
        setDisabledRightBrecket(false)
        largeAreaText.textContent += getSymbol(e);
    });
};

for (button of operandsButtons) {
    button.addEventListener('click', e => {
        if (isCalculated) {
            defaultPreset();
        }
        largeAreaText.textContent += getSymbol(e);
        setDisabledOperands(true);
        setDisabledMinus(false);
        setDisabledDot(false);
    });
};

buttonDot.addEventListener('click', e => {
    if (isCalculated) {
        defaultPreset('');
    }
    largeAreaText.textContent += getSymbol(e);
    setDisabledDot(true);
})

buttonEqual.addEventListener('click', e => {
    let equation = largeAreaText.textContent.trim();
    if (validationInput(equation)) {
        smallAreaText.textContent = equation + getSymbol(e);
        largeAreaText.textContent = equationHandler(Array.from(equation), 0);
        isCalculated = true;
    }
})

function defaultPreset(text = largeAreaText.textContent) {
    setDisabledOperands(true);
    setDisabledRightBrecket(true);
    setDisabledMinus(false);
    setDisabledDot(false);
    isDisabled = true;
    isCalculated = false;
    isCorrect = true;
    bracketCounter = 0;
    ansPreset(text);
}

function ansPreset(text = largeAreaText.textContent) {
    isCalculated = false;
    smallAreaText.textContent = `Ans = ${largeAreaText.textContent}`;
    largeAreaText.textContent = text;
}

function excPreset(text = 'Incorrect expression') {
    smallAreaText.textContent = text;
}


function setDisabledLeftBrecket(bool) {
    leftBracket.disabled = bool;
}

function setDisabledRightBrecket(bool) {
    rightBracket.disabled = bool;
}

function setDisabledOperands(bool) {
    isDisabled = bool;
    for (button of operandsButtons) {
        button.disabled = isDisabled;
    }
}

function clearAreas() {
    largeAreaText.textContent = '';
    defaultPreset();
}

function getSymbol(e) {
    return String.fromCharCode(e.target.id.split('__')[1]); //the symbol code is embedded in the id
}

function setDisabledMinus(bool) {
    buttnMinus.disabled = bool;
}

function setDisabledDot(bool) {
    buttonDot.disabled = bool;
}

function validationInput(str) {
    let validation = new RegExp(regulars.validateRegular, 'g');
    let abusiveExpressions = str.match(validation);
    if (abusiveExpressions != null) {
        excPreset();
        return false;
    } else if (bracketCounter != 0) {
        excPreset('Forgot the bracket!');
        return false;
    }
    return true;
}

function equationHandler(equation, begin) {
    for (let i = begin; i < equation.length; i++) {
        if (equation[i] === '\50') {
            if (stringOrNumber(equation[i - 1]) === 'number') {
                equation = addDefaultMultiply(equation, i);
                ++i;
            }
            ++i;
            let section = equationHandler(equation, i);
            let processedSection = section.length === 1 ? section.toString() : section.join('');
            let calculateItem = calculate(decomposeEquation(processedSection));
            equation.splice(--i, section.length + MINBRACKETS, calculateItem);
        }
        if (equation[i] === '\51') {
            if (stringOrNumber(equation[i + 1]) === 'number') {
                equation = addDefaultMultiply(equation, i + 1);
            }
            let section = equation.slice(begin, i);
            return section;
        }
    }
    return calculate(decomposeEquation(equation.join('')));
}

function getPlus(str) {
    let twoMinus = new RegExp(regulars.twoMinus, 'g');
    let processedStr = str.replace(twoMinus, '\+');
    return processedStr;
}

function stringOrNumber(str) {
    if (isNaN(str)) {
        return "string";
    } else {
        return "number";
    }
}

function addDefaultMultiply(equation, index) {
    let processedEquation = equation;
    processedEquation.splice(index, 0, '\327');
    return processedEquation;
}

function decomposeEquation(equation) {
    let mainHandler = new RegExp(regulars.mainHandler, 'g');
    let expressions = getPlus(equation).match(mainHandler);
    return toFloat(addZero(expressions));
}

function addZero(array) {
    let processsedArr = array.map(e => e[0] === '.' ? `0${e}` : e);  //add 0 before .
    return processsedArr
}

function toFloat(array) {
    let processedArr = array;
    for (let i = 0; i <= array.length - 1; i += 2) {
        processedArr[i] = parseFloat(processedArr[i]);
    }
    return processedArr;
}

function calculate(expressions) {
    let interimEquation = expressions;
    for (let operand of operands) {
        interimEquation = mathHandler(interimEquation, operand);
    }
    return interimEquation[0];
}

function mathHandler(interimEquation, operand) {
    for (let i = 0; i < interimEquation.length; i++) {
        let equationItem = interimEquation[i];
        if (operand.includes(equationItem)) {

            let expressionResult
                = operand === '\367'
                    ? division(interimEquation[i - 1], interimEquation[i + 1])
                    : operand === '\327'
                        ? multiplication(interimEquation[i - 1], interimEquation[i + 1])
                        : equationItem === '+'
                            ? summ(interimEquation[i - 1], interimEquation[i + 1])
                            : difference(interimEquation[i - 1], interimEquation[i + 1]);

            interimEquation.splice(i - 1, 3, expressionResult);
            --i;
        }
    }
    return interimEquation;
}

function multiplication(x, y) {
    return x * y;
}

function division(x, y) {
    return x / y;
}

function difference(x, y) {
    return x - y;
}

function summ(x, y) {
    return x + y;
}