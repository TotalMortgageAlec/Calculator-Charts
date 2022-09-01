module.exports = async (request) => {
  try {
    //button click gets values from inputs
    var balance = parseFloat(request.loan_amount);
    var interestRate = parseFloat(request.interest / 100.0);
    var terms = parseFloat(request.terms);
    var extra = parseFloat(request.extra);
    var extraTerm = parseFloat(request.extra_term);

    var result = "";
    var balVal = validateInputs(balance);
    var intrVal = validateInputs(interestRate);

    console.log(request);

    if (balVal && intrVal) {
      if (request.responseType.toLowerCase() == "json") {
        result = extraPayment(balance, interestRate, terms, extra, extraTerm);
      } else {
        result = extraPayment(balance, interestRate, terms, extra, extraTerm);
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
 * Additional Payment Amortization function:
 * Recieves a request with the loan amount('balance'), interest rate(as a decimal),
 * term period(in years), extra payment, and extra term (the term to start adding extra payments)
 */

function extraPayment(balance, interestRate, terms, extra, extraTerm) {
  var l = balance;
  var eff = interestRate;
  var c = eff / 12;
  var n = terms * 12;
  var N = terms * 26;
  var extraPayment = extra;
  var chosenTerm = extraTerm;

  let payment = (l * (c * (1 + c) ** n)) / ((1 + c) ** n - 1);

  var result = {};

  result["loan_amount"] = formatToCurrency(l);
  result["interest_rate"] = eff * 100;
  result["number_of_months"] = terms * 12;
  result["monthly_payment"] = formatToCurrency(payment);
  result["extra_payment"] = formatToCurrency(extraPayment);
  result["extra_term"] = chosenTerm;
  result["total_paid"] = formatToCurrency(payment * terms);
  console.log(result);
  result["schedule"] = [];

  console.log("Monthly payment: " + payment);
  console.log("---------------------------------");

  let interestSum = 0;

  for (let x = 1, row = {}; x < n; x++, row = {}) {
    if (l < 0) {
      break;
    }

    let interest = l * (eff / 12.0);
    let principalPayment = payment - interest;

    interestSum += interest;

    if (x >= chosenTerm) {
      principalPayment += extraPayment;
    }

    l -= principalPayment;

    if (l < 0) {
      principalPayment += l;
      l = 0;
      row.count = x;
      row.principal = formatToCurrency(principalPayment);
      if (x >= chosenTerm) {
        row.extra = formatToCurrency(extraPayment);
      } else {
        row.extra = formatToCurrency(0);
      }
      row.interest = formatToCurrency(interest);
      row.balance = formatToCurrency(l);
      result.schedule.push(row);
      break;
    }

    row.count = x;
    row.principal = formatToCurrency(principalPayment);
    if (x >= chosenTerm) {
      row.extra = formatToCurrency(extraPayment);
    } else {
      row.extra = formatToCurrency(0);
    }
    row.interest = formatToCurrency(interest);
    row.balance = formatToCurrency(l);
    result.schedule.push(row);
  }
  console.log(interestSum);
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
