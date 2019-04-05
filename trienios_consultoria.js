var salaries = [
{'id':'e3','base':11779.29,'plus':827.78},
{'id':'e2','base':12616.26,'plus':887.71},
{'id':'e1','base':14817.89,'plus':1042.67},
{'id':'d3','base':15017.47,'plus':1056.71},
{'id':'d2','base':15319.28,'plus':1069.98},
{'id':'d1','base':16548.44,'plus':1167.21},
{'id':'c3','base':19527.72,'plus':1368.72},
{'id':'c2','base':21530.56,'plus':1509.10},
{'id':'c1','base':23099.31,'plus':1541.06},
{'id':'b2','base':23542.78,'plus':1646.24},
{'id':'b1','base':24297.46,'plus':1689.13},
{'id':'a1','base':25035.54,'plus':1754.77}
];

var chartOptions = {
  width: 400,
  height: 250,
  chartPadding: {
    top: 40
  },
  axisY: {
    offset: 100,
    labelInterpolationFnc: function(value) {
      return formatMoney(value);
    }
  }
};

var totalWithPeriods = 0;

function calculateSalary() {
    var salaryObj = getSalaryBySelectedCategory();
    var periods = getPeriods();
    if (null != salaryObj) {
        document.getElementById("result-periods").innerHTML=periods;
        document.getElementById("result-base-salary").innerHTML=formatMoney(salaryObj.base);
        document.getElementById("result-plus").innerHTML=formatMoney(salaryObj.plus);
        var threeYearPeriod = calcOnePeriod(salaryObj.base);
        document.getElementById("result-three-year-period").innerHTML=formatMoney(threeYearPeriod);
        var total = parseFloat(salaryObj.base) + parseFloat(salaryObj.plus);
        var threeYearPeriods = calculateThreeYearPeriod(salaryObj.base, periods);
        document.getElementById("result-sum-periods").innerHTML=formatMoney(threeYearPeriods);
        totalWithPeriods = parseFloat(total) + parseFloat(threeYearPeriods);
        document.getElementById("result-total").innerHTML=formatMoney(totalWithPeriods);
        calculateReduction();
        if (document.getElementById("salaryEvolutionTitle").style.display == "block") {
            calcEvolution();
        }
    } else {
        document.getElementById("result-periods").innerHTML=periods;
        document.getElementById("result-base-salary").innerHTML='';
        document.getElementById("result-plus").innerHTML='';
        document.getElementById("result-three-year-period").innerHTML='';
        document.getElementById("result-sum-periods").innerHTML='';
        document.getElementById("result-total").innerHTML='';
    }
}

function calcOnePeriod(base) {
    return parseFloat(base) * 0.05;
}

function getPeriods() {
    var periods = 0;
    var selectedOptionVal = getSelectedOption();
    if (selectedOptionVal == 'three-year-period-option') {
        var elPeriods = document.getElementById("three-year-period");
        periods = elPeriods.options[elPeriods.selectedIndex].value;
    } else if (selectedOptionVal == 'initial-year-option') {
        var yearInput = document.getElementById("initialYear");
        var year = yearInput.value;
        if (yearInput.validity.valid == true && year != null && year != "") {
            var currentYear = new Date().getFullYear();
            periods = Math.trunc((currentYear - year) / 3);
            if (periods > 9) {
                periods = 9;
            }
        }
    }
    return periods;
}

function formatMoney(quantity) {
    return quantity.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function getSalaryBySelectedCategory() {
    var elCategory = document.getElementById("category");
    var selOption = elCategory.options[elCategory.selectedIndex].value;
    var salaryObj = salaries.find((item) => item.id === selOption);
    return salaryObj;
}

function calculateThreeYearPeriod(baseSalary, periods) {
    var totalPeriods = 0;
    for (var x = 0; x != periods; x++) {
        if (x >= 0 && x < 5) {
            totalPeriods+=1;
        } else if (x >= 5 && x < 8) {
            totalPeriods+=2;
        } else {
            totalPeriods+=1;
        }
    }
    return parseFloat(parseFloat(baseSalary)*0.05*totalPeriods);
}

function showReduction() {
    document.getElementById("addReduction").style.display='none';
    document.getElementById("reduction").style.display='block';
}

function hideReduction() {
    document.getElementById("reduction").style.display='none';
    document.getElementById("addReduction").style.display='block';
}

function calculateReduction() {
    var percentageInput = document.getElementById("reductionPercentage");
    if (percentageInput.validity.valid == false) {
        percentage = 0;
    } else {
        percentage = percentageInput.value;
    }
    var newTotal = totalWithPeriods - (percentage * 0.01 * totalWithPeriods);
    document.getElementById("result-with-reduction-total").innerHTML=formatMoney(newTotal);
}

function changeSelectedOption() {
    var selOption = getSelectedOption();
    if (selOption == 'three-year-period-option') {
        document.getElementById("initial-year-filter").style.display='none';
        document.getElementById("three-year-period-filter").style.display='block';
    } else if (selOption == 'initial-year-option') {
        document.getElementById("three-year-period-filter").style.display='none';
        document.getElementById("initial-year-filter").style.display='block';
    }
    calculateSalary();
}

function getSelectedOption() {
    var selectedOptionVal;
    var selectedOption = document.getElementsByName("selectedOption");
    for (var i = 0, length = selectedOption.length; i < length; i++)
    {
        if (selectedOption[i].checked) {
            selectedOptionVal = selectedOption[i].value;
            break;
        }
    }
    return selectedOptionVal;
}

function calcEvolution() {
	var salaryObj = getSalaryBySelectedCategory();
    var periods = getPeriods();
    if (null != salaryObj && null != periods && periods < 9) {
		var data = { labels: [], series: [] };
		internalSerie = [];
        for (var i = periods; i < 10; i++) {
            var total = parseFloat(salaryObj.base) + parseFloat(salaryObj.plus);
            var threeYearPeriods = calculateThreeYearPeriod(salaryObj.base, i);
            var totalWPeriods = parseFloat(total) + parseFloat(threeYearPeriods);
            data.labels.push(i);
			internalSerie.push(totalWPeriods);
        }
        data.series.push(internalSerie);
        new Chartist.Line('.salaryEvolution', data, chartOptions);
        document.getElementById("showEvolutionLink").style.display='none';
        document.getElementById("hideEvolutionLink").style.display='block';
        document.getElementById("salaryEvolutionTitle").style.display='block';
		document.getElementById("salaryEvolution").style.display='block';
    } else {
        hideEvolution();
    }
}

function hideEvolution() {
    document.getElementById("showEvolutionLink").style.display='block';
    document.getElementById("hideEvolutionLink").style.display='none';
    document.getElementById("salaryEvolutionTitle").style.display='none';
    document.getElementById("salaryEvolution").style.display='none';
}
