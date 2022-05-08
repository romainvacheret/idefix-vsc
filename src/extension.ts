import * as vsc from 'vscode';

import { transferWorkspaceFolderCommand, retrieveFileFromServerCommand, displayDiff } from './commands/files';
import { compileProjectCommand, launchProjectAnalysisCommand, listGeneratedDiffs } from './commands/execution';
import { createTmpDirectory } from './utils/files';
import { DiffProvider } from './gui/DiffProvider';

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
	const commandLaunchProjectAnalysisCommand = vsc.commands.registerCommand(
		'idefix-vsc.launchProjectAnalysisCommand',
		() => launchProjectAnalysisCommand(context));
	const commandListGeneratedDiffsCommand = vsc.commands.registerCommand(
		'idefix-vsc.listGeneratedDiffsCommand',
		() => listGeneratedDiffs(context));
		
	
		vsc.commands.registerCommand(
			'idefix-vsc.displayDiff',
			displayDiff);
	const diffProvider = new DiffProvider(context);
		vsc.commands.registerCommand('diffProvider.refreshEntry', () =>
			diffProvider.refresh()
	);

	vsc.window.registerTreeDataProvider(
		'diffProvider',
		diffProvider
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(commandTransferWorkspaceFolderCommand);
	context.subscriptions.push(commandRetrieveFileFromServerCommand);
	context.subscriptions.push(commandCompileProjectCommand);
	context.subscriptions.push(commandLaunchProjectAnalysisCommand);
	context.subscriptions.push(commandListGeneratedDiffsCommand);
	

	
}

export const deactivate = () => {}


