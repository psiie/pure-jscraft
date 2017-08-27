import css from "./index.css";
// import Perlin from "./vendor/perlin.js";
const { Perlin } = require("./vendor/perlin");
const { render } = require("./renderEngine");

var ctx;
var pixels;

var w = 320;
var h = 240;

var map = (() => {
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

  return dim3;
})();

var texmap = new Array(16 * 16 * 3 * 16);
(() => {
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
        texmap[x + y * 16 + i * 256 * 3] = col;
      }
    }
  }
})();

init();

function init() {
  ctx = document.getElementById("game").getContext("2d");

  const randBlock = function() {
    const pick = (Math.random() * 16) | 0;
    return pick;
  };

  const perlinLandGen = function() {
    const pn = new Perlin("fjlakj3kn4kj9uvd98vf");
    const heightMap = new Array(64);
    // generate height map
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

    // map height map to map
    for (let x = 0; x < 64; x++) {
      for (let z = 0; z < 64; z++) {
        let mHeight = heightMap[x][z];
        map[x][mHeight][z] = 1;
        // water fill 9
        for (let y = mHeight - 1; y > 50; y--) {
          map[x][y][z] = 9;
        }

        // underground fill
        for (let y = mHeight + 1; y < 64; y++) {
          map[x][y][z] = 4;
        }
      }
    }
  };

  perlinLandGen();

  pixels = ctx.createImageData(w, h);

  for (let i = 0; i < w * h; i++) {
    pixels.data[i * 4 + 3] = 255;
  }

  setInterval(clock, 1000 / 100);
}

// camera Pitch & Yaw
const player = {
  x: 32.5,
  y: 32.5,
  z: 32.5,
  pitch: Math.cos(4.6),
  yaw: Math.PI / 2
};

// let player.yaw = Math.sin(0) + Math.PI / 2; // 7.855 // 6.2842036732 sin
// let player.pitch = Math.cos(4.6);

// // camera coords
// let player.x = 32.5;
// let player.y = 31.5;
// let player.z = 32.5;

function clock() {
  calculateMovement();
  const renderOpts = {
    map,
    texmap,
    pixels,
    w,
    h,
    playerX: player.x,
    playerY: player.y,
    playerZ: player.z,
    playerYaw: player.yaw,
    playerPitch: player.pitch
  };
  render(renderOpts);
  ctx.putImageData(pixels, 0, 0);
}

function calculateMovement() {
  if (keyState.forward) {
    player.x += Math.sin(player.yaw) * Math.cos(player.pitch) / 8;
    player.y -= Math.sin(player.pitch) / 8;
    player.z += Math.cos(player.yaw) * Math.cos(player.pitch) / 8;
  } else if (keyState.backward) {
    player.x -= Math.sin(player.yaw) * Math.cos(player.pitch) / 8;
    player.y += Math.sin(player.pitch) / 8;
    player.z -= Math.cos(player.yaw) * Math.cos(player.pitch) / 8;
  }

  if (keyState.strafeLeft) {
    player.x += Math.sin(player.yaw - Math.PI / 2) / 8;
    player.z += Math.cos(player.yaw - Math.PI / 2) / 8;
  } else if (keyState.strafeRight) {
    player.x -= Math.sin(player.yaw - Math.PI / 2) / 8;
    player.z -= Math.cos(player.yaw - Math.PI / 2) / 8;
  }
}

document.addEventListener("pointerlockchange", changeCallback, false);
document.addEventListener("mozpointerlockchange", changeCallback, false);
document.addEventListener("webkitpointerlockchange", changeCallback, false);

document.getElementById("game").addEventListener("click", function() {
  var canvas = document.getElementById("game");
  canvas.requestPointerLock =
    canvas.requestPointerLock ||
    canvas.mozRequestPointerLock ||
    canvas.webkitRequestPointerLock;
  canvas.requestPointerLock();
});

function changeCallback(e) {
  var canvas = document.getElementById("game");
  const havePointer =
    document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas ||
    document.webkitPointerLockElement === canvas;
  if (havePointer) {
    document.addEventListener("mousemove", moveCallback, false);
  } else {
    document.removeEventListener("mousemove", moveCallback, false);
  }
}

function moveCallback(event) {
  var movementX =
    event.movementX || event.mozMovementX || event.webkitMovementX || 0;

  var movementY =
    event.movementY || event.mozMovementY || event.webkitMovementY || 0;

  player.yaw = (player.yaw + movementX / 500) % 7.855;
  player.pitch = player.pitch - movementY / 1000;
  if (player.pitch < -Math.PI / 2) player.pitch = -Math.PI / 2;
  if (player.pitch > Math.PI / 2) player.pitch = Math.PI / 2;
}

const keyState = {
  forward: false,
  backward: false,
  strafeLeft: false,
  strafeRight: false
};

document.addEventListener("keydown", event => {
  // console.log(player.x | 0, player.y | 0, player.z | 0);
  // console.log(
  //   player.yaw,
  //   Math.sin(player.yaw),
  //   Math.cos(player.yaw),
  //   Math.sin(player.pitch)
  // );
  switch (event.keyCode) {
    case 65:
      keyState.strafeLeft = true;
      break;
    case 68:
      keyState.strafeRight = true;
      break;
    case 87:
      keyState.forward = true;
      break;
    case 83:
      keyState.backward = true;
      break;
  }
});

document.addEventListener("keyup", event => {
  switch (event.keyCode) {
    case 65:
      keyState.strafeLeft = false;
      break;
    case 68:
      keyState.strafeRight = false;
      break;
    case 87:
      keyState.forward = false;
      break;
    case 83:
      keyState.backward = false;
      break;
  }
});

document.addEventListener("click", event => {
  if (event.button === 0) {
    // console.log(player.x, player.y, player.z);
    // console.log(Math.sin(playerPitch), Math.sin(player.yaw));

    const findSelectedBlock = function() {
      let rayX = player.x;
      let rayY = player.y;
      let rayZ = player.z;
      // let rayPitch = player.pitch;
      // let rayYaw = player.yaw;
      // console.log(rayPitch, rayYaw);
      // console.log(rayX | 0, rayY | 0, rayZ | 0);
      for (var i = 0; i < 6 * 1000; i++) {
        rayX += Math.sin(player.yaw) * Math.cos(player.pitch) / 1000;
        rayY -= Math.sin(player.pitch) / 1000;
        rayZ += Math.cos(player.yaw) * Math.cos(player.pitch) / 1000;
        // map[rayX | 0][rayY | 0][rayZ | 0] = 9;
        // console.log(rayX, rayY, rayZ);
        if (map[rayX | 0][rayY | 0][rayZ | 0] > 0) {
          console.log("steps:", i);
          let currBlock = map[rayX | 0][rayY | 0][rayZ | 0];
          currBlock = (currBlock + 1) % 16;
          map[rayX | 0][rayY | 0][rayZ | 0] = currBlock || 1;
          break;
        }
      }
      console.log(rayX | 0, rayY | 0, rayZ | 0);
    };

    findSelectedBlock();
  }
});

/* ------------------------- 
|       Render Engine      |
------------------------- */

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
