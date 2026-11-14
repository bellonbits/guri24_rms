use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Clone, Deserialize, IntoParams, ToSchema)]
pub struct PaginationParams {
    #[serde(default = "default_page")]
    pub page: usize,
    #[serde(default = "default_per_page")]
    pub per_page: usize,
    pub search: Option<String>,
    pub status: Option<String>,
}

fn default_page() -> usize {
    1
}

fn default_per_page() -> usize {
    25
}

impl Default for PaginationParams {
    fn default() -> Self {
        Self {
            page: 1,
            per_page: 25,
            search: None,
            status: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PaginatedResponse<T> {
    pub items: Vec<T>,
    pub page: usize,
    pub per_page: usize,
    pub total: usize,
    pub total_pages: usize,
}

impl<T> PaginatedResponse<T> {
    pub fn from_vec(all_items: Vec<T>, params: &PaginationParams) -> Self {
        let page = params.page.max(1);
        let per_page = params.per_page.clamp(1, 100);
        let total = all_items.len();
        let total_pages = if total == 0 {
            1
        } else {
            total.div_ceil(per_page)
        };
        let start = (page - 1) * per_page;
        let items = all_items.into_iter().skip(start).take(per_page).collect();

        Self {
            items,
            page,
            per_page,
            total,
            total_pages,
        }
    }
}
