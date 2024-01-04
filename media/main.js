
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();
  vscode.postMessage({
    command: 'loadData',
    data: "request data",
  });
  window.addEventListener('message', event => {
    const message = event.data;
    // console.log('Received message:', message);
    // 处理接收到的消息
    switch (message.command) {
      case 'loadData':
        // updateConfigDisplay(message.data);
        const blob = new Blob([message.data.content], { type: 'application/octet-stream' });
        const stream = blob.stream();
        VCDromExt('waveformTest', message.data.fileName, stream);
        break;
    }
  });
}());