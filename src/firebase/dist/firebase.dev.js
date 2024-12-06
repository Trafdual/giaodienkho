"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ref", {
  enumerable: true,
  get: function get() {
    return _database.ref;
  }
});
Object.defineProperty(exports, "onValue", {
  enumerable: true,
  get: function get() {
    return _database.onValue;
  }
});
Object.defineProperty(exports, "push", {
  enumerable: true,
  get: function get() {
    return _database.push;
  }
});
exports.db = void 0;

var _app = require("firebase/app");

var _database = require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyBG3ReVfhqDDn-Ocd_aTvON8vBAcHXdduc",
  authDomain: "chat-app-ceb82.firebaseapp.com",
  databaseURL: "https://chat-app-ceb82-default-rtdb.firebaseio.com",
  projectId: "chat-app-ceb82",
  storageBucket: "chat-app-ceb82.firebasestorage.app",
  messagingSenderId: "268815395218",
  appId: "1:268815395218:web:f4afe468507bd19debb94b"
};
var app = (0, _app.initializeApp)(firebaseConfig);
var db = (0, _database.getDatabase)(app);
exports.db = db;