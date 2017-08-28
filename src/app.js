import css from "./index.css";
const movement = require("./movement");
const Perlin = require("./vendor/perlin");
const render = require("./renderEngine");

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

const game = {
  width: 320,
  height: 240,
  ctx: document.getElementById("game").getContext("2d"),
  pixels: undefined,
  map: [],
  texmap: new Array(16 * 16 * 3 * 16),
  player: {
    x: 32.5,
    y: 32.5,
    z: 32.5,
    pitch: Math.cos(4.6),
    yaw: Math.PI / 2
  }
};

(function init() {
  const pn = new Perlin("fjlakj3kn4kj9uvd98vf");
  const heightMap = new Array(64);

  function genMapDataType() {
    /* using JSON string/parse for deep cloning. Array.slice(0) doesn't 
    seem to play well. It ends up linking */
    const dim1 = [];
    for (let i = 0; i < 64; i++)
      dim1.push(0);

    const dim2 = dim1.slice();
    for (let i = 0; i < 64; i++)
      dim2[i] = JSON.parse(JSON.stringify(dim1));

    const dim3 = dim2.slice();
    for (let i = 0; i < 64; i++)
      dim3[i] = JSON.parse(JSON.stringify(dim2));

    game.map = dim3;
  }

  function generateTextures() {
    for (var i = 1; i < 16; i++) {
      var br = 255 - ((Math.random() * 96) | 0);
      for (var y = 0; y < 16 * 3; y++) {
        for (var x = 0; x < 16; x++) {
          var color = 0x966c4a;
          if (i == 4) color = 0x7f7f7f;
          if (i != 4 || ((Math.random() * 3) | 0) === 0) {
            br = 255 - ((Math.random() * 96) | 0);
          }
          if (i == 1 && y < (((x * x * 3 + x * 81) >> 2) & 3) + 18) {
            color = 0x6aaa40;
          } else if (i == 1 && y < (((x * x * 3 + x * 81) >> 2) & 3) + 19) {
            br = br * 2 / 3;
          }
          if (i == 7) {
            color = 0x675231;
            if (x > 0 && x < 15 && ((y > 0 && y < 15) || (y > 32 && y < 47))) {
              color = 0xbc9862;
              var xd = x - 7;
              var yd = (y & 15) - 7;
              if (xd < 0) xd = 1 - xd;
              if (yd < 0) yd = 1 - yd;
              if (yd > xd) xd = yd;

              br = 196 - ((Math.random() * 32) | 0) + xd % 3 * 32;
            } else if (((Math.random() * 2) | 0) === 0) {
              br = br * (150 - (x & 1) * 100) / 100;
            }
          }

          if (i == 5) {
            color = 0xb53a15;
            if ((x + (y >> 2) * 4) % 8 === 0 || y % 4 === 0) {
              color = 0xbcafa5;
            }
          }
          if (i == 9) {
            color = 0x4040ff;
          }
          var brr = br;
          if (y >= 32) brr /= 2;

          if (i == 8) {
            color = 0x50d937;
            if (((Math.random() * 2) | 0) === 0) {
              color = 0;
              brr = 255;
            }
          }

          var col =
            ((((color >> 16) & 0xff) * brr / 255) << 16) |
            ((((color >> 8) & 0xff) * brr / 255) << 8) |
            ((color & 0xff) * brr / 255);
          game.texmap[x + y * 16 + i * 256 * 3] = col;
        }
      }
    }
  }

  function generateLand() {
    // generate height game.map
    for (let x = 0; x < 64; x++) {
      heightMap[x] = new Array(64);
      for (let z = 0; z < 64; z++) {
        let height = pn.noise(x / 15, z / 15, Math.PI);
        height *= 32;
        height += 32;
        height = Math.floor(height);
        heightMap[x][z] = height;
      }
    }

    // game.map height game.map to game.map
    for (let x = 0; x < 64; x++) {
      for (let z = 0; z < 64; z++) {
        let mHeight = heightMap[x][z];
        game.map[x][mHeight][z] = 1;

        // water fill 9
        for (let y = mHeight - 1; y > 50; y--)
          game.map[x][y][z] = 9;

        // underground fill
        for (let y = mHeight + 1; y < 64; y++)
          game.map[x][y][z] = 4;
      }
    }
  }

  function clock() {
    movement.calculateMovement(game.player);
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

  // white out
  for (let i = 0; i < game.width * game.height; i++) {
    game.pixels.data[i * 4 + 3] = 255;
  }

  genMapDataType();
  generateLand();
  generateTextures();
  movement.init(game.player, game.map);
  setInterval(clock, 1000 / 100);
})();
