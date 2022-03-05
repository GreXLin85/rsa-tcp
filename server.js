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
const NodeRSA = require("node-rsa");
const logger = require("./logger");
const { PacketParser } = require("./helpers/Packet");
const PacketMessager = require("./helpers/PacketMessager");

const server = net.createServer().on("error", (err) => {
  logger.error(err);
});

// Create a new RSA keypair
const key = new NodeRSA({ b: 512 });
// Variable to store the clients
let clients = [];

server.on("connection", (socket) => {
  // Unique ID for each client
  socket.id = Math.random().toString(36).substring(2, 15); // 15 random characters
  // Add client to the list of clients
  clients.push({ [socket.id]: socket });

  logger.info(`${socket.id} connected`);

  socket.on("data", (data) => {
    try {
      let packet = PacketParser(data.toString());
      switch (packet.type) {
        case "EXC":
          if (!socket.publicKey) {
            // Write the key to the clients list
            clients[socket.id] = packet.message;
            // Send the key to the client
            socket.write(PacketMessager.Exchange(key.exportKey("public")));
            socket.end();
          }
          break;
        case "MES":
          // Send the message to the client
          break;
        case "DIS":
          // Remove the client from the list of clients
          clients = clients.filter((client) => {
            return client[socket.id] !== socket;
          });
          // Send the disconnection message to the client
          break;
        default:
          // Send an error message to the client

          break;
      }
    } catch (error) {
      logger.error(error);
    }
  });

  socket.on("end", () => {
    // Remove client from the list of clients
    clients = clients.filter((client) => {
      return client[socket.id] !== socket;
    });
    logger.info(`${socket.id} disconnected`);
  });
});

server.listen(9000, () => {
  logger.info("server listening on port 9000");
});
