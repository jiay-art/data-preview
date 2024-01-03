import * as vscode from "vscode";
import * as fs from "fs/promises";
import path from "path";

class VCDPreviewProvider implements vscode.CustomTextEditorProvider {
  private webviewContent: string = "";

  constructor(private context: vscode.ExtensionContext) {}

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    console.log("resolveCustomTextEditor", document);
    const content = document.getText();
    // const webviewPanel = vscode.window.createWebviewPanel(
    //   "vcd",
    //   "vcd preview",
    //   vscode.ViewColumn.One,
    //   {
    //     enableScripts: true, // 启用JS，默认禁用
    //     retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
    //     localResourceRoots: [vscode.Uri.file(this.context.extensionPath)],
    //   }
    // );

    webviewPanel.webview.options = {
      enableScripts: true,
      // retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(this.context.extensionPath)],
    };

    webviewPanel.webview.options = {
      enableScripts: true,
    };

    // Load external JS and CSS resources
    const scriptUri = vscode.Uri.file(
      path.join(this.context.extensionPath, "views/vcdrom.js")
    );
    const styleUri = vscode.Uri.file(
      path.join(this.context.extensionPath, "views/iosevka-term-light.woff2")
    );

    const scriptSrc = webviewPanel.webview.asWebviewUri(scriptUri);
    const styleSrc = webviewPanel.webview.asWebviewUri(styleUri);

    this.webviewContent = await this.getWebviewContent(
      this.context,
      scriptSrc,
      styleSrc
    );

    webviewPanel.webview.html = this.webviewContent;

    webviewPanel.webview.onDidReceiveMessage((message) => {
      console.log("Received message from Webview", message);
      if (message.command === "loadData") {
        webviewPanel.webview.postMessage({
          command: "loadData",
          data: { fileName: document.fileName, content },
        });
      }
    });

    // Update Webview content when the document changes
    vscode.workspace.onDidChangeTextDocument(async (event) => {
      if (event.document === document) {
        this.webviewContent = await this.getWebviewContent(
          this.context,
          scriptSrc,
          styleSrc
        );
        webviewPanel.webview.html = this.webviewContent;
      }
    });
  }

  private async getWebviewContent(
    context: vscode.ExtensionContext,
    scriptSrc: vscode.Uri,
    styleSrc: vscode.Uri
  ): Promise<string> {
    const resourcePath = vscode.Uri.joinPath(
      vscode.Uri.file(context.extensionPath),
      "views/list.html"
    );

    const htmlContent = await fs.readFile(resourcePath.fsPath, "utf-8");
    return htmlContent
      .replace(/{{scriptSrc}}/g, scriptSrc.toString())
      .replace(/{{styleSrc}}/g, styleSrc.toString());
  }
}

export default VCDPreviewProvider;