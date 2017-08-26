function init() {
  ctx = document.getElementById("game").getContext("2d");

  const randBlock = function() {
    const pick = (Math.random() * 16) | 0;
    return pick;
  };

  for (worldX = 0; worldX < 64; worldX++) {
    for (worldY = 0; worldY < 64; worldY++) {
      for (worldZ = 0; worldZ < 64; worldZ++) {
        if (worldY === 36) map[worldX][worldY][worldZ] = 1;
        if (worldY === 35 && worldX === 20) map[worldX][worldY][worldZ] = 7;
      }
    }
  }

  const printMap = function() {
    for (worldX = 0; worldX < 64; worldX++) {
      for (worldY = 0; worldY < 64; worldY++) {
        console.log(map[worldX][worldY].join(""));
      }
    }
  };

  // printMap();

  pixels = ctx.createImageData(w, h);

  for (i = 0; i < w * h; i++) {
    pixels.data[i * 4 + 3] = 255;
  }

  setInterval(clock, 1000 / 100);
}

// camera Pitch & Yaw
let playerYaw = Math.sin(0) + Math.PI / 2; // 7.855 // 6.2842036732 sin
let playerPitch = Math.cos(4.6);

// camera coords
let playerX = 32.5;
let playerY = 31.5;
let playerZ = 32.5;

function clock() {
  calculateMovement();
  renderMinecraft(playerX, playerY, playerZ, playerYaw, playerPitch);
  ctx.putImageData(pixels, 0, 0);
}

function calculateMovement() {
  if (keyState.forward) {
    playerX += Math.sin(playerYaw) / 10;
    playerZ += Math.cos(playerYaw) / 10;
  } else if (keyState.backward) {
    playerX -= Math.sin(playerYaw) / 10;
    playerZ -= Math.cos(playerYaw) / 10;
  }

  if (keyState.strafeLeft) {
    playerX += Math.sin(playerYaw - Math.PI / 2) / 10;
    playerZ += Math.cos(playerYaw - Math.PI / 2) / 10;
  } else if (keyState.strafeRight) {
    playerX -= Math.sin(playerYaw - Math.PI / 2) / 10;
    playerZ -= Math.cos(playerYaw - Math.PI / 2) / 10;
  }
}
