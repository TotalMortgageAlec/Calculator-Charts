var extraPaymentCalc = require("./ExtraPaymentCalc");

var extraPaymentResponseData = async () => {
  var request = {};

  request["responseType"] = "json";
  request["loan_amount"] = 150000;
  request["interest"] = 3.25;
  request["terms"] = 30; // in years
  request["extra"] = 56.14;
  request["extra_term"] = 1; // in payment periods --- range: (1 - (terms * 12))

  var extraPaymentData = await extraPaymentCalc(request);
  return extraPaymentData;
};

export default extraPaymentResponseData;
