let input = require('fs').readFileSync('./input.txt', 'utf8');

let reactionPossible = true;
const unitRegex = new RegExp(/(\w)(\1)/, 'i');
let regexIndex = 0;

while (reactionPossible) {
	const unit = unitRegex.exec(input.substr(regexIndex));

	if (!unit) {
		reactionPossible = false;
		return console.log('Remaining units without reactions:', input.length);
	}
	else if (unit.every(char => char === char.toUpperCase() || char === char.toLowerCase())) {
		regexIndex += 1; // Prevent rematching the same characters
	}
	else {
		regexIndex = 0;
		input = input.substr(0, input.indexOf(unit[0])) + input.substr(input.indexOf(unit[0]) + 2);
	}
}