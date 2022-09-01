var biWeeklyCalc = require("./BiWeeklyCalc");
var extraPayment = require("./ExtraPaymentCalc");

var biWeeklyResponseData = async () => {
  var request = {};
  // var request2 = {};

  request["responseType"] = "json";
  request["loan_amount"] = 480000;
  request["interest"] = 5.27;
  request["terms"] = 30;

  // request2["responseType"] = "json";
  // request2["loan_amount"] = 480000;
  // request2["interest"] = 5.27;
  // request2["terms"] = 30; // in years
  // request2["extra"] = 100;
  // request2["extra_term"] = 60; // in payment periods --- range: (1 - (terms * 12))

  var biWeeklyData = await biWeeklyCalc(request);
  //   var biWeeklyDataGraph = await plotBiWeekly(biWeeklyData);

  // var extraPaymentData = await extraPayment(request2);
  //   var extraPaymentDataGraph = await plotExtraPayment(extraPaymentData);

  // console.log(JSON.stringify(biWeeklyData));
  // console.log(JSON.stringify(extraPaymentData));
  return biWeeklyData;
};

export default biWeeklyResponseData;
