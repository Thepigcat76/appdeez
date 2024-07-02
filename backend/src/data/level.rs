use serde::{Deserialize, Serialize};

use super::SavedData;

#[derive(Debug, Serialize, Deserialize)]
pub struct LevelData {
    pub player_count: i32,
}

impl SavedData for LevelData {
}