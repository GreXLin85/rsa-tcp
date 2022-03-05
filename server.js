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
const { PacketParser, Packet } = require("./helpers/Packet");

const server = net.createServer().on("error", (err) => {
  logger.error(err);
});

let clients = [];

server.on("connection", (socket) => {
  // Unique ID for each client
  socket.id = Math.random().toString(36).substring(2, 15);
  // Add client to the list of clients
  clients.push({ [socket.id]: socket });
  logger.info(`${socket.id} connected`);

  socket.on("data", (data) => {
    try {
      let packet = PacketParser(data.toString());
      logger.info(packet);
    } catch (error) {
      logger.error(error);
    }
  });
  socket.on("end", () => {
    logger.info(`${socket.id} disconnected`);
    // Remove client from the list of clients
    clients = clients.filter((client) => {
        return client[socket.id] !== socket;
    });
  });
  socket.write(Packet("MES", "hello client", new Date().toISOString()));
  socket.end();
});

server.listen(9000, () => {
  logger.info("server listening on port 9000");
});
