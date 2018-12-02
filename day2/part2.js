const input = require('fs').readFileSync('./input.txt', 'utf8').split('\r\n');
let maxMatch = [];

for (let i = 0; i < input.length; i++) {
	const id = input[i];
	let comparisonMatch = [];

	for (let j = 0; j < input.length; j++) {
		if (i === j) continue;

		const comparisonID = input[j];
		const currentMatch = [];

		for (let l = 0; l < comparisonID.length; l++) {
			if (id[l] === comparisonID[l]) currentMatch.push(id[l]);
		}

		if (currentMatch.length > comparisonMatch.length) comparisonMatch = currentMatch;
	}

	if (comparisonMatch.length > maxMatch.length) maxMatch = comparisonMatch;
}

console.log('Longest match:', maxMatch.join(''));