const MINBRACKETING = 2;
const smallAreaText = document.querySelector('.calculator__display__small-area__text');
const largeAreaText = document.querySelector('.calculator__display__large-area__text');
const numbersButtons = Array.from(document.querySelectorAll('.calculator__buttons__numbers'));
const operandsButtons = Array.from(document.querySelectorAll('.calculator__buttons__operands'));
const leftBracket = document.querySelector('#start-bracket__40');
const rightBracket = document.querySelector('#end-bracket__41');
const minusButton = document.querySelector('#minus__45');
const buttonEqual = document.querySelector('#equal__61')
const buttonDelete = document.querySelector('#delete');
const buttonDot = document.querySelector('#dot__46');
const operands = ['\367', '\327', '+-'];
let isDisabled = true;

setDisabledOperands(true);
setDisabledRightBrecket(true)

leftBracket.addEventListener('click', e => {
    largeAreaText.textContent += getSymbol(e);
    setDisabledRightBrecket(false)
})

rightBracket.addEventListener('click', e => {
    largeAreaText.textContent += getSymbol(e);
})

buttonDelete.addEventListener('click', clearAreas);

minusButton.addEventListener('click', e => {
    largeAreaText.textContent += getSymbol(e);
    setDisabledMinus(true);
    setDisabledDot(false);
})

for (button of numbersButtons) {
    button.addEventListener('click', e => {
        if (isDisabled) {
            setDisabledOperands(false);
        }
        setDisabledMinus(false);
        setDisabledRightBrecket(false)
        largeAreaText.textContent += getSymbol(e);
    });
};

for (button of operandsButtons) {
    button.addEventListener('click', e => {
        largeAreaText.textContent += getSymbol(e);
        setDisabledOperands(true);
        setDisabledMinus(false);
        setDisabledDot(false);
    });
};

buttonDot.addEventListener('click', e => {
    largeAreaText.textContent += getSymbol(e);
    setDisabledDot(true);
})

buttonEqual.addEventListener('click', e => {
    let equation = largeAreaText.textContent.trim();
    smallAreaText.textContent = equation + getSymbol(e);
    largeAreaText.textContent = equationHundler(Array.from(equation), 0);
    setDisabledOperands(true);
})

function setDisabledLeftBrecket(bool) {
    leftBracket.enabled = bool;
}

function setDisabledRightBrecket(bool) {
    leftBracket.enabled = bool;
}

function setDisabledOperands(bool) {
    isDisabled = bool;
    for (button of operandsButtons) {
        button.disabled = isDisabled;
    }
}

function clearAreas() {
    largeAreaText.textContent = '';
    smallAreaText.textContent = '';
    setDisabledMinus(false);
    setDisabledDot(false);
}

function getSymbol(e) {
    return String.fromCharCode(e.target.id.split('__')[1]); //the symbol code is embedded in the id
}

function setDisabledMinus(bool) {
    minusButton.disabled = bool;
}

function setDisabledDot(bool) {
    buttonDot.disabled = bool;
}


function equationHundler(equation, begin) {

    for (let i = begin; i < equation.length; i++) {
        if (equation[i] === '\50') {
            let section = equationHundler(equation, i + 1);
            let calculateItem = calculate(decomposeEquation(section.join('')));
            equation.splice(i, section.length + MINBRACKETING, calculateItem);
        }
        if (equation[i] === '\51') {
            let section = equation.slice(begin, i);
            return section;
        }
    }

    let result = calculate(decomposeEquation(equation.join('')));
    return result;
}

function decomposeEquation(equation) {
    let expressions = equation.match(/(((?<=[\367\327\+])\-)*(^\-)*(\d*\.*)\d+)|((?<=(\d+.*))[\367\327+-])/g);
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
                    ? interimEquation[i - 1] / interimEquation[i + 1]
                    : operand === '\327'
                        ? interimEquation[i - 1] * interimEquation[i + 1]
                        : equationItem === '+'
                            ? interimEquation[i - 1] + interimEquation[i + 1]
                            : interimEquation[i - 1] - interimEquation[i + 1];

            interimEquation.splice(i - 1, 3, expressionResult);
            --i;
        }
    }
    return interimEquation;
}