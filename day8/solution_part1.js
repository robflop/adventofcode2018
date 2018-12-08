const input = require('fs').readFileSync('./input.txt', 'utf8').split(' ');

const metaStack = [];

function getMetadata(length) {
	for (let i = 0; i < length; i++) {
		const meta = input.shift();
		metaStack.push(meta);
	}
}

function getChildren() {
	const node = [input.shift(), input.shift()].map(n => parseInt(n));
	// Node = [children, metadata];
	let children = node[0];

	if (node[0] > 0) {
		for (; children > 0; children--) {
			getChildren(node[0]);
		}
		if (children === 0) getMetadata(node[1]);
	}
	else {
		getMetadata(node[1]);
	}
}

getChildren();

const metaSum = metaStack.map(m => parseInt(m)).reduce((stack, metadata) => stack = stack + metadata, 0);

console.log('The resulting metadata sum is:', metaSum);