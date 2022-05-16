import * as vsc from 'vscode';
import { basename } from 'path';

import { sendJsonRpcRequest }  from '../communication/jsonRpc';
import { getFirstWorkspaceUriIfExists } from '../utils/files';


export const compileProjectCommand = (context: vsc.ExtensionContext): void => {
	(async () => {
		// TODO: Make the command a parameter 
		const optionalUri = getFirstWorkspaceUriIfExists();
		if(optionalUri === undefined) {
			vsc.window.showErrorMessage('Project name is not defined');
			await context.workspaceState.update('isJsonRpcCommandSuccessfull-compile', false);
			return;
		}
		const compileCommand = 'mvn clean compile test -DskipTests';
		const statusCallback = (status: boolean) => status ? 
			vsc.window.showInformationMessage('Project compiled successfully') :
			vsc.window.showErrorMessage('An error occured during the compilation of the project');

		sendJsonRpcRequest('compile', [basename(optionalUri.uri.path), compileCommand], context, statusCallback);
	})();
}


export const launchProjectAnalysisCommand = (context: vsc.ExtensionContext): void => {
	(async () => {
		const optionalUri = getFirstWorkspaceUriIfExists();
		if(optionalUri === undefined) {
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
		const statusCallback = (status: boolean) => status ? 
			vsc.window.showInformationMessage('Analysis ran successfully') :
			vsc.window.showErrorMessage('An error occured during the analysis');

		sendJsonRpcRequest('analyze', [defaultParameters], context, statusCallback);
	})();
}

export const listGeneratedDiffs = (context: vsc.ExtensionContext): void => {
	(async () => {
		const optionalUri = getFirstWorkspaceUriIfExists();
		if(optionalUri === undefined) {
			vsc.window.showErrorMessage('Project name is not defined');
			return;
		}

		const workspacePath = basename(optionalUri.uri.path);
		const statusCallback = (status: boolean) => status ? 
			vsc.window.showInformationMessage('Diffs downloaded successfully') :
			vsc.window.showErrorMessage('An error occured during the downlaod of the diffs');

		sendJsonRpcRequest('list-diffs', [workspacePath], context, statusCallback, 'generatedDiffs');
	})();
}