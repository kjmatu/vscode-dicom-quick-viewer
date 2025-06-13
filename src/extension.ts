// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// 型定義がないため any として読み込む
const daikon: any = require('daikon');

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
                                vscode.Uri.joinPath(context.extensionUri, 'node_modules', 'daikon', 'release', 'current', 'daikon-min.js')
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
    <canvas id="dicomCanvas"></canvas>
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
        const data = new DataView(base64ToArrayBuffer(base64));
        const image = daikon.Series.parseImage(data);
        if (!image) {
            document.body.innerText = '画像の読み込みに失敗しました';
        } else {
            const rows = image.getRows();
            const cols = image.getCols();
            const pixelData = image.getInterpretedData();
            const canvas = document.getElementById('dicomCanvas');
            canvas.width = cols;
            canvas.height = rows;
            const ctx = canvas.getContext('2d');
            const imgData = ctx.createImageData(cols, rows);
            let min = pixelData[0], max = pixelData[0];
            for (let i = 1; i < pixelData.length; i++) {
                const v = pixelData[i];
                if (v < min) min = v;
                if (v > max) max = v;
            }
            for (let i = 0; i < pixelData.length; i++) {
                const v = pixelData[i];
                const n = Math.round((v - min) / (max - min) * 255);
                const idx = i * 4;
                imgData.data[idx] = n;
                imgData.data[idx + 1] = n;
                imgData.data[idx + 2] = n;
                imgData.data[idx + 3] = 255;
            }
            ctx.putImageData(imgData, 0, 0);
        }
    </script>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
