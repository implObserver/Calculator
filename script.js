const MINBRACKETS = 2;

const buttons = {
    lBracket: document.querySelector('.start-bracket'),
    rBracket: document.querySelector('.end-bracket'),
    minus: document.querySelector('.minus'),
    equal: document.querySelector('.equal'),
    del: document.querySelector('.delete'),
    remove: document.querySelector('.remove'),
    dot: document.querySelector('.dot'),
    numbers: Array.from(document.querySelectorAll('.numbers')),
    operands: Array.from(document.querySelectorAll('.operands')),
}

const display = {
    area: document.querySelector('.calculator__display'),
    smallText: document.querySelector('.calculator__display-small-area-text'),
    largeText: document.querySelector('.calculator__display-large-area-text'),
}

const markers = ['\367', '\327', '+-'];
let bracketCounter;
let isDisabled;
let isCalculated;

const regulars = {
    validateRegular: '(^\\.*[\\367\\327\\050\\+\\-]*$)|(\\.-)|(\\(\\))|((?<=(\\-))[\\367\\327\\+\\-])|([\\367\\327\\050\\+\\-]$)',
    twoMinus: '(\\-\\-)',
    mainHandler: '(((?<=[\\367\\327\\+\\-])\\-)*(^\\-)*(\\d*\\.*)\\d+)|((?<=(\\d+\\.*))[\\367\\327+-])',
}

defaultPreset();

window.addEventListener('click', e => {
    display.area.scrollLeft = display.area.scrollWidth;
    if (bracketCounter == 0) {
        setDisabledRightBrecket(true);
    } else {
        setDisabledRightBrecket(false);
    }
});

buttons.lBracket.addEventListener('click', e => {
    if (isCalculated) {
        defaultPreset();
    }
    bracketCounter += 1;
    display.largeText.textContent += e.target.value;
    setDisabledMinus(false);
})

buttons.rBracket.addEventListener('click', e => {
    bracketCounter -= 1;
    display.largeText.textContent += e.target.value;
    setDisabledMinus(true);
})

buttons.del.addEventListener('click', clearAreas);

buttons.remove.addEventListener('click', e => {

    let removableText = display.largeText.textContent.trim();
    if (removableText.length > 1) {
        removePreset();
        display.largeText.textContent = removableText.slice(0, -1);
    } else {
        defaultPreset('');
        ansPreset('', '');
    }
})

buttons.minus.addEventListener('click', e => {
    if (isCalculated) {
        defaultPreset();
    }
    display.largeText.textContent += e.target.value;
    setDisabledMinus(true);
    setDisabledDot(false);
})

for (let button of buttons.numbers) {
    button.addEventListener('click', e => {
        if (isDisabled) {
            setDisabledOperands(false);
        }
        if (isCalculated) {
            defaultPreset('');
        }
        setDisabledMinus(false);
        display.largeText.textContent += e.target.value;
    });
};

for (let button of buttons.operands) {
    button.addEventListener('click', e => {
        if (isCalculated) {
            defaultPreset();
        }
        display.largeText.textContent += e.target.value;
        setDisabledOperands(true);
        setDisabledMinus(false);
        setDisabledDot(false);
    });
};

buttons.dot.addEventListener('click', e => {
    if (isCalculated) {
        defaultPreset('');
    }
    display.largeText.textContent += e.target.value;
    setDisabledDot(true);
})

buttons.equal.addEventListener('click', e => {
    let equation = display.largeText.textContent.trim();
    if (validationInput(equation)) {
        display.smallText.textContent = equation + e.target.value;
        display.largeText.textContent = equationHandler(Array.from(equation), 0);
        isCalculated = true;
        setDisabledDot(false);
    }
})

function defaultPreset(text = display.largeText.textContent) {
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

function removePreset() {
    bracketing();
    setDisabledOperands(false);
    setDisabledMinus(false);
    setDisabledDot(false);
}

function ansPreset(text = display.largeText.textContent, result = display.largeText.textContent) {
    isCalculated = false;
    display.smallText.textContent = `Ans = ${result}`;
    display.largeText.textContent = text;
}

function excPreset(text = 'Incorrect expression') {
    display.smallText.textContent = text;
}

function setDisabledLeftBrecket(bool) {
    buttons.lBracket.disabled = bool;
}

function setDisabledRightBrecket(bool) {
    buttons.rBracket.disabled = bool;
}

function setDisabledOperands(bool) {
    isDisabled = bool;
    for (let button of buttons.operands) {
        button.disabled = isDisabled;
    }
}

function clearAreas() {
    display.largeText.textContent = '';
    defaultPreset();
}

function setDisabledMinus(bool) {
    buttons.minus.disabled = bool;
}

function setDisabledDot(bool) {
    buttons.dot.disabled = bool;
}

function bracketing(symbol = display.largeText.textContent.slice(-1)) {
    if (symbol === '\50') {
        bracketCounter -= 1;
    }
    if (symbol === '\51') {
        bracketCounter += 1;

    }
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
    for (let operand of markers) {
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