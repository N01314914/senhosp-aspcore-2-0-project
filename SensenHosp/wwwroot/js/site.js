﻿// Write your JavaScript code.

window.onload = function () {

    if (document.getElementById('donation_form')) {
        var donation_form = document.getElementById('donation_form');
        var donations_success = document.getElementById('donation_success');
        var donor_name_span = document.getElementById('donorName');

        let donationAmount = 10;
        const amountInput = document.getElementById('donationAmount');
        amountInput.onblur = function () {
            donationAmount = Number(amountInput.value == 0 ? 10 : amountInput.value);
            console.log(donationAmount);
        }
        paypal.Buttons({
            createOrder: function () {
                return fetch('/Donations/CreateOrder', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        OrderAmount: donationAmount
                    })
                }).then(function (res) {
                    return res.json();
                    }).then(function (data) {
                        console.log(data.headers[7]);
                        return(data.headers[7].value[0]);
                });
            },
            onApprove: function (data) {
                console.log(data);
                return fetch('/Donations/CaptureOrder', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        OrderId: data.orderID
                    })
                }).then(function (res) {
                    return res.json();
                    }).then(function (details) {
                        var donorName = details.headers[7].value[0];
                        donor_name_span.innerHTML = donorName;
                        donation_form.classList.toggle('hidden');
                        donations_success.classList.toggle('hidden');
                        document.getElementById('page_title').innerHTML = "Thank You!";
                });
            }
        }).render('#paypal-button-container');
    }

}