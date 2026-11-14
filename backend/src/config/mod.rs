use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub app_env: String,
    pub host: String,
    pub port: u16,
    pub default_currency: String,
    pub default_timezone: String,
    pub database_url: String,
    pub redis_url: String,
    pub jwt_access_secret: String,
    pub jwt_refresh_secret: String,
    pub jwt_access_expiry_secs: i64,
    pub jwt_refresh_expiry_secs: i64,
    pub mpesa_environment: String,
    pub mpesa_base_url: String,
    pub mpesa_shortcode: String,
    pub mpesa_callback_url: String,
    pub mpesa_callback_hmac_secret: String,
    pub sms_provider: String,
    pub email_provider: String,
    pub storage_provider: String,
    pub s3_bucket: String,
    pub s3_signing_secret: String,
    pub s3_signed_url_expiry_secs: u64,
}

impl AppConfig {
    pub fn from_env() -> Self {
        let _ = dotenvy::dotenv();
        Self {
            app_env: env::var("APP_ENV").unwrap_or_else(|_| "development".to_string()),
            host: env::var("APP_HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
            port: env::var("APP_PORT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(8080),
            default_currency: env::var("DEFAULT_CURRENCY").unwrap_or_else(|_| "KES".to_string()),
            default_timezone: env::var("DEFAULT_TIMEZONE")
                .unwrap_or_else(|_| "Africa/Nairobi".to_string()),
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| {
                "postgres://rms_user:rms_password_dev_only@localhost:5432/guri24_rms".to_string()
            }),
            redis_url: env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://127.0.0.1:6379/0".to_string()),
            jwt_access_secret: env::var("JWT_ACCESS_SECRET").unwrap_or_else(|_| {
                "dev_only_access_secret_must_be_overridden_in_production_64_bytes".to_string()
            }),
            jwt_refresh_secret: env::var("JWT_REFRESH_SECRET").unwrap_or_else(|_| {
                "dev_only_refresh_secret_must_be_overridden_in_production_64_byte".to_string()
            }),
            jwt_access_expiry_secs: env::var("JWT_ACCESS_EXPIRY_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(900),
            jwt_refresh_expiry_secs: env::var("JWT_REFRESH_EXPIRY_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(604_800),
            mpesa_environment: env::var("MPESA_ENVIRONMENT")
                .unwrap_or_else(|_| "sandbox".to_string()),
            mpesa_base_url: env::var("MPESA_BASE_URL")
                .unwrap_or_else(|_| "https://sandbox.safaricom.co.ke".to_string()),
            mpesa_shortcode: env::var("MPESA_SHORTCODE").unwrap_or_else(|_| "174379".to_string()),
            mpesa_callback_url: env::var("MPESA_CALLBACK_URL").unwrap_or_else(|_| {
                "http://localhost:8080/api/v1/payments/mpesa/callback".to_string()
            }),
            mpesa_callback_hmac_secret: env::var("MPESA_CALLBACK_HMAC_SECRET")
                .unwrap_or_else(|_| "mpesa_callback_hmac_secret_dev".to_string()),
            sms_provider: env::var("SMS_PROVIDER")
                .unwrap_or_else(|_| "africastalking".to_string()),
            email_provider: env::var("EMAIL_PROVIDER").unwrap_or_else(|_| "smtp".to_string()),
            storage_provider: env::var("STORAGE_PROVIDER").unwrap_or_else(|_| "s3".to_string()),
            s3_bucket: env::var("S3_BUCKET")
                .unwrap_or_else(|_| "guri24-rms-private-docs".to_string()),
            s3_signing_secret: env::var("S3_SECRET_KEY")
                .unwrap_or_else(|_| "minioadmin_secret_dev_only".to_string()),
            s3_signed_url_expiry_secs: env::var("S3_SIGNED_URL_EXPIRY_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(300),
        }
    }
}
