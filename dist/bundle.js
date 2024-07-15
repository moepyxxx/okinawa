/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/drawObject.ts":
/*!***************************!*\
  !*** ./src/drawObject.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DrawObject = void 0;\nvar DrawObject = /** @class */ (function () {\n    function DrawObject(canvas, ctx) {\n        this.canvas = canvas;\n        this.ctx = ctx;\n    }\n    return DrawObject;\n}());\nexports.DrawObject = DrawObject;\n\n\n//# sourceURL=webpack://canvas_pokemon/./src/drawObject.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar sea_1 = __webpack_require__(/*! ./sea */ \"./src/sea.ts\");\nvar canvas = null;\nvar ctx = null;\nvar animationId;\nvar lastTime = 0;\nvar fps = 0;\nvar interval = 0;\nvar sea = null;\nsetup();\nanimate(0);\nwindow.addEventListener(\"resize\", function () {\n    setup();\n    draw();\n});\nfunction setup() {\n    var _a;\n    animationId = null;\n    lastTime = 0;\n    fps = 10;\n    interval = 1000 / fps;\n    canvas = document.querySelector(\"canvas\");\n    ctx = (_a = canvas === null || canvas === void 0 ? void 0 : canvas.getContext(\"2d\")) !== null && _a !== void 0 ? _a : null;\n    if (canvas == null || ctx == null) {\n        throw new Error(\"cannot get canvas\");\n    }\n    canvas.width = window.innerWidth;\n    canvas.height = window.innerHeight * 2.5;\n    canvas.style.backgroundColor = \"#fdf5e6\";\n    ctx.fillStyle = \"#fff\";\n    ctx.strokeStyle = \"#fff\";\n    sea = new sea_1.Sea(canvas, ctx);\n}\nfunction draw() {\n    sea === null || sea === void 0 ? void 0 : sea.drawSandyBeach();\n    sea === null || sea === void 0 ? void 0 : sea.drawWaves();\n    sea === null || sea === void 0 ? void 0 : sea.drawSea();\n}\nfunction update() {\n    sea === null || sea === void 0 ? void 0 : sea.update();\n}\nfunction animate(timestamp) {\n    if (canvas == null || ctx == null) {\n        throw new Error(\"cannot get canvas\");\n    }\n    if (timestamp - lastTime > interval) {\n        ctx.clearRect(0, 0, canvas.width, canvas.height);\n        draw();\n        update();\n        lastTime = timestamp;\n    }\n    animationId = requestAnimationFrame(animate);\n}\n\n\n//# sourceURL=webpack://canvas_pokemon/./src/index.ts?");

/***/ }),

/***/ "./src/sea.ts":
/*!********************!*\
  !*** ./src/sea.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Sea = void 0;\nvar drawObject_1 = __webpack_require__(/*! ./drawObject */ \"./src/drawObject.ts\");\nvar Sea = /** @class */ (function (_super) {\n    __extends(Sea, _super);\n    function Sea(canvas, ctx) {\n        var _this = _super.call(this, canvas, ctx) || this;\n        _this.frame = 0;\n        _this.baseStart = 0;\n        _this.baseXRange = 600;\n        _this.baseYRange = 600;\n        _this.baseMiddle = _this.canvas.width / 2;\n        _this.baseEnd = _this.canvas.width;\n        _this.baseYEnd = (_this.canvas.height / 4) * 2;\n        return _this;\n    }\n    Sea.prototype.update = function () {\n        this.frame++;\n    };\n    Sea.prototype.drawWaves = function () {\n        var min = 30;\n        var max = 100;\n        for (var moveRange = min; moveRange < max; moveRange += 10) {\n            /**\n             * -50〜50の間をspeed10の速さで行き来するsin波を作る\n             * 値が大きければspeedは小さくなる\n             */\n            var moveSpeed = moveRange - 20;\n            var offset = moveRange * Math.sin(this.frame / moveSpeed);\n            var waveX = this.baseStart;\n            var waveY = this.baseStart;\n            var waveIdx = 1;\n            this.ctx.save();\n            this.ctx.beginPath();\n            this.ctx.moveTo(waveX, waveY);\n            while (waveY < this.canvas.height) {\n                var lc1 = {\n                    x: waveIdx * this.baseXRange + offset,\n                    y: waveY - offset,\n                };\n                var lc2 = {\n                    x: waveX - offset,\n                    y: waveIdx * this.baseYRange + offset,\n                };\n                var lp = {\n                    x: waveIdx * this.baseXRange,\n                    y: waveIdx * this.baseYRange,\n                };\n                this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);\n                this.ctx.lineTo(lp.x, lp.y);\n                waveX += this.baseXRange;\n                waveY += this.baseXRange;\n                waveIdx++;\n            }\n            this.ctx.lineTo(waveX, waveY);\n            this.ctx.lineTo(0, this.canvas.height);\n            this.ctx.lineTo(0, 0);\n            this.ctx.closePath();\n            this.ctx.strokeStyle = \"rgba(0, 175,204, .5)\";\n            this.ctx.fillStyle = \"rgba(0, 175,204, .2)\";\n            this.ctx.stroke();\n            this.ctx.fill();\n            this.ctx.restore();\n        }\n    };\n    Sea.prototype.drawSea = function () {\n        var offsetF = -100;\n        var seaX = this.baseStart + offsetF;\n        var seaY = this.baseStart - offsetF;\n        var seaIdx = 1;\n        this.ctx.save();\n        this.ctx.beginPath();\n        this.ctx.moveTo(seaX, seaY);\n        while (seaY < this.canvas.height + offsetF) {\n            var lc1 = {\n                x: seaIdx * this.baseXRange + offsetF,\n                y: seaY - offsetF,\n            };\n            var lc2 = {\n                x: seaX + offsetF,\n                y: seaIdx * this.baseYRange - offsetF,\n            };\n            var lp = {\n                x: seaIdx * this.baseXRange + offsetF,\n                y: seaIdx * this.baseYRange - offsetF,\n            };\n            this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);\n            this.ctx.lineTo(lp.x, lp.y);\n            seaX += this.baseXRange;\n            seaY += this.baseYRange;\n            seaIdx++;\n        }\n        this.ctx.lineTo(seaX, seaY);\n        this.ctx.lineTo(0, this.canvas.height);\n        this.ctx.lineTo(0, 0);\n        this.ctx.closePath();\n        this.ctx.filter = \"blur(3px)\";\n        this.ctx.strokeStyle = \"#00afcc\";\n        this.ctx.fillStyle = \"#00afcc\";\n        this.ctx.stroke();\n        this.ctx.fill();\n        this.ctx.restore();\n    };\n    Sea.prototype.drawSandyBeach = function () {\n        var offsetS = 150;\n        var sandX = this.baseStart + offsetS;\n        var sandY = this.baseStart - offsetS;\n        var seaIdx = 1;\n        this.ctx.save();\n        this.ctx.beginPath();\n        this.ctx.moveTo(sandX, sandY);\n        while (sandY < this.canvas.height + offsetS) {\n            var lc1 = {\n                x: seaIdx * this.baseXRange + offsetS,\n                y: sandY - offsetS,\n            };\n            var lc2 = {\n                x: sandX + offsetS,\n                y: seaIdx * this.baseYRange - offsetS,\n            };\n            var lp = {\n                x: seaIdx * this.baseXRange + offsetS,\n                y: seaIdx * this.baseYRange - offsetS,\n            };\n            this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);\n            this.ctx.lineTo(lp.x, lp.y);\n            sandX += this.baseXRange;\n            sandY += this.baseYRange;\n            seaIdx++;\n        }\n        this.ctx.lineTo(sandX, sandY);\n        this.ctx.lineTo(0, this.canvas.height);\n        this.ctx.lineTo(0, 0);\n        this.ctx.closePath();\n        this.ctx.filter = \"blur(2px)\";\n        this.ctx.strokeStyle = \"#ffefd5\";\n        this.ctx.fillStyle = \"#ffefd5\";\n        this.ctx.stroke();\n        this.ctx.fill();\n        this.ctx.restore();\n    };\n    return Sea;\n}(drawObject_1.DrawObject));\nexports.Sea = Sea;\n\n\n//# sourceURL=webpack://canvas_pokemon/./src/sea.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;