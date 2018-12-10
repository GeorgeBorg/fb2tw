import Teamweek from './Teamweek.js';
import Facebook from './Facebook.js';

chrome.extension.onMessage.addListener(function(message) {
	switch (message.type) {
	case 'sync':
		return initiate();
	}
});

async function initiate() {
	const [teamweek, facebook] = await Promise.all([
		Teamweek.auth(),
		Facebook.auth()
	]);

	const [tasks, events] = await Promise.all([
		Teamweek.getTasks(teamweek),
		Facebook.getEvents(facebook)
	]);

	await Teamweek.update(teamweek, tasks, events);

	chrome.tabs.query({}, function(tabs) {
		var message = 'done';
		for (let i = 0; i < tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, message);
		}
	});
}
