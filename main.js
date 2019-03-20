var { app, BrowserWindow } = require('electron');
// var url = require('url);

let win = null;

app.on('ready', () => {
    win = new BrowserWindow({
        width: 1400,
        height: 1000
    })

    win.loadURL('http://localhost:4200');

    win.on('closed', () => {
        win = null;
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})