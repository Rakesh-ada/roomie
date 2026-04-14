const nodemailer = require("nodemailer")

const smtpHost = process.env.SMTP_HOST
const smtpPort = Number(process.env.SMTP_PORT || 587)
const smtpSecure = process.env.SMTP_SECURE === "true"
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const fromEmail = process.env.SMTP_FROM || smtpUser

let transporter = null

function getTransporter() {
    if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
        throw new Error("SMTP configuration is missing")
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        })
    }

    return transporter
}

async function sendOtpEmail(toEmail, otp) {
    const transport = getTransporter()

    await transport.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: "Your Roomie OTP Code",
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your OTP is <b>${otp}</b>.</p><p>It is valid for 10 minutes.</p>`
    })
}

module.exports = {
    sendOtpEmail
}