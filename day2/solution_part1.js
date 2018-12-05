const input = require('fs').readFileSync('./input.txt', 'utf8').split('\r\n');
let doubles = 0;
let triples = 0;

for (const id of input) {
	const knownLetters = [];

	for (const letter of id) {
		if (knownLetters.every(l => !l.includes(letter))) knownLetters.push([letter]);
		else knownLetters.find(l => l.includes(letter)).push(letter);
	}

	const hasDouble = knownLetters.filter(l => l.length === 2);
	const hasTriple = knownLetters.filter(l => l.length === 3);

	if (hasDouble.length) doubles++;
	if (hasTriple.length) triples++;
}

console.log('Checksum:', doubles * triples);