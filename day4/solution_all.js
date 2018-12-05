const input = require('fs').readFileSync('./input.txt', 'utf8').split('\r\n').map(log => {
	const logRegex = new RegExp(/\[(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})\]\s(falls asleep|Guard (#\d{1,4}) begins shift|wakes up)/);
	const logInfo = logRegex.exec(log);

	return {
		timestamp: new Date(logInfo[1]).getTime(),
		action: logInfo[2][0].toLocaleLowerCase(), // lowercase first letter only to identify
		guard: logInfo[3]
	};
}).sort((a, b) => a.timestamp - b.timestamp);

let lastGuard = '';

input.map(log => {
	if (log.action === 'g') lastGuard = log.guard;
	else log.guard = lastGuard;

	return log;
});

const guards = [];

for (const log of input) {
	if (guards.find(guard => guard.id === log.guard)) continue;
	else guards.push({ id: log.guard, sleepTimespans: [], totalSleep: 0 });
}

for (const log of input) {
	const guard = guards.find(g => g.id === log.guard);
	const latestSleep = guard.sleepTimespans ? guard.sleepTimespans[guard.sleepTimespans.length - 1] : [];
	// Waking up is always after the latest sleep began, so latest entry is used
	const logTime = log.timestamp;

	if (log.action === 'w') {
		latestSleep.end = logTime;
		latestSleep.duration = latestSleep.end - latestSleep.start;

		guard.totalSleep += latestSleep.duration;
	}
	else if (log.action === 'f') {
		/* eslint-disable no-lonely-if */
		if (guard.sleepTimespans) guard.sleepTimespans.push({ start: logTime });
		else guard.sleepTimespans = [{ start: logTime }];
		/* eslint-enable no-lonely-if */
	}
}

const guardMinutes = [];

for (let i = 0; i <= 59; i++) {
	if (!guardMinutes[i]) guardMinutes[i] = [i, { }];

	for (const guard of guards) {
		for (const sleepTimespan of guard.sleepTimespans) {
			let sleepHits = 0;

			for (let j = sleepTimespan.start; j < sleepTimespan.end; j = j + 60000) { // 60000 ms = 1 min
				if (new Date(j).getMinutes() === i) sleepHits++;
			}

			if (sleepHits > 0) {
				if (guardMinutes[i][1][guard.id]) guardMinutes[i][1][guard.id] += sleepHits;
				else guardMinutes[i][1][guard.id] = sleepHits;
			}
		}
	}
}

const mostFrequentSleepMinute = guardMinutes.sort((a, b) => {
	a = Object.values(a[1]).reduce((acc, freq) => acc = acc + freq, 0);
	b = Object.values(b[1]).reduce((acc, freq) => acc = acc + freq, 0);

	return b - a;
})[0];

const mostFrequentSleeper = guards.sort((a, b) => b.totalSleep - a.totalSleep)[0];
const mostFrequentSleeperSleepMinute = guardMinutes
	.filter(minute => Object.keys(minute[1]).includes(mostFrequentSleeper.id))
	.sort((a, b) => b[1][mostFrequentSleeper.id] - a[1][mostFrequentSleeper.id])[0];

const highestSleepFrequency = { number: 0 };

for (const minute of guardMinutes) {
	const minuteRepeat = Object.entries(minute[1]).sort((a, b) => b[1] - a[1])[0];

	if (Object.entries(minute[1]) < 1) continue;

	if (minuteRepeat[1] > highestSleepFrequency.number) {
		highestSleepFrequency.number = minuteRepeat[1];
		highestSleepFrequency.minute = minute;
		highestSleepFrequency.guard = minuteRepeat[0];
	}
}

console.log('Most frequent sleeper:', `${highestSleepFrequency.guard} was asleep at 00:${highestSleepFrequency.minute[0]} a total of ${highestSleepFrequency.number} times.`); // eslint-disable-line max-len
console.log('Longest sleeper overall:', `${mostFrequentSleeper.id} slept a total of ${mostFrequentSleeper.totalSleep / 60000} minutes.`);
console.log('Most frequent minute slept during:', `${Object.keys(mostFrequentSleepMinute[1]).length} guards slept during Minute ${mostFrequentSleepMinute[0]}.`); // eslint-disable-line max-len
console.log('Part 1 result:', mostFrequentSleeper.id.substr(1) * mostFrequentSleeperSleepMinute[0]);
console.log('Part 2 result:', highestSleepFrequency.guard.substr(1) * highestSleepFrequency.minute[0]);