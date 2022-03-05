module.exports = {
  /**
   *
   * @param {String} type EXC(HANGE), MES(SAGE), or DIS(CONNECT)
   * @param {String} message the message to be sent
   * @param {String} timestamp A valid date string
   * @returns {String} the packet to be sent
   * @throws {Error} if the types are not valid
   * @throws {Error} if the timestamp is not valid
   * @example Packet("EXC", "PUBLIC RSA KEY", "2021-01-01T00:00:00.000Z");
   * @example Packet("MES", "hello", new Date().toISOString());
   * @example Packet("DIS", "goodbye", "2021-01-01T00:00:00.000Z");
   */
  Packet: (type, message, timestamp) => {
    // Check if all arguments are provided
    if (
      type === undefined ||
      message === undefined ||
      timestamp === undefined
    ) {
      throw new Error("All arguments must be provided");
    }
    // Check if all arguments are strings
    if (
      typeof type !== "string" ||
      typeof message !== "string" ||
      typeof timestamp !== "string"
    ) {
      throw new Error("All arguments must be strings");
    }
    // Make type upper case
    type = type.toUpperCase();
    // Check if type is valid
    if (type !== "MES" && type !== "EXC" && type !== "DIS" && type !== "ERR") {
      throw new Error(
        "Type must be one of MES(SAGE), EXC(HANGE), DIS(CONNECT) or ERR(OR)"
      );
    }
    // Check if timestamp is valid
    try {
      new Date(timestamp);
    } catch (error) {
      throw new Error("Timestamp must be a valid date");
    }

    return `${type} - ${timestamp} - ${message}`;
  },
  /**
   * @param {String} packet the packet to be parsed
   * @returns {Object<JSON>} an JSON object with the type, timestamp, and message
   * @throws {Error} if the packet is not valid
   * @example PacketParser("EXC - 2021-01-01T00:00:00.000Z - PUBLIC RSA KEY");
   * @example PacketParser("MES - 2021-01-01T00:00:00.000Z - hello");
   * @example PacketParser("DIS - 2021-01-01T00:00:00.000Z - goodbye");
   * */
  PacketParser: (packet) => {
    // parse data by using slice
    let type = packet.slice(0, 3);
    // Check if type is valid
    if (type !== "MES" && type !== "EXC" && type !== "DIS") {
      throw new Error("Type must be one of MESSAGE, EXCHANGE, or DISCONNECT");
    }
    let timestamp = packet.slice(6, 30);
    // Check if timestamp is valid
    try {
      timestamp = new Date(timestamp);
    } catch (error) {
      throw new Error("Timestamp must be a valid date");
    }
    let message = packet.slice(packet.indexOf("-") + 29);
    // Try to parse the message as a JSON object
    try {
      message = JSON.parse(message);
    } catch (error) {
      // If it fails, just return the message
    }

    return {
      type: type,
      timestamp: timestamp,
      message: message,
    };
  },
};
