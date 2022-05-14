import * as vsc from 'vscode';
import { join, basename } from 'path';
import { transferFolderToServer, retrieveFileFromServer } from '../communication/ftp';
import { getFirstWorkspaceUriIfExists } from '../utils/files';
import { Diff } from '../gui/DiffProvider';

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


export const retrieveFileFromServerCommand = (remoteFilePath: string, context: vsc.ExtensionContext): void => {
	(async () => {
		// const remoteFilePath:string | undefined = context.workspaceState.get('remoteFilePathToRetrieve');
		
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


export const displayDiff = (diffId: string, text: string) => {
	const output = vsc.window.createOutputChannel(diffId);
	output.append(text);
	output.show();
}

export const applyDiff = (diff_: Diff, context: vsc.ExtensionContext) => {
	(async () => {
		// const optionalDiffs: Array<{id: string, diff: string, path: string}> | undefined = context.workspaceState.get('generatedDiffs');
		const optionalUri = getFirstWorkspaceUriIfExists();
		// console.log('apply', diff_);

		if(optionalUri === undefined ) {
			return;
		}

		// const filteredDiffs = optionalDiffs.filter(diff => diff.id == diff_.id);

		// if(filteredDiffs.length !== 0) {
		// 	return;
		// }

		// const remoteFilePath = join(
		// 	'output_astor',
		// 	`AstorMain-${basename(optionalUri.uri.path)}`,
		// 	'src',
		// 	diff_.label,
		// 	diff_.path.split('src/java')[1]);

		// console.log('hihihi', diff_.path);
		// console.log(remoteFilePath);
		// // await context.workspaceState.update('patchPath', remoteFilePath);
		// retrieveFileFromServerCommand(remoteFilePath, context);
		const splittedSourceCode = diff_.value.split('\n');
		const diffLine = splittedSourceCode[2];
		const [startLine, numberLines] = diffLine
			.substring(4, diffLine.length - 3)
			.split(' ')[0]
			.split(',')
			.map(nb => parseInt(nb));
		console.log(startLine, numberLines);
		const edit = new vsc.WorkspaceEdit();
		const localFilePath = vsc.Uri.joinPath(optionalUri.uri, diff_.path); 
		console.log('local', localFilePath);
		edit.replace(localFilePath, new vsc.Range(startLine, 0, startLine + numberLines, splittedSourceCode[splittedSourceCode.length - 1].length), extractAdditions(diff_.value));
		vsc.workspace.applyEdit(edit).then(x => console.log('x', x), y => console.log('y', y));
	})();
}


const extractAdditions = (sourceCode: string): string => {
	return sourceCode
		.split('\n')
		.slice(4)
		.filter((line: string) => !line.startsWith('-'))
		.map((line: string) => {
			if(line.startsWith('+')) {
				line = line.replace('+', ' ');
			}
			return line;
		})
		.join('\n');
}