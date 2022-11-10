// Unit converter application

// Global variables and arrays definition
const categories = new Array();
const units = new Array();
const factors = new Array();

categories[0] = 'Distancia';
units[0] = new Array(
    'Kilometros',
    'Metros',
    'Centimetros',
    'Milimetros',
    'Milla',
    'Yarda',
    'Pie',
    'Pulgada'
);
factors[0] = new Array(1, 1000, 100000, 1000000, 0.6214, 1093.6, 3280.8, 39370);

categories[1] = 'Peso';
units[1] = new Array('Kilogramos', 'Gramos', 'Miligramos', 'Libra', 'Onza');
factors[1] = new Array(1, 1000, 1000000, 2.2046, 35.274);

categories[2] = 'Temperatura';
units[2] = new Array('Celsius', 'Fahrenheit', 'Kelvin');
factors[2] = new Array(1, 0.555555555555, 1);
tempIncrement = new Array(0, 32, 273.15);

categories[3] = 'Velocidad';
units[3] = new Array(
    'Kilometros por hora',
    'Metros por segundo',
    'Millas por hora'
);
factors[3] = new Array(1, 0.2778, 0.6214);

// Function to update the categories select list with the categories array
function updateCategories() {
    let select = document.getElementById('categories_list');
    for (let i = 0; i < categories.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = categories[i];
        select.appendChild(opt);
    }
}

// Function to update the units input and output lists depending on the category selected from the categories array, must use the same index as the categories array data.
function updateUnits() {
    let category = document.getElementById('categories_list').value;
    let select_from = document.getElementById('input_list');
    let select_to = document.getElementById('output_list');
    select_from.innerHTML = '';
    select_to.innerHTML = '';
    for (let i = 0; i < units[category].length; i++) {
        let opt_from = document.createElement('option');
        let opt_to = document.createElement('option');
        opt_from.value = i;
        opt_from.innerHTML = units[category][i];
        opt_to.value = i;
        opt_to.innerHTML = units[category][i];
        select_from.appendChild(opt_from);
        select_to.appendChild(opt_to);
    }
}

// Convert the input value to the output value
function convert() {
    let category = document.getElementById('categories_list').value;
    let input = document.getElementById('input_list').value;
    let output = document.getElementById('output_list').value;
    let input_value = document.getElementById('input_value').value;
    let output_value = document.getElementById('output_value');
    let base_unit = input_value / factors[category][input];
    output_value.value = base_unit * factors[category][output];
    if (category == 2) {
        output_value.value =
            parseFloat(output_value.value) + parseFloat(tempIncrement[output]);
    }
    // Round the result to 2 decimals
    output_value.value = parseFloat(output_value.value).toFixed(2);
}

// Function to save data to local storage if checkbox is checked
function saveData() {
    let checkbox = document.getElementById('datos').checked;
    let category = document.getElementById('categories_list').value;
    let input = document.getElementById('input_list').value;
    let output = document.getElementById('output_list').value;
    let value = document.getElementById('input_value').value;
    if (checkbox) {
        localStorage.setItem('category', category);
        localStorage.setItem('input', input);
        localStorage.setItem('output', output);
        localStorage.setItem('input_value', value);
        localStorage.setItem('output_value', result);
    }
}

// Convert the arrays and variables in json format and save them in local storage
function saveJson() {
    let json = JSON.stringify({
        categories: categories,
        units: units,
        factors: factors,
        tempIncrement: tempIncrement,
    });
    localStorage.setItem('json', json);
}

// Save the json data in local storage if checkbox is checked when the convert button is clicked
document.getElementById('convertBtn').addEventListener('click', function () {
    saveData();
});

// Clear the input values and execute the functions when the page is loaded
window.onload = function () {
    document.getElementById('input_value').value = '';
    document.getElementById('output_value').value = '';
    updateCategories();
    updateUnits();
};

// Execute the functions when the category is changed in the categories list
document
    .getElementById('categories_list')
    .addEventListener('change', function () {
        updateUnits();
    });

// Convert when the "convertBtn" button is clicked
document.getElementById('convertBtn').addEventListener('click', function () {
    convert();
});

// Clear input and output values when page is reloaded
window.onbeforeunload = function () {
    document.getElementById('input_value').value = '';
    document.getElementById('output_value').value = '';
};

// Function to clear all data from local storage when checkbox is unchecked
document.getElementById('datos').addEventListener('change', function () {
    if (!document.getElementById('datos').checked) {
        clearAll();
    }
});

// Clear input when the input and output box is clicked after conversion
document.getElementById('input_value').addEventListener('click', function () {
    document.getElementById('input_value').value = '';
    document.getElementById('output_value').value = '';
});

// Clear checkbox if the page is reloaded
document.getElementById('datos').checked = false;
