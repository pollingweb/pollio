import axios from 'axios';

export function cookieInterceptor() {
	axios.interceptors.request.use((request) => {
		// add auth header with jwt if account is logged in and request is to the api url

		request.withCredentials = true;

		return request;
	});
}

export function errorInterceptor() {
	axios.interceptors.response.use(null, (error) => {
		const { response } = error;
		if (!response) {
			return;
		}

		return response;
	});
}
