import * as vsc from 'vscode';

import { transferFolderToServer } from '../communication/ftp';
import { getFirstWorkspaceUriIfExists } from '../utils/files';

export const transferWorkspaceFolderCommand = (context: vsc.ExtensionContext): void => {
	(async () => {
		const workspaceFolder = getFirstWorkspaceUriIfExists();

		if(workspaceFolder === undefined) {
			vsc.window.showErrorMessage('No workspace is open, impossible to transfer files to the server');
			return false;
		}

		const workspaceFolderUri = workspaceFolder.uri;
		await transferFolderToServer(workspaceFolderUri, context);
		
		// TODO: Add more context to the error message
		context.workspaceState.get('isTcpTransferSuccessfull') === true ?
			vsc.window.showInformationMessage('Folder successfully transfered to the server') :
			vsc.window.showErrorMessage('An error occured during the file transfer');
	})();
}