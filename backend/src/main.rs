use std::io::prelude::*;
use std::net::{TcpListener, TcpStream};
use std::thread;

fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0; 512];
    stream.read(&mut buffer).unwrap();
    let request = String::from_utf8_lossy(&buffer[..]);

    println!("{}", request);

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
        let response = "HTTP/1.1 200 OK\r\n\
                        Content-Type: text/plain\r\n\
                        Access-Control-Allow-Origin: *\r\n\
                        \r\n\
                        Hello, world!";
        stream.write(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    } else if request.starts_with("POST") {
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

fn main() {
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
    println!("Server listening on port 7878");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                thread::spawn(|| {
                    handle_client(stream);
                });
            }
            Err(e) => {
                println!("Connection failed: {}", e);
            }
        }
    }
}