import { PUBLIC_BASE_URL } from '$env/static/public';

let getMyUrlForDev = () => {
	// let urlDev = 'https://tfe30-backend.up.railway.app';
	// let urlDev = 'http://192.168.0.43:3000';

	//return 'http://localhost:3000';
	console.log('PUBLIC_BACKEND_URL', PUBLIC_BASE_URL);
	return import.meta.env.PUBLIC_BASE_URL;
};

export { getMyUrlForDev };
