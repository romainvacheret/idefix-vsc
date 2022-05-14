import * as vsc from 'vscode';

export class DiffProvider implements vsc.TreeDataProvider<Diff> {
	constructor(private context: vsc.ExtensionContext) {}

	getTreeItem(element: Diff): vsc.TreeItem | Thenable<vsc.TreeItem> {
		return element
	}

	getChildren(element?: Diff): Thenable<Diff[]> {
		const optionalDiffs: Array<{id: string, diff: string, path: string}> | undefined = this.context.workspaceState.get('generatedDiffs');

		if(element === undefined && optionalDiffs !== undefined) {
			return Promise.resolve(optionalDiffs.map(diff => new Diff(
				diff.id,
				diff.diff,
				diff.path, 
				vsc.TreeItemCollapsibleState.None)));
		}
		return Promise.resolve([]);
	}
	
	

	private _onDidChangeTreeData: vsc.EventEmitter<Diff | undefined | null | void> = new vsc.EventEmitter<Diff | undefined | null | void>();
	readonly onDidChangeTreeData: vsc.Event<Diff | undefined | null | void> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}


}

export class Diff extends vsc.TreeItem{
	constructor(public readonly label: string, 
		public readonly value: string, 
		public readonly path: string,
		public readonly collapsibleState: vsc.TreeItemCollapsibleState) {
		super(label, collapsibleState);
	}

	command?: vsc.Command | undefined = {
		title: "",
		command: "idefix-vsc.displayDiff",
		arguments: [this.label, this.value]
	}

}