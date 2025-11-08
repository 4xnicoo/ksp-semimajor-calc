const bodyRadii = {
    kerbol: 261600000,
    moho: 250000,
    eve: 700000,
    gilly: 13000,
    kerbin: 600000,
    mun: 200000,
    minmus: 60000,
    duna: 320000,
    ike: 130000,
    jool: 6000000,
    laythe: 500000,
    vall: 300000,
    tylo: 600000,
    bop: 65000,
    pol: 44000,
    dres: 138000,
    eeloo: 210000
};

const bodySelect = document.getElementById('bodySelect');
const altitudeInput = document.getElementById('altitudeInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultValue = document.getElementById('resultValue');
const copyBtn = document.getElementById('copyBtn');
const unitTabs = document.getElementById('unitTabs');

let currentSemimajorAxis = null;
let currentUnit = 'm';

function getConvertedValue(value, unit) {
    if (unit === 'km') {
        return value / 1000;
    } else if (unit === 'Mm') {
        return value / 1000000;
    } else if (unit === 'Gm') {
        return value / 1000000000;
    }
    return value;
}

function formatValue(value, unit) {
    let convertedValue = getConvertedValue(value, unit);
    let decimals = 0;
    
    if (unit === 'km') {
        decimals = 2;
    } else if (unit === 'Mm') {
        decimals = 3;
    } else if (unit === 'Gm') {
        decimals = 4;
    }
    
    if (convertedValue >= 1000) {
        return convertedValue.toLocaleString('en-US', { maximumFractionDigits: decimals }) + ' ' + unit;
    } else {
        return convertedValue.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + ' ' + unit;
    }
}

function getValueToCopy(value, unit) {
    const convertedValue = getConvertedValue(value, unit);
    let decimals = 0;
    
    if (unit === 'km') {
        decimals = 2;
    } else if (unit === 'Mm') {
        decimals = 3;
    } else if (unit === 'Gm') {
        decimals = 4;
    }
    
    const formatted = convertedValue.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
    return formatted.replace(/,/g, '');
}

function updateDisplay() {
    if (currentSemimajorAxis === null) {
        resultValue.textContent = '-';
        return;
    }
    
    resultValue.textContent = formatValue(currentSemimajorAxis, currentUnit);
}

function calculateSemimajorAxis() {
    const selectedBody = bodySelect.value;
    const cleanedValue = altitudeInput.value.replace(/[^\d]/g, '');
    const altitude = parseFloat(cleanedValue);
    
    if (isNaN(altitude) || altitude < 0 || cleanedValue === '') {
        resultValue.textContent = 'Invalid input';
        copyBtn.style.display = 'none';
        unitTabs.style.display = 'none';
        currentSemimajorAxis = null;
        return;
    }
    
    const bodyRadius = bodyRadii[selectedBody];
    const semimajorAxis = bodyRadius + altitude;
    currentSemimajorAxis = semimajorAxis;
    
    updateDisplay();
    copyBtn.style.display = 'inline-block';
    unitTabs.style.display = 'flex';
}

copyBtn.addEventListener('click', function() {
    if (currentSemimajorAxis !== null) {
        const valueToCopy = getValueToCopy(currentSemimajorAxis, currentUnit);
        navigator.clipboard.writeText(valueToCopy).then(function() {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(function() {
                copyBtn.textContent = originalText;
            }, 1000);
        });
    }
});

const unitTabButtons = unitTabs.querySelectorAll('.unit-tab');
unitTabButtons.forEach(function(tab) {
    tab.addEventListener('click', function() {
        unitTabButtons.forEach(function(t) {
            t.classList.remove('active');
        });
        tab.classList.add('active');
        currentUnit = tab.getAttribute('data-unit');
        updateDisplay();
    });
});

calculateBtn.addEventListener('click', calculateSemimajorAxis);

altitudeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateSemimajorAxis();
    }
});

bodySelect.addEventListener('change', function() {
    if (altitudeInput.value) {
        calculateSemimajorAxis();
    }
});

