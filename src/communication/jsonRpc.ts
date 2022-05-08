import * as vsc from 'vscode';
import * as jayson from 'jayson';

export const sendJsonRpcRequest = async (command: string, args: Array<any>, 
		context: vsc.ExtensionContext, stateKey: string | undefined=undefined): Promise<void> => {
	const client = jayson.Client.http({port: 8080});
	const commandStorageName = `isJsonRpcCommandSuccessfull-${command}`;

	client.request(command, args, (err: any, response: any) => {
		if(err) {
			console.log(err);
			context.workspaceState.update(commandStorageName, false);
		}
		console.log(response.result); 
		context.workspaceState.update(commandStorageName, true);

		if(stateKey !== undefined) {
			console.log('RESPONSE', response);
			context.workspaceState.update(stateKey, response.result).then(res => 
				console.log('statekey', context.workspaceState.get(stateKey)));
		}
	});
}