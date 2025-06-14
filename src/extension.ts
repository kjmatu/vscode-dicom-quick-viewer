// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dicom-quick-viewer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
        const disposableHello = vscode.commands.registerCommand('dicom-quick-viewer.helloWorld', () => {
                vscode.window.showInformationMessage('Hello World from dicom-quick-viewer!');
        });

        const disposablePreview = vscode.commands.registerCommand('dicom-quick-viewer.previewDicom', async () => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                        vscode.window.showErrorMessage('DICOMファイルを開いてください');
                        return;
                }

                const uri = editor.document.uri;
                try {
                        const buffer = await vscode.workspace.fs.readFile(uri);
                        const base64 = Buffer.from(buffer).toString('base64');
                        const panel = vscode.window.createWebviewPanel(
                                'dicomPreview',
                                'DICOM Preview',
                                vscode.ViewColumn.One,
                                { enableScripts: true }
                        );

                        const scriptUri = panel.webview.asWebviewUri(
                                vscode.Uri.joinPath(context.extensionUri, 'node_modules', 'dwv', 'dist', 'dwv.min.js')
                        );

                        panel.webview.html = getWebviewContent(base64, scriptUri);
                } catch (err) {
                        vscode.window.showErrorMessage(`読み込みに失敗しました: ${err}`);
                }
        });

        context.subscriptions.push(disposableHello, disposablePreview);
}

/**
 * Webview の HTML を生成する
 */
function getWebviewContent(base64: string, scriptUri: vscode.Uri): string {
        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; script-src 'self' 'unsafe-eval'; style-src 'unsafe-inline';">
    <script src="${scriptUri}"></script>
</head>
<body>
    <div id="layerGroup0" style="width:100%; height:100%;"></div>
    <script>
        const base64 = "${base64}";
        function base64ToArrayBuffer(b64) {
            const bin = atob(b64);
            const len = bin.length;
            const buf = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                buf[i] = bin.charCodeAt(i);
            }
            return buf.buffer;
        }
        const buffer = base64ToArrayBuffer(base64);
        // DWV アプリケーションを初期化
        const app = new dwv.App();
        const viewConfig = new dwv.ViewConfig('layerGroup0');
        const options = new dwv.AppOptions({'*': [viewConfig]});
        options.viewOnFirstLoadItem = false;
        app.init(options);
        // ロード完了後に描画
        app.addEventListener('load', () => {
            const id = app.getDataIds()[0];
            app.render(id);
            app.fitToContainer();
        });
        app.loadImageObject([{ name: 'image.dcm', data: buffer }]);
    </script>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
