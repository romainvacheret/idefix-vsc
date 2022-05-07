import * as ftp from 'basic-ftp';
import * as vsc from 'vscode'
import { basename } from 'path';
import { getTmpFolderPath } from '../utils/files';

const _ftpServerConfig = {
    host: "127.0.0.1",
    user: "idefix",
    password: "idefix",
};

export const transferFolderToServer = async(folderUri: vsc.Uri, 
        context: vsc.ExtensionContext): Promise<void> => {

    const client = new ftp.Client();
    const remotePath = basename(folderUri.path);
    client.ftp.verbose = true;

    try {
        await client.access(_ftpServerConfig);
		await client.ensureDir(remotePath);
        await client.clearWorkingDir();
		await client.uploadFromDir(folderUri.path);
	} catch(err) {
        console.log(err);
        context.workspaceState.update('isTcpTransferSuccessfull', false);
    }

    context.workspaceState.update('isTcpTransferSuccessfull', true);
    client.close();
}


export const retrieveFileFromServer = async(remoteFilePath: string, 
        context: vsc.ExtensionContext): Promise<void> => {
    
    const client = new ftp.Client();
    const fileBaseName = basename(remoteFilePath);
    const tmpFolderPath = getTmpFolderPath();

    if(tmpFolderPath === undefined) {
        console.log('There is not temporary folder');
        context.workspaceState.update('isTcpFileDownloadSuccessfull', false);
        return;
    }

    const localPath = vsc.Uri.joinPath(tmpFolderPath, fileBaseName);
    client.ftp.verbose = true;

    try {
        await client.access(_ftpServerConfig);
        await client.downloadTo(localPath.path, remoteFilePath);
    } catch(err) {
        console.log(err);
        context.workspaceState.update('isTcpFileDownloadSuccessfull', false);
    }

    context.workspaceState.update('isTcpFileDownloadSuccessfull', true);
    client.close();
}