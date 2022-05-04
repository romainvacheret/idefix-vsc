import * as ftp from 'basic-ftp';
import * as vsc from 'vscode'

export const transferFolderToServer = async (folderUri: vsc.Uri, 
        context: vsc.ExtensionContext): Promise<void> => {

    const client = new ftp.Client()
    const splittedPath = folderUri.path.split('/');
    const remotePath = splittedPath[splittedPath.length - 1];
    client.ftp.verbose = true

    try {
        await client.access({
            host: "127.0.0.1",
            user: "idefix",
            password: "idefix",
        });
		await client.ensureDir(remotePath);
        await client.clearWorkingDir()
		await client.uploadFromDir(folderUri.path);
	} catch(err) {
        console.log(err);
        context.workspaceState.update('isTcpTransferSuccessfull', false);
    }

    context.workspaceState.update('isTcpTransferSuccessfull', true);
    client.close();
}