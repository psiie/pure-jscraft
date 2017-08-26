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
  if (playerPitch < -1.6) playerPitch = -1.6;
  if (playerPitch > 1.6) playerPitch = 1.6;
}

const keyState = {
  forward: false,
  backward: false,
  strafeLeft: false,
  strafeRight: false
};

document.addEventListener("keydown", event => {
  console.log(playerX | 0, playerY | 0, playerZ | 0);
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
