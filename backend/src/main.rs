use std::net::SocketAddr;
use tokio::net::TcpListener;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use guri24_rms_backend::{config::AppConfig, database::AppState, routes::create_router};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,guri24_rms_backend=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = AppConfig::from_env();
    let addr: SocketAddr = format!("{}:{}", config.host, config.port).parse()?;
    let state = AppState::new(config);
    let app = create_router(state);

    tracing::info!(
        address = %addr,
        timezone = "Africa/Nairobi",
        currency = "KES",
        "Starting Guri24 Residential Rental Management System (RMS) Backend"
    );

    let listener = TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;
    Ok(())
}
