import axios from "axios";
export const BASE_URL = "https://api.morvinnandan.club/api";  // Live
export const ONESIGNAL_APP_ID = '4195c1cd-2143-4063-a6bd-e5581e8546a5';
// export const BASE_URL = "http://127.0.0.1:8000/api";   // Demo

const getAuthorizationToken = () => {
	let authToken = localStorage.getItem("authToken");
	if (authToken) {
		return `Bearer ${authToken}`;
	}
	return '';
}

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		Accept: 'application/json',
		Authorization: getAuthorizationToken(),
		request_type: 'web_app',
	},
});

export default apiClient;	