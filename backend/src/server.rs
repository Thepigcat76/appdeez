use std::net::TcpStream;

pub struct Server {
    addr: &'static str,
    stream: TcpStream,
}

impl Server {
    pub fn new(addr: &'static str) -> Self {
        Self {
            addr,
            stream: todo!()
        }
    }
}