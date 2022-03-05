const net = require("net");
const NodeRSA = require("node-rsa");
const logger = require("./logger");
const { PacketParser, Packet } = require("./helpers/Packet");

const key = new NodeRSA({ b: 512 });

const client = net.createConnection({ port: 9000 }, () => {
  logger.info("connected to server");
  client.write(
    Packet("EXC", key.exportKey("public"), new Date().toISOString())
  );
  client.end();
});

client.on("data", (data) => {
  try {
    let packet = PacketParser(data.toString());
    logger.info(packet);
  } catch (error) {
    logger.error(error);
  }

  client.end();
});

client.on("end", () => {
  logger.info("disconnected from server");
});
