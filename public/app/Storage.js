export default class Storage {
	static async store(key, value) {
		return chrome.storage.local.set({ [key]: value }, () => {
			console.log('stored:' + key + ': ' + value);
		});
	}

	static async get(key) {
		return new Promise(async(resolve, reject) => {
			try {
				chrome.storage.local.get([key], data => {
					console.log('got:' + ' ' + key + ': ' + data[key]);
					resolve(data[key]);
				});
			} catch (error) {
				reject(error);
			}
		});
	}
}
