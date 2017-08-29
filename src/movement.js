const { BLOCKS, PLAYER_HEIGHT } = require("./constants");

const keyState = {
  forward: false,
  backward: false,
  strafeLeft: false,
  strafeRight: false
};

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

module.exports = {
  applyGravity: (player, map) => {
    const x = Math.floor(player.x);
    const y = Math.floor(player.y + PLAYER_HEIGHT + player.velocity);
    const z = Math.floor(player.z);
    const futurePosition = map[x][y][z];
    if (futurePosition === BLOCKS.AIR) {
      player.y += player.velocity;
      if (player.velocity < 3.0) player.velocity *= 1.025;
      if (player.velocity === 0) player.velocity = 0.1;
    } else {
      if (player.velocity) player.velocity = 0;
    }
  },

  calculateMovement: player => {
    if (keyState.forward) {
      player.x += Math.sin(player.yaw) * Math.cos(player.pitch) / 8;
      // player.y -= Math.sin(player.pitch) / 8;
      player.z += Math.cos(player.yaw) * Math.cos(player.pitch) / 8;
    } else if (keyState.backward) {
      player.x -= Math.sin(player.yaw) * Math.cos(player.pitch) / 8;
      // player.y += Math.sin(player.pitch) / 8;
      player.z -= Math.cos(player.yaw) * Math.cos(player.pitch) / 8;
    }

    if (keyState.strafeLeft) {
      player.x += Math.sin(player.yaw - Math.PI / 2) / 8;
      player.z += Math.cos(player.yaw - Math.PI / 2) / 8;
    } else if (keyState.strafeRight) {
      player.x -= Math.sin(player.yaw - Math.PI / 2) / 8;
      player.z -= Math.cos(player.yaw - Math.PI / 2) / 8;
    }
  },
  init: (player, map) => {
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

    function captureMouseCB() {
      var canvas = document.getElementById("game");
      canvas.requestPointerLock =
        canvas.requestPointerLock ||
        canvas.mozRequestPointerLock ||
        canvas.webkitRequestPointerLock;
      canvas.requestPointerLock();
    }

    function keyDownCB(event) {
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
    }

    function keyUpCB(event) {
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
    }

    function mouseClickCB(event) {
      if (event.button === 0) {
        const findSelectedBlock = function() {
          let rayX = player.x;
          let rayY = player.y;
          let rayZ = player.z;
          for (var i = 0; i < 6 * 1000; i++) {
            rayX += Math.sin(player.yaw) * Math.cos(player.pitch) / 1000;
            rayY -= Math.sin(player.pitch) / 1000;
            rayZ += Math.cos(player.yaw) * Math.cos(player.pitch) / 1000;
            if (map[rayX | 0][rayY | 0][rayZ | 0] > 0) {
              let currBlock = map[rayX | 0][rayY | 0][rayZ | 0];
              currBlock = (currBlock + 1) % 16;
              map[rayX | 0][rayY | 0][rayZ | 0] = currBlock || 1;
              break;
            }
          }
        };
        findSelectedBlock();
      }
    }

    document.addEventListener("pointerlockchange", changeCallback, false);
    document.addEventListener("mozpointerlockchange", changeCallback, false);
    document.addEventListener("webkitpointerlockchange", changeCallback, false);
    document.getElementById("game").addEventListener("click", captureMouseCB);

    document.addEventListener("keydown", keyDownCB);
    document.addEventListener("keyup", keyUpCB);
    document.addEventListener("click", mouseClickCB);
  }
};
