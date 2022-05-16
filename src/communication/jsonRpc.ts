import * as vsc from 'vscode';
import * as jayson from 'jayson';

interface ResponseStatusCallback {
	(status: boolean): void;
}

export const sendJsonRpcRequest = (command: string, args: Array<any>, 
		context: vsc.ExtensionContext, 
		callback: ResponseStatusCallback,
		stateKey: string | undefined=undefined): void => {
		
	(async () => {
		const client = jayson.Client.http({port: 8080});
		const commandStorageName = `isJsonRpcCommandSuccessfull-${command}`;

		client.request(command, args, (err: any, response: any) => {
			if(err) {
				console.log(err);
				context.workspaceState.update(commandStorageName, false);
			}
			console.log('response', response.result); 
			context.workspaceState.update(commandStorageName, true);

			if(stateKey !== undefined) {
				console.log('RESPONSE', response);
				context.workspaceState.update(stateKey, response.result);
			}
			const result = response.result;
			callback(err !== undefined && 
				((typeof result === 'boolean' && result === true ) || 
				typeof result !== 'boolean'));
		});
	})();
}