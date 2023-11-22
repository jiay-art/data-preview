// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
// import { acquireVsCodeApi } from "vscode";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "data-preview" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('data-preview.helloWorld', () => {
  // 	// The code you place here will be executed every time your command is executed
  // 	// Display a message box to the user
  // 	vscode.window.showInformationMessage('Hello World from data-preview!');
  // });

  // context.subscriptions.push(disposable);

  vscode.window.registerWebviewViewProvider("myPluginView", {
    resolveWebviewView(webviewView) {
      // 从my-data.json中读取数据
      console.log("==========>resolveWebviewView");
      // 设置 localResourceRoots 允许加载外部资源
      webviewView.webview.options = {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(context.extensionPath)],
      };
      webviewView.webview.html = getWebviewContent(context);
      // 1. 获取数据
      const configData = getConfigFileData();
      //2. 传递数据
      webviewView.webview.postMessage({
        command: "updateConfig",
        data: configData,
      });
    },
  });
}

//获取配置文件中的数据
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

//渲染数据列表// 渲染数据列表
function getWebviewContent(context: vscode.ExtensionContext): string {
  const onDiskPath = vscode.Uri.joinPath(context.extensionUri, "views", "list.html");
  // Set the HTML content of the webview
  const htmlContent = fs.readFileSync(onDiskPath.fsPath, "utf-8");
  return htmlContent;
  // `
  //   ${htmlContent}
  //   <script>
  //   // 等待 HTML 页面加载完成后再发送数据
  //   // document.addEventListener('DOMContentLoaded', function() {
  //   //   //updateConfigDisplay(${JSON.stringify(getConfigFileData())});
  //   //   //console.log('hello world')
  //   //   // 在扩展代码中发送消息
  //   //   const vscode = acquireVsCodeApi();
  //   //   vscode.postMessage({
  //   //     command: 'updateConfig',
  //   //     data: ${JSON.stringify(getConfigFileData())},
  //   //   });
  //   // });
  //   </script>
  // `;
}

// This method is called when your extension is deactivated
export function deactivate() {}
