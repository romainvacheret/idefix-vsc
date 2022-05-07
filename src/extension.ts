import * as vsc from 'vscode';

import { transferWorkspaceFolderCommand, retrieveFileFromServerCommand } from './commands/files';
import { compileProjectCommand } from './commands/execution';
import { createTmpDirectory } from './utils/files';

const _clearWorkspaceStates = (context: vsc.ExtensionContext) => 
	context.workspaceState.keys()
		.forEach((key: string) => context.workspaceState.update(key, undefined));

export const activate = (context: vsc.ExtensionContext) => {
	// TODO: May be a useful to keep them in the future
	_clearWorkspaceStates(context);	
	createTmpDirectory();
	console.log('test');
	const disposable = vsc.commands.registerCommand('idefix-vsc.helloWorld', () => {
		vsc.window.showInformationMessage('Hello World from idefix-vsc!');
	});

	const commandTransferWorkspaceFolderCommand = vsc.commands.registerCommand(
		'idefix-vsc.transferWorkspaceFolderCommand', 
		() => transferWorkspaceFolderCommand(context));
	const commandCompileProjectCommand = vsc.commands.registerCommand(
		'idefix-vsc.compileProjectCommand',
		() => compileProjectCommand(context));
	const commandRetrieveFileFromServerCommand = vsc.commands.registerCommand(
		'idefix-vsc.retrieveFileFromServerCommand',
		() => retrieveFileFromServerCommand(context));

	context.subscriptions.push(disposable);
	context.subscriptions.push(commandTransferWorkspaceFolderCommand);
	context.subscriptions.push(commandRetrieveFileFromServerCommand);
	context.subscriptions.push(commandCompileProjectCommand);
}

export const deactivate = () => {}


