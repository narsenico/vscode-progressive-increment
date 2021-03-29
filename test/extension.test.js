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

/**
 * Seleziona tutto il contenuto del file ed esegue l'incremento.
 *
 * @param {String} testfile
 * @param {String} expectedfile
 */
async function selectAllAndIncrements(testfile, expectedfile) {
    const inputText = await fs.readFile(testfile, 'utf8');
    const expectedText = await fs.readFile(expectedfile, 'utf8');
    const document = await vscode.workspace.openTextDocument();
    const editor = await vscode.window.showTextDocument(document)
    await editor.edit(editBuilder => editBuilder.insert(new vscode.Position(0, 0), inputText));
    // mi assicuro che l'editor del documento sia quello attivo
    assert.deepEqual(editor, vscode.window.activeTextEditor);
    // seleziono tutto
    await vscode.commands.executeCommand("editor.action.selectAll");
    // incremento tutti i numeri trovati nella selezione di 1
    await vscode.commands.executeCommand(
        'progressive.incrementBy1',
        hasSkipFirstSelection(inputText)
    );
    // verifico che il testo modificato sia corretto
    const text = editor.document.getText();
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    assert.equal(text, expectedText);
}

/**
 * Seleziona riga per riga ed esegue l'incremento.
 *
 * @param {String} testfile
 * @param {String} expectedfile
 */
async function splitSelectionAndIncrements(testfile, expectedfile) {
    const inputText = await fs.readFile(testfile, 'utf8');
    const expectedText = await fs.readFile(expectedfile, 'utf8');
    const document = await vscode.workspace.openTextDocument();
    const editor = await vscode.window.showTextDocument(document);
    await editor.edit(editBuilder => editBuilder.insert(new vscode.Position(0, 0), inputText));
    // mi assicuro che l'editor del documento sia quello attivo
    assert.deepEqual(editor, vscode.window.activeTextEditor);
    // seleziono tutto e splitto la selezione su ogni riga
    await vscode.commands.executeCommand("editor.action.selectAll");
    await vscode.commands.executeCommand("editor.action.insertCursorAtEndOfEachLineSelected");
    await vscode.commands.executeCommand("cursorHomeSelect");
    // incremento tutti i numeri trovati nella selezione di 1
    await vscode.commands.executeCommand(
        'progressive.incrementBy1',
        hasSkipFirstSelection(inputText)
    );
    // verifico che il testo modificato sia corretto
    const text = editor.document.getText();
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    assert.equal(text, expectedText);
}

function hasSkipFirstSelection(text) {
    return /^##.*skipFirstSelection.*\n/i.test(text);
}

async function exec(fn) {
    const rgTestExt = /\.test$/;
    // cerco tutti i file .test nella cartella cases/
    // per ogni file eseguo la funzione in parametro passando il percorso
    //  del file di test e del corrispettivo contenente il risultato aspettato dopo l'incremento
    const folder = path.join(__dirname, "cases");
    const list = await fs.readdir(folder);
    for (const testfile of list.filter(f => rgTestExt.test(f))) {
        const expectedfile = path.join(folder, testfile.replace(rgTestExt, '.expected'));
        await fn(path.join(folder, testfile), expectedfile);
    }
}

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    // Defines a Mocha unit test
    test("Select all and increments by 1", async function () {
        await exec(selectAllAndIncrements);
    });
    test("Split into selections and increments by 1", async function () {
        await exec(splitSelectionAndIncrements);
    });
});