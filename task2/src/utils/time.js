function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { sleep }
