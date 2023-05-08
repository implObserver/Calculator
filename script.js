const smallAreaText = document.querySelector('.calculator__display__small-area__text');
const largeAreaText = document.querySelector('.calculator__display__large-area__text');
const numbersButtons = Array.from(document.querySelectorAll('.calculator__buttons__numbers'));
const operandsButtons = Array.from(document.querySelectorAll('.calculator__buttons__operands'));
const buttonDelete = document.querySelector('#delete');
buttonDelete.addEventListener('click', deleteAreasOutput);

for (button of numbersButtons) {
    button.addEventListener('click', e => {
        largeAreaText.textContent += getSymbol(e);
    });
};

for (button of operandsButtons) {
    button.addEventListener('click', e => {
        largeAreaText.textContent = getSymbol(e);
    });
};

function operandsButtonsDisable(bool) {
    for (button of operandsButtons) {
        button.disabled = bool;
    }
}

function deleteAreasOutput() {
    largeAreaText.textContent = '';
    smallAreaText.textContent = '';
}

function getSymbol(e) {
    return String.fromCharCode(e.target.id.split('__')[1]);
}