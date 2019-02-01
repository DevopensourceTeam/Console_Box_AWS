import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import ViewManager from './ViewManager';

//const { BrowserWindow, BrowserView } = window.require('electron').remote;

ReactDOM.render(<ViewManager />, document.getElementById('root'));
serviceWorker.register();