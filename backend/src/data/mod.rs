use std::{fs::File, io::{Read, Write}};

use serde::{Deserialize, Serialize};

use crate::utils::Vec2f;

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayerData {
    name: String,
    pos: Vec2f,
}

const FILE_NAME: &str = "saved_data.json";

impl PlayerData {
    pub fn new(name: String, pos: Vec2f) -> Self {
        Self { name, pos }
    }

    pub fn save(&self) -> Result<(), Box<dyn std::error::Error>> {
        let serialized = serde_json::to_string(self)?;

        let mut file = File::create(FILE_NAME)?;
        file.write_all(serialized.as_bytes())?;

        Ok(())
    }

    pub fn load(name: String) -> PlayerData {
        let mut file = File::open(FILE_NAME).unwrap();
        let mut contents = String::new();
        file.read_to_string(&mut contents).unwrap();

        let person: PlayerData = serde_json::from_str(&contents).unwrap();

        person
    }
}
