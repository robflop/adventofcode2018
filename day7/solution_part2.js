const input = require('fs').readFileSync('./input.txt', 'utf8').split('\r\n');
const stepRegex = new RegExp(/Step\s(\w).+step\s(\w).+/);

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// let instructions = ['A', 'B', 'C', 'D', 'E', 'F']
let instructions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	.map(i => { return { name: i, requirements: [], requiredFor: [], fulfilled: false, inProgress: false, time: /* 60 + /**/alphabet.indexOf(i) + 1 }; });

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

const executionOrder = [];

function fulfillInstruction(instructionName) {
	const instruction = instructions.find(i => i.name === instructionName);

	if (instruction.requirements.length === 0) {
		executionOrder.push(instruction.name); // All instruction requirements have been fulfilled
		instruction.fulfilled = true;

		instructions
			.filter(i => i.requirements.includes(instruction.name))
			.map(i => i.requirements.splice(i.requirements.indexOf(instruction.name), 1));
		// Remove the instruction requirement from every other instruction because it only needs to be fulfilled once
	}
}

function sortInstructions(ins) {
	return ins.sort((a, b) => {
		if (a.requirements.length === b.requirements.length) {
			if (a.inProgress === b.inProgress) return a.name.localeCompare(b.name);
			else return a.inProgress - b.inProgress;
		}
		else return a.requirements.length - b.requirements.length;
	}); // Requirements length -> In progress (Y down/N up) -> Alphabet sort
}

const workers = [
	{ id: 1, currentJob: '', completedJobs: [], workTime: 0, remainingTime: 0 },
	{ id: 2, currentJob: '', completedJobs: [], workTime: 0, remainingTime: 0 },
	{ id: 3, currentJob: '', completedJobs: [], workTime: 0, remainingTime: 0 },
	{ id: 4, currentJob: '', completedJobs: [], workTime: 0, remainingTime: 0 },
	{ id: 5, currentJob: '', completedJobs: [], workTime: 0, remainingTime: 0 },
];

let workDuration = 0;

const workInterval = setInterval(() => {
	instructions = sortInstructions(instructions);

	let instrs = instructions.filter(i => i.requirements.length === 0 && !i.inProgress);
	// Don't try to assign instructions that aren't ready or already being processed

	// console.log(`Worked for a total of ${workDuration} seconds so far.`);

	for (const worker of workers) {
		if (!worker.currentJob) {
			if (!instrs.length) continue; // No free jobs to assign

			worker.currentJob = instrs[0].name;
			worker.remainingTime = instrs[0].time;

			console.log(`Giving worker ${worker.id} job ${instrs[0].name} which takes ${instrs[0].time} seconds.`);

			instrs[0].inProgress = true;
			instrs = sortInstructions(instrs).filter(i => i.requirements.length === 0 && !i.inProgress);
		}
		else {
			worker.remainingTime -= 1;
			worker.workTime += 1;
		}

		if (worker.currentJob && worker.remainingTime === 0) {
			fulfillInstruction(worker.currentJob);

			console.log(`Worker ${worker.id} has completed job ${worker.currentJob}, seeking another.`);

			worker.completedJobs.push(worker.currentJob);
			worker.currentJob = '';

			if (executionOrder.length === instructions.length) {
				clearInterval(workInterval);

				console.log(`\n${workers.length} workers worked for a total of ${workDuration} seconds.`);
				console.log(`The work was completed in the following order:`, executionOrder.join(''));

				workers.forEach(w => {
					console.log(`Worker ${w.id} worked for a total of ${w.workTime} seconds.`);
					console.log(`Worker ${w.id} completed the following jobs:`, w.completedJobs.join('') || 'None');
				});
			}
		}
	}

	workDuration += 1;
}, 1000); // Check if worker available every second