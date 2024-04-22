// @ts-nocheck
import { goto } from '$app/navigation';

let clearStorage = () => {
	sessionStorage.clear();
	throw goto('/');
};

export { clearStorage };
