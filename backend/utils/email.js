const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// TripTidy brand colors and style
const BRAND_COLOR = "#5AB1F5";
const BRAND_NAME = "TripTidy";
const SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL || "noreply@triptidy.com";

exports.sendPasswordResetEmail = async (email, name, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: `Reset your password - ${BRAND_NAME}`,
    text: `Hello ${name},\n\nYou requested to reset your password for ${BRAND_NAME}.\nReset link: ${resetLink}\n\nThis link expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">Hello ${name},</h2>
        <p>You requested to reset your password for <strong>${BRAND_NAME}</strong>.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="margin: 24px 0;">
          <a href="${resetLink}" 
             style="background-color: ${BRAND_COLOR}; color: white; padding: 12px 28px; 
                    text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="margin-top: 32px; color: #718096; font-size: 13px;">
          This link will expire in 5 minutes for your security.<br>
          &copy; ${new Date().getFullYear()} TripTidy
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Password reset email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};

exports.sendVerificationEmail = async (email, name, code) => {
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: `Verify your email - ${BRAND_NAME}`,
    text: `Hello ${name},\n\nThank you for registering with ${BRAND_NAME}.\nYour verification code is: ${code}\n\nThis code expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">Hello ${name},</h2>
        <p>Thank you for registering with <strong>${BRAND_NAME}</strong>.</p>
        <p>Your verification code is:</p>
        <div style="margin: 24px 0; text-align: center;">
          <span style="background-color: #f3f4f6; padding: 14px 32px; font-size: 28px; font-family: monospace; letter-spacing: 4px; border-radius: 6px; color: ${BRAND_COLOR}; border: 1px solid ${BRAND_COLOR}; display: inline-block;">
            <strong>${code}</strong>
          </span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="margin-top: 32px; color: #718096; font-size: 13px;">
          If you didn't request this code, please ignore this email.<br>
          &copy; ${new Date().getFullYear()} TripTidy
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Verification email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};