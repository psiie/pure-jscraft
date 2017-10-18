module.exports = () => {
  const texmap = new Array(16 * 16 * 3 * 16);
  for (let i = 1; i < 16; i++) {
    let br = 255 - ((Math.random() * 96) | 0);
    for (let y = 0; y < 16 * 3; y++) {
      for (let x = 0; x < 16; x++) {
        let color = 0x966c4a;
        if (i == 4) color = 0x7f7f7f;
        if (i != 4 || ((Math.random() * 3) | 0) === 0) {
          br = 255 - ((Math.random() * 96) | 0);
        }
        if (i == 1 && y < (((x * x * 3 + x * 81) >> 2) & 3) + 18) {
          color = 0x6aaa40;
        } else if (i == 1 && y < (((x * x * 3 + x * 81) >> 2) & 3) + 19) {
          br = br * 2 / 3;
        }
        if (i == 7) {
          color = 0x675231;
          if (x > 0 && x < 15 && ((y > 0 && y < 15) || (y > 32 && y < 47))) {
            color = 0xbc9862;
            let xd = x - 7;
            let yd = (y & 15) - 7;
            if (xd < 0) xd = 1 - xd;
            if (yd < 0) yd = 1 - yd;
            if (yd > xd) xd = yd;

            br = 196 - ((Math.random() * 32) | 0) + xd % 3 * 32;
          } else if (((Math.random() * 2) | 0) === 0) {
            br = br * (150 - (x & 1) * 100) / 100;
          }
        }

        if (i == 5) {
          color = 0xb53a15;
          if ((x + (y >> 2) * 4) % 8 === 0 || y % 4 === 0) {
            color = 0xbcafa5;
          }
        }
        if (i == 9) {
          color = 0x4040ff;
        }
        let brr = br;
        if (y >= 32) brr /= 2;

        if (i == 8) {
          color = 0x50d937;
          if (((Math.random() * 2) | 0) === 0) {
            color = 0;
            brr = 255;
          }
        }

        let col =
          ((((color >> 16) & 0xff) * brr / 255) << 16) |
          ((((color >> 8) & 0xff) * brr / 255) << 8) |
          ((color & 0xff) * brr / 255);
        texmap[x + y * 16 + i * 256 * 3] = col;
      }
    }
  }

  return texmap;
}