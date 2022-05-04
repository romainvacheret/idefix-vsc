import * as vsc from 'vscode';

import { transferWorkspaceFolderCommand } from './commands/files';
import {compileProjectCommand } from './commands/execution';

const _clearWorkspaceStates = (context: vsc.ExtensionContext) => 
	context.workspaceState.keys()
		.forEach((key: string) => context.workspaceState.update(key, undefined));

export function activate(context: vsc.ExtensionContext) {
	// TODO: May be a useful to keep them in the future
	_clearWorkspaceStates(context);	
	const disposable = vsc.commands.registerCommand('idefix-vsc.helloWorld', () => {
		vsc.window.showInformationMessage('Hello World from idefix-vsc!');
	});

	const commandTransferWorkspaceFolderCommand = vsc.commands.registerCommand(
		'idefix-vsc.transferWorkspaceFolderCommand', 
		() => transferWorkspaceFolderCommand(context));
	const commandCompileProjectCommand = vsc.commands.registerCommand(
		'idefix-vsc.compileProjectCommand',
		() => compileProjectCommand(context));

	context.subscriptions.push(disposable);
	context.subscriptions.push(commandTransferWorkspaceFolderCommand);
	context.subscriptions.push(commandCompileProjectCommand);
}

export function deactivate() {}
