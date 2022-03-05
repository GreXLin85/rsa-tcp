const { Packet } = require("./Packet");

module.exports = {
  Message: (message, timestamp = new Date().toISOString()) => {
    return Packet("MES", message, timestamp);
  },
  Exchange: (publicKey, timestamp = new Date().toISOString()) => {
    return Packet("EXC", publicKey, timestamp);
  },
  Disconnect: (message, timestamp = new Date().toISOString()) => {
    return Packet("DIS", message, timestamp);
  },
};
