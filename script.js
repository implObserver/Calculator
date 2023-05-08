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
    let mathChain = largeAreaText.textContent;
    smallAreaText.textContent = mathChain + getSymbol(e);
    mathHundler(mathChain.trim());
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

function mathHundler(chain) {
    let chainLinks = chain.match(/(\.\d+)|(\d+\.\d+)|\d+|[^0-9]/g);
    console.log(chainLinks);
}

function checkDot(str) {
    return str[0] === '.' ? `0${str}` : str;
}