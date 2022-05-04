import * as vsc from 'vscode';

import { sendJsonRpcRequest }  from '../communication/jsonRpc';


export const compileProjectCommand = (context: vsc.ExtensionContext): void => {
	(async () => {
		// TODO: Make the command a parameter 
		const compileCommand = 'mvn clean compile test -DskipTests';
		const projectName = 'Math-issue-280';
		sendJsonRpcRequest('compile', [projectName, compileCommand], context);

		console.log('q', context.workspaceState.keys());
		console.log('s', context.workspaceState.get('isJsonRpcCommandSuccessfull-compile'));

		// TODO: To look into & fix
		// Note: Because the value is set in the callback, the value will always be
		// undefined the first time the command is triggered
		context.workspaceState.get('isJsonRpcCommandSuccessfull-compile') === true ?
		vsc.window.showInformationMessage('Project compiled successfully') :
		vsc.window.showErrorMessage('An error occured during the compilation of the project');
	})();
}