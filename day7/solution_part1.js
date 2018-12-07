const input = require('fs').readFileSync('./input.txt', 'utf8').split('\r\n');
const stepRegex = new RegExp(/Step\s(\w).+step\s(\w).+/);

let instructions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	.map(i => { return { name: i, requirements: [], requiredFor: [], fulfilled: false }; });

for (const instruction of instructions) {
	const involvedInstructions = input.filter(i => i.toLowerCase().includes(`step ${instruction.name.toLowerCase()}`));
	// Lowercasing to catch both step mentions

	for (const i of involvedInstructions) {
		const instructionMatch = stepRegex.exec(i);
		const type = instructionMatch[1] === instruction.name ? 2 : 1;
		// 1 = requires another Instruction to be solved; 2 = requirement for another Instruction to be solved
		const otherInstruction = instructions.find(ins => ins.name === instructionMatch[type]);

		if (otherInstruction.requirements.concat(otherInstruction.requiredFor).includes(instruction.name)) continue;

		if (type === 1) {
			otherInstruction.requiredFor.push(instruction.name);
			instruction.requirements.push(otherInstruction.name);
		}
		else {
			otherInstruction.requirements.push(instruction.name);
			instruction.requiredFor.push(otherInstruction.name);
		}
	}
}

const instructionOrder = [];

function fulfillInstruction(instructionName, upperInstructionName) {
	const instruction = instructions.find(i => i.name === instructionName);
	instruction.requirements = instruction.requirements.sort((a, b) => a.localeCompare(b)); // Alphabetical sort

	// console.log(`Attempting to fulfill instruction ${instruction.name}.`);

	if (instruction.requirements.length === 0 && !instruction.fulfilled) {
		instructionOrder.push(instruction.name); // All instruction requirements have been fulfilled
		instruction.fulfilled = true;

		instructions
			.filter(i => i.requirements.includes(instruction.name))
			.map(i => i.requirements.splice(i.requirements.indexOf(instruction.name), 1));
		// Remove the instruction requirement from every other instruction because it only needs to be fulfilled once

		// console.log(`Fulfilled instruction ${instruction.name}. No requirements remain.`);

		if (upperInstructionName) {
			fulfillInstruction(upperInstructionName);
		}
	}
	else {
		// console.log(`Could not fulfill instruction ${instruction.name}. Remaining requiremenents: ${instruction.requirements}.`);
		for (const requirementName of instruction.requirements) {
			fulfillInstruction(requirementName, instructionName);
		}
	}
}

while (!instructions.every(i => i.fulfilled)) {
	instructions = instructions.filter(i => !i.fulfilled).sort((a, b) => {
		return a.requirements.length === b.requirements.length ? a.name.localeCompare(b.name) : a.requirements.length - b.requirements.length;
	}); // Primarily sort unfulfilled instructions by number of requirements and secondarily by alphabet position

	fulfillInstruction(instructions[0].name);
}
console.log('\nThe instruction order is as follows:', instructionOrder.join(''));