//! Guri24 RMS Production Email Templates
//! Unified modern visual design across all 7 transactional email templates:
//! - Circular brand logo badge (#0284c7 with futuristic house logo)
//! - Centered greeting and headline
//! - Primary card featuring laptop illustration ("NEW EMAIL!" from apps/web/public/image.png)
//! - Structured details, key figures, and high-contrast CTA buttons
//! - Secondary card: "Get the Guri24 RMS app!" with App Store & Google Play badges
//! - Footer with circular social icons (Facebook, Twitter/X, LinkedIn), guri24 logo, and copyright

pub const GURI24_LOGO_BASE64: &str = include_str!("guri24_logo_email.base64");
pub const NEW_EMAIL_ILLUSTRATION_BASE64: &str = include_str!("new_email_illustration.base64");

/// Helper to render the shared mobile app card and footer
const EMAIL_APP_CARD_AND_FOOTER_HTML: &str = r###"
    <!-- Card 2: Get the App -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px 20px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <h2 style="font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0;">
          Get the Guri24 RMS app!
        </h2>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0 0 16px 0;">
          Get the most of Guri24 RMS by installing the mobile app.<br>
          You can log in by using your existing email address and password.
        </p>

        <!-- App Store & Google Play Badges -->
        <table role="presentation" cellpadding="0" cellspacing="6" style="margin: 0 auto;">
          <tr>
            <!-- Apple App Store Badge -->
            <td align="center">
              <a href="https://guri24rms.co.ke" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 6px 14px; text-align: left;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 8px;">
                      <svg width="18" height="22" viewBox="0 0 170 170" fill="#ffffff " style="display: block;">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.19-9.57-11.02-20.4-14.5-32.48-3.48-12.08-5.22-23.48-5.22-34.19 0-14.78 3.7-27.18 11.1-37.19 7.4-10.01 16.92-15.11 28.56-15.31 4.58 0 9.87 1.25 15.87 3.75 6 2.5 10.15 3.8 12.45 3.91 1.74 0 5.86-1.36 12.35-4.08 6.49-2.72 11.75-3.97 15.78-3.75 12.08.76 21.73 5.43 28.95 14.01-10.66 6.42-15.88 15.44-15.66 27.08.22 9.13 3.69 16.85 10.42 23.16 6.74 6.31 14.78 9.89 24.13 10.76-2.07 6.41-4.78 13.04-8.15 19.89zM119.22 31.86c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.63-10.54 19.24-12.07.22 1.3.33 2.61.33 3.91 0 7.39-2.72 14.46-8.16 21.2-5.44 6.74-11.85 10.54-19.24 11.41-.33-1.08-.33-2.28-.33-3.58z"/>
                      </svg>
                    </td>
                    <td style="vertical-align: middle;">
                      <div style="font-size: 8px; text-transform: uppercase; color: #d1d5db; line-height: 1;">Available on the</div>
                      <div style="font-size: 13px; font-weight: 700; color: #ffffff; line-height: 1.2;">App Store</div>
                    </td>
                  </tr>
                </table>
              </a>
            </td>

            <!-- Google Play Badge -->
            <td align="center">
              <a href="https://guri24rms.co.ke" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 6px 14px; text-align: left;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 8px;">
                      <svg width="18" height="20" viewBox="0 0 24 24" fill="none" style="display: block;">
                        <path d="M3.6 2.3C3.2 2.7 3 3.3 3 4.1v15.8c0 .8.2 1.4.6 1.8l.1.1 9.1-9.1v-.2L3.6 2.3z" fill="#00D2FF "/>
                        <path d="M15.8 15.6l-3-3v-.2l3-3 .1.1 3.5 2c1 .6 1 1.5 0 2.1l-3.6 2z" fill="#FFCE00 "/>
                        <path d="M12.8 12.5L3.6 21.7c.4.4 1.1.5 1.9 0l10.4-6.1-3.1-3.1z" fill="#00E676 "/>
                        <path d="M12.8 11.5l3.1-3.1-10.4-6c-.8-.5-1.5-.3-1.9.1l9.2 9z" fill="#FF3A44 "/>
                      </svg>
                    </td>
                    <td style="vertical-align: middle;">
                      <div style="font-size: 8px; text-transform: uppercase; color: #d1d5db; line-height: 1;">GET IT ON</div>
                      <div style="font-size: 13px; font-weight: 700; color: #ffffff; line-height: 1.2;">Google Play</div>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Spacer -->
    <tr><td height="20" style="height: 20px;"></td></tr>

    <!-- Footer: Social Icons, Brand & Copyright -->
    <tr>
      <td align="center" style="text-align: center;">
        <table role="presentation" cellpadding="0" cellspacing="8" style="margin: 0 auto 14px auto;">
          <tr>
            <td>
              <a href="https://facebook.com" target="_blank" style="display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: #0284c7; color: #ffffff; text-align: center; line-height: 30px; text-decoration: none; font-weight: 700; font-size: 13px;">
                f
              </a>
            </td>
            <td>
              <a href="https://twitter.com" target="_blank" style="display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: #38bdf8; color: #ffffff; text-align: center; line-height: 30px; text-decoration: none; font-weight: 700; font-size: 13px;">
                &#120143;
              </a>
            </td>
            <td>
              <a href="https://linkedin.com" target="_blank" style="display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: #0284c7; color: #ffffff; text-align: center; line-height: 30px; text-decoration: none; font-weight: 700; font-size: 12px;">
                in
              </a>
            </td>
          </tr>
        </table>

        <div style="font-size: 18px; font-weight: 800; color: #0284c7; letter-spacing: -0.02em; margin-bottom: 6px;">
          guri24
        </div>

        <p style="font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0; max-width: 360px;">
          Copyright &copy; 2026, Guri24 Rental Management Ltd.<br>
          A better company begins with a personalised property management experience.
        </p>
      </td>
    </tr>
