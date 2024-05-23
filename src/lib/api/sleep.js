// @ts-nocheck

let sleep = (sec) => {
	console.log("Attention Morgane, je te vois !")
	return new Promise((resolve) => setTimeout(resolve, sec * 1000));
};

export { sleep };
