// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// function execIncrementBy(increment) {
//     const editor = vscode.window.activeTextEditor;
//     if (editor && editor.selections && editor.selections.length > 0) {
//         editor.edit(editBuilder => {
//             const selections = editor.selections;
//             let text = editor.document.getText(selections[0]);
//             let selectionText;
//             let value = parseInt(text);
//             if (!isNaN(value)) {
//                 // controllo che tutte le selezioni contengano lo stesso testo
//                 for (let ii = 1; ii < selections.length; ii++) {
//                     if (editor.document.getText(selections[ii]) !== text) {
//                         // il testo non è uguale, ritorno senza fare nulla
//                         console.warn(`Selezione diversa alla riga ${ii+1}`);
//                         return;
//                     }
//                 }
//                 // modifico le selezioni con i nuovi valori
//                 for (let ii = 0; ii < selections.length; ii++) {
//                     text = (value += increment).toString();
//                     selectionText = editor.document.getText(selections[ii]);
//                     if (text.length >= selectionText.length) {
//                         editBuilder.replace(selections[ii], text);
//                     } else {
//                         editBuilder.replace(selections[ii], selectionText.substring(0, selectionText.length - text.length) + text);
//                     }
//                 };
//             }
//         }).then(resp => {
//             console.log('Edit could be applied:', resp);
//         });
//     }
// }

function execIncrementBy(increment) {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.selections && editor.selections.length > 0) {
        editor.edit(editBuilder => {
            const selections = editor.selections;
            let selectionText, replacedText;
            let refValue;
            for (let ii = 0; ii < selections.length; ii++) {
                selectionText = editor.document.getText(selections[ii]);
                // cerco tutte le porzioni di stringa contenente valori numerici
                // e li incremento considerando come valore iniziale il primo numero trovato
                // cerco di mantenere 
                replacedText = selectionText.replace(/\d+/g, nn => {
                    if (refValue === undefined) {
                        refValue = +nn;
                    }
                    let val = (refValue += increment).toString();
                    // se il valore incrementato ha una lunghezza inferiore della stringa nn
                    // significa che nn è preceduta da '0'
                    if (val.length < nn.length) {
                        // aggiungo '0' davanti al valore
                        val = Array(nn.length - val.length).fill('0').join('') + val;
                    }
                    return val;
                });

                if (selectionText != replacedText) {
                    editBuilder.replace(selections[ii], replacedText);
                }
            };
        }).then(resp => {
            console.log('Edit could be applied:', resp);
        });
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Running extension "Progressive: increment by"');

    // implemento i comandi definiti nel package.json
    context.subscriptions.push(vscode.commands.registerCommand('extension.incrementBy1', function () {
        execIncrementBy(1);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.incrementBy10', function () {
        execIncrementBy(10);
    }));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;