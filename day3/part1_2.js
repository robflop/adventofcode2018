// Beware, incredibly inefficient, takes a lot of time to run

const input = require('fs').readFileSync('./input.txt', 'utf8').split('\r\n').map(claim => {
	const claimRegex = new RegExp(/(#\d+)\s@\s(\d+),(\d+):\s(\d+)x(\d+)/);
	const claimProperties = claimRegex.exec(claim);

	return {
		id: claimProperties[1],
		x: parseInt(claimProperties[2]),
		y: parseInt(claimProperties[3]),
		w: parseInt(claimProperties[4]),
		h: parseInt(claimProperties[5])
	};
});

const coordinates = [];

for (const claim of input) {
	for (let i = 0; i < claim.w; i++) {
		for (let j = 0; j < claim.h; j++) {
			const entry = coordinates.find(p => p[0] === (claim.x + i) && p[1] === (claim.y + j));

			if (entry) {
				entry[2] = entry[2] + 1;
				entry[3] = entry[3].concat([claim.id]);
			}
			else {
				coordinates.push([
					claim.x + i,
					claim.y + j,
					1,
					claim.id
				]);
			}
		}
	}
}

const overlaps = coordinates.filter(point => point[2] > 1);

const cleanClaim = input.find(claim => overlaps.every(o => !o[3].includes(claim.id))).id;

console.log('Claim overlaps:', overlaps.length);
console.log('Claim without overlap:', cleanClaim);