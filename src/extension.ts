import * as vscode from "vscode";
import { VcdPreviewEditorProvider } from "./vcdPreviewEditorProvider";

function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(VcdPreviewEditorProvider.register(context));
}

export { activate };
