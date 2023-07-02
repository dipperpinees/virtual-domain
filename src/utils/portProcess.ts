import net from "net";

export async function isPortReachable(port: number) {
	const promise = new Promise(((resolve, reject) => {
		const socket = new net.Socket();

		const onError = () => {
			socket.destroy();
			reject();
		};

		socket.setTimeout(1000);
		socket.once('error', onError);
		socket.once('timeout', onError);

		socket.connect(port, 'localhost', () => {
			socket.end();
			resolve(true);
		});
	}));

	try {
		await promise;
		return true;
	} catch {
		return false;
	}
}