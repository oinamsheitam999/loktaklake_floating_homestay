const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { email, name } = JSON.parse(event.body);
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@yourdomain.com';

    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ message: 'SendGrid not configured' }) };
    }

    sgMail.setApiKey(apiKey);
    const verificationLink = `https://loktakfloat-homestay.netlify.app/verify?email=${encodeURIComponent(email)}`;

    const msg = {
        to: email,
        from: fromEmail,
        subject: 'Verify your Loktak Floatel account',
        html: `<h2>Hi ${name},</h2><p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">Verify Email</a>`
    };

    try {
        await sgMail.send(msg);
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};