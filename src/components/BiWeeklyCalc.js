module.exports = async (request) => {
  try {
    var balance = parseFloat(request.loan_amount);
    var interestRate = parseFloat(request.interest / 100.0);
    var terms = parseFloat(request.terms);

    var result = "";
    var balVal = validateInputs(balance);
    var intrVal = validateInputs(interestRate);

    console.log(request);

    if (balVal && intrVal) {
      if (request.responseType.toLowerCase() == "json") {
        result = biWeekly(balance, interestRate, terms);
      } else {
        result = biWeekly(balance, interestRate, terms);
      }
    } else {
      //returns error if inputs are invalid
      throw "Please Check your inputs and retry - invalid values.";
    }

    return result;
  } catch (e) {
    throw e;
  }
};

function formatToCurrency(amount) {
  return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

/**
 * Biweekly Amortization function:
 * Recieves a request with the loan amount('balance'), interest rate(as a decimal),
 * and term period(in years). Does the necessary calculations to produce
 * a JSON object with the amortization data for every 2 weeks.
 */

function biWeekly(balance, interestRate, terms) {
  var l = balance;
  var eff = interestRate;
  var c = interestRate / 12;
  var n = terms * 12;
  var N = terms * 26;

  let payment = (l * (c * (1 + c) ** n)) / ((1 + c) ** n - 1);
  var biWeeklyPayment = payment / 2;

  var result = {};

  result["loan_amount"] = formatToCurrency(l);
  result["interest_rate"] = eff * 100;
  result["number_of_months"] = terms * 12;
  result["monthly_payment"] = formatToCurrency(payment);
  result["biweekly_payment"] = formatToCurrency(biWeeklyPayment);
  result["total_paid"] = formatToCurrency(payment * terms);
  result["schedule"] = [];

  let interestSum = 0;

  for (let x = 1, row = {}; x < N; x++, row = {}) {
    if (l < 0) {
      break;
    }
    let interest = l * (eff / 26.0);
    interestSum += interest;

    let principalPayment = biWeeklyPayment - interest;

    l -= principalPayment;

    if (l < 0) {
      principalPayment += l;
      l = 0;

      row.count = x;
      row.principal = formatToCurrency(principalPayment);
      row.interest = formatToCurrency(interest);
      row.balance = formatToCurrency(l);
      result.schedule.push(row);
      var intAvg = interestSum / x;
      break;
    }

    row.count = x;
    row.principal = formatToCurrency(principalPayment);
    row.interest = formatToCurrency(interest);
    row.balance = formatToCurrency(l);
    result.schedule.push(row);
  }
  console.log(result);
  return result;
}

function validateInputs(value) {
  //some code here to validate inputs
  if (value == null || value == "") {
    return false;
  } else {
    return true;
  }
}
