// Validate Email Format.
function validateEmail(val) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return emailPattern.test(val);
}

module.exports = { validateEmail };