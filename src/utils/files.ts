import * as vsc from 'vscode'

export const getFirstWorkspaceUriIfExists = (): vsc.WorkspaceFolder | undefined => {
	const workspaceFolders = vsc.workspace.workspaceFolders;
	return workspaceFolders !== undefined ? workspaceFolders[0] : undefined;
}