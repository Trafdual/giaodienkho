'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports['default'] = void 0

var _react = require('react')

function _slicedToArray (arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  )
}

function _nonIterableRest () {
  throw new TypeError('Invalid attempt to destructure non-iterable instance')
}

function _iterableToArrayLimit (arr, i) {
  if (
    !(
      Symbol.iterator in Object(arr) ||
      Object.prototype.toString.call(arr) === '[object Arguments]'
    )
  ) {
    return
  }
  var _arr = []
  var _n = true
  var _d = false
  var _e = undefined
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value)
      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }
  return _arr
}

function _arrayWithHoles (arr) {
  if (Array.isArray(arr)) return arr
}

function SanPhamLayout (_ref) {
  var opendetail = _ref.opendetail,
    setopendetail = _ref.setopendetail,
    idloaisp = _ref.idloaisp

  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1]

  var _useState3 = (0, _react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    SanPham = _useState4[0],
    setSanPham = _useState4[1]

  var _useToast = useToast(),
    showToast = _useToast.showToast // Các trạng thái khác...

  var fetchData = function fetchData () {
    var response, data
    return regeneratorRuntime.async(
      function fetchData$ (_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              if (idloaisp) {
                _context.next = 2
                break
              }

              return _context.abrupt('return')

            case 2:
              _context.prev = 2
              _context.next = 5
              return regeneratorRuntime.awrap(
                fetch('http://localhost:8080/getsanpham/'.concat(idloaisp), {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
              )

            case 5:
              response = _context.sent

              if (!response.ok) {
                _context.next = 13
                break
              }

              _context.next = 9
              return regeneratorRuntime.awrap(response.json())

            case 9:
              data = _context.sent
              setSanPham(data)
              _context.next = 14
              break

            case 13:
              console.error('Failed to fetch data')

            case 14:
              _context.next = 19
              break

            case 16:
              _context.prev = 16
              _context.t0 = _context['catch'](2)
              console.error('Error fetching data:', _context.t0)

            case 19:
            case 'end':
              return _context.stop()
          }
        }
      },
      null,
      null,
      [[2, 16]]
    )
  }

  ;(0, _react.useEffect)(
    function () {
      fetchData()
    },
    [idloaisp]
  )

  var postxuatkho = function postxuatkho (idsp) {
    var response
    return regeneratorRuntime.async(
      function postxuatkho$ (_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              if (idloaisp) {
                _context2.next = 2
                break
              }

              return _context2.abrupt('return')

            case 2:
              _context2.prev = 2
              _context2.next = 5
              return regeneratorRuntime.awrap(
                fetch(
                  'http://localhost:8080/xuatkho/'
                    .concat(idsp, '/')
                    .concat(idloaisp, '/')
                    .concat(khoID),
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                )
              )

            case 5:
              response = _context2.sent

              if (!response.ok) {
                _context2.next = 12
                break
              }

              _context2.next = 9
              return regeneratorRuntime.awrap(fetchData())

            case 9:
              // Gọi lại để làm mới danh sách sản phẩm
              showToast('Xuất kho thành công')
              _context2.next = 14
              break

            case 12:
              console.error('Failed to fetch data')
              showToast('Xuất kho thất bại')

            case 14:
              _context2.next = 19
              break

            case 16:
              _context2.prev = 16
              _context2.t0 = _context2['catch'](2)
              console.error('Error fetching data:', _context2.t0)

            case 19:
            case 'end':
              return _context2.stop()
          }
        }
      },
      null,
      null,
      [[2, 16]]
    )
  } // Phần còn lại của component...
}

var _default = SanPhamLayout
exports['default'] = _default
