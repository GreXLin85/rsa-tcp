/*
NOTES
- Packet is a string that contains the type, timestamp, and message
- PacketParser is a function that takes a packet and returns an object
    with the type, timestamp, and message
- PacketParser is used to parse the packet into an object
- Packet is used to create a packet from a type, timestamp, and message object
- Types are: MES(SAGE), EXC(HANGE), and DIS(CONNECT)
- EXCHANGE Type is used to exchange public RSA keys
- Timestamp is a valid date string
- Message is a string or a JSON object (if it can be parsed)

*/

const net = require("net");
const logger = require("./logger");
const { PacketParser, Packet } = require("./helpers");

const server = net
  .createServer()
  .on("error", (err) => {
      logger.error(err);
  });

server.on("connection", (socket) => {
    console.log("client connected");
    socket.on("data", (data) => {
        try {
            let packet = PacketParser(data.toString());
            console.log(packet);
        } catch (error) {
            logger.error(error);
        }
    });
    socket.on("end", () => {
        logger.info("client disconnected");
    });
    socket.write("hello client");
    socket.end();
});

server.listen(9000, () => { 
    logger.info("server listening on port 9000");
})