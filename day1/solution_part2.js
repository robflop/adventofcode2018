const input = require('fs').readFileSync('./input.txt', 'utf8').split('\r\n').map(i => parseInt(i));
let total = 0;
const knownTotals = [];
let duplicateFound = false;

let loopNum = 1;

while (!duplicateFound) {
	for (const i of input) {
		total = total + i;

		if (knownTotals.includes(total)) {
			duplicateFound = true;
			return console.log(`Looped ${++loopNum} times to find the first duplicate: ${total}`);
		}
		else knownTotals.push(total);
	}

	loopNum++;
}