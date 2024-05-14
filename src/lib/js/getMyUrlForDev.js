let getMyUrlForDev = () => {
	// let urlDev = 'https://tfe30-backend.up.railway.app';
	// let urlDev = 'http://192.168.0.43:3000';

	//return 'http://localhost:3000';
	return import.meta.env.VITE_BACKEND_URL;
};

export { getMyUrlForDev };
