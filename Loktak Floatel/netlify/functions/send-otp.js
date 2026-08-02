const twilio = require('twilio');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { phone, code } = JSON.parse(event.body);
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Twilio not configured' }) };
    }

    const client = twilio(accountSid, authToken);

    try {
        await client.messages.create({
            body: `Your Loktak Floatel OTP is: ${code}`,
            from: twilioPhone,
            to: phone
        });
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};