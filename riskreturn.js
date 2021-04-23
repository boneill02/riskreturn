/*!
 * @author Ben O'Neill <ben@benoneill.xyz>
 * @license
 * Copyright (c) 2021 Ben O'Neill <ben@benoneill.xyz>
 * Licensed under the GNU AGPL v3.
 */

var user_begin = 0;
var user_end = 0;
var user_return = 0;

var nasdaq_begin = 0;
var nasdaq_end = 0;
var nasdaq_return = 0;

function riskreturncalc() {
	/* find date indexes */
	var start_date_index;
	var end_date_index;
	for (var i = 0; i < monthly_data.length; i++) {
		if (document.getElementById('sdate').value === monthly_data[i][0]) {
			start_date_index = i;
		}
		if (document.getElementById('edate').value === monthly_data[i][0]) {
			end_date_index = i;
		}
	}

	if (start_date_index == undefined || end_date_index == undefined) {
		alert("Form must be fully completed");
		return;
	}
	if (start_date_index >= end_date_index) {
		alert("End date must be after start date");
		return;
	}

	user_begin = Number(document.getElementById('ubegin').value);

	var monthly_in = user_begin;

	var months = end_date_index - start_date_index;

	var start_data = monthly_data[start_date_index];
	var end_data = monthly_data[start_date_index];
	var total_invested = monthly_in * months;

	/* calculate cumulative shares */
	var shares_purchased = 0;
	var cumulative_shares = 0;
	for (var i = start_date_index; i <= end_date_index; i++) {
		shares_purchased = (monthly_in / (monthly_data[i][1]));
		cumulative_shares += shares_purchased;
	}

	user_end = cumulative_shares * monthly_data[end_date_index][1];
	user_return = RATE(months, (monthly_in * -1), 0, user_end) * 12;

	nasdaq_begin = monthly_data[start_date_index][2];
	nasdaq_end = monthly_data[end_date_index][2];
	nasdaq_return = RATE(months, 0, (nasdaq_begin * -1), nasdaq_end) * 12;

	document.getElementById("user_end").innerHTML = "Ending Value: $" + user_end;
	document.getElementById("user_return").innerHTML = "Average Annual Return: " + (user_return * 100) + "%";
	document.getElementById("nasdaq_end").innerHTML = "Ending Value: $" + nasdaq_end;
	document.getElementById("nasdaq_return").innerHTML = "Average Annual Return: " + (nasdaq_return * 100) + "%";
}
