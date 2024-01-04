import * as vscode from "vscode";
import { VcdPreviewEditorProvider } from "./vcdEditor";

function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(VcdPreviewEditorProvider.register(context));
}

export { activate };
