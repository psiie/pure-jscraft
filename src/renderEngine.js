module.exports = {
  render: function({
    map,
    texmap,
    pixels,
    w,
    h,
    playerX,
    playerY,
    playerZ,
    playerYaw,
    playerPitch
  }) {
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        function setPixelColor() {
          // 144 238 255
          let r = ((col >> 16) & 0xff) * brightness * fogDistance / (255 * 255);
          let g = ((col >> 8) & 0xff) * brightness * fogDistance / (255 * 255);
          let b = (col & 0xff) * brightness * fogDistance / (255 * 255);

          // blue fog effect
          r += (1 - fogDistance / 210) * 144;
          g += (1 - fogDistance / 210) * 238;
          b += (1 - fogDistance / 210) * 255;

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
        const worldyd = (y - h / 2) / h;
        const worldzd = 1;
        const worldxd = (x - w / 2) / h;
        const worldyd_ = worldzd * yCos + worldyd * ySin;

        const rotxd = worldyd * yCos - worldzd * ySin;
        const rotyd = worldxd * xCos + worldyd_ * xSin;
        const rotzd = worldyd_ * xCos - worldxd * xSin;

        // declare variables. Initial states are simply for notes
        let col = 0;
        let brightness = 255;
        let fogDistance = 0;

        // render distance
        let renderDistance = 32;

        // Ray cast for each dimension
        for (let dimension = 0; dimension < 3; dimension++) {
          // rotyd === -0.5-1.5 . Straight forward 1.0
          let dimLength = rotyd;
          if (dimension == 1) dimLength = rotxd;
          if (dimension == 2) dimLength = rotzd;

          // 11 === 2-0.65
          const ll = 1 / Math.abs(dimLength);
          const xd = rotyd * ll; // 1
          const yz = rotxd * ll; // 7
          const zd = rotzd * ll; // -pi-pi

          // initial is a block offset. where in the block the person is. 0-1
          let initial = playerX - (playerX | 0);
          if (dimension == 1) initial = playerY - (playerY | 0);
          if (dimension == 2) initial = playerZ - (playerZ | 0);
          if (dimLength > 0) initial = 1 - initial;

          /* where to start/stop rendering. Faces offset when wrong */
          let xp = playerX + xd * initial;
          let yp = playerY + yz * initial;
          let zp = playerZ + zd * initial;

          // faces go missing in certain cardinal directions when not subtracted
          if (dimLength < 0) {
            if (dimension === 0) xp--;
            if (dimension === 1) yp--;
            if (dimension === 2) zp--;
          }

          // the ray
          let distance = ll * initial; // distance === 0-2
          while (distance < renderDistance) {
            let texture = map[xp & 63][yp & 63][zp & 63];
            if (zp > 64 || yp > 64 || xp > 64 || zp < 0 || yp < 0 || xp < 0) {
              texture = 0; // Only render the 64x64x64 cube. Dont loop
            }

            // if not an air block
            if (texture > 0) {
              let u = ((xp + zp) * 16) & 15;
              let v = ((yp * 16) & 15) + 16;

              // if top dimension of block
              if (dimension == 1) {
                u = (xp * 16) & 15;
                v = (zp * 16) & 15;
                if (yz < 0) v += 32;
              }

              const cc = texmap[u + v * 16 + texture * 256 * 3];
              if (cc > 0) {
                col = cc;
                fogDistance = 255 - ((distance / 32 * 255) | 0);
                // fogDistance = 255 - ((distance / 32 * 0) | 0);
                brightness = 255 * (255 - (dimension + 2) % 3 * 50) / 255;
                renderDistance = distance;
              }
            }
            xp += xd;
            yp += yz;
            zp += zd;
            distance += ll;
          }
        }

        setPixelColor();
        // Function.prototype.call(this, setPixelColor);
      }
    }
  }
};
