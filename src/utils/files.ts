import * as vsc from 'vscode'

const _TMP_FOLDER = '.idexfix-tmp'

// TODO: Change name
export const getFirstWorkspaceUriIfExists = (): vsc.WorkspaceFolder | undefined => {
	const workspaceFolders = vsc.workspace.workspaceFolders;
	return workspaceFolders !== undefined ? workspaceFolders[0] : undefined;
}

export const getTmpFolderPath = (): vsc.Uri | undefined => {
	const workspaceFolder = getFirstWorkspaceUriIfExists();

	return workspaceFolder !== undefined ? 
		vsc.Uri.joinPath(workspaceFolder.uri, _TMP_FOLDER) : undefined;
}


export const createTmpDirectory = (): void => {
	const tmpFolderPath = getTmpFolderPath();

	if(tmpFolderPath !== undefined) {
		vsc.workspace.fs.createDirectory(tmpFolderPath);
		console.log('Temporary folder created', tmpFolderPath)
	} else {
		console.log('No temporary folder was created');
	}
}