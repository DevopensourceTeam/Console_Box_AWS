const electron = require('electron');

const app = electron.app;
//const { BrowserWindow, BrowserView} = electron.BrowserWindow;
const { BrowserWindow, BrowserView} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const store = new Store();
const globalShortcut = electron.globalShortcut;

let preloadWindow;
let mainWindow;


function preloader() {
	preloadWindow = new BrowserWindow({
		width: 200, 
		height: 200, 
		frame: false,
		resizable: false,
	});
	preloadWindow.loadURL(`file://${path.join(__dirname, '../build/components/preload.html')}`);
	preloadWindow.on('closed', () => (preloadWindow = null));
	//preloadWindow.setIgnoreMouseEvents(true);
}

function createWindow() {
	
	mainWindow = new BrowserWindow({
		width: 900, 
		height: 680 , 
		show:false, 
		icon: path.join(__dirname, './icon.icns'),
		minWidth: 600, // set a min width!
		minHeight: 300, // and a min height!
		frame: true,
		titleBarStyle: 'default',
		nodeIntegration: false
	});

	preloader();
	mainWindow.loadURL(isDev ? 'http://localhost:3000?view=viewA' : `file://${path.join(__dirname, '../build/index.html?view=viewA')}`);
	mainWindow.on('closed', () => (mainWindow = null));
	mainWindow.once('ready-to-show', () => {
		preloadWindow.hide();
		preloadWindow.close();
		mainWindow.show();
	});
	//Menu allow copy paste
	require('./menu/mainMenu');

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
	globalShortcut.unregisterAll();
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});