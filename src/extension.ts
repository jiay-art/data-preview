import * as vscode from "vscode";
import VCDPreviewProvider from "./vcdPreviewProvider";

function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      "mywave.vcd",
      new VCDPreviewProvider(context)
    )
  );
}

export { activate };
