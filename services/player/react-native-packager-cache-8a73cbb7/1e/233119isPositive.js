Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPositive;
function isPositive(value) {
  return typeof value === 'number' && value >= 0;
}