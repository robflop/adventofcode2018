const input = require('fs').readFileSync('./input.txt', 'utf8').split(' ').map(i => parseInt(i));

function getChildren(metadataStack) {
	const node = [input.shift(), input.shift()]; // [children, metadata];

	if (node[0] > 0) {
		for (; node[0] > 0; node[0]--) {
			metadataStack = getChildren(metadataStack);
		}
		if (node[0] === 0) metadataStack = getMetadata(node[1], metadataStack);
	}
	else metadataStack = getMetadata(node[1], metadataStack);

	return metadataStack;
}

function getMetadata(length, metadataStack) {
	for (let i = 0; i < length; i++) {
		metadataStack.push(input.shift());
	}

	return metadataStack;
}

const metaSum = getChildren([]).reduce((stack, metadata) => stack = stack + metadata, 0);

console.log('The resulting metadata sum is:', metaSum);