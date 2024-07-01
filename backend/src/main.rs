use std::{
    fs,
    io::{BufRead, BufReader, Write},
    net::{TcpListener, TcpStream},
};

fn main() -> anyhow::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:7878")?;
    for stream in listener.incoming() {
        let stream = stream?;

        println!("Connection established");
        handle_connection(stream)?;
    }
    Ok(())
}

fn handle_connection(mut stream: TcpStream) -> anyhow::Result<()> {
    let buf_reader = BufReader::new(&mut stream);
    /*let http_req = buf_reader
        .lines()
        .map(|res| res.unwrap())
        .take_while(|line| !line.is_empty())
        .collect::<Vec<_>>();
    println!("Request: {http_req:#?}");*/
    let request_line = buf_reader.lines().next().unwrap().unwrap();

    if request_line == "GET / HTTP/1.1" {
        let status_line = "HTTP/1.1 200 OK";
        let contents = fs::read_to_string("test.html")?;
        let len = contents.len();

        let response = format!(
        "{status_line}\r\nContent-Length: {len}\r\nAccess-Control-Allow-Origin: *\r\n\r\n{contents}"
    );

        stream.write_all(response.as_bytes())?;
    }
    Ok(())
}
