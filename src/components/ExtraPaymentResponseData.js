var extraPaymentCalc = require("./ExtraPaymentCalc");

var extraPaymentResponseData = async () => {
  var request = {};

  request["responseType"] = "json";
  request["loan_amount"] = 480000;
  request["interest"] = 5.27;
  request["terms"] = 30; // in years
  request["extra"] = 100;
  request["extra_term"] = 60; // in payment periods --- range: (1 - (terms * 12))

  var extraPaymentData = await extraPaymentCalc(request);
  return extraPaymentData;
};

export default extraPaymentResponseData;
