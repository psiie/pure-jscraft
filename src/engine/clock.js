const movement = require("../movement");
const render = require("./render");
let pid;

function tick() {
  // console.log(this.player.x | 0, this.player.y | 0, this.player.z | 0);
  movement.applyGravity(this.player, this.map);
  movement.calculateMovement(this.player, this.map);
  render(this);
}

module.exports = {
  init: game => pid = setInterval(tick.bind(game), 1000 / 100),
}