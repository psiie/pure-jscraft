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

  playerYaw = (playerYaw + movementX / 500) % 7.855;
  playerPitch = playerPitch - movementY / 1000;
  if (playerPitch < -Math.PI / 2) playerPitch = -Math.PI / 2;
  if (playerPitch > Math.PI / 2) playerPitch = Math.PI / 2;
}

const keyState = {
  forward: false,
  backward: false,
  strafeLeft: false,
  strafeRight: false
};

document.addEventListener("keydown", event => {
  // console.log(playerX | 0, playerY | 0, playerZ | 0);
  // console.log(
  //   playerYaw,
  //   Math.sin(playerYaw),
  //   Math.cos(playerYaw),
  //   Math.sin(playerPitch)
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
    // console.log(playerX, playerY, playerZ);
    // console.log(Math.sin(playerPitch), Math.sin(playerYaw));

    const findSelectedBlock = function() {
      let rayX = playerX;
      let rayY = playerY;
      let rayZ = playerZ;
      // let rayPitch = playerPitch;
      // let rayYaw = playerYaw;
      // console.log(rayPitch, rayYaw);
      // console.log(rayX | 0, rayY | 0, rayZ | 0);
      for (var i = 0; i < 6 * 1000; i++) {
        rayX += Math.sin(playerYaw) * Math.cos(playerPitch) / 1000;
        rayY -= Math.sin(playerPitch) / 1000;
        rayZ += Math.cos(playerYaw) * Math.cos(playerPitch) / 1000;
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

// playerX += Math.sin(playerYaw) / 8;
// playerY -= Math.sin(playerPitch) / 8;
// playerZ += Math.cos(playerYaw) / 8;
