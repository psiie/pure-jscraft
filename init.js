function init() {
  ctx = document.getElementById("game").getContext("2d");

  const randBlock = function() {
    const pick = (Math.random() * 16) | 0;
    return pick;
  };

  const perlinLandGen = function() {
    const pn = new Perlin("fjlakj3kn4kj9uvd98vf");
    const heightMap = new Array(64);
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
    console.log(heightMap);

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

    console.log("done setting perlin");
  };
  // for (worldX = 0; worldX < 64; worldX++) {
  //   for (worldY = 0; worldY < 64; worldY++) {
  //     for (worldZ = 0; worldZ < 64; worldZ++) {
  //       // if (worldY === 36) map[worldX][worldY][worldZ] = 1;

  //       let pnHeight = pn.noise(worldX / 64, worldY / 64, 0.5);
  //       pnHeight *= 32;
  //       pnHeight += 20;
  //       if (worldY === (pnHeight | 0)) {
  //         console.log("yes");
  //         map[worldX][worldY][worldZ] = 1;
  //       }
  //     }
  //   }
  // }
  perlinLandGen();
  // map[35][35][32] = 3;
  // map[35][34][32] = 4;
  // map[35][33][32] = 5;
  // map[35][32][32] = 6;

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
    playerX += Math.sin(playerYaw) * Math.cos(playerPitch) / 8;
    playerY -= Math.sin(playerPitch) / 8;
    playerZ += Math.cos(playerYaw) * Math.cos(playerPitch) / 8;
  } else if (keyState.backward) {
    playerX -= Math.sin(playerYaw) * Math.cos(playerPitch) / 8;
    playerY += Math.sin(playerPitch) / 8;
    playerZ -= Math.cos(playerYaw) * Math.cos(playerPitch) / 8;
  }

  if (keyState.strafeLeft) {
    playerX += Math.sin(playerYaw - Math.PI / 2) / 8;
    playerZ += Math.cos(playerYaw - Math.PI / 2) / 8;
  } else if (keyState.strafeRight) {
    playerX -= Math.sin(playerYaw - Math.PI / 2) / 8;
    playerZ -= Math.cos(playerYaw - Math.PI / 2) / 8;
  }
}
