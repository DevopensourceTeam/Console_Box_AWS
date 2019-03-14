import React from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';
import 'typeface-roboto';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import ListItemText from '@material-ui/core/ListItemText';
/** DIALOG **/
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
/** DIALOG **/

/* ADD WORKSPACE */
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/LibraryAdd';
/* ADD WORKSPACE */

/* Spiner */
import CircularProgress from '@material-ui/core/CircularProgress';
/* Spiner */

/* Store */
const { remote } = window.require('electron');
const Store = window.require('electron-store');
const store = new Store();
/* Store */

/* DEV */
const isDev = window.require('electron-is-dev');
/* DEV */

/** **/
window.React = React;
/** **/
const { BrowserWindow, BrowserView } = window.require('electron').remote;
/** **/

const test = BrowserWindow.getAllWindows()[0];

/** **/
const path = require('path');
const url = require('url');

const ipc = window.require('electron').remote.ipcMain;
const globalShortcut = window.require('electron').remote.globalShortcut;

const noIMG = require('./assets/img/NO-IMAGE.jpg');

const { Menu, MenuItem } = window.require('electron').remote
//const menu = new Menu();
const menu = Menu.getApplicationMenu();
console.log('menu:', menu);

class ViewA extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      newImage: '',
      open: false,
      name: '',
      active: '',
      id: 1,
      workSpaces: [],
      images: {},
      res: [0, 0]
    }
  }

  componentWillMount = () => {
    let workspacesStore = store.get('workspaces');
    let imagesStore = store.get('images');
    if(typeof(workspacesStore)!=='undefined'){
      workspacesStore.map(w => {
        w.id = 0;
      });
      this.setState({workSpaces: workspacesStore});
    }
    if(typeof(imagesStore)!=='undefined'){
      this.setState({ images: imagesStore})
    }
    
  }
  
  componentDidMount = () => {
    ipc.on('update-image', (event, arg) => {
      var images = store.get('images');
      this.setState({images: images})
      console.log(arg[1]);
      console.log(arg[0]);
      console.log(arg);
    });
    
  }

  componentWillUnmount = () => {
    ipc.removeAllListeners();
    globalShortcut.unregisterAll();
  }


  workspacesShortcut = (quantity) => {

  }

  /* WORKSPACES */

  getIndexByName = (name) => {
    
    if(typeof name !== 'undefined'){ 
      var output = this.state.workSpaces.filter(
        (workSpaces) => {
          return workSpaces.name === name;
        }
      );
      return output.length >0? this.state.workSpaces.indexOf(output[0]) : -1;
    }else{
      return -1;
    }
  }
  getWorkspaceByName = (name) => {
    if(typeof name !== 'undefined'){ 
      var output = this.state.workSpaces.filter(
        (workSpaces) => {
          return workSpaces.name === name;
        }
      );
      return output.length >0? output[0] : -1;
    }else{
      return -1;
    }
  }

  getWorkspaceByIndex = (index) => {
    var workspace = this.state.workSpaces[index];
    return typeof workspace === 'undefined'? -1 : this.state.workSpaces[index];
  }

  /* WORKSPACES */

  /* Get 1st JSON object */
  first = (state) => {
    var i=0;
    for(let st in state){
      var exit = st;
      if(i===1){ return exit};
      i++;
    }
    return undefined;
  }
/* Get 1st JSON object */

	activeColor = (workSpace) => {
		return this.state.active===workSpace?1:0.5;
  }
  
  setActive = (act) => {
    this.setState({active: act})
  }

  checkRes = () => {
    return (JSON.stringify(this.state.res) === JSON.stringify(test.getSize()));
  }

  openWorkSpace = (workSpace) => {
    var test = BrowserWindow.getAllWindows()[0];
    var workspace = this.getWorkspaceByName(workSpace);
    let view = BrowserView.fromId(workspace.id);
    if(view){
      test.setBrowserView(view);
      view.setBounds({ x: 73, y: 0, width: test.getSize()[0]-73, height: test.getSize()[1]-26 });
      isDev? view.webContents.openDevTools():console.log('Production mode');
      this.setActive(workSpace);
    }else{
      let view = new BrowserView({
        webPreferences: {
          nodeIntegration: true,
          partition: `persist:${workSpace}`,
          devTools: true,
        },
        parent: test
      });
    
      test.setBrowserView(view);

      /* ------------------------------------------------------------------------------ SWITCH DEV ---------------------------------------------------------------------------- */
      isDev? view.webContents.loadURL(`http://localhost:3000?view=viewB&session=${workSpace}`) : view.webContents.loadURL(`file://${path.join(remote.app.getAppPath(), `./build/index.html?view=viewB&session=${workSpace}`)}`);
      //view.webContents.loadURL(`http://localhost:3000?view=viewB&session=${workSpace}`);
      //view.webContents.loadURL(`file://${path.join(remote.app.getAppPath(), `./build/index.html?view=viewB&session=${workSpace}`)}`);
      /* ------------------------------------------------------------------------------ SWITCH DEV ---------------------------------------------------------------------------- */

      view.setBounds({ x: 73, y: 0, width: test.getSize()[0]-73, height: test.getSize()[1] });
      view.setAutoResize({width:true, height: true});

      var woorkspaces = this.state.workSpaces;
      var woorkspacesIndex = this.getIndexByName(workspace.name);
      woorkspaces[woorkspacesIndex].id = view.id;
      this.setState({workSpaces:woorkspaces});

      store.set('workspaces', woorkspaces);

      this.setActive(workSpace);

      view.webContents.on('destroyed', (event) => {
        this.setState({workSpaces: store.get('workspaces')});
        this.setState({images: store.get('images')})
        this.setActive('');
      });
    }
  }

  /* ADD WORKSPACE */
  _handleEnter = (event) => {
    if (event.charCode === 13) {
      this._addWorkspace();
    }
  }

  _addWorkspace = () => {
    
    // Check for white space
    var reWhiteSpace = new RegExp(/\s/);
    const name = this.state.name;
    
    if (reWhiteSpace.test(name) || name.length<1) {
        alert('No white spaces allowed.');
    }else{
      var workspaces = this.state.workSpaces;
      
      // Check workspace already exists
      if(this.getIndexByName(name) !== -1){
        alert('The name of this workspace already exists.')
      }else{
        
        this.setImage(this.state.name);
        workspaces.push({name: this.state.name, id: 0})
        this.setState({workspaces: workspaces});
        
        store.set('workspaces', workspaces);
        
        let window = BrowserWindow.getAllWindows()[0];
        window.setBrowserView(null);
        this.handleClose('create');
        this.openWorkSpace(this.state.name);
        
      }
    }
  }

  modifyMenuWorkspaces = () => {
    var workspaceItems = menu.items[5].submenu.items;
  }

  /* ADD WORKSPACE */

  /* DIALOG */
  handleClickOpen = () => {
    this.setState({open: true});
    this.setState({newImage: ''});
    let window = BrowserWindow.getAllWindows()[0];
    window.setBrowserView(null);
  }

  handleClose = (type) => {
    this.setState({open: false, name: '', newImage:''});

    if(type === 'close'){
      
      if(this.state.active !== ''){
        var workspace = this.getWorkspaceByName(this.state.active);
        var view = BrowserView.fromId(workspace.id);
        let window = BrowserWindow.getAllWindows()[0];
        window.setBrowserView(view);
      }
    }else if(type === 'create'){

    }else{

    }

    this.setState({open: false, name: ''});
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
	};
  /* DIALOG */

  _renderWorkspaces = () => {
    let children = [];
    var text = remote.process.platform === 'darwin' ? 'cmd' : 'ctrl';
    var i =1;

    this.state.workSpaces.map(workspace => {
      children.push(
        <ListItem className="bttn" key={workspace.name} >
          {/*<span style={{borderLeft: this.activeColor(workspace) === 1 ? '1px dotted white' : 'none'}}></span>*/}
          <div style={{backgroundImage: 'red', borderRadius: 8, borderLeft: this.activeColor(workspace.name) === 1 ? '3px solid #FF9735' : 'none', textAlign:'center', width: this.activeColor(workspace.name) === 1 ? '69px' : '72px'}}>
          <a onClick={() => {this.openWorkSpace(workspace.name)}} href="#/" style={{marginLeft: this.activeColor(workspace.name) === 1 ? '-8px!important': 'none'}}>
            <Tooltip title={workspace.name} enterDelay={700} leaveDelay={200} placement="bottom">
              <img style={{opacity:this.activeColor(workspace.name), backgroundColor:'#FFFFFF'}} alt={workspace.name} className="workspace-img" src={this.getImageBase64(workspace.name)} />
              {/*this.getImageBase64(workspace)*/}
            </Tooltip>
          </a>
          </div>
          <ListItemText className="secondary" secondary={`${text}+${i}`} style={{color: 'red', textAlign: 'center'}}/>
        </ListItem>
      );
      i++;
      
      });
    return children;
  }

  /* UPLOAD IMAGE */
  fileChangedHandler = (event) => {
    const file = event.target.files[0];
    this.setState({newImage: file});
  }

  setImage = async (workspace) => {
    var b64;
    if(this.state.newImage !== ''){
      b64 = await this.getBase64(this.state.newImage);
    }else{
      b64 = '';
    }
      var images = store.get('images');

      if(typeof(images) == 'undefined'){
        var imgs = {};
        imgs[workspace] = b64;
        this.setState({images: imgs});
        store.set('images', imgs);
      }else{
          images[workspace] = b64;
          this.setState({images: images});
          await store.set('images', images);
      }
  }

  getBase64 = async (file) => {
    return new Promise((resolve,reject) => {
       const reader = new FileReader();
       reader.onload = () => resolve(reader.result);
       reader.onerror = error => reject('');
       reader.readAsDataURL(file);
    });
  }

  getImageBase64 = (workspace) => {
    var image = this.state.images[workspace];
    return image === '' ? noIMG : image;
  }
  /* UPLOAD IMAGE */
 
  /* LOADING */

  showLoading = () => {
    if(this.state.active !== ''){
      return <CircularProgress className="App-spin" />;
    }else{
      return <div className="App-img" />;
    }
  }

  /* LOADING */

  /* RENDER WORKSPACES */

  render() {
    return (
      <div className="App">
        <Drawer className="drawer" variant="permanent">
        
          <List>
            {this._renderWorkspaces()}
          </List>
          <div>
          <IconButton className="add" onClick={()=>this.handleClickOpen()}>
            <SettingsIcon />
          </IconButton>
          </div>
          <Dialog open={this.state.open} onClose={() => this.handleClose('close')} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create new workspace</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create new workspace, please enter the name here without white spaces.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Workspace name"
                type="email"
                onChange={this.handleChange('name')}
                fullWidth
                onKeyPress={event => this._handleEnter(event)}
              />
              <Button variant="contained" component="label">
                Select workspace image
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={this.fileChangedHandler}/>
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose('close')} color="secondary">
                Cancel
              </Button>
              <Button onClick={() => this._addWorkspace()} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>

        </Drawer>
        <div id="app-content" className="App-content">
          
            {this.showLoading()}
          
        </div>
      </div>
    );
  }
}

export default ViewA;
