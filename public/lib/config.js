export const redirectUri =
	'https://jmiminbcdojnidebcjmgbppoleaoiemd.chromiumapp.org';

// FACEBOOK
export const clientIdFB = '317361235285325';
export const authUrlFB = `https://www.facebook.com/v3.1/dialog/oauth?client_id=${clientIdFB}&redirect_uri=${redirectUri}&state=1234&scope=user_events`;

// TEAMWEEK
export const clientIdTW = 'c2b0301e9510c38ddc5a';
export const authUrlTW = `https://teamweek.com/oauth/login?response_type=code&client_id=${clientIdTW}&redirect_uri=${redirectUri}&state=1234`;
export const teamweekAuthUrl = 'https://teamweek.com/api/v4/authenticate/token';
export const secretKeyTW = 'bef4692121a9344d5665574beb00145f648734d2';
export const authToken = btoa(`${clientIdTW}:${secretKeyTW}`);