"###;

/// Renders a responsive, modern HTML email for OTP verification
pub fn render_otp_email_template(recipient: &str, code: &str) -> String {
    let clean_recipient = recipient.trim();
    let name_part = clean_recipient.split('@').next().unwrap_or("User");

    format!(
        r###"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guri24 RMS Verification Code</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto;">
    <!-- Circular Logo Badge -->
    <tr>
      <td align="center" style="padding-bottom: 18px;">
        <div style="width: 56px; height: 56px; background-color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
          <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="width: 32px; height: 32px; object-fit: contain; display: block; margin: 12px auto 0 auto;" />
        </div>
      </td>
    </tr>

    <!-- Headline -->
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 400; color: #1e293b; margin: 0; line-height: 1.35;">
          Hi <strong style="font-weight: 700;">{name_part}</strong>,<br>
          here is your <strong style="font-weight: 700;">Guri24 RMS</strong> verification code!
        </h1>
      </td>
    </tr>

    <!-- Card 1: Main Content -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px 24px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 16px;">
          <img src="data:image/png;base64,{illustration}" alt="New Email Notification" style="width: 130px; height: 130px; max-width: 100%; object-fit: contain; display: inline-block;" />
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 18px 0;">
          Welcome to Guri24 RMS. To authenticate your session and protect your portfolio data, enter the one-time verification code below:
        </p>

        <div style="background-color: #fff7ed; border: 1.5px dashed #ea580c; border-radius: 10px; padding: 18px; text-align: center; margin: 18px 0;">
          <div style="font-size: 11px; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
            One-Time Access Code
          </div>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #ea580c; font-family: monospace; margin: 6px 0;">
            {code}
          </div>
          <div style="font-size: 12px; color: #9a3412;">
            Valid for <strong>10 minutes</strong> &bull; Do not share with anyone
          </div>
        </div>

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
          If you did not request this verification code, please ignore this email.
        </p>
      </td>
    </tr>

    <!-- Spacer -->
    <tr><td height="16" style="height: 16px;"></td></tr>

    {app_card_and_footer}
  </table>
</body>
</html>"###,
        logo = GURI24_LOGO_BASE64,
        illustration = NEW_EMAIL_ILLUSTRATION_BASE64,
        name_part = name_part,
        code = code.trim(),
        app_card_and_footer = EMAIL_APP_CARD_AND_FOOTER_HTML,
    )
}

/// Renders a responsive, modern HTML email for operational notifications
pub fn render_notification_email_template(
    recipient: &str,
    title: &str,
    body: &str,
    action_label: Option<&str>,
    action_url: Option<&str>,
) -> String {
    let clean_recipient = recipient.trim();
    let name_part = clean_recipient.split('@').next().unwrap_or("Member");
    let button_label = action_label.unwrap_or("Open Guri24 Portal");
    let button_url = action_url.unwrap_or("https://guri24rms.co.ke");

    format!(
        r###"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto;">
    <!-- Circular Logo Badge -->
    <tr>
      <td align="center" style="padding-bottom: 18px;">
        <div style="width: 56px; height: 56px; background-color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
          <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="width: 32px; height: 32px; object-fit: contain; display: block; margin: 12px auto 0 auto;" />
        </div>
      </td>
    </tr>

    <!-- Headline -->
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 400; color: #1e293b; margin: 0; line-height: 1.35;">
          Hi <strong style="font-weight: 700;">{name_part}</strong>,<br>
          {title}
        </h1>
      </td>
    </tr>

    <!-- Card 1: Main Content -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px 24px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 16px;">
          <img src="data:image/png;base64,{illustration}" alt="New Email Notification" style="width: 130px; height: 130px; max-width: 100%; object-fit: contain; display: inline-block;" />
        </div>

        <div style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px 0; text-align: left;">
          {body}
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #0284c7;">
              <a href="{button_url}" target="_blank" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                {button_label}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Spacer -->
    <tr><td height="16" style="height: 16px;"></td></tr>

    {app_card_and_footer}
  </table>
</body>
</html>"###,
        logo = GURI24_LOGO_BASE64,
        illustration = NEW_EMAIL_ILLUSTRATION_BASE64,
        name_part = name_part,
        title = title,
        body = body,
        button_url = button_url,
        button_label = button_label,
        app_card_and_footer = EMAIL_APP_CARD_AND_FOOTER_HTML,
    )
}

/// Renders a verified M-Pesa payment receipt notification
pub fn render_payment_receipt_template(
    _recipient: &str,
    tenant_name: &str,
    amount_kes: &str,
    receipt_number: &str,
    mpesa_receipt: &str,
    property_unit: &str,
    payment_date: &str,
) -> String {
    format!(
        r###"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt — {receipt_number}</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto;">
    <!-- Circular Logo Badge -->
    <tr>
      <td align="center" style="padding-bottom: 18px;">
        <div style="width: 56px; height: 56px; background-color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
          <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="width: 32px; height: 32px; object-fit: contain; display: block; margin: 12px auto 0 auto;" />
        </div>
      </td>
    </tr>

    <!-- Headline -->
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 400; color: #1e293b; margin: 0; line-height: 1.35;">
          Hi <strong style="font-weight: 700;">{tenant_name}</strong>,<br>
          your rent payment has been received & verified!
        </h1>
      </td>
    </tr>

    <!-- Card 1: Main Content -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px 24px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 16px;">
          <img src="data:image/png;base64,{illustration}" alt="New Email Notification" style="width: 130px; height: 130px; max-width: 100%; object-fit: contain; display: inline-block;" />
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px 0;">
          We have verified your M-Pesa payment for <strong>{property_unit}</strong>. Funds have been credited to your active rental ledger via FIFO allocation.
        </p>

        <!-- Receipt Box -->
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; margin: 18px 0; text-align: left;">
          <table role="presentation" width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px;">
            <tr>
              <td style="color: #64748b;">Amount Received:</td>
              <td align="right" style="font-size: 18px; font-weight: 800; color: #16a34a;">KES {amount_kes}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Receipt Number:</td>
              <td align="right" style="font-weight: 700; color: #0f172a;">{receipt_number}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">M-Pesa Reference:</td>
              <td align="right" style="font-weight: 700; color: #0f172a;">{mpesa_receipt}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Unit Reference:</td>
              <td align="right" style="font-weight: 600; color: #0f172a;">{property_unit}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Payment Date:</td>
              <td align="right" style="color: #475569;">{payment_date}</td>
            </tr>
          </table>
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #0284c7;">
              <a href="https://guri24rms.co.ke" target="_blank" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                View Statement in Portal
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Spacer -->
    <tr><td height="16" style="height: 16px;"></td></tr>

    {app_card_and_footer}
  </table>
</body>
</html>"###,
        logo = GURI24_LOGO_BASE64,
        illustration = NEW_EMAIL_ILLUSTRATION_BASE64,
        tenant_name = tenant_name,
        amount_kes = amount_kes,
        receipt_number = receipt_number,
        mpesa_receipt = mpesa_receipt,
        property_unit = property_unit,
        payment_date = payment_date,
        app_card_and_footer = EMAIL_APP_CARD_AND_FOOTER_HTML,
    )
}

