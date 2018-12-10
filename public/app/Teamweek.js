import Storage from './Storage.js';

import {
	clientIdTW,
	authUrlTW,
	teamweekAuthUrl,
	authToken
} from '../lib/config.js';

export default class Teamweek {
	static async auth() {
		return new Promise(async(resolve, reject) => {
			try {
				const token = await this.checkToken();
				const user = await this.checkUser(token);
				resolve({ token, user });
			} catch (error) {
				reject(error);
			}
		});
	}

	static async checkToken() {
		let token = await Storage.get('teamweekRefreshToken');

		if (!token) {
			token = await this.getToken();
		}

		return token;
	}

	static async login() {
		return new Promise(async(resolve, reject) => {
			try {
				chrome.identity.launchWebAuthFlow(
					{ url: authUrlTW, interactive: true },
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
		let dataString = `grant_type=authorization_code&code=${code}&client_id=${clientIdTW}`;
		return fetch(teamweekAuthUrl, {
			method: 'POST',
			mode: 'cors',
			cache: 'default',
			headers: new Headers({
				Authorization: 'Basic ' + authToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			}),
			body: dataString
		})
			.then(res => {
				return res.json();
			})
			.then(data => {
				// Store access token and refresh token
				Storage.store('teamweekRefreshToken', data.refresh_token);
				return data.refresh_token;
			});
	}

	static async checkUser(token) {
		let user = await Storage.get('teamweekUser');

		if (!user) {
			user = await this.getUser(token);
		}

		return user;
	}

	static async refresh(token) {
		let dataString = `grant_type=refresh_token&refresh_token=${token}`;
		return fetch(teamweekAuthUrl, {
			method: 'POST',
			mode: 'cors',
			cache: 'default',
			headers: new Headers({
				Authorization: 'Basic ' + authToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			}),
			body: dataString
		})
			.then(res => {
				return res.json();
			})
			.then(data => {
				return data.access_token;
			});
	}

	static async getUser(token) {
		const freshToken = await this.refresh(token);

		return fetch('https://teamweek.com/api/v4/me', {
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + freshToken
			}
		})
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				let user = {
					id: data.id,
					workspaceId: data.workspaces[0].id
				};
				Storage.store('teamweekUser', user);
				return user;
			})
			.catch(error => {
				console.log(error);
			});
	}

	static async getTasks({ token, user }) {
		const freshToken = await this.refresh(token);
		return fetch(
			`https://teamweek.com/api/v4/${user.workspaceId}/tasks/timeline?since=
			${new Date(Date.now()).toISOString()}&users=${user.id}`,
			{
				method: 'GET',
				headers: {
					authorization: 'Bearer ' + freshToken
				}
			}
		)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				// if TW token is legit
				return data;
			})
			.catch(error => {
				console.log(error);
			});
	}

	static async update( teamweek, tasks, events ) {
		console.log(teamweek);
		
		const freshToken = await this.refresh(teamweek.token);
		
		let currentDate = new Date().toISOString();
		let twoMonths = new Date().setMonth(new Date().getMonth() + 2);

		let teamweekTasksNames = [];

		await tasks.map(function(task) {
			teamweekTasksNames.push(task.name);
		});


		await events.data.map(function(event) {

			let startTime = new Date(event.start_time)
				.toTimeString()
				.split(' ')[0]
				.slice(0, -3);

			let endTime = new Date(event.end_time)
				.toTimeString()
				.split(' ')[0]
				.slice(0, -3);

			let eventStart = new Date(event.start_time).getTime();

			let isEndDateInTheFuture = event.end_time
				? event.end_time > currentDate
				: true;
			let isStartDateInTheFuture = event.start_time
				? event.start_time > currentDate
				: false;
			let isStartDateLessThanTwoMonths = eventStart
				? eventStart < twoMonths
				: true;
			let taskDoesNotAlreadyExist =
				teamweekTasksNames.includes(event.name) == false;

			if (
				isEndDateInTheFuture &&
				isStartDateInTheFuture &&
				taskDoesNotAlreadyExist &&
				isStartDateLessThanTwoMonths
			) {
				let data = {
					name: event.name,
					start_date: event.start_time,
					end_date: event.end_time ? event.end_time : event.start_time,
					start_time: startTime,
					end_time: endTime,
					notes:
						'https://www.facebook.com/events/' +
						event.id +
						'       ' +
						event.description,
					user_id: teamweek.user.id,
					project_id: 1620233
					// TODO: dynamic project id
				};

				let headers = {
					Authorization: 'Bearer ' + freshToken,
					'Content-Type': 'application/json'
				};

				return fetch(`https://teamweek.com/api/v4/${teamweek.user.workspaceId}/tasks`, {
					method: 'POST',
					headers: headers,
					body: JSON.stringify(data)
				})
					.then(function(response) {
						return response.json();
					})
					.then(function(data) {
						console.log(data);
					})
					.catch(function(error) {
						console.log(error);
					});
			} else {
				return;
			}

		});
	}

}
