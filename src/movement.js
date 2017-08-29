const { BLOCKS, PLAYER_HEIGHT, GRAVITY } = require("./constants");

const keyState = {
  forward: false,
  backward: false,
  strafeLeft: false,
  strafeRight: false,
  jump: false
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
    // console.log(player.velocity);
    const x = Math.floor(player.x);
    const y1 = Math.floor(player.y + PLAYER_HEIGHT + player.velocity);
    const y2 = Math.floor(player.y - PLAYER_HEIGHT + player.velocity);
    const z = Math.floor(player.z);
    const feet = map[x | 0][y1 | 0][z | 0];
    const head = map[x | 0][y2 | 0][z | 0];

    // Already falling
    if (player.velocity > 0) {
      // can still fall
      if (feet === BLOCKS.AIR) {
        player.y += player.velocity;
        player.velocity *= GRAVITY.CONSTANT;
        // done falling
      } else {
        player.velocity = 0;
      }
      // need to start falling
    } else if (player.velocity === 0 && feet === BLOCKS.AIR) {
      player.velocity = GRAVITY.START_VELOCITY;
      // jumping
    } else if (player.velocity < 0) {
      // Float division fix
      if (player.velocity.toFixed(3) > -0.005)
        player.velocity = GRAVITY.START_VELOCITY;
      // Only jump if headspace is clear
      if (head === BLOCKS.AIR) {
        player.y += player.velocity;
        player.velocity /= GRAVITY.JUMP_DECAY;
      }
    }
    if (keyState.jump) {
      keyState.jump = false;
      player.velocity = -1.8;
    }
  },

  calculateMovement: player => {
    if (keyState.forward) {
      player.x += Math.sin(player.yaw) * Math.cos(player.pitch) / 8;
      player.z += Math.cos(player.yaw) * Math.cos(player.pitch) / 8;
      // player.y -= Math.sin(player.pitch) / 8;
    } else if (keyState.backward) {
      player.x -= Math.sin(player.yaw) * Math.cos(player.pitch) / 8;
      player.z -= Math.cos(player.yaw) * Math.cos(player.pitch) / 8;
      // player.y += Math.sin(player.pitch) / 8;
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
        case 32:
          keyState.jump = true;
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
