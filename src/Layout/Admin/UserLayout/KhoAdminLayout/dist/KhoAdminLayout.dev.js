"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _api = require("../../../../api/api");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function KhoAdminLayout(_ref) {
  var isOpen = _ref.isOpen,
      onClose = _ref.onClose,
      iduser = _ref.iduser;

  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      data = _useState2[0],
      setdata = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedIds = _useState4[0],
      setSelectedIds = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      selectAll = _useState6[0],
      setSelectAll = _useState6[1];

  var fetchdata = function fetchdata() {
    var page,
        response,
        _data,
        _args = arguments;

    return regeneratorRuntime.async(function fetchdata$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            page = _args.length > 0 && _args[0] !== undefined ? _args[0] : 1;
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(fetch("".concat((0, _api.getApiUrl)('domain'), "/getkhochua/").concat(iduser, "?page=").concat(page, "&limit=9")));

          case 4:
            response = _context.sent;

            if (!response.ok) {
              _context.next = 10;
              break;
            }

            _context.next = 8;
            return regeneratorRuntime.awrap(response.json());

          case 8:
            _data = _context.sent;
            setdata(_data.data);

          case 10:
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            console.error(_context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 12]]);
  };

  (0, _react.useEffect)(function () {
    if (isOpen && iduser) {
      fetchdata();
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [isOpen, iduser]);
  return;
}

var _default = KhoAdminLayout;
exports["default"] = _default;