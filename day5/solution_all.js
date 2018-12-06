const input = require('fs').readFileSync('./input.txt', 'utf8');

const unitRegex = new RegExp(/(\w)(\1)/, 'i');

const units = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
// Empty string is for part 1 that does not remove any units from the start

let shortestOriginalPolymer = input;
let shortestPolymer = input;
let replacedUnit = '';

function processReactions(polymer, removal = '') {
	if (!polymer.includes(removal)) return shortestPolymer;

	const charRegex = new RegExp(removal, 'gi');
	let unitRegexIndex = 0;
	let reactionPossible = true;

	polymer = polymer.replace(charRegex, '');

	while (reactionPossible) {
		const unitMatch = unitRegex.exec(polymer.substr(unitRegexIndex));

		if (!unitMatch) {
			reactionPossible = false;

			return polymer;
		}
		else if (unitMatch.every(char => char === char.toUpperCase() || char === char.toLowerCase())) {
			unitRegexIndex += 1; // Prevent rematching the same characters
		}
		else {
			const unitIndex = polymer.indexOf(unitMatch[0]);

			unitRegexIndex = 0;
			polymer = polymer.substr(0, unitIndex) + polymer.substr(unitIndex + 2);
		}
	}
}

for (const unit of units) {
	if (unit === '') { // Part 1
		shortestOriginalPolymer = processReactions(input);
		shortestPolymer = shortestOriginalPolymer; // For further part 2 processing
	}
	else {
		const polymer = processReactions(shortestOriginalPolymer, unit);

		if (polymer.length < shortestPolymer.length) {
			replacedUnit = unit;
			shortestPolymer = polymer;
		}
	}
}

console.log(`Shortest possible polymer length when not removing any units beforehand:`, shortestOriginalPolymer.length);
console.log(`Shortest possible polymer length when removing all '${replacedUnit}' units beforehand:`, shortestPolymer.length);