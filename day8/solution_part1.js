const input = require('fs').readFileSync('./input.1.txt', 'utf8').split(' ');

const metaStack = [];

function getMetadata(length) {
	for (let i = 0; i < length; i++) {
		const meta = input.shift();
		console.log('Added to metaStack:', meta);
		metaStack.push(meta);
	}
}

function getChildren() {
	const node = [input.shift(), input.shift()].map(n => parseInt(n));
	// Node = [children, metadata];
	console.log('Processing node:', node.join(' '));

	if (node[0] > 0) {
		for (let i = 0; i < node[0]; i++) {
			getChildren(node[0]);
		}
	}
	else {
		console.log('Processing metadata of node:', node.join(' '));
		getMetadata(node[1]);
	}
}

getChildren();
getMetadata(input.length);

const metaSum = metaStack.map(m => parseInt(m)).reduce((stack, metadata) => stack = stack + metadata, 0);

console.log('The resulting metadata sum is:', metaSum);