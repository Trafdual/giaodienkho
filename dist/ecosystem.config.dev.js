"use strict";

module.exports = {
  apps: [{
    name: 'giaodienkho',
    script: 'npm',
    // Lệnh chính để chạy ứng dụng (npm)
    args: 'start',
    env: {
      PORT: 3006,
      NODE_ENV: 'production'
    }
  }]
};