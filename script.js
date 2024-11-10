const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_j3pe3o8';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Replace with your PhonePe merchant key and endpoint URL
const MERCHANT_ID = 'YOUR_MERCHANT_ID';
const MERCHANT_KEY = 'YOUR_MERCHANT_KEY';
const BASE_URL = 'https://api.phonepe.com/apis/merchant-simulator'; // Use PhonePe's actual endpoint

app.post('/create-phonepe-payment', async (req, res) => {
    const { amount } = req.body;

    const payload = {
        merchantId: MERCHANT_ID,
        transactionId: `TXN_${Date.now()}`,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        redirectUrl: 'https://your-website.com/payment-success',
        callbackUrl: 'https://your-server.com/phonepe-callback'
    };

    // Generate signature and hash here (use HMAC with your MERCHANT_KEY)

    try {
        const response = await axios.post(`${BASE_URL}/v3/initiatePayment`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': 'GENERATED_HASH', // Implement hash generation as per PhonePe API
                'X-MERCHANT-ID': MERCHANT_ID
            }
        });

        res.json({
            success: true,
            paymentUrl: response.data.data.instrumentResponse.redirectUrl // Example response field
        });
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ success: false, message: 'Payment initiation failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
