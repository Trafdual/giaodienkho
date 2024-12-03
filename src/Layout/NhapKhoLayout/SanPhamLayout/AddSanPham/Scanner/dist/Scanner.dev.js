"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _quagga = _interopRequireDefault(require("@ericblade/quagga2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function getMedian(arr) {
  var newArr = _toConsumableArray(arr); // copy the array before sorting, otherwise it mutates the array passed in, which is generally undesireable


  newArr.sort(function (a, b) {
    return a - b;
  });
  var half = Math.floor(newArr.length / 2);

  if (newArr.length % 2 === 1) {
    return newArr[half];
  }

  return (newArr[half - 1] + newArr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes) {
  var errors = decodedCodes.flatMap(function (x) {
    return x.error;
  });
  var medianOfErrors = getMedian(errors);
  return medianOfErrors;
}

var defaultConstraints = {
  width: 640,
  height: 480
};
var defaultLocatorSettings = {
  patchSize: 'medium',
  halfSample: true,
  willReadFrequently: true
};
var defaultDecoders = ['ean_reader', 'code_128_reader', // Mã Code 128
'code_39_reader', // Mã Code 39
'upc_reader', // Mã UPC-A
'upc_e_reader', // Mã UPC-E
'i2of5_reader', // Interleaved 2 of 5
'2of5_reader', // Standard 2 of 5
'codabar_reader' // Mã Codabar
];

var Scanner = function Scanner(_ref) {
  var onDetected = _ref.onDetected,
      scannerRef = _ref.scannerRef,
      onScannerReady = _ref.onScannerReady,
      cameraId = _ref.cameraId,
      facingMode = _ref.facingMode,
      _ref$constraints = _ref.constraints,
      constraints = _ref$constraints === void 0 ? defaultConstraints : _ref$constraints,
      _ref$locator = _ref.locator,
      locator = _ref$locator === void 0 ? defaultLocatorSettings : _ref$locator,
      _ref$decoders = _ref.decoders,
      decoders = _ref$decoders === void 0 ? defaultDecoders : _ref$decoders,
      _ref$locate = _ref.locate,
      locate = _ref$locate === void 0 ? true : _ref$locate;
  var errorCheck = (0, _react.useCallback)(function (result) {
    if (!onDetected) {
      return;
    }

    var err = getMedianOfCodeErrors(result.codeResult.decodedCodes); // if Quagga is at least 75% certain that it read correctly, then accept the code.

    if (err === 0) {
      onDetected(result.codeResult.code);
    }
  }, [onDetected]);

  var handleProcessed = function handleProcessed(result) {
    var drawingCtx = _quagga["default"].canvas.ctx.overlay;
    var drawingCanvas = _quagga["default"].canvas.dom.overlay;
    drawingCtx.font = '24px Arial';
    drawingCtx.fillStyle = 'green';

    if (result) {
      // console.warn('* quagga onProcessed', result);
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          _quagga["default"].ImageDebug.drawPath(box, {
            x: 0,
            y: 1
          }, drawingCtx, {
            color: 'purple',
            lineWidth: 2
          });
        });
      }

      if (result.box) {
        _quagga["default"].ImageDebug.drawPath(result.box, {
          x: 0,
          y: 1
        }, drawingCtx, {
          color: 'blue',
          lineWidth: 2
        });
      }

      if (result.codeResult && result.codeResult.code) {
        // const validated = barcodeValidator(result.codeResult.code);
        // const validated = validateBarcode(result.codeResult.code);
        // Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: validated ? 'green' : 'red', lineWidth: 3 });
        drawingCtx.font = '24px Arial'; // drawingCtx.fillStyle = validated ? 'green' : 'red';
        // drawingCtx.fillText(`${result.codeResult.code} valid: ${validated}`, 10, 50);

        drawingCtx.fillText(result.codeResult.code, 10, 20); // if (validated) {
        //     onDetected(result);
        // }
      }
    }
  };

  (0, _react.useLayoutEffect)(function () {
    // if this component gets unmounted in the same tick that it is mounted, then all hell breaks loose,
    // so we need to wait 1 tick before calling init().  I'm not sure how to fix that, if it's even possible,
    // given the asynchronous nature of the camera functions, the non asynchronous nature of React, and just how
    // awful browsers are at dealing with cameras.
    var ignoreStart = false;

    var init = function init() {
      return regeneratorRuntime.async(function init$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(new Promise(function (resolve) {
                return setTimeout(resolve, 1);
              }));

            case 2:
              if (!ignoreStart) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return");

            case 4:
              _context2.next = 6;
              return regeneratorRuntime.awrap(_quagga["default"].init({
                inputStream: {
                  type: 'LiveStream',
                  constraints: _objectSpread({}, constraints, {}, cameraId && {
                    deviceId: cameraId
                  }, {}, !cameraId && {
                    facingMode: facingMode
                  }),
                  target: scannerRef.current,
                  willReadFrequently: true
                },
                locator: locator,
                decoder: {
                  readers: decoders
                },
                locate: locate
              }, function _callee(err) {
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _quagga["default"].onProcessed(handleProcessed);

                        if (!err) {
                          _context.next = 3;
                          break;
                        }

                        return _context.abrupt("return", console.error('Error starting Quagga:', err));

                      case 3:
                        if (!(scannerRef && scannerRef.current)) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 6;
                        return regeneratorRuntime.awrap(_quagga["default"].start());

                      case 6:
                        if (onScannerReady) {
                          onScannerReady();
                        }

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }));

            case 6:
              _quagga["default"].onDetected(errorCheck);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      });
    };

    init(); // cleanup by turning off the camera and any listeners

    return function () {
      ignoreStart = true;

      _quagga["default"].stop();

      _quagga["default"].offDetected(errorCheck);

      _quagga["default"].offProcessed(handleProcessed);
    };
  }, [cameraId, onDetected, onScannerReady, scannerRef, errorCheck, constraints, locator, decoders, locate, facingMode]);
  return null;
};

Scanner.propTypes = {
  onDetected: _propTypes["default"].func.isRequired,
  scannerRef: _propTypes["default"].object.isRequired,
  onScannerReady: _propTypes["default"].func,
  cameraId: _propTypes["default"].string,
  facingMode: _propTypes["default"].string,
  constraints: _propTypes["default"].object,
  locator: _propTypes["default"].object,
  decoders: _propTypes["default"].array,
  locate: _propTypes["default"].bool
};
var _default = Scanner;
exports["default"] = _default;