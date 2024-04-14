/*!
 * @author Ben O'Neill <ben@oneill.sh>
 * @license GNU AGPL v3
 * Copyright (c) 2021 Ben O'Neill <ben@oneill.sh>
 * Licensed under the GNU AGPL v3.
 */

var user_begin = 0;
var user_end = 0;
var user_return = 0;
var nasdaq_begin = 0;
var nasdaq_end = 0;
var nasdaq_return = 0;

var form = document.getElementById('inform');
var result = document.getElementById('result');
var canvas = document.getElementById('myChart');

var result_less = 'Your return is less than the index. Lengthen your investment time period to see if you can overcome the low/negative returns.';
var result_more = 'Nice! You beat the Nasdaq!';
var result_negative = 'Your return is negative! This is the downside of risk. Change your dates or lengthen your investment period to see what happens.';

/**
	Round to nearest hundredth
*/
function numfmt(num) {
	return Intl.NumberFormat().format(parseFloat(num).toFixed(2));
}

/*
	Get the number of months in a given MM/YYYY date since year 0
*/
function getMonthNumber(s) {
	var vals = s.split('/');
	return (parseInt(vals[1]) * 12) + parseInt(vals[0]);
}

/**
	Convert date from YYYY-MM to MM/YYYY
*/
function convertDate(s) {
	var vals = s.split('-');
	return vals[1] + '/' + vals[0];
}

/**
	Get month in MM/YYYY n months after s
*/
function dateOffset(s, n) {
	var vals = s.split('/');
	var month = parseInt(vals[0]) + Math.floor(n % 12);
	var year = parseInt(vals[1]) + Math.floor(n / 12);
	
	if (month < 10)
		return '0' + month + '/' + year;

	return month + '/' + year;
}

function riskReturn() {
	var data = JSON.parse(ndata);
	var sdate = convertDate(document.getElementById('sdate').value);
	var edate = convertDate(document.getElementById('edate').value);
	var monthly_in = Number(document.getElementById('ubegin').value);
	var months = getMonthNumber(edate) - getMonthNumber(sdate);

	if (sdate == null || edate == null || monthly_in == null) {
		alert("Form must be fully completed");
		return;
	}
	if (months <= 0) {
		alert("End date must be after start date");
		return;
	}

	var start_data = data[sdate];
	var end_data = data[edate];
	var total_invested = monthly_in * months;
	var value_by_month = [];
	var nasdaq_value_by_month = [];
	var labels = [];

	/* calculate cumulative shares */
	var shares_purchased = 0;
	var cumulative_shares = 0;
	for (var i = 0; i <= months; i++) {
		var idx = dateOffset(sdate, i);
		console.log(idx);
		shares_purchased = (monthly_in / (data[idx][0]));
		cumulative_shares += shares_purchased;
		value_by_month.push(cumulative_shares * data[idx][0]);
		nasdaq_value_by_month.push(data[idx][1]);

		/* for chart */
		labels.push(idx);
	}

	user_end = cumulative_shares * end_data[0];
	user_return = RATE(months, (monthly_in * -1), 0, edate) * 12;
	nasdaq_begin = start_data[1];
	nasdaq_end = end_data[1];
	nasdaq_return = RATE(months, 0, (nasdaq_begin * -1), nasdaq_end) * 12;

	/* display results */
	document.getElementById("user_invested").innerHTML = "$" + numfmt(monthly_in * months);
	document.getElementById("user_end").innerHTML = "$" + numfmt(user_end, 2);
	document.getElementById("user_return").innerHTML = numfmt(user_return * 100, 2) + "%";
	document.getElementById("nasdaq_begin").innerHTML = "$" + numfmt(nasdaq_begin, 2);
	document.getElementById("nasdaq_end").innerHTML = "$" + numfmt(nasdaq_end, 2);
	document.getElementById("nasdaq_return").innerHTML = numfmt(nasdaq_return * 100, 2) + "%";

	if (user_return > nasdaq_return && user_return > 0) {
		document.getElementById("message").innerHTML = result_more;
	} else if (user_return < nasdaq_return && user_return > 0) {
		document.getElementById("message").innerHTML = result_less;
	} else {
		document.getElementById("message").innerHTML = result_negative;
	}

	var ctx = canvas.getContext("2d");
	const chartData = {
		labels: labels,
		datasets: [{
			axis: 'y',
			label: 'User Value',
			data: value_by_month,
			fill: false,
			backgroundColor: [
				'rgba(255, 255, 132, 0.2)',
			],
			borderColor: [
				'rgb(200, 0, 200)',
			],
			borderWidth: 2,
			yAxisID: 'user_value'
		}, {
			axis: 'y',
			label: 'NASDAQ Value',
			data: nasdaq_value_by_month,
			fill: false,
			backgroundColor: [
				'rgba(75, 192, 192, 0.2)',
			],
			borderColor: [
				'rgb(200, 0, 10)',
			],
			borderWidth: 2,
			yAxisID: 'nasdaq_value'
		}
		]};

	var graph = new Chart(ctx, {
		type: 'line',
		data: chartData,
		options: {
			scales: {
				'user_value': {
					type: 'linear',
					position: 'left'
				},
				'nasdaq_value': {
					type: 'linear',
					position: 'right'
				}
			}
		}
	});
}
