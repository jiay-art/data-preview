import * as vscode from "vscode";

class VcdPreviewDocument implements vscode.CustomDocument {
  static async create(uri: vscode.Uri): Promise<VcdPreviewDocument> {
    const content = await vscode.workspace.fs.readFile(uri);
    return new VcdPreviewDocument(uri, content);
  }

  private constructor(public uri: vscode.Uri, private content: Uint8Array) {}

  get getText(): string {
    return Buffer.from(this.content).toString("utf-8");
  }

  dispose(): void {}

  // Implement other methods of CustomDocument as needed
}

export class VcdPreviewEditorProvider
  implements vscode.CustomEditorProvider<VcdPreviewDocument>
{
  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new VcdPreviewEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      VcdPreviewEditorProvider.viewType,
      provider,
      {
        // For this demo extension, we enable `retainContextWhenHidden` which keeps the
        // webview alive even when it is not visible. You should avoid using this setting
        // unless is absolutely required as it does have memory overhead.
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      }
    );
    return providerRegistration;
  }

  private static readonly viewType = "myWave.vcd";

  private constructor(private readonly context: vscode.ExtensionContext) {}

  async openCustomDocument(uri: vscode.Uri): Promise<VcdPreviewDocument> {
    return await VcdPreviewDocument.create(uri);
  }

  async resolveCustomEditor(
    document: VcdPreviewDocument,
    webviewPanel: vscode.WebviewPanel
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(this.context.extensionPath)],
    };

    webviewPanel.webview.html = this.getWebviewContent(webviewPanel.webview);

    webviewPanel.webview.onDidReceiveMessage((message) => {
      console.log("Received message from Webview", message);
      if (message.command === "loadData") {
        webviewPanel.webview.postMessage({
          command: "loadData",
          data: { fileName: document.uri.path, content: document.getText },
        });
      }
    });
  }

  private getWebviewContent(webview: vscode.Webview): string {
    // Local path to script and css for the webview
    const scriptVcdromUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "vcdrom.js")
    );
    const linkeWoffUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "media",
        "iosevka-term-light.woff2"
      )
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "main.css")
    );
    const scriptMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "main.js")
    );

    // Use a nonce to whitelist which scripts can be run
    // const nonce = getNonce();

    return /* html */ `<!DOCTYPE html>
    <html lang="zh-CN">
    
    <head>
      <meta charset="UTF-8">
      <title>VCDPreview</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preload" as="font" href="${linkeWoffUri}" type="font/woff2">
      <link rel="stylesheet" href="${styleMainUri}">
      <script src="${scriptVcdromUri}"></script>
    </head>
    
    <body>
      <div id="waveformTest"></div>
      <script src="${scriptMainUri}"></script>
    </body>
    
    </html>`;
  }

  // CustomEditorProvider methods
  onDidChangeCustomDocument: any;
  saveCustomDocument(
    document: VcdPreviewDocument,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    throw new Error("Method not implemented.");
  }
  saveCustomDocumentAs(
    document: VcdPreviewDocument,
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    throw new Error("Method not implemented.");
  }
  revertCustomDocument(
    document: VcdPreviewDocument,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    throw new Error("Method not implemented.");
  }
  backupCustomDocument(
    document: VcdPreviewDocument,
    context: vscode.CustomDocumentBackupContext,
    cancellation: vscode.CancellationToken
  ): Thenable<vscode.CustomDocumentBackup> {
    throw new Error("Method not implemented.");
  }
}
