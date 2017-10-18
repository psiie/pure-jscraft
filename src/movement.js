const { BLOCKS, PLAYER_HEIGHT, GRAVITY } = require("./constants");

const keyState = {
  forward: false,
  backward: false,
  strafeLeft: false,
  strafeRight: false,
  jump: false,
  jumping: false
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
    const x = player.x;
    const y = player.y + 2;
    const z = player.z;
    const feet = map[x | 0][y | 0][z | 0];

    if (keyState.jump && feet > 0) {
      player.velocity = -GRAVITY.JUMP_STR;
      keyState.jumping = true;
    }
    if (keyState.jumping) {
      player.velocity +=
        player.velocity + (GRAVITY.JUMP_STR + GRAVITY.JUMP_STR_AMP);
      if (player.velocity > 0) {
        player.velocity = 0;
        keyState.jumping = false;
      }

      if (map[x | 0][(player.y + player.velocity) | 0][z | 0] === 0) {
        player.y += player.velocity; // check that next position is safe
      }
    }

    if (keyState.jumping === true) return; // guard - Either jumping (above) or falling (below)

    if (feet === 0) {
      // jumping
      if (player.velocity < 3) player.velocity += 0.1; // if not at terminal velocity, increase velocity
      if (map[x | 0][(player.y + 0.1 * player.velocity) | 0][z | 0] === 0) {
        // check that next position is safe
        player.y += 0.1 * player.velocity;
      }
    } else {
      // we hit the ground. stop velocity
      player.velocity = 0;
    }
  },

  calculateMovement: (player, map) => {
    function collisionCheck(x, y, z) {
      const inBlock = map[x | 0][y | 0][z | 0];
      if (inBlock === 0) {
        player.x = x;
        player.z = z;
      } else {
        const inBlockX = map[x | 0][y | 0][player.z | 0];
        const inBlockZ = map[player.x | 0][y | 0][z | 0];
        if (inBlockX === 0) player.x = x;
        else if (inBlockZ === 0) player.z = z;
      }
    }

    // detect collision via cube instead of exact coord.
    if (
      keyState.forward ||
      keyState.backward ||
      keyState.strafeLeft ||
      keyState.strafeRight
    ) {
      let x = player.x;
      let y = player.y + PLAYER_HEIGHT;
      let z = player.z;
      if (keyState.forward) {
        x += Math.sin(player.yaw) / 8;
        z += Math.cos(player.yaw) / 8;
      } else if (keyState.backward) {
        x -= Math.sin(player.yaw) / 8;
        z -= Math.cos(player.yaw) / 8;
      }
      if (keyState.strafeLeft) {
        x += Math.sin(player.yaw - Math.PI / 2) / 8;
        z += Math.cos(player.yaw - Math.PI / 2) / 8;
      } else if (keyState.strafeRight) {
        x -= Math.sin(player.yaw - Math.PI / 2) / 8;
        z -= Math.cos(player.yaw - Math.PI / 2) / 8;
      }
      collisionCheck(x, y, z);
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
        case 32:
          keyState.jump = false;
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
