//! Guri24 RMS Production Email Templates
//! Visual design matches modern email card mockup with:
//! - Window header ("New email") and modal controls
//! - Official Guri24 RMS Property Logo
//! - "To" recipient chip with avatar
//! - Bold title and formatted body with @mention & highlight badge
//! - Attachment reference cards
//! - Bottom action bar ("Ask AI", primary action button)

pub const GURI24_LOGO_BASE64: &str = include_str!("guri24_logo_email.base64");

/// Renders a responsive, modern HTML email for OTP verification
pub fn render_otp_email_template(recipient: &str, code: &str) -> String {
    let clean_recipient = recipient.trim();
    let name_part = clean_recipient.split('@').next().unwrap_or("User");
    let avatar_initial = name_part.chars().next().unwrap_or('U').to_ascii_uppercase();

    format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guri24 RMS Verification Code</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <!-- Email Window Card -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); overflow: hidden;">
    <!-- Top Header Bar (Matching "New email" modal header) -->
    <tr>
      <td style="padding: 18px 24px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" style="vertical-align: middle;">
              <div style="display: inline-flex; align-items: center; gap: 8px;">
                <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="height: 32px; width: auto; max-width: 140px; display: inline-block; vertical-align: middle;" />
                <span style="display: inline-block; margin-left: 10px; font-size: 13px; font-weight: 600; color: #64748b; background: #f8fafc; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">New verification</span>
              </div>
            </td>
            <td align="right" style="vertical-align: middle;">
              <!-- Minimalist modal controls (expand, close) -->
              <span style="display: inline-block; width: 14px; height: 14px; border: 1.5px solid #94a3b8; border-radius: 3px; margin-right: 8px; vertical-align: middle;"></span>
              <span style="display: inline-block; font-size: 16px; font-weight: 700; color: #94a3b8; line-height: 1; vertical-align: middle;">&times;</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Recipient "To" Bar -->
    <tr>
      <td style="padding: 12px 24px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" style="vertical-align: middle;">
              <span style="font-size: 13px; color: #64748b; margin-right: 12px; font-weight: 500;">To</span>
              <span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 20px; padding: 3px 12px 3px 4px; vertical-align: middle;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #e0e7ff; color: #4338ca; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 700; margin-right: 6px;">{initial}</span>
                <span style="font-size: 13px; color: #0f172a; font-weight: 500;">{recipient}</span>
              </span>
            </td>
            <td align="right" style="vertical-align: middle;">
              <span style="font-size: 12px; color: #94a3b8; margin-left: 10px; cursor: default;">Bc</span>
              <span style="font-size: 12px; color: #94a3b8; margin-left: 8px; cursor: default;">Cc</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Content Area -->
    <tr>
      <td style="padding: 28px 28px 20px 28px;">
        <!-- Email Subject Headline -->
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.02em; line-height: 1.3;">
          Account verification & access code
        </h1>

        <!-- Salutation with @mention pill -->
        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 16px 0;">
          Hey <span style="background-color: #ede9fe; color: #6d28d9; padding: 2px 8px; border-radius: 6px; font-weight: 600; font-size: 14px;">@{name_part}</span>,
        </p>

        <!-- Body Copy -->
        <p style="font-size: 14px; color: #475569; line-height: 1.65; margin: 0 0 18px 0;">
          Welcome to <strong style="color: #0f172a;">Guri24 RMS</strong> — the intelligent residential rental management platform for Kenya.
          To complete your account verification and activate your workspace, please enter the security code below:
        </p>

        <!-- High-Impact Verification Code Box -->
        <div style="background-color: #fff7ed; border: 1.5px dashed #ea580c; border-radius: 12px; padding: 20px; text-align: center; margin: 22px 0;">
          <div style="font-size: 12px; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
            One-Time Verification Code
          </div>
          <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #ea580c; font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace; margin: 6px 0;">
            {code}
          </div>
          <div style="font-size: 12px; color: #9a3412;">
            Expires in <strong>10 minutes</strong> &bull; Do not share this code with anyone
          </div>
        </div>

        <!-- Inline Floating Tooltip Bar Mockup (Matching attached reference design) -->
        <div style="text-align: center; margin: 24px 0 16px 0;">
          <span style="display: inline-block; background-color: #0f172a; color: #cbd5e1; padding: 5px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; letter-spacing: 2px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);">
            B &nbsp;<i>I</i> &nbsp;<u>U</u> &nbsp;|&nbsp; &#9776; &#9776; &#9776; &nbsp;|&nbsp; &#128279;
          </span>
        </div>

        <p style="font-size: 14px; color: #475569; line-height: 1.65; margin: 0 0 24px 0;">
          If you did not request this verification code, please ignore this email or reach out to
          <a href="mailto:guri24@aqivo.shop" style="color: #ea580c; text-decoration: none; font-weight: 600;">guri24@aqivo.shop</a>.
        </p>

        <p style="font-size: 14px; color: #334155; margin: 0 0 24px 0;">
          Best,<br>
          <strong style="color: #0f172a;">Guri24 RMS Team</strong>
        </p>

        <!-- Attachments / Reference Cards (Matching reference screenshot) -->
        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #f1f5f9;">
          <div style="font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 12px;">
            2 security references
          </div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="48%" style="padding: 10px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="28" style="vertical-align: middle;">
                      <span style="display: inline-block; width: 26px; height: 26px; background-color: #fee2e2; color: #ef4444; border-radius: 6px; font-size: 10px; font-weight: 800; text-align: center; line-height: 26px;">PDF</span>
                    </td>
                    <td style="padding-left: 8px; vertical-align: middle;">
                      <div style="font-size: 12px; font-weight: 600; color: #0f172a;">Security Policy</div>
                      <div style="font-size: 11px; color: #94a3b8;">246 kB</div>
                    </td>
                  </tr>
                </table>
              </td>
              <td width="4%">&nbsp;</td>
              <td width="48%" style="padding: 10px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="28" style="vertical-align: middle;">
                      <span style="display: inline-block; width: 26px; height: 26px; background-color: #f3e8ff; color: #9333ea; border-radius: 6px; font-size: 10px; font-weight: 800; text-align: center; line-height: 26px;">RMS</span>
                    </td>
                    <td style="padding-left: 8px; vertical-align: middle;">
                      <div style="font-size: 12px; font-weight: 600; color: #0f172a;">Portal Guidelines</div>
                      <div style="font-size: 11px; color: #94a3b8;">812 kB</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>

    <!-- Bottom Action Bar (Matching bottom row in reference screenshot) -->
    <tr>
      <td style="padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" style="vertical-align: middle;">
              <!-- Action Icons -->
              <span style="font-size: 14px; color: #94a3b8; margin-right: 12px;">&#128206;</span>
              <span style="font-size: 14px; color: #94a3b8; margin-right: 12px;">&#128337;</span>
              <span style="display: inline-block; background: #0f172a; color: #ffffff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; vertical-align: middle; margin-right: 12px;">Template</span>
              <span style="font-size: 14px; color: #94a3b8;">&#128100;</span>
            </td>
            <td align="right" style="vertical-align: middle;">
              <!-- Ask AI button -->
              <span style="display: inline-block; background-color: #ffffff; border: 1px solid #e2e8f0; color: #334155; font-size: 12px; font-weight: 600; padding: 7px 12px; border-radius: 8px; margin-right: 8px;">
                Ask AI &#10022;
              </span>
              <!-- Send / Confirm button -->
              <a href="http://143.198.30.249:5175" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 12px; font-weight: 600; padding: 8px 16px; border-radius: 8px; text-decoration: none;">
                Open Portal &#10148;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Small Footer -->
  <div style="text-align: center; margin-top: 18px; font-size: 11px; color: #94a3b8;">
    Guri24 RMS &bull; Residential Rental Management System &bull; Nairobi, Kenya &bull; Powered by Aqivo
  </div>
