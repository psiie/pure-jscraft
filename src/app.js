import css from "./webpack/index.css";
const movement = require("./movement");
const render = require("./renderEngine");
const generators = require('./generators');

const game = {
  width: 320,
  height: 240,
  ctx: document.getElementById("game").getContext("2d"),
  player: {
    x: 32.5,
    y: 32.5,
    z: 32.5,
    velocity: 0,
    pitch: Math.cos(4.6),
    yaw: Math.PI / 2
  }
};

(() => {
  function clock() {
    // console.log(game.player.x | 0, game.player.y | 0, game.player.z | 0);
    movement.applyGravity(game.player, game.map);
    movement.calculateMovement(game.player, game.map);
    const renderOpts = {
      map: game.map,
      texmap: game.texmap,
      pixels: game.pixels,
      w: game.width,
      h: game.height,
      playerX: game.player.x,
      playerY: game.player.y,
      playerZ: game.player.z,
      playerYaw: game.player.yaw,
      playerPitch: game.player.pitch
    };
    render(renderOpts);
    game.ctx.putImageData(game.pixels, 0, 0);
  }

  game.pixels = game.ctx.createImageData(game.width, game.height);

  // Set Opacity for screen
  for (let i = 0; i < game.width * game.height; i++) {
    game.pixels.data[i * 4 + 3] = 255;
  }

  game.map = generators.mapDataType();
  game.map = generators.map(game.map);
  game.texmap = generators.textures();
  movement.init(game.player, game.map);
  setInterval(clock, 1000 / 100);
})();
