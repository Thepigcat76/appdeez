use std::{
    fs::{self, File},
    io::{Read, Write},
};

use anyhow::bail;
use serde::{Deserialize, Serialize};

pub mod level;
pub mod player;

const FILE_NAME: &str = "saved_data.json";

pub trait SavedData
where
    Self: Serialize + for<'sd> Deserialize<'sd>,
{
    fn save(&self) -> anyhow::Result<()> {
        let serialized = serde_json::to_string(self)?;

        let mut file = File::create(FILE_NAME)?;
        file.write_all(serialized.as_bytes())?;

        Ok(())
    }

    fn load(_id: String) -> anyhow::Result<Self> {
        let contents = match fs::metadata(FILE_NAME) {
            Ok(_) => fs::read_to_string(FILE_NAME).unwrap(),
            Err(_) => bail!("Failed to load data from file. File does not exist"),
        };
        let data = serde_json::from_str(&contents)?;
        Ok(data)
    }
}