</body>
</html>"#,
        logo = GURI24_LOGO_BASE64,
        recipient = clean_recipient,
        name_part = name_part,
        initial = avatar_initial,
        code = code.trim(),
    )
}

/// Renders a generic notification email template
pub fn render_notification_email_template(
    recipient: &str,
    title: &str,
    message: &str,
    action_label: Option<&str>,
    action_url: Option<&str>,
) -> String {
    let clean_recipient = recipient.trim();
    let name_part = clean_recipient.split('@').next().unwrap_or("User");
    let avatar_initial = name_part.chars().next().unwrap_or('U').to_ascii_uppercase();

    let btn_label = action_label.unwrap_or("Open Guri24 RMS Portal");
    let btn_url = action_url.unwrap_or("http://143.198.30.249:5175");

    format!(
        r#"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="padding: 18px 24px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" style="vertical-align: middle;">
              <div style="display: inline-flex; align-items: center; gap: 8px;">
                <img src="data:image/png;base64,{logo}" alt="Guri24 RMS" style="height: 32px; width: auto; max-width: 140px; display: inline-block; vertical-align: middle;" />
                <span style="display: inline-block; margin-left: 10px; font-size: 13px; font-weight: 600; color: #64748b; background: #f8fafc; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">Notification</span>
              </div>
            </td>
            <td align="right" style="vertical-align: middle;">
              <span style="display: inline-block; width: 14px; height: 14px; border: 1.5px solid #94a3b8; border-radius: 3px; margin-right: 8px; vertical-align: middle;"></span>
              <span style="display: inline-block; font-size: 16px; font-weight: 700; color: #94a3b8; line-height: 1; vertical-align: middle;">&times;</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Recipient -->
    <tr>
      <td style="padding: 12px 24px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" style="vertical-align: middle;">
              <span style="font-size: 13px; color: #64748b; margin-right: 12px; font-weight: 500;">To</span>
              <span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 20px; padding: 3px 12px 3px 4px; vertical-align: middle;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #e0e7ff; color: #4338ca; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 700; margin-right: 6px;">{initial}</span>
                <span style="font-size: 13px; color: #0f172a; font-weight: 500;">{recipient}</span>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding: 28px;">
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.02em;">
          {title}
        </h1>

        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 16px 0;">
          Hey <span style="background-color: #ede9fe; color: #6d28d9; padding: 2px 8px; border-radius: 6px; font-weight: 600; font-size: 14px;">@{name_part}</span>,
        </p>

        <div style="font-size: 14px; color: #475569; line-height: 1.65; margin: 0 0 24px 0;">
          {message}
        </div>

        <div style="text-align: center; margin: 28px 0 20px 0;">
          <a href="{btn_url}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);">
            {btn_label} &rarr;
          </a>
        </div>
      </td>
    </tr>

    <!-- Bottom Bar -->
    <tr>
      <td style="padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left" style="vertical-align: middle;">
              <span style="font-size: 11px; color: #94a3b8;">Guri24 RMS Transactional Outbox &bull; Delivered via Resend</span>
            </td>
            <td align="right" style="vertical-align: middle;">
              <span style="display: inline-block; background-color: #ffffff; border: 1px solid #e2e8f0; color: #334155; font-size: 11px; font-weight: 600; padding: 6px 10px; border-radius: 6px;">
                Ask AI &#10022;
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"#,
        title = title,
        logo = GURI24_LOGO_BASE64,
        recipient = clean_recipient,
        name_part = name_part,
        initial = avatar_initial,
        message = message,
        btn_label = btn_label,
        btn_url = btn_url,
    )
}
