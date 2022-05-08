import * as vsc from 'vscode';
import { basename } from 'path';

import { sendJsonRpcRequest }  from '../communication/jsonRpc';
import { getFirstWorkspaceUriIfExists } from '../utils/files';


export const compileProjectCommand = (context: vsc.ExtensionContext): void => {
	(async () => {
		// TODO: Make the command a parameter 
		const optionalUri = getFirstWorkspaceUriIfExists();
		if(optionalUri === undefined) {
			console.log('Project name is not defined');
			vsc.window.showErrorMessage('Project name is not defined');
			context.workspaceState.update('isJsonRpcCommandSuccessfull-compile', false);
			return;
		}
		const compileCommand = 'mvn clean compile test -DskipTests';
		sendJsonRpcRequest('compile', [basename(optionalUri.uri.path), compileCommand], context);

		// TODO: To look into & fix
		// Note: Because the value is set in the callback, the value will always be
		// undefined the first time the command is triggered
		context.workspaceState.get('isJsonRpcCommandSuccessfull-compile') === true ?
		vsc.window.showInformationMessage('Project compiled successfully') :
		vsc.window.showErrorMessage('An error occured during the compilation of the project');
	})();
}


export const launchProjectAnalysisCommand = (context: vsc.ExtensionContext): void => {
	(async () => {
		const optionalUri = getFirstWorkspaceUriIfExists();
		if(optionalUri === undefined) {
			console.log('Project name is not defined');
			vsc.window.showErrorMessage('Project name is not defined');
			return;
		}

		const workspacePath = basename(optionalUri.uri.path);
		const defaultParameters = {'-mode':  'jgenprog',
			'-srcjavafolder': '/src/java/',
			'-srctestfolder': '/src/test/',
			'-binjavafolder': '/target/classes/',
			'-bintestfolder':  '/target/test-classes/',
			'-location': workspacePath,
			'-dependencies': `${workspacePath}/lib`}

		sendJsonRpcRequest('analyze', [defaultParameters], context);
	})();
}