/// Renders a rent invoice issued notification
pub fn render_invoice_issued_template(
    _recipient: &str,
    tenant_name: &str,
    invoice_number: &str,
    billing_period: &str,
    amount_kes: &str,
    due_date: &str,
    property_unit: &str,
) -> String {
    format!(
        r###"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Issued — {invoice_number}</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto;">
    <!-- Circular Logo Badge -->
    <tr>
      <td align="center" style="padding-bottom: 18px;">
        <div style="width: 56px; height: 56px; background-color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
          <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="width: 32px; height: 32px; object-fit: contain; display: block; margin: 12px auto 0 auto;" />
        </div>
      </td>
    </tr>

    <!-- Headline -->
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 400; color: #1e293b; margin: 0; line-height: 1.35;">
          Hi <strong style="font-weight: 700;">{tenant_name}</strong>,<br>
          your rental invoice for <strong style="font-weight: 700;">{property_unit}</strong> has been generated!
        </h1>
      </td>
    </tr>

    <!-- Card 1: Main Content -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px 24px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 16px;">
          <img src="data:image/png;base64,{illustration}" alt="New Email Notification" style="width: 130px; height: 130px; max-width: 100%; object-fit: contain; display: inline-block;" />
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px 0;">
          Your monthly rental invoice is ready. Please settle the amount before the due date to avoid automated late penalties.
        </p>

        <!-- Invoice Breakdown Box -->
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 18px; margin: 18px 0; text-align: left;">
          <table role="presentation" width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px;">
            <tr>
              <td style="color: #64748b;">Invoice Reference:</td>
              <td align="right" style="font-weight: 700; color: #0f172a;">{invoice_number}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Billing Period:</td>
              <td align="right" style="font-weight: 600; color: #0f172a;">{billing_period}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Amount Payable:</td>
              <td align="right" style="font-size: 18px; font-weight: 800; color: #1d4ed8;">KES {amount_kes}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Due Date:</td>
              <td align="right" style="font-weight: 600; color: #dc2626;">{due_date}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Unit Reference:</td>
              <td align="right" style="font-weight: 600; color: #0f172a;">{property_unit}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Paybill / Till:</td>
              <td align="right" style="font-weight: 700; color: #0f172a;">Paybill 174379</td>
            </tr>
          </table>
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #0284c7;">
              <a href="https://guri24rms.co.ke" target="_blank" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                Settle via M-Pesa STK Push
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Spacer -->
    <tr><td height="16" style="height: 16px;"></td></tr>

    {app_card_and_footer}
  </table>
</body>
</html>"###,
        logo = GURI24_LOGO_BASE64,
        illustration = NEW_EMAIL_ILLUSTRATION_BASE64,
        tenant_name = tenant_name,
        invoice_number = invoice_number,
        billing_period = billing_period,
        amount_kes = amount_kes,
        due_date = due_date,
        property_unit = property_unit,
        app_card_and_footer = EMAIL_APP_CARD_AND_FOOTER_HTML,
    )
}

/// Renders a security deposit acknowledgment notification
pub fn render_deposit_received_template(
    _recipient: &str,
    tenant_name: &str,
    amount_kes: &str,
    lease_reference: &str,
    property_unit: &str,
) -> String {
    format!(
        r###"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Deposit Acknowledgment</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto;">
    <!-- Circular Logo Badge -->
    <tr>
      <td align="center" style="padding-bottom: 18px;">
        <div style="width: 56px; height: 56px; background-color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
          <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="width: 32px; height: 32px; object-fit: contain; display: block; margin: 12px auto 0 auto;" />
        </div>
      </td>
    </tr>

    <!-- Headline -->
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 400; color: #1e293b; margin: 0; line-height: 1.35;">
          Hi <strong style="font-weight: 700;">{tenant_name}</strong>,<br>
          your security deposit has been secured in trust!
        </h1>
      </td>
    </tr>

    <!-- Card 1: Main Content -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px 24px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 16px;">
          <img src="data:image/png;base64,{illustration}" alt="New Email Notification" style="width: 130px; height: 130px; max-width: 100%; object-fit: contain; display: inline-block;" />
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px 0;">
          This confirms receipt of your move-in security deposit for <strong>{property_unit}</strong>. Under Guri24 RMS financial rules, this deposit is strictly segregated under Liability Account 2100.
        </p>

        <!-- Deposit Details Box -->
        <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 18px; margin: 18px 0; text-align: left;">
          <table role="presentation" width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px;">
            <tr>
              <td style="color: #64748b;">Deposit Amount:</td>
              <td align="right" style="font-size: 18px; font-weight: 800; color: #0d9488;">KES {amount_kes}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Lease Reference:</td>
              <td align="right" style="font-weight: 700; color: #0f172a;">{lease_reference}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Ledger Account:</td>
              <td align="right" style="font-weight: 700; color: #0d9488;">Account 2100 (Held in Trust)</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Status:</td>
              <td align="right" style="color: #16a34a; font-weight: 600;">Refundable upon Move-Out</td>
            </tr>
          </table>
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #0284c7;">
              <a href="https://guri24rms.co.ke" target="_blank" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                Download Deposit Certificate
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Spacer -->
    <tr><td height="16" style="height: 16px;"></td></tr>

    {app_card_and_footer}
  </table>
</body>
</html>"###,
        logo = GURI24_LOGO_BASE64,
        illustration = NEW_EMAIL_ILLUSTRATION_BASE64,
        tenant_name = tenant_name,
        amount_kes = amount_kes,
        lease_reference = lease_reference,
        property_unit = property_unit,
        app_card_and_footer = EMAIL_APP_CARD_AND_FOOTER_HTML,
    )
}

/// Renders a move-out deposit refund disbursement notification
pub fn render_refund_verified_template(
    _recipient: &str,
    tenant_name: &str,
    amount_kes: &str,
    payout_channel: &str,
    payout_ref: &str,
    property_unit: &str,
) -> String {
    format!(
        r###"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deposit Refund Disbursed</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto;">
    <!-- Circular Logo Badge -->
    <tr>
      <td align="center" style="padding-bottom: 18px;">
        <div style="width: 56px; height: 56px; background-color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
          <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="width: 32px; height: 32px; object-fit: contain; display: block; margin: 12px auto 0 auto;" />
        </div>
      </td>
    </tr>

    <!-- Headline -->
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 400; color: #1e293b; margin: 0; line-height: 1.35;">
          Hi <strong style="font-weight: 700;">{tenant_name}</strong>,<br>
          your deposit refund for <strong style="font-weight: 700;">{property_unit}</strong> has been disbursed!
        </h1>
      </td>
    </tr>

    <!-- Card 1: Main Content -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px 24px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 16px;">
          <img src="data:image/png;base64,{illustration}" alt="New Email Notification" style="width: 130px; height: 130px; max-width: 100%; object-fit: contain; display: inline-block;" />
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px 0;">
          Your move-out deposit reconciliation has been finalized. Funds have been electronically disbursed to your mobile line:
        </p>

        <!-- Refund Box -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 18px 0; text-align: left;">
          <table role="presentation" width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px;">
            <tr>
              <td style="color: #64748b;">Disbursed Amount:</td>
              <td align="right" style="font-size: 18px; font-weight: 800; color: #16a34a;">KES {amount_kes}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Payout Channel:</td>
              <td align="right" style="font-weight: 600; color: #0f172a;">{payout_channel}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Payout Reference:</td>
              <td align="right" style="font-weight: 700; color: #0f172a;">{payout_ref}</td>
            </tr>
            <tr>
              <td style="color: #64748b;">Subledger Liability:</td>
              <td align="right" style="color: #16a34a; font-weight: 700;">CLOSED &amp; BALANCED</td>
            </tr>
          </table>
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #0284c7;">
              <a href="https://guri24rms.co.ke" target="_blank" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                View Reconciliation Statement
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Spacer -->
    <tr><td height="16" style="height: 16px;"></td></tr>

    {app_card_and_footer}
  </table>
</body>
</html>"###,
        logo = GURI24_LOGO_BASE64,
        illustration = NEW_EMAIL_ILLUSTRATION_BASE64,
        tenant_name = tenant_name,
        amount_kes = amount_kes,
        property_unit = property_unit,
        payout_channel = payout_channel,
        payout_ref = payout_ref,
        app_card_and_footer = EMAIL_APP_CARD_AND_FOOTER_HTML,
    )
}

/// Renders modern, responsive Account Approved email matching Guri24 RMS design specification
pub fn render_account_approved_email(
    recipient_name: &str,
    portal_url: &str,
) -> String {
    let clean_name = recipient_name.trim();
    let display_name = if clean_name.is_empty() { "Valued Member" } else { clean_name };
    let clean_portal_url = if portal_url.trim().is_empty() { "https://guri24rms.co.ke" } else { portal_url.trim() };

    format!(
        r###"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Guri24 RMS account has been approved!</title>
</head>
<body style="margin: 0; padding: 28px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto;">
    <!-- Circular Logo Badge -->
    <tr>
      <td align="center" style="padding-bottom: 18px;">
        <div style="width: 56px; height: 56px; background-color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
          <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="width: 32px; height: 32px; object-fit: contain; display: block; margin: 12px auto 0 auto;" />
        </div>
      </td>
    </tr>

    <!-- Salutation & Headline -->
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h1 style="font-size: 22px; font-weight: 400; color: #1e293b; margin: 0; line-height: 1.35;">
          Hi <strong style="font-weight: 700;">{display_name}</strong>,<br>
          your <strong style="font-weight: 700;">Guri24 RMS</strong> account has been approved!
        </h1>
      </td>
    </tr>

    <!-- Card 1: Main Content with NEW EMAIL! Laptop Illustration -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px 24px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="margin-bottom: 16px;">
          <img src="data:image/png;base64,{illustration}" alt="New Email Notification" style="width: 140px; height: 140px; max-width: 100%; object-fit: contain; display: inline-block;" />
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 14px 0;">
          Your Guri24 RMS account has been approved and you can now log in to the Guri24 portal.
        </p>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 22px 0;">
          You can access Guri24 RMS online or on any device by going to<br>
          <a href="{portal_url}" style="color: #0284c7; text-decoration: none; font-weight: 600;">{portal_url}</a>
        </p>

        <!-- CTA Button -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 6px; background-color: #0284c7;">
              <a href="{portal_url}" target="_blank" style="display: inline-block; padding: 12px 36px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                Get started
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Spacer -->
    <tr><td height="16" style="height: 16px;"></td></tr>

    {app_card_and_footer}
  </table>
</body>
</html>"###,
        logo = GURI24_LOGO_BASE64,
        illustration = NEW_EMAIL_ILLUSTRATION_BASE64,
        display_name = display_name,
        portal_url = clean_portal_url,
        app_card_and_footer = EMAIL_APP_CARD_AND_FOOTER_HTML,
    )
}
