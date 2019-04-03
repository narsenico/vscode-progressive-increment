/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;
// const myExtension = require('../extension');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    // Defines a Mocha unit test
    test("Increment all numbers", async function () {
        const uri = vscode.Uri.file(path.join(__dirname, "increment_all_numbers.txt"));
        const document = await vscode.workspace.openTextDocument(uri);
        const editor = await vscode.window.showTextDocument(document)
        // mi assicuro che l'editor del documento sia quello attivo
        assert.deepEqual(editor, vscode.window.activeTextEditor);
        await vscode.commands.executeCommand("editor.action.selectAll");
        // incremento tutti i numeri trovati nella selezione di 1
        await vscode.commands.executeCommand("progressive.incrementBy1");
        // verifico che il testo modificato sia corretto
        const text = editor.document.getText();
        const expectedText = await fs.readFile(path.join(__dirname, "increment_all_numbers_expected.txt"), 'utf8');
        assert.equal(text, expectedText);
    });
});