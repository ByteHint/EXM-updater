require('bytenode');
const path = require('path');

// Load compiled main loader (which requires .jsc)
const compiledMainLoader = path.join(__dirname, 'compiled', 'main', 'main.js');
require(compiledMainLoader);
