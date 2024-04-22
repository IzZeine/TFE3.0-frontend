import { dev } from '$app/environment';

let getMyUrlForDev = () => {
	let urlDev = 'https://tfe30-backend.up.railway.app';
	if (dev) {
		urlDev = import.meta.env.VITE_BACKEND_URL;
	}
	return urlDev;
};

export { getMyUrlForDev };
