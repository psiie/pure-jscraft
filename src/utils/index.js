function dlog(msg) {
  let debounceLogging = false;
  function debounceLog(msg) {
    if (debounceLogging === false) {
      debounceLogging = true;
      console.log(msg);
      setTimeout(function() {
        debounceLogging = false;
      }, 500);
    }
  }
  debounceLog(msg);
}

module.exports = {
  dlog,
};
