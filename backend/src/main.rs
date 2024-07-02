mod data;
mod server;
mod utils;

use std::io::prelude::*;
use std::net::{TcpListener, TcpStream};

use data::level::LevelData;
use data::SavedData;

fn main() -> anyhow::Result<()> {
    //let server = Server::new("127.0.0.1:7878");
    let mut level = LevelData::load(String::new()).unwrap_or(LevelData { player_count: 0 });

    let listener = TcpListener::bind("127.0.0.1:7878")?;
    println!("Server listening on port 7878");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => handle_client(stream, &mut level),
            Err(e) => {
                println!("Connection failed: {}", e);
            }
        }

        if level.player_count != 0 {
            level.save()?;
        }
    }

    Ok(())
}

fn handle_client(mut stream: TcpStream, level: &mut LevelData) {
    let mut buffer = [0; 512];
    stream.read(&mut buffer).unwrap();
    let request = String::from_utf8_lossy(&buffer[..]);

    if request.starts_with("OPTIONS") {
        // Handle preflight request
        let response = "HTTP/1.1 204 No Content\r\n\
                        Access-Control-Allow-Origin: *\r\n\
                        Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n\
                        Access-Control-Allow-Headers: Content-Type\r\n\
                        Access-Control-Max-Age: 86400\r\n\
                        \r\n";
        stream.write(response.as_bytes()).unwrap();
        stream.flush().unwrap();
        return;
    }

    // Your usual request handling logic
    // Here is an example for a GET request
    if request.starts_with("GET") {
        let first_line = request.lines().nth(0);
        let path = first_line.unwrap().split(" ").collect::<Vec<_>>();

        if let Some(path) = path.get(1) {
            if *path == "/player-count" {
                println!("Requested player count");
                println!("readonly count: {}", level.player_count);
                let response = format!(
                    "HTTP/1.1 200 OK\r\n\
                        Content-Type: text/plain\r\n\
                        Access-Control-Allow-Origin: *\r\n\
                        \r\n\
                        {}",
                    serde_json::to_string(&level).unwrap()
                );
                stream.write(response.as_bytes()).unwrap();
                stream.flush().unwrap();
                return;
            }
        }

        let response = "HTTP/1.1 200 OK\r\n\
                        Content-Type: text/plain\r\n\
                        Access-Control-Allow-Origin: *\r\n\
                        \r\n\
                        Hello, world!";
        stream.write(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    } else if request.starts_with("POST") {
        let first_line = request.lines().nth(0);
        let path = first_line.unwrap().split(" ").collect::<Vec<_>>();

        if let Some(path) = path.get(1) {
            if *path == "/player-count" {
                println!("Sent new player count");
                let mut request_data = request.lines().last().unwrap().bytes().collect::<Vec<_>>();
                for ch in request_data.clone().iter().rev() {
                    if *ch == 0 {
                        request_data.pop();
                    }
                }
                let level_data: LevelData =
                    serde_json::from_str(std::str::from_utf8(&request_data).unwrap()).unwrap();
                println!("new count: {}", level_data.player_count);
                level.player_count = level_data.player_count;
            }
        }

        let response = "HTTP/1.1 200 OK\r\n\
                        Content-Type: application/json\r\n\
                        Access-Control-Allow-Origin: *\r\n\
                        \r\n\
                        {\"message\": \"Hello, POST!\"}";
        stream.write(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    } else {
        let response = "HTTP/1.1 404 NOT FOUND\r\n\r\n";
        stream.write(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    }
}
