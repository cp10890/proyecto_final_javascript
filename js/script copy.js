// Unit converter application

// Global variables and arrays definition
const categoriesList = document.querySelector('#categories_list');
(inputUnit = document.querySelector('#input_list')),
    (outputUnit = document.querySelector('#output_list')),
    (inputValue = document.querySelector('#input_value')),
    (outputValue = document.querySelector('#output_value')),
    (invertBtn = document.querySelector('#invertBtn'));

// Update the categories select list with the categories from the json file data without including duplicates
const updateCategories = async () => {
    const response = await fetch('./js/data.json');
    const data = await response.json();
    const categories = data.map((item) => item.category);
    const uniqueCategories = [...new Set(categories)];
    uniqueCategories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category;
        option.innerHTML = category;
        categoriesList.appendChild(option);
    });
};

// Update the units select lists with the units from the json file data depending on the selected category. The default units for the category "Longitud" will be "Kilometros" and "Millas", for the category "Peso" will be "Kilogramos" and "Libras", for the category "Temperatura" will be "Celsius" and "Fahrenheit" and for the category "Velocidad" will be "Kilometros por hora" and "Millas por hora".
const updateUnits = async () => {
    const response = await fetch('./js/data.json');
    const data = await response.json();
    const category = categoriesList.value;
    const categoryData = data.filter((item) => item.category === category);
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';
    categoryData.forEach((unit) => {
        const optionFrom = document.createElement('option');
        const optionTo = document.createElement('option');
        optionFrom.value = unit.unit;
        optionFrom.innerHTML = unit.unit;
        optionTo.value = unit.unit;
        optionTo.innerHTML = unit.unit;
        inputUnit.appendChild(optionFrom);
        outputUnit.appendChild(optionTo);
    });
    category === 'Longitud'
        ? ((inputUnit.value = 'Kilometros'), (outputUnit.value = 'Millas'))
        : category === 'Peso'
        ? ((inputUnit.value = 'Kilogramos'), (outputUnit.value = 'Libras'))
        : category === 'Temperatura'
        ? ((inputUnit.value = 'Celsius'), (outputUnit.value = 'Fahrenheit'))
        : category === 'Velocidad'
        ? ((inputUnit.value = 'Kilometros por hora'),
          (outputUnit.value = 'Millas por hora'))
        : null;
};

// Function to convert the input value to the output value depending on the selected units and the factors from the json file data. If the category is "Temperatura", the increment should be added from the "Increment" property of the json file data. The output value will be rounded to 4 decimals if it is a decimal and the output value will be updated with the converted value in the id "output_value". The input must be converted to a base unit before the conversion and then converted to the output unit and considering the increment if the category is "Temperatura".
function convertUnits() {
    fetch('./js/data.json')
        .then((response) => response.json())
        .then((data) => {
            const category = categoriesList.value;
            const categoryData = data.filter(
                (item) => item.category === category
            );
            const inputUnitData = categoryData.filter(
                (item) => item.unit === inputUnit.value
            );
            const outputUnitData = categoryData.filter(
                (item) => item.unit === outputUnit.value
            );
            const inputFactor = inputUnitData[0].factor;
            const outputFactor = outputUnitData[0].factor;
            const increment = outputUnitData[0].increment;
            const inputBaseValue = inputValue.value / inputFactor;
            const outputBaseValue =
                category === 'Temperatura'
                    ? inputBaseValue * outputFactor + increment
                    : inputBaseValue * outputFactor;
            const outputValueRounded = outputBaseValue.toFixed(4);
            outputValue.value = outputValueRounded;
        });
}

// On category change the units select lists will be updated
categoriesList.addEventListener('change', () => {
    updateUnits();
    inputValue.value = '';
    outputValue.value = '';
});

// When the input value changes the output value will be updated
inputValue.addEventListener('input', () => {
    convertUnits();
});

// When the input unit changes the output value will be updated
inputUnit.addEventListener('change', () => {
    convertUnits();
});

// When the output unit changes the output value will be updated
outputUnit.addEventListener('change', () => {
    convertUnits();
});

// When the id "invertBtn" is clicked, the values of the input and output units will be inverted
invertBtn.addEventListener('click', () => {
    const temp = inputUnit.value;
    inputUnit.value = outputUnit.value;
    outputUnit.value = temp;
    inputValue.value = outputValue.value;
    outputValue.value = inputValue.value;
    convertUnits();
});

// If the input value is not a number, show an alert message saying that the user must enter a number
inputValue.addEventListener('input', () => {
    if (isNaN(inputValue.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor ingrese un número válido',
        });
        inputValue.value = '';
        outputValue.value = '';
    }
});

// If the checkbox with the id "datos" is checked, save the input value, input unit, output unit and output value in the local storage and show an alert message saying that de data has been saved successfully
const datos = document.querySelector('#datos');
datos.addEventListener('change', () => {
    if (datos.checked) {
        localStorage.setItem('category', categoriesList.value);
        localStorage.setItem('inputValue', inputValue.value);
        localStorage.setItem('inputUnit', inputUnit.value);
        localStorage.setItem('outputUnit', outputUnit.value);
        localStorage.setItem('outputValue', outputValue.value);
        Swal.fire({
            icon: 'success',
            title: 'Datos guardados',
            text: 'Sus datos han sido guardados exitosamente',
        });
    }
});

// On window load the categories and units select lists will be updated. If there is data in the local storage, show an alert saying that there is data saved in the browser's memory and ask to load, if the user clicks yes the input value, input unit, output unit and output value will be updated with the data from the local storage, and if it clicks no the data from the local storage will be deleted
window.onload = () => {
    // Reset the input and output values
    inputValue.value = '';
    outputValue.value = '';
    if (localStorage.getItem('inputValue')) {
        Swal.fire({
            title: 'Hay información guardada en el navegador, ¿desea cargarla?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Si`,
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                updateCategories();
                updateUnits();
                categoriesList.value = localStorage.getItem('category');
                inputValue.value = localStorage.getItem('inputValue');
                inputUnit.value = localStorage.getItem('inputUnit');
                outputUnit.value = localStorage.getItem('outputUnit');
                outputValue.value = localStorage.getItem('outputValue');
            } else if (result.isDenied) {
                localStorage.clear();
                updateCategories();
                updateUnits();
            }
        });
    } else {
        updateCategories();
        updateUnits();
    }
};
