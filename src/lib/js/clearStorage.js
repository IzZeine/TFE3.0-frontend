// @ts-nocheck
let clearStorage = () => {
	sessionStorage.clear();
	location.reload(true);
};

export { clearStorage };
