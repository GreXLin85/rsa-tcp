// create logging with colors

module.exports = {
  info: function (message) {
    console.info("[LOG - " + new Date() + "] -", message);
  },
  error: function (message) {
    console.error("[ERR - " + new Date() + "] -", message);
  },
  warn: function (message) {
    console.warn("[WARN - " + new Date() + "] -", message);
  },
};
