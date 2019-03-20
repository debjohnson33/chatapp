var { app, BrowserWindow } = require('electron');
var url = require('url');
var path = require('path');

let win = null;

app.on('ready', () => {
    win = new BrowserWindow({
        width: 1400,
        height: 1000
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: file,
        slashes: true
    }))

    win.on('closed', () => {
        win = null;
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})