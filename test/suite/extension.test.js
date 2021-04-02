/* global suite, test */

const assert = require('assert');
const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;

/**
 * Seleziona tutto il contenuto del file ed esegue l'incremento.
 *
 * @param {String} testfile
 * @param {String} expectedfile
 */
async function selectAllAndIncrements(testfile, expectedfile) {
    const inputText = await fs.readFile(testfile, 'utf8');
	const skipFirstNumber = hasSkipFirstNumber(inputText);
    const expectedText = normalizeText(await fs.readFile(expectedfile, 'utf8'));
    const document = await vscode.workspace.openTextDocument();
    const editor = await vscode.window.showTextDocument(document);
    await editor.edit(editBuilder => editBuilder.insert(new vscode.Position(0, 0), inputText));
    // mi assicuro che l'editor del documento sia quello attivo
    assert.deepStrictEqual(editor, vscode.window.activeTextEditor);
    // seleziono tutto
    await vscode.commands.executeCommand("editor.action.selectAll");
    // incremento tutti i numeri trovati nella selezione di 1
    await vscode.commands.executeCommand(
        'progressive.incrementBy1',
        skipFirstNumber
    );
    // verifico che il testo modificato sia corretto
    const text = normalizeText(editor.document.getText());
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    assert.strictEqual(text, expectedText, `File: '${testfile}' skipFirstNumber=${skipFirstNumber}`);
}

/**
 * Seleziona riga per riga ed esegue l'incremento.
 *
 * @param {String} testfile
 * @param {String} expectedfile
 */
async function splitSelectionAndIncrements(testfile, expectedfile) {
    const inputText = await fs.readFile(testfile, 'utf8');
	const skipFirstNumber = hasSkipFirstNumber(inputText);
    const expectedText = normalizeText(await fs.readFile(expectedfile, 'utf8'));
    const document = await vscode.workspace.openTextDocument();
    const editor = await vscode.window.showTextDocument(document);
    await editor.edit(editBuilder => editBuilder.insert(new vscode.Position(0, 0), inputText));
    // mi assicuro che l'editor del documento sia quello attivo
    assert.deepStrictEqual(editor, vscode.window.activeTextEditor);
    // seleziono tutto e splitto la selezione su ogni riga
    await vscode.commands.executeCommand("editor.action.selectAll");
    await vscode.commands.executeCommand("editor.action.insertCursorAtEndOfEachLineSelected");
    await vscode.commands.executeCommand("cursorHomeSelect");
    // incremento tutti i numeri trovati nella selezione di 1
    await vscode.commands.executeCommand(
        'progressive.incrementBy1',
        skipFirstNumber
    );
    // verifico che il testo modificato sia corretto
    const text = normalizeText(editor.document.getText());
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    assert.strictEqual(text, expectedText, `File: '${testfile}' skipFirstNumber=${skipFirstNumber}`);
}

function hasSkipFirstNumber(text) {
    return /^##.*skipFirstNumber.*\n/i.test(text);
}

function normalizeText(text) {
	return text ? text.replace(/\r\n/g, '\n') : '';
}

// async function exec(fn) {
//     const rgTestExt = /\.test$/;
//     // cerco tutti i file .test nella cartella cases/
//     // per ogni file eseguo la funzione in parametro passando il percorso
//     //  del file di test e del corrispettivo contenente il risultato aspettato dopo l'incremento
//     const folder = path.join(__dirname, "cases");
//     const list = await fs.readdir(folder);
//     for (const testfile of list.filter(f => rgTestExt.test(f))) {
// 		// if (!/test1_skipfirst/.test(testfile)) continue;
//         const expectedfile = path.join(folder, testfile.replace(rgTestExt, '.expected'));
//         await fn(path.join(folder, testfile), expectedfile);
//     }
// }

// suite('Extension Tests', function () {
//     test('Select all and increments by 1', async () =>
//         await exec(selectAllAndIncrements));
//     test('Split into selections and increments by 1', async () =>
//         await exec(splitSelectionAndIncrements));
// });

suite('Select all', async function () {
    const folder = path.join(__dirname, 'cases');

    test('Increment all by 1: test1.test', async () =>
        await selectAllAndIncrements(
            path.join(folder, 'test1.test'),
            path.join(folder, 'test1.expected')
        ));
    test('Increment all by 1: test2.test', async () =>
        await selectAllAndIncrements(
            path.join(folder, 'test2.test'),
            path.join(folder, 'test2.expected')
        ));
    test('Increment all by 1: test3.test', async () =>
        await selectAllAndIncrements(
            path.join(folder, 'test3.test'),
            path.join(folder, 'test3.expected')
        ));
    test('Increment all by 1: test4.test', async () =>
        await selectAllAndIncrements(
            path.join(folder, 'test4.test'),
            path.join(folder, 'test4.expected')
        ));
    test('Increment all by 1: test1_skipfirst.test', async () =>
        await selectAllAndIncrements(
            path.join(folder, 'test1_skipfirst.test'),
            path.join(folder, 'test1_skipfirst.expected')
        ));
});

suite('Split selections', async function () {
    const folder = path.join(__dirname, 'cases');

    test('Increment all by 1: test1.test', async () =>
        await splitSelectionAndIncrements(
            path.join(folder, 'test1.test'),
            path.join(folder, 'test1.expected')
        ));
    test('Increment all by 1: test2.test', async () =>
        await splitSelectionAndIncrements(
            path.join(folder, 'test2.test'),
            path.join(folder, 'test2.expected')
        ));
    test('Increment all by 1: test3.test', async () =>
        await splitSelectionAndIncrements(
            path.join(folder, 'test3.test'),
            path.join(folder, 'test3.expected')
        ));
    test('Increment all by 1: test4.test', async () =>
        await splitSelectionAndIncrements(
            path.join(folder, 'test4.test'),
            path.join(folder, 'test4.expected')
        ));
    test('Increment all by 1: test1_skipfirst.test', async () =>
        await splitSelectionAndIncrements(
            path.join(folder, 'test1_skipfirst.test'),
            path.join(folder, 'test1_skipfirst.expected')
        ));
});