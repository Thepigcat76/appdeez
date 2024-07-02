use std::{fs::{self, File}, io::{Read, Write}};

use serde::{Deserialize, Serialize};

pub mod player;
pub mod level;

const FILE_NAME: &str = "saved_data.json";

pub trait SavedData: Serialize + for<'sd> Deserialize<'sd> {
    fn save(&self) -> Result<(), Box<dyn std::error::Error>> {
        let serialized = serde_json::to_string(self)?;

        let mut file = File::create(FILE_NAME)?;
        file.write_all(serialized.as_bytes())?;

        Ok(())
    }

    fn load(id: String) -> Self {
        let contents = fs::read(FILE_NAME).unwrap();

        let person = serde_json::from_str(std::str::from_utf8(&contents).unwrap()).unwrap();

        person
    }
}
