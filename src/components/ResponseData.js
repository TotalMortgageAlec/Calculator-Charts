var biWeekly = require("./BiWeeklyCalc");
var extraPayment = require("./ExtraPaymentCalc");

var handler = async (event) => {
  var request = {};
  var request2 = {};

  request["responseType"] = "json";
  request["loan_amount"] = 800000;
  request["interest"] = 5.3;
  request["terms"] = 15;

  request2["responseType"] = "json";
  request2["loan_amount"] = 800000;
  request2["interest"] = 5.3;
  request2["terms"] = 15; // in years
  request2["extra"] = 100;
  request2["extra_term"] = 60; // in payment periods --- range: (1 - (terms * 12))

  var biWeeklyData = await biWeekly(request);
  //   var biWeeklyDataGraph = await plotBiWeekly(biWeeklyData);

  // var extraPaymentData = await extraPayment(request2);
  //   var extraPaymentDataGraph = await plotExtraPayment(extraPaymentData);

  console.log(JSON.stringify(biWeeklyData));
  // console.log(JSON.stringify(extraPaymentData));
};

handler(null);
