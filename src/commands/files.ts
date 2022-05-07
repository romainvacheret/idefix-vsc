import * as vsc from 'vscode';

import { transferFolderToServer, retrieveFileFromServer } from '../communication/ftp';
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


export const retrieveFileFromServerCommand = (context: vsc.ExtensionContext): void => {
	(async () => {
		const remoteFilePath:string | undefined = context.workspaceState.get('remoteFilePathToRetrieve');
		
		if(remoteFilePath === undefined) {
			console.log('The context have no value for the remote file path to retrieve');
			context.workspaceState.update('isTcpFileDownloadSuccessfull', false);
			vsc.window.showErrorMessage('No file path were provided for the download');
			return;
		}

		retrieveFileFromServer(remoteFilePath, context);

		context.workspaceState.get('isTcpFileDownloadSuccessfull') === true ?
			vsc.window.showInformationMessage('The patch has been downloaded successfully') :
			vsc.window.showErrorMessage('An error occured during the download of the patch');
	})();
}