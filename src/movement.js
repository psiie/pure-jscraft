module.exports = {
  calculateMovement: (() => {
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
    return calculateMovement;
  })()
};
