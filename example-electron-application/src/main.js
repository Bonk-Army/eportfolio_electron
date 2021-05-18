const {app, BrowserWindow} = require('electron')
const path = require('path')
const os = require('os-utils')

function createWindow(){
    const window = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences:{
            preload: path.join(__dirname, 'preload.js')
        }
    })

    window.loadFile('src/index.html')

    setInterval(() => {
        os.cpuUsage(function(v){
            window.webContents.send('cpu',v*100);
            window.webContents.send('mem',os.freememPercentage()*100);
            window.webContents.send('total-mem',os.totalmem()/1024);
        });
    },1000);
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () =>{
    if (process.platform !== 'darwin'){
        app.quit()
    }
})