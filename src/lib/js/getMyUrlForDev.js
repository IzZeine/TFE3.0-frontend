import { PUBLIC_BASE_URL } from '$env/static/public';

let getMyUrlForDev = () => {
	return PUBLIC_BASE_URL;
};

export { getMyUrlForDev };
