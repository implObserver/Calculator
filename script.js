const smallAreaText = document.querySelector('.calculator__display__small-area__text');
const largeAreaText = document.querySelector('.calculator__display__large-area__text');
const numbersButtons = Array.from(document.querySelectorAll('.calculator__buttons__numbers'));
const operandsButtons = Array.from(document.querySelectorAll('.calculator__buttons__operands'));
const buttonEqual = document.querySelector('#equal__61')
const buttonDelete = document.querySelector('#delete');
const buttonDot = document.querySelector('#dot__46');
let isDisabled = true;

setDisabledOperands(true);
buttonDelete.addEventListener('click', deleteAreasOutput);

buttonEqual.addEventListener('click', e => {
    let equation = largeAreaText.textContent.trim();
    smallAreaText.textContent = equation + getSymbol(e);
    mathHundler(getDecomposeEquation(equation));
})

buttonDot.addEventListener('click', e => {
    largeAreaText.textContent += getSymbol(e);
    setDisableDot(true);
})

for (button of numbersButtons) {
    button.addEventListener('click', e => {
        if (isDisabled) {
            setDisabledOperands(false);
        }

        largeAreaText.textContent += getSymbol(e);
    });
};

for (button of operandsButtons) {
    button.addEventListener('click', e => {
        largeAreaText.textContent += getSymbol(e);
        setDisabledOperands(true);
        setDisableDot(false);
    });
};

function setDisabledOperands(bool) {
    isDisabled = bool;
    for (button of operandsButtons) {
        button.disabled = isDisabled;
    }
}

function setDisableDot(bool) {
    buttonDot.disabled = bool;
}

function deleteAreasOutput() {
    largeAreaText.textContent = '';
    smallAreaText.textContent = '';
}

function getSymbol(e) {
    return String.fromCharCode(e.target.id.split('__')[1]);
}

function getDecomposeEquation(equation) {
    let decomposeEquation = equation.match(/(\.\d+)|(\d+\.\d+)|\d+|[^0-9]/g);
    return parseFloatElements(getCheckDot(decomposeEquation));
}

function mathHundler(decomposeEquation) {
    for (let i = 0; i < decomposeEquation.length; i++) {
        let equationComponent = decomposeEquation[i];
        if (equationComponent === '\367') {
            let resultCalculationComponent = decomposeEquation[i - 1] / decomposeEquation[i + 1];
            decomposeEquation.splice(i - 1, 3, resultCalculationComponent);
        }

        if (equationComponent === '\327') {
            let resultCalculationComponent = decomposeEquation[i - 1] * decomposeEquation[i + 1];
            decomposeEquation.splice(i - 1, 3, resultCalculationComponent);
        }
    }
    console.log(decomposeEquation);
}


function getCheckDot(array) {
    let processsedArr = array.map(e => e[0] === '.' ? `0${e}` : e);
    return processsedArr
}

function parseFloatElements(array) {
    let processedArr = array;
    for (let i = 0; i <= array.length - 1; i += 2) {
        processedArr[i] = parseFloat(processedArr[i]);
    }

    return processedArr;
}