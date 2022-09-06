import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import extraPaymentResponseData from './ExtraPaymentResponseData.js';

Chart.register(ChartDataLabels);

const ExtraPaymentChart = props => {
  const [extraPaymentGraphic, setExtraPaymentGraphic] = useState('');
  const [chartCreated, setChartCreated] = useState(false);

  useEffect(() => {
    // if (extraPaymentGraphic) {
    //   extraPaymentGraphic.destroy();
    // }
    if (!chartCreated) {
      createGraph();
    }
  }, [chartCreated]);

  var formatCurrency = amount => {
    var i = parseFloat(amount);
    if (isNaN(i)) {
      i = 0.0;
    }

    var minus = '';
    if (i < 0) {
      minus = '-';
    }

    i = Math.abs(i);
    i = parseInt((i + 0.005) * 100);
    i = i / 100;

    var s = new String(i);
    if (s.indexOf('.') < 0 && s.indexOf('0') === 0) {
      s += '.00';
    }

    if (s.indexOf('.') == s.length - 2) {
      s += '0';
    }
    s = minus + s;
    s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return '$' + s;
  };

  const createGraph = async () => {
    // If a chart already exists, destroy it
    if (extraPaymentGraphic) {
      extraPaymentGraphic.destroy();
    }

    var extraPaymentAmortization = await extraPaymentResponseData();

    // create amortization graph
    lineChart(extraPaymentAmortization);

    if (!chartCreated) {
      setChartCreated(true);
    }
  };

  function lineChart(response) {
    let term = [];
    let principalValues = [];
    let interestValues = [];
    let balanceValues = [];

    for (let i = 0; i <= response.number_of_months / 12; i++) {
      term.push(i);
    }

    let pSum = 0;
    let iSum = 0;

    for (let i = 0; i < response.schedule.length; i++) {
      pSum += parseFloat(response.schedule[i].principal.replace(/[$,]/g, ''));
      // console.log(`pSum: ${pSum}`);
      if (i % 12 == 0) {
        principalValues.push(pSum);
      }

      iSum += parseFloat(response.schedule[i].interest.replace(/[$,]/g, ''));
      // console.log(`iSum: ${iSum}`);
      if (i % 12 == 0) {
        interestValues.push(iSum);
      }

      if (i % 12 == 0) {
        balanceValues.push(
          parseFloat(response.schedule[i].balance.replace(/[$,]/g, ''))
        );
      }
    }

    balanceValues.push(
      parseFloat(
        response.schedule[response.schedule.length - 1].balance.replace(
          /[$,]/g,
          ''
        )
      )
    );

    principalValues.push(
      pSum + parseFloat(response.monthly_payment.replace(/[$,]/g, ''))
    );

    interestValues.push(iSum);

    const ctx = document.getElementById('extraPaymentLineChart');

    const lineChart = new Chart(ctx, {
      data: {
        datasets: [
          {
            type: 'line',
            label: 'Principal',
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            data: principalValues,
          },
          {
            type: 'line',
            label: 'Interest',
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            data: interestValues,
          },
          {
            type: 'line',
            label: 'Balance',
            backgroundColor: 'rgba(153, 102, 255, 0.8)',

            data: balanceValues,
          },
        ],
        labels: term,
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Extra Payment Amortization Graph',
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              color: 'grey',
              display: true,
              text: 'Years Passed',
            },
          },
          y: {
            title: {
              color: 'grey',
              display: true,
              text: 'Payment in $',
            },
          },
        },
      },
    });
    setExtraPaymentGraphic(lineChart);
    setChartCreated(true);
  }

  return (
    <div className="canvas-container">
      <div className="canvas">
        <canvas
          id="extraPaymentLineChart"
          role="chart"
          aria-label="Line Chart"
          onClick={createGraph}
        ></canvas>
      </div>
    </div>
  );
};

export default ExtraPaymentChart;
