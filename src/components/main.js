var biWeekly = require("./BiWeeklyCalc");
var extraPayment = require("./ExtraPaymentCalc");
// var plotBiWeekly = require("./PlotBiWeekly");

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

  biWeeklyData = await biWeekly(request);
  //   biWeeklyDataGraph = await plotBiWeekly(biWeeklyData);

  extraPaymentData = await extraPayment(request2);
  //   extraPaymentDataGraph = await plotExtraPayment(extraPaymentData);

  console.log(JSON.stringify(biWeeklyData));
  console.log(JSON.stringify(extraPaymentData));
};

handler(null);
