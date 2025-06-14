# dicom-quick-viewer README

VS Code 上で DICOM 画像をプレビュー表示する拡張機能です。`Preview DICOM` コマンドを実行すると、アクティブな `.dcm` ファイルが DWV ライブラリを使用した Webview に表示されます。

## Features

- 開いている DICOM ファイルを即座にプレビュー
  - DWV ライブラリを利用した Webview 表示

## 動作確認

1. 依存パッケージをインストールします。
   ```bash
   npm install
   ```
2. VS Code で本リポジトリを開き、`F5` キーを押してデバッグを開始します。新しい Extension Development Host が起動します。
3. 起動したウィンドウで任意の `.dcm` ファイルを開きます。
4. `Ctrl+Shift+P`（macOS の場合は `Cmd+Shift+P`）でコマンドパレットを開き、`Preview DICOM` を実行します。
5. Webview に画像が表示されれば動作確認は成功です。

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
