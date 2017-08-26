var ctx;
var pixels;

var w = 320;
var h = 240;

var map = (() => {
  const dim1 = [];
  for (let i = 0; i < 64; i++)
    dim1.push(0);
  const dim2 = dim1.slice();
  for (let i = 0; i < 64; i++)
    dim2[i] = dim1.slice();
  const dim3 = dim1.slice();
  for (let i = 0; i < 64; i++)
    dim3[i] = dim2.slice();
  return dim3.slice();
})();
// var map = new Array(64 * 64 * 64);
var texmap = new Array(16 * 16 * 3 * 16);

init();
