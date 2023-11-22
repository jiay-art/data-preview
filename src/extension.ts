// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerWebviewViewProvider("myPluginView", {
    resolveWebviewView(webviewView) {
      // 从my-data.json中读取数据
      console.log("==========>resolveWebviewView");

      // 设置 localResourceRoots 允许加载外部资源
      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)],
      };

      // 设置 Webview 的 HTML 内容
      webviewView.webview.html = getWebviewContent(context);

      // 监听来自 Webview 的消息
      webviewView.webview.onDidReceiveMessage((message) => {
        console.log("收到来自 Webview 的消息", message);
        if (message.command === "updateConfig") {
          // 1. 获取数据,处理更新配置数据的逻辑
          const updatedConfigData = getConfigFileData();
          // 2. 传递数据,将数据发送给 Webview
          webviewView.webview.postMessage({
            command: "updateConfig",
            data: updatedConfigData,
          });
        }
      });
    },
  });
}

/**
 * 获取配置文件中的数据
 * 从当前目录的.vscode下的my-data.json中获取数据
 * @returns
 */
function getConfigFileData(): any[] {
  try {
    const configPath = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, ".vscode", "my-data.json");
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(configData);
      return config;
    }
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * 获取html页面数据
 * @param context 
 * @returns 
 */
function getWebviewContent(context: vscode.ExtensionContext): string {
  const onDiskPath = vscode.Uri.joinPath(context.extensionUri, "views", "list.html");
  // Set the HTML content of the webview
  const htmlContent = fs.readFileSync(onDiskPath.fsPath, "utf-8");
  return htmlContent;
}

// This method is called when your extension is deactivated
export function deactivate() {}
