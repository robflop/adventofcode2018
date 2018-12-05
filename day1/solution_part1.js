const input = require('fs').readFileSync('./input.txt', 'utf8').split('\r\n').map(i => parseInt(i));
let total = 0;

input.reduce((acc, c) => total = total + c, 0);

console.log('Total:', total);