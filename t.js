const compile = require('ejs').compile
const read = require('fs').readFileSync
module.exports = [compile(read(__dirname + '/a.ejs').toString()), compile(read(__dirname + '/t.ejs').toString())]
