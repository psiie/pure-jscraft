/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(1);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Perlin from "./vendor/perlin.js";
var _require = __webpack_require__(6),
    Perlin = _require.Perlin;

var ctx;
var pixels;

var w = 320;
var h = 240;

var map = function () {
  /* using JSON string/parse for deep cloning. Array.slice(0) doesn't 
  seem to play well. It ends up linking */
  var dim1 = [];
  for (var _i = 0; _i < 64; _i++) {
    dim1.push(0);
  }var dim2 = dim1.slice();
  for (var _i2 = 0; _i2 < 64; _i2++) {
    dim2[_i2] = JSON.parse(JSON.stringify(dim1));
  }var dim3 = dim2.slice();
  for (var _i3 = 0; _i3 < 64; _i3++) {
    dim3[_i3] = JSON.parse(JSON.stringify(dim2));
  }return dim3;
}();

var texmap = new Array(16 * 16 * 3 * 16);

init();

function init() {
  ctx = document.getElementById("game").getContext("2d");

  var randBlock = function randBlock() {
    var pick = Math.random() * 16 | 0;
    return pick;
  };

  var perlinLandGen = function perlinLandGen() {
    var pn = new Perlin("fjlakj3kn4kj9uvd98vf");
    var heightMap = new Array(64);
    // generate height map
    for (var _x = 0; _x < 64; _x++) {
      heightMap[_x] = new Array(64);
      for (var z = 0; z < 64; z++) {
        var height = pn.noise(_x / 15, z / 15, Math.PI);
        height *= 32;
        height += 32;
        height = Math.floor(height);
        heightMap[_x][z] = height;
      }
    }

    // map height map to map
    for (var _x2 = 0; _x2 < 64; _x2++) {
      for (var _z = 0; _z < 64; _z++) {
        var mHeight = heightMap[_x2][_z];
        map[_x2][mHeight][_z] = 1;
        // water fill 9
        for (var _y = mHeight - 1; _y > 50; _y--) {
          map[_x2][_y][_z] = 9;
        }

        // underground fill
        for (var _y2 = mHeight + 1; _y2 < 64; _y2++) {
          map[_x2][_y2][_z] = 4;
        }
      }
    }
  };

  perlinLandGen();

  pixels = ctx.createImageData(w, h);

  for (i = 0; i < w * h; i++) {
    pixels.data[i * 4 + 3] = 255;
  }

  setInterval(clock, 1000 / 100);
}

// camera Pitch & Yaw
var playerYaw = Math.sin(0) + Math.PI / 2; // 7.855 // 6.2842036732 sin
var playerPitch = Math.cos(4.6);

// camera coords
var playerX = 32.5;
var playerY = 31.5;
var playerZ = 32.5;

function clock() {
  calculateMovement();
  renderMinecraft(playerX, playerY, playerZ, playerYaw, playerPitch);
  ctx.putImageData(pixels, 0, 0);
}

function calculateMovement() {
  if (keyState.forward) {
    playerX += Math.sin(playerYaw) * Math.cos(playerPitch) / 8;
    playerY -= Math.sin(playerPitch) / 8;
    playerZ += Math.cos(playerYaw) * Math.cos(playerPitch) / 8;
  } else if (keyState.backward) {
    playerX -= Math.sin(playerYaw) * Math.cos(playerPitch) / 8;
    playerY += Math.sin(playerPitch) / 8;
    playerZ -= Math.cos(playerYaw) * Math.cos(playerPitch) / 8;
  }

  if (keyState.strafeLeft) {
    playerX += Math.sin(playerYaw - Math.PI / 2) / 8;
    playerZ += Math.cos(playerYaw - Math.PI / 2) / 8;
  } else if (keyState.strafeRight) {
    playerX -= Math.sin(playerYaw - Math.PI / 2) / 8;
    playerZ -= Math.cos(playerYaw - Math.PI / 2) / 8;
  }
}

document.addEventListener("pointerlockchange", changeCallback, false);
document.addEventListener("mozpointerlockchange", changeCallback, false);
document.addEventListener("webkitpointerlockchange", changeCallback, false);

document.getElementById("game").addEventListener("click", function () {
  var canvas = document.getElementById("game");
  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
  canvas.requestPointerLock();
});

function changeCallback(e) {
  var canvas = document.getElementById("game");
  var havePointer = document.pointerLockElement === canvas || document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas;
  if (havePointer) {
    document.addEventListener("mousemove", moveCallback, false);
  } else {
    document.removeEventListener("mousemove", moveCallback, false);
  }
}

function moveCallback(event) {
  var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;

  var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

  playerYaw = (playerYaw + movementX / 500) % 7.855;
  playerPitch = playerPitch - movementY / 1000;
  if (playerPitch < -Math.PI / 2) playerPitch = -Math.PI / 2;
  if (playerPitch > Math.PI / 2) playerPitch = Math.PI / 2;
}

var keyState = {
  forward: false,
  backward: false,
  strafeLeft: false,
  strafeRight: false
};

document.addEventListener("keydown", function (event) {
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

document.addEventListener("keyup", function (event) {
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

document.addEventListener("click", function (event) {
  if (event.button === 0) {
    // console.log(playerX, playerY, playerZ);
    // console.log(Math.sin(playerPitch), Math.sin(playerYaw));

    var findSelectedBlock = function findSelectedBlock() {
      var rayX = playerX;
      var rayY = playerY;
      var rayZ = playerZ;
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
          var currBlock = map[rayX | 0][rayY | 0][rayZ | 0];
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

/* ------------------------- 
|       Render Engine      |
------------------------- */

var debounceLogging = false;
function debounceLog(msg) {
  if (debounceLogging === false) {
    debounceLogging = true;
    console.log(msg);
    setTimeout(function () {
      debounceLogging = false;
    }, 500);
  }
}

function renderMinecraft(playerX, playerY, playerZ, playerYaw, playerPitch) {
  var _loop = function _loop(_x3) {
    var _loop2 = function _loop2(_y3) {
      function setPixelColor() {
        // 144 238 255
        var r = (col >> 16 & 0xff) * brightness * fogDistance / (255 * 255);
        var g = (col >> 8 & 0xff) * brightness * fogDistance / (255 * 255);
        var b = (col & 0xff) * brightness * fogDistance / (255 * 255);

        // blue fog effect
        r += (1 - fogDistance / 210 / 2) * 144;
        g += (1 - fogDistance / 210 / 2) * 238;
        b += (1 - fogDistance / 210 / 2) * 255;

        // Sky color 144 238 255
        pixels.data[(_x3 + _y3 * w) * 4 + 0] = r || 144;
        pixels.data[(_x3 + _y3 * w) * 4 + 1] = g || 238;
        pixels.data[(_x3 + _y3 * w) * 4 + 2] = b || 255;
      }

      // calculate camera rotation
      var yCos = Math.cos(playerPitch);
      var ySin = Math.sin(playerPitch);
      var xCos = Math.cos(playerYaw);
      var xSin = Math.sin(playerYaw);

      // pixel maths
      var worldyd = (_y3 - h / 2) / h;
      var worldzd = 1;
      var worldxd = (_x3 - w / 2) / h;
      var worldyd_ = worldzd * yCos + worldyd * ySin;

      var rotxd = worldyd * yCos - worldzd * ySin;
      var rotyd = worldxd * xCos + worldyd_ * xSin;
      var rotzd = worldyd_ * xCos - worldxd * xSin;

      // declare variables. Initial states are simply for notes
      var col = 0;
      var brightness = 255;
      var fogDistance = 0;

      // render distance
      var renderDistance = 32;

      // Ray cast for each dimension
      for (var dimension = 0; dimension < 3; dimension++) {
        // rotyd === -0.5-1.5 . Straight forward 1.0
        var dimLength = rotyd;
        if (dimension == 1) dimLength = rotxd;
        if (dimension == 2) dimLength = rotzd;

        // 11 === 2-0.65
        var ll = 1 / Math.abs(dimLength);
        var _xd = rotyd * ll; // 1
        var yz = rotxd * ll; // 7
        var zd = rotzd * ll; // -pi-pi

        // initial is a block offset. where in the block the person is. 0-1
        var initial = playerX - (playerX | 0);
        if (dimension == 1) initial = playerY - (playerY | 0);
        if (dimension == 2) initial = playerZ - (playerZ | 0);
        if (dimLength > 0) initial = 1 - initial;

        /* where to start/stop rendering. Faces offset when wrong */
        var xp = playerX + _xd * initial;
        var yp = playerY + yz * initial;
        var zp = playerZ + zd * initial;

        // faces go missing in certain cardinal directions when not subtracted
        if (dimLength < 0) {
          if (dimension === 0) xp--;
          if (dimension === 1) yp--;
          if (dimension === 2) zp--;
        }

        // the ray
        var distance = ll * initial; // distance === 0-2
        while (distance < renderDistance) {
          var texture = map[xp & 63][yp & 63][zp & 63];
          if (zp > 64 || yp > 64 || xp > 64 || zp < 0 || yp < 0 || xp < 0) {
            texture = 0; // Only render the 64x64x64 cube. Dont loop
          }

          // if not an air block
          if (texture > 0) {
            var u = (xp + zp) * 16 & 15;
            var v = (yp * 16 & 15) + 16;

            // if top dimension of block
            if (dimension == 1) {
              u = xp * 16 & 15;
              v = zp * 16 & 15;
              if (yz < 0) v += 32;
            }

            var cc = texmap[u + v * 16 + texture * 256 * 3];
            if (cc > 0) {
              col = cc;
              fogDistance = 255 - (distance / 32 * 255 | 0);
              // fogDistance = 255 - ((distance / 32 * 0) | 0);
              brightness = 255 * (255 - (dimension + 2) % 3 * 50) / 255;
              renderDistance = distance;
            }
          }
          xp += _xd;
          yp += yz;
          zp += zd;
          distance += ll;
        }
      }

      setPixelColor();
    };

    for (var _y3 = 0; _y3 < h; _y3++) {
      _loop2(_y3);
    }
  };

  for (var _x3 = 0; _x3 < w; _x3++) {
    _loop(_x3);
  }
}

for (var i = 1; i < 16; i++) {
  var br = 255 - (Math.random() * 96 | 0);
  for (var y = 0; y < 16 * 3; y++) {
    for (var x = 0; x < 16; x++) {
      var color = 0x966c4a;
      if (i == 4) color = 0x7f7f7f;
      if (i != 4 || (Math.random() * 3 | 0) === 0) {
        br = 255 - (Math.random() * 96 | 0);
      }
      if (i == 1 && y < (x * x * 3 + x * 81 >> 2 & 3) + 18) {
        color = 0x6aaa40;
      } else if (i == 1 && y < (x * x * 3 + x * 81 >> 2 & 3) + 19) {
        br = br * 2 / 3;
      }
      if (i == 7) {
        color = 0x675231;
        if (x > 0 && x < 15 && (y > 0 && y < 15 || y > 32 && y < 47)) {
          color = 0xbc9862;
          var xd = x - 7;
          var yd = (y & 15) - 7;
          if (xd < 0) xd = 1 - xd;
          if (yd < 0) yd = 1 - yd;
          if (yd > xd) xd = yd;

          br = 196 - (Math.random() * 32 | 0) + xd % 3 * 32;
        } else if ((Math.random() * 2 | 0) === 0) {
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
      var brr = br;
      if (y >= 32) brr /= 2;

      if (i == 8) {
        color = 0x50d937;
        if ((Math.random() * 2 | 0) === 0) {
          color = 0;
          brr = 255;
        }
      }

      var col = (color >> 16 & 0xff) * brr / 255 << 16 | (color >> 8 & 0xff) * brr / 255 << 8 | (color & 0xff) * brr / 255;
      texmap[x + y * 16 + i * 256 * 3] = col;
    }
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./index.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "body { background-color: #DDDDDD; font: 30px sans-serif; }\ncanvas, img {\n    image-rendering: optimizeSpeed;\n    image-rendering: -moz-crisp-edges;\n    image-rendering: -webkit-optimize-contrast;\n    image-rendering: optimize-contrast;\n    -ms-interpolation-mode: nearest-neighbor;\n    width:640px;\n    height:480px;\n}\n.hidden {\n  display: none;\n}\n\n.crosshair {\n  background-color: red;\n  width: 5px;\n  height: 5px;\n  display: inline-block;\n  position: absolute;\n  top: 240px;\n  left: 320px;\n}", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// This is fugly as hell. I simply cut, pasted, and wrapped it with
// a simple interface. Sorry! -wwwtyro
// https://github.com/wwwtyro/perlin.js

function Perlin(seed) {
  // Alea random number generator.
  //----------------------------------------------------------------------------//

  // From http://baagoe.com/en/RandomMusings/javascript/
  function Alea() {
    return function (args) {
      // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      if (args.length == 0) {
        args = [+new Date()];
      }
      var mash = Mash();
      s0 = mash(" ");
      s1 = mash(" ");
      s2 = mash(" ");

      for (var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function random() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function () {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function () {
        return random() + (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = "Alea 0.9";
      random.args = args;
      return random;
    }(Array.prototype.slice.call(arguments));
  }

  // From http://baagoe.com/en/RandomMusings/javascript/
  // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
  function Mash() {
    var n = 0xefc8249d;

    var mash = function mash(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = "Mash 0.9";
    return mash;
  }

  // Simplex perlin noise.
  //----------------------------------------------------------------------------//

  // Ported from Stefan Gustavson's java implementation
  // http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
  // Read Stefan's excellent paper for details on how this code works.
  //
  // Sean McCullough banksean@gmail.com

  /**
     * You can pass in a random number generator object if you like.
     * It is assumed to have a random() method.
     */
  var SimplexNoise = function SimplexNoise(r) {
    if (r == undefined) r = Math;
    this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
    this.p = [];
    for (var i = 0; i < 256; i++) {
      this.p[i] = Math.floor(r.random() * 256);
    }
    // To remove the need for index wrapping, double the permutation table length
    this.perm = [];
    for (var i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }

    // A lookup table to traverse the simplex around a given point in 4D.
    // Details can be found where this table is used, in the 4D noise method.
    this.simplex = [[0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0], [0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0], [1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0], [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]];
  };

  SimplexNoise.prototype.dot = function (g, x, y) {
    return g[0] * x + g[1] * y;
  };

  SimplexNoise.prototype.noise = function (xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    var s = (xin + yin) * F2; // Hairy factor for 2D
    var i = Math.floor(xin + s);
    var j = Math.floor(yin + s);
    var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    var t = (i + j) * G2;
    var X0 = i - t; // Unskew the cell origin back to (x,y) space
    var Y0 = j - t;
    var x0 = xin - X0; // The x,y distances from the cell origin
    var y0 = yin - Y0;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1 = 0;
      j1 = 1;
    } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1.0 + 2.0 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    var ii = i & 255;
    var jj = j & 255;
    var gi0 = this.perm[ii + this.perm[jj]] % 12;
    var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0.0;else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0); // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0.0;else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
    }
    var t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0.0;else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70.0 * (n0 + n1 + n2);
  };

  // 3D simplex noise
  SimplexNoise.prototype.noise3d = function (xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners
    // Skew the input space to determine which simplex cell we're in
    var F3 = 1.0 / 3.0;
    var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
    var i = Math.floor(xin + s);
    var j = Math.floor(yin + s);
    var k = Math.floor(zin + s);
    var G3 = 1.0 / 6.0; // Very nice and simple unskew factor, too
    var t = (i + j + k) * G3;
    var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
    var Y0 = j - t;
    var Z0 = k - t;
    var x0 = xin - X0; // The x,y,z distances from the cell origin
    var y0 = yin - Y0;
    var z0 = zin - Z0;
    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        // X Y Z order
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        // X Z Y order
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } // Z X Y order
    } else {
      // x0<y0
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else if (x0 < z0) {
        // Z Y X order
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else {
        // Y Z X order
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } // Y X Z order
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;
    var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
    var y2 = y0 - j2 + 2.0 * G3;
    var z2 = z0 - k2 + 2.0 * G3;
    var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
    var y3 = y0 - 1.0 + 3.0 * G3;
    var z3 = z0 - 1.0 + 3.0 * G3;
    // Work out the hashed gradient indices of the four simplex corners
    var ii = i & 255;
    var jj = j & 255;
    var kk = k & 255;
    var gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
    var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
    var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
    var gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0.0;else {
      t0 *= t0;
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
    }
    var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0.0;else {
      t1 *= t1;
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
    }
    var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0.0;else {
      t2 *= t2;
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
    }
    var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0.0;else {
      t3 *= t3;
      n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]
    return 32.0 * (n0 + n1 + n2 + n3);
  };

  // Classic Perlin noise, 3D version
  //----------------------------------------------------------------------------//

  var ClassicalNoise = function ClassicalNoise(r) {
    // Classic Perlin noise in 3D, for comparison
    if (r == undefined) r = Math;
    this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
    this.p = [];
    for (var i = 0; i < 256; i++) {
      this.p[i] = Math.floor(r.random() * 256);
    }
    // To remove the need for index wrapping, double the permutation table length
    this.perm = [];
    for (var i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
  };

  ClassicalNoise.prototype.dot = function (g, x, y, z) {
    return g[0] * x + g[1] * y + g[2] * z;
  };

  ClassicalNoise.prototype.mix = function (a, b, t) {
    return (1.0 - t) * a + t * b;
  };

  ClassicalNoise.prototype.fade = function (t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  };

  ClassicalNoise.prototype.noise = function (x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x);
    var Y = Math.floor(y);
    var Z = Math.floor(z);

    // Get relative xyz coordinates of point within that cell
    x = x - X;
    y = y - Y;
    z = z - Z;

    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255;
    Y = Y & 255;
    Z = Z & 255;

    // Calculate a set of eight hashed gradient indices
    var gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
    var gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
    var gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
    var gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
    var gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
    var gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
    var gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
    var gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

    // The gradients of each corner are now:
    // g000 = grad3[gi000];
    // g001 = grad3[gi001];
    // g010 = grad3[gi010];
    // g011 = grad3[gi011];
    // g100 = grad3[gi100];
    // g101 = grad3[gi101];
    // g110 = grad3[gi110];
    // g111 = grad3[gi111];
    // Calculate noise contributions from each of the eight corners
    var n000 = this.dot(this.grad3[gi000], x, y, z);
    var n100 = this.dot(this.grad3[gi100], x - 1, y, z);
    var n010 = this.dot(this.grad3[gi010], x, y - 1, z);
    var n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z);
    var n001 = this.dot(this.grad3[gi001], x, y, z - 1);
    var n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1);
    var n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1);
    var n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1);
    // Compute the fade curve value for each of x, y, z
    var u = this.fade(x);
    var v = this.fade(y);
    var w = this.fade(z);
    // Interpolate along x the contributions from each of the corners
    var nx00 = this.mix(n000, n100, u);
    var nx01 = this.mix(n001, n101, u);
    var nx10 = this.mix(n010, n110, u);
    var nx11 = this.mix(n011, n111, u);
    // Interpolate the four results along y
    var nxy0 = this.mix(nx00, nx10, v);
    var nxy1 = this.mix(nx01, nx11, v);
    // Interpolate the two last results along z
    var nxyz = this.mix(nxy0, nxy1, w);

    return nxyz;
  };

  //----------------------------------------------------------------------------//

  var rand = {};
  rand.random = new Alea(seed);
  var noise = new ClassicalNoise(rand);

  this.noise = function (x, y, z) {
    return 0.5 * noise.noise(x, y, z) + 0.5;
  };
}

module.exports = {
  Perlin: Perlin
};

/***/ })
/******/ ]);