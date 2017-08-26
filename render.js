/* ------------------------- 
|       Render Engine      |
------------------------- */

function renderMinecraft(playerX, playerY, playerZ, playerYaw, playerPitch) {
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      function setPixelColor() {
        let r = ((col >> 16) & 0xff) * brightness * fogDistance / (255 * 255);
        let g = ((col >> 8) & 0xff) * brightness * fogDistance / (255 * 255);
        let b = (col & 0xff) * brightness * fogDistance / (255 * 255);

        // Sky color 144 238 255
        pixels.data[(x + y * w) * 4 + 0] = r || 144;
        pixels.data[(x + y * w) * 4 + 1] = g || 238;
        pixels.data[(x + y * w) * 4 + 2] = b || 255;
      }

      // calculate camera rotation
      const yCos = Math.cos(playerPitch);
      const ySin = Math.sin(playerPitch);
      const xCos = Math.cos(playerYaw);
      const xSin = Math.sin(playerYaw);

      // pixel maths
      const __yFace = (y - h / 2) / h;
      const __zFace = 1;
      const ___xFace = (x - w / 2) / h;
      const ___zFace = __zFace * yCos + __yFace * ySin;
      const _yFace = __yFace * yCos - __zFace * ySin;
      const _xFace = ___xFace * xCos + ___zFace * xSin;
      const _zFace = ___zFace * xCos - ___xFace * xSin;

      // declare variables. Initial states are simply for notes
      let col = 0;
      let brightness = 255;
      let fogDistance = 0;

      // render distance
      let closest = 32;

      // render each of the 3 visible faces
      for (let face = 0; face < 3; face++) {
        let dimentionLength = _xFace;
        if (face == 1) dimentionLength = _yFace;
        if (face == 2) dimentionLength = _zFace;

        const ll =
          1 / (dimentionLength < 0 ? -dimentionLength : dimentionLength);
        const xFace = _xFace * ll;
        const yFace = _yFace * ll;
        const zFace = _zFace * ll;

        let initial = playerX - (playerX | 0);
        if (face == 1) initial = playerY - (playerY | 0);
        if (face == 2) initial = playerZ - (playerZ | 0);
        if (dimentionLength > 0) initial = 1 - initial;

        let distance = ll * initial;

        let xp = playerX + xFace * initial;
        let yp = playerY + yFace * initial;
        let zp = playerZ + zFace * initial;

        if (dimentionLength < 0) {
          if (face === 0) xp--;
          if (face === 1) yp--;
          if (face === 2) zp--;
        }

        // While we havn't hit the render limit, keep rendering
        while (distance < closest) {
          // var tex = map[(zp & 63) << 12 | (yp & 63) << 6 | (xp & 63)];
          let texture = map[zp & 63][yp & 63][xp & 63];
          if (zp > 64 || yp > 64 || xp > 64 || zp < 1 || yp < 1 || xp < 1) {
            texture = 0;
          }

          if (texture > 0) {
            let u = ((xp + zp) * 16) & 15;
            let v = ((yp * 16) & 15) + 16;

            // if top face of block
            if (face == 1) {
              u = (xp * 16) & 15;
              v = (zp * 16) & 15;
              if (yFace < 0) v += 32;
            }

            const cc = texmap[u + v * 16 + texture * 256 * 3];
            if (cc > 0) {
              col = cc;
              // fogDistance = 255 - ((distance / 32 * 255) | 0);
              fogDistance = 255 - ((distance / 32 * 0) | 0);
              brightness = 255 * (255 - (face + 2) % 3 * 50) / 255;
              closest = distance;
            }
          }
          xp += xFace;
          yp += yFace;
          zp += zFace;
          distance += ll;
        }
      }

      setPixelColor();
    }
  }
}
