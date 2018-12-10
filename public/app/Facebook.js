import Storage from './Storage.js';

import { clientIdFB, authUrlFB, redirectUri } from '../lib/config.js';

export default class Facebook {
	static async auth() {
		return new Promise(async(resolve, reject) => {
			try {
				const token = await this.checkToken();
				resolve({ token });
			} catch (error) {
				reject(error);
			}
		});
	}

	static async checkToken() {
		let token = await Storage.get('facebookToken');

		if (!token) {
			token = await this.getToken();
		}

		return token;
	}

	static async login() {
		return new Promise(async(resolve, reject) => {
			try {
				chrome.identity.launchWebAuthFlow(
					{ url: authUrlFB, interactive: true },
					function(redirect) {
						let url = new URL(redirect);
						let code = url.searchParams.get('code');
						resolve(code);
					}
				);
			} catch (error) {
				reject(error);
			}
		});
	}

	static async getToken() {
		const code = await this.login();
		const appSecret = '5ece346ee9a729287ca88d936a7f98fe';

		let dataString = `client_id=${clientIdFB}&redirect_uri=${new URL(
			redirectUri
		)}&code=${code}&client_secret=${appSecret}`;
		const facebookAuthUrl = `https://graph.facebook.com/v3.1/oauth/access_token?${dataString}`;

		return fetch(facebookAuthUrl, {
			method: 'GET',
			mode: 'cors',
			cache: 'default'
		})
			.then(res => {
				return res.json();
			})
			.then(data => {
				// Store access token and refresh token
				Storage.store('facebookToken', data.access_token);
				return data.access_token;
			});
	}

	static async getEvents({ token }) {
		const facebookGraphUrl =
			'https://graph.facebook.com/me/events?fields=end_time,start_time,name,description,id';

		return fetch(facebookGraphUrl, {
			method: 'GET',
			mode: 'cors',
			cache: 'default',
			headers: {
				authorization: 'Bearer ' + token
			}
		})
			.then(res => {
				return res.json();
			})
			.then(facebookEvents => {
				return facebookEvents;
			});
	}
}
