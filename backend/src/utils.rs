use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Vec2f {
    pub x: f32,
    pub y: f32,
}