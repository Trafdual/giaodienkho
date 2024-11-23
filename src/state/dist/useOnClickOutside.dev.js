"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var OnClickOutside = function OnClickOutside(ref, handler) {
  _react["default"].useEffect(function () {
    var listener = function listener(event) {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return function () {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
};

var _default = OnClickOutside;
exports["default"] = _default;