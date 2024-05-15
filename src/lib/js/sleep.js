// @ts-nocheck

let sleep = (sec) => {
	return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

export { sleep };
