use rust_decimal::Decimal;
use crate::core::{circuit_breaker::CircuitBreaker, errors::AppResult};

/// Section 5.10: Adapter Pattern for AI Operational Insights
pub trait AIAdapter: Send + Sync {
    fn summarize_portfolio_health(
        &self,
        occupancy_rate_pct: Decimal,
        collection_rate_pct: Decimal,
        total_arrears_kes: Decimal,
    ) -> AppResult<String>;
}

pub struct OperationalInsightsAiAdapter {
    pub breaker: CircuitBreaker,
}

impl OperationalInsightsAiAdapter {
    pub fn new(breaker: CircuitBreaker) -> Self {
        Self { breaker }
    }
}

impl AIAdapter for OperationalInsightsAiAdapter {
    fn summarize_portfolio_health(
        &self,
        occupancy_rate_pct: Decimal,
        collection_rate_pct: Decimal,
        total_arrears_kes: Decimal,
    ) -> AppResult<String> {
        self.breaker.call(|| {
            Ok(format!(
                "Portfolio occupancy stands at {:.1}% with a {:.1}% rent collection rate and KES {} in active arrears.",
                occupancy_rate_pct, collection_rate_pct, total_arrears_kes
            ))
        })
    }
}
