
use serde::{Deserialize, Serialize};

use crate::utils::Vec2f;

use super::SavedData;

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayerData {
    name: String,
    pos: Vec2f,
}

impl SavedData for PlayerData {
}