import * as ftp from 'basic-ftp';
import * as vsc from 'vscode'
import { basename } from 'path';
import { getTmpFolderPath } from '../utils/files';

const _ftpServerConfig = {
    host: "127.0.0.1",
    user: "idefix",
    password: "idefix",
};

export const transferFolderToServer = (folderUri: vsc.Uri, 
        context: vsc.ExtensionContext): void => {

    (async () => {
        const client = new ftp.Client();
        const remotePath = basename(folderUri.path);
        let anErrorOccured: boolean = false;
        client.ftp.verbose = true;

        try {
            await client.access(_ftpServerConfig);
            await client.ensureDir(remotePath);
            await client.clearWorkingDir();
            await client.uploadFromDir(folderUri.path);
        } catch(err) {
            console.log(err);
            vsc.window.showErrorMessage('An error occured during the compilation of the project');
            anErrorOccured = true;
            await context.workspaceState.update('isTcpTransferSuccessful', false);
        }
        finally {
            client.close();
        }

        if(!anErrorOccured) {
            vsc.window.showInformationMessage('Project compiled successfully');
            await context.workspaceState.update('isTcpTransferSuccessful', true);
        }
    })();
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