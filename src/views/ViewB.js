import React from 'react';
import '../App.css';
import './css/Views.css';
import {Tab, Tabs} from 'react-draggable-tab';
/* MENU */
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
/* MENU */
/* NAVBAR */
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import Bookmarks from '@material-ui/icons/Bookmarks';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
/* NAVBAR */
/** DIALOG **/
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
/** DIALOG **/
import StarButton from './components/StarButton';

const { remote } = window.require('electron');
/* STORE */
const Store = window.require('electron-store');
const store = new Store();
/* STORE */

window.React = React;
const { BrowserWindow, BrowserView } = window.require('electron').remote;

const ipc = window.require('electron').ipcRenderer;

export default class ViewB extends React.Component {

	constructor(props) {
    super(props);
    var bkmrk = store.get('bookmarks');
    if(typeof bkmrk == 'undefined'){
      bkmrk = []
    }
		this.state = {
      anchorEl: null,
      bookmarkEl: null,
      session : props.session,
      workspaceImage: '',
      open: false,
			tabs:[],
      badgeCount: 0,
      bookmarks: bkmrk
    }
  }

  componentWillMount = () => {
    var bkmrk = store.get('bookmarks');
    this.setState({bookmarks: bkmrk});

    var tabs = this.state.tabs;
    var tab0 = (<Tab key={'tab0'} title={'Fixed - ' + this.props.session} >
    <AppBar position="static" className="AppBar">
      <Toolbar className="Toolbar">
        <IconButton onClick={()=>{this.goBack('tab0')}}>
          <ArrowBackIcon className="icon" />
        </IconButton>
        <IconButton onClick={()=>{this.goForward('tab0')}}>
          <ArrowForwardIcon className="icon" />
        </IconButton>
        <IconButton onClick={()=>{this.reload('tab0')}}>
          <AutorenewIcon className="icon" />
        </IconButton>
        <div className="search">
          <InputBase
            placeholder="Search…"
            className="inputRoot root"
            inputRef={ref => this['tab0-search'] = ref}
            onKeyPress={event => this.handleURL(event, 'tab0')}
            onFocus={this.handleFocus}
          />
          <IconButton onClick={()=>{this.addFavorite('tab0')}}  >
            <StarButton bookmarks={this.state.bookmarks} ref={ref => this['tab0-star'] = ref}/>
          </IconButton>
        </div>
        <IconButton onClick={this.handleBookmarkListClick} style={{marginRight:10}}>
          <Bookmarks className="icon" />
        </IconButton>
        <IconButton onClick={()=>{this.handleDevTools('tab0')}}>
          <VerticalSplitIcon className="icon" />
        </IconButton>
      </Toolbar>
    </AppBar>
    <div className="fullSpace">
      <webview id={'tab0'} ref={ref => this['tab0'] = ref} className="webview" autosize="true" src="https://signin.aws.amazon.com/console" partition={"persist:"+ this.props.session} onContextMenu={()=>{alert('context menu')}}></webview>
    </div>
  </Tab>);
    tabs.push(tab0);
    this.setState({tabs: tabs});
    /*
    var bkmrk = store.get('bookmarks');
    this.setState({bookmarks: bkmrk});
    */
  }

  handleFocus = (event) => event.target.select();

  changeURL = (key) => {
    this[key + '-search'].value = this[key].getURL();
    if(typeof this[key+'-star'] !== 'undefined'){
    this[key+'-star'].setUrl(this[key].getURL());
    }
  }
  addListener = (key) => {
    this[key].addEventListener('dom-ready', ()=>{this.changeURL(key)});
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.tabs.length < this.state.tabs.length){
      this[this.state.selectedTab].addEventListener('dom-ready', ()=>{this.changeURL(this.state.selectedTab)});
    }else if(prevState.tabs.length > this.state.tabs.length){
      this[this.state.selectedTab].removeEventListener('dom-ready', ()=>{this.changeURL(this.state.selectedTab)});
    }
  }
  
	componentDidMount = () => {
    window.addEventListener('resize', this._handleResize);
    this['tab0'].addEventListener('dom-ready', ()=>{this.changeURL('tab0')});
    this['tab0'].addEventListener('context-menu', event => {
      console.log(event);
      if(event.params.mediaType == 'image'){
        console.log('Image URL: ', event.params.srcURL);
      }else{
        console.log('Link URL: ', event.params.linkURL);
        console.log('Text selected: ', event.params.selectionText)
      }
    });
  }
  
	componentWillUnmount = () => {
    window.removeEventListener('resize', this._handleResize);
    this['tab0'].removeEventListener('dom-ready', ()=>{this.changeURL('tab0')});
  }

 
	_handleResize = (e) => {
		let test = BrowserWindow.getAllWindows()[0];
    e.preventDefault();
    let win = BrowserView.fromId(remote.getCurrentWindow().id);
    win!=null? win.setBounds({ x: 73, y: 0, width: test.getSize()[0]-73, height: test.getSize()[1] }):console.log('err');
  }

	/* TABS */
	handleTabSelect(e, key, currentTabs) {
    this.setState({selectedTab: key, tabs: currentTabs});
  }

  handleTabClose = (e, key, currentTabs) => {
    this.setState({tabs: currentTabs});
  }

  handleTabPositionChange(e, key, currentTabs) {
    this.setState({tabs: currentTabs});
  }

  handleTabAddButtonClick = (e, currentTabs) => {
    // key must be unique
    
    const key = 'newTab_' + Date.now();

    let newTab = (<Tab key={key} title={this.state.session}>
                    <AppBar position="static" className="AppBar">
                      <Toolbar className="Toolbar">
                        <IconButton onClick={()=>{this.goBack(key)}}>
                          <ArrowBackIcon className="icon" />
                        </IconButton>
                        <IconButton onClick={()=>{this.goForward(key)}}>
                          <ArrowForwardIcon className="icon" />
                        </IconButton>
                        <IconButton onClick={()=>{this.reload(key)}}>
                          <AutorenewIcon className="icon" />
                        </IconButton>
                        <div className="search">
                          <InputBase
                            placeholder="Search…"
                            className="inputRoot root"
                            inputRef={ref => this[key+'-search'] = ref}
                            onKeyPress={event => this.handleURL(event, key)}
                            onFocus={this.handleFocus}
                          />
                          <IconButton onClick={()=>{this.addFavorite(key)}}  >
                            <StarButton bookmarks={this.state.bookmarks} ref={ref => this[key+'-star'] = ref}/>
                          </IconButton>
                        </div>
                        <IconButton onClick={this.handleBookmarkListClick} style={{marginRight:10}}>
                          <Bookmarks className="icon" />
                        </IconButton>
                        <IconButton onClick={()=>{this.handleDevTools(key)}}>
                          <VerticalSplitIcon className="icon" />
                        </IconButton>
                      </Toolbar>
                    </AppBar>
                    <div className="fullSpace">
											<webview id={key} ref={ref => this[key] = ref} className="webview" autosize="on" src="https://signin.aws.amazon.com/console" partition={"persist:"+ this.state.session} ></webview>
                    </div>
                  </Tab>);
    let newTabs = currentTabs.concat([newTab]);
    this.setState({
      tabs: newTabs,
      selectedTab: key
    });
  }
  /* TABS */

  /* MENU */
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  _deteteWorkspace = () => {
    let stor = store.get('workspaces');
    let storImg = store.get('images');

    let test = BrowserWindow.getAllWindows()[0];
    let win = BrowserView.fromId(stor[this.state.session]);

    delete stor[this.state.session];
    delete storImg[this.state.session];
    
    store.set('workspaces', stor);
    store.set('images', storImg);

    test.setBrowserView(null);
    win.destroy();
  }
  /* MENU */

  /* LOAD IMAGE */
  loadImage = (image) => {
    var fr = new FileReader(); 
  }
  /* LOAD IMAGE */

  /* APPBAR */
  reload = (ref) => {
    this[ref].reload();
  }

  goBack = (ref) => {
    this[ref].goBack();
  }

  goForward = (ref) => {
    this[ref].goForward();
  }

  handleDevTools = (ref) => {
    if(this[ref].isDevToolsOpened()){
      this[ref].closeDevTools();
    }else{
      this[ref].openDevTools()
    }
  }

  handleURL = (event, ref) => {

    if (event.charCode === 13) {
      this[ref+'-search'].blur();
      let val = this[ref+'-search'].value;
      let https = val.slice(0, 8).toLowerCase();
      let http = val.slice(0, 7).toLowerCase();
      if (https === 'https://') {
        this[ref].loadURL(val);
      } else if (http === 'http://') {
        this[ref].loadURL(val);
      } else {
        this[ref].loadURL('http://'+ val);
        
      }
    }
     
  }
  
  /* APPBAR */

  /* CHANGE IMAGE */
  changeImage = async () => {
    var b64;
    if(this.state.workspaceImage !== ''){
      b64 = await this.getBase64(this.state.workspaceImage);
    }else{
      b64 = '';
    }
    var images = store.get('images');
    if(b64){
      images[this.state.session] = b64;
      await store.set('images', images);
      ipc.send('update-image', [this.state.session]);
    }
    this.handleCloseImg();
    this.handleClose();
  }

  getBase64 = async (file) => {
    return new Promise((resolve,reject) => {
       const reader = new FileReader();
       reader.onload = () => resolve(reader.result);
       reader.onerror = error => reject('');
       reader.readAsDataURL(file);
    });
  }

  fileChangedHandler = (event) => {
    const file = event.target.files[0];
    this.setState({workspaceImage: file});
  }

  handleOpen = () => {
    this.setState({open: true});
  }

  handleCloseImg = () => {
    this.setState({open: false, workspaceImage:''});
  }
  /* CHANGE IMAGE */
  /* ADD FAVORITE */

  addFavorite = (key) => {
    var bookmark = this.state.bookmarks;
    var index = this.getIndexBookmark(this[key].getURL());
    if(index < 0){
      bookmark.push({url: this[key].getURL(), name: this[key].getTitle()});
      this.setState({bookmarks: bookmark});
      store.set('bookmarks', bookmark);
    }else{
      bookmark.splice(index, 1);
      this.setState({bookmarks: bookmark});
      store.set('bookmarks', bookmark);
    }
    for(let tab of this.state.tabs){
      this[tab.key+'-star'].bookmarks(this.state.bookmarks);
    }
  }

  starType = (key) => {
    try{
    if(typeof this[key].getURL() === 'undefined'){
      return <StarBorder className="icon" />
    }else{
      
      return this.state.bookmarks.indexOf(this[key].getURL()) < 0? <StarBorder className="icon" /> : <Star className="icon" />;
    }
  }catch(err){return <StarBorder className="icon" />}
  }

  /* ADD FAVORITE */
  /* BOOKmARKS */
  getBookmark = (code) => {
    if(typeof code !== 'undefined'){
      
      var output = this.state.bookmarks.filter(
        (bookmarks) => {
          if(code.includes('http')){
            return bookmarks.url == code;
          }else{
            return bookmarks.name == code;
          }
        }
      );
      if(code.includes('http')){
        return output.length >0? output[0].name : -1;
      }else{
        return output.length >0? output[0].url : -1;
      }
    }else{
      return -1;
    }
  }
  
  getIndexBookmark = (code) => {
    if(typeof code !== 'undefined'){ 
      var output = this.state.bookmarks.filter(
        (bookmarks) => {
          if(code.includes('http')){
            return bookmarks.url == code;
          }else{
            return bookmarks.name == code;
          }
        }
      );
      return output.length >0? this.state.bookmarks.indexOf(output[0]) : -1;
    }else{
      return -1;
    }
    
  }

  handleBookmarkListClose = () => {
    this.setState({ bookmarkEl: null });
  }

  handleBookmarkListClick = event => {
    this.setState({ bookmarkEl: event.currentTarget });
  }

  renderBookmarkList = (key) => {
    let children = [];
    if(this.state.bookmarks.length==0){
      children.push(
        <MenuItem key={0} onClick={() => { this.handleBookmarkListClose()}}>No bookmarks saved</MenuItem>
        );
    }else{
      this.state.bookmarks.forEach((bookmark)=>{
        children.push(
        <MenuItem key={bookmark.name} onClick={() => { this.bookmarkOpen(bookmark.url)}}>{bookmark.name}</MenuItem>
        );
      });
    }
    
    return children;
  }

  bookmarkOpen = (url) => {
    var activeTab = this.state.selectedTab;
    this[this.state.selectedTab ? this.state.selectedTab : 'tab0'].loadURL(url);
    this.handleBookmarkListClose();
  }

  /* BOOKmARKS */

	render() {
    const { anchorEl, bookmarkEl } = this.state;
    
	  return (
		  <div className="Dim-screen">
        <div className="actions">
          <IconButton
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
          <SettingsIcon />
          </IconButton>
        </div>	  
        <Tabs
          ref={ref => this['tabs'] = ref}
          selectedTab={this.state.selectedTab ? this.state.selectedTab : 'tab0'}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          tabs={this.state.tabs}
          shortCutKeys={
            {
              'close': ['alt+command+w', 'alt+ctrl+w'],
              'create': ['command+t', 'alt+ctrl+t'],
              'moveRight': ['alt+command+tab', 'alt+ctrl+tab'],
              'moveLeft': ['shift+alt+command+tab', 'shift+alt+ctrl+tab']
            }
          }
          tabsStyles={
            {
              tabBarAfter: {
                'backgroundColor': 'rgb(29, 40, 51)'
              },
              tab: {
                'backgroundImage': 'linear-gradient(rgb(35, 48, 61),rgb(29, 40, 51))'
              },
              tabAfter: {
                'backgroundImage': 'linear-gradient(rgb(35, 48, 61),rgb(29, 40, 51))'
              },
              tabBefore: {
                'backgroundImage': 'linear-gradient(rgb(35, 48, 61),rgb(29, 40, 51))'
              },
              tabActive: {
                'backgroundImage': 'linear-gradient(rgb(53, 76, 99),rgb(29, 40, 51))'
              },
              tabAfterActive: {
                'backgroundImage': 'linear-gradient(rgb(53, 76, 99),rgb(29, 40, 51))'
              },
              tabBeforeActive: {
                'backgroundImage': 'linear-gradient(rgb(53, 76, 99),rgb(29, 40, 51))'
              },
              tabOnHover: {
                'backgroundImage': 'linear-gradient(rgb(67, 98, 130),rgb(53, 76, 99)'
              },
              tabAfterOnHover: {
                'backgroundImage': 'linear-gradient(rgb(67, 98, 130),rgb(53, 76, 99)'
              },
              tabBeforeOnHover: {
                'backgroundImage': 'linear-gradient(rgb(67, 98, 130),rgb(53, 76, 99)'
              }

            }
          }
        />
        <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleClose}
        >
          <MenuItem onClick={() => { this.handleOpen()}}>Change workspace image</MenuItem>
          <MenuItem onClick={() => {this._deteteWorkspace()}}>Delete workspace</MenuItem>
        </Menu>
        <Dialog open={this.state.open} onClose={() => this.handleCloseImg()} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Change workspace image</DialogTitle>
          <DialogContent>
            <Button variant="contained" component="label">
              Select image
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={this.fileChangedHandler}/>
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleCloseImg()} color="secondary">
              Cancel
            </Button>
            <Button onClick={() => this.changeImage()} color="primary">
              Change
            </Button>
          </DialogActions>
        </Dialog>
        <Menu
        id="simple-menu-bookmark"
        anchorEl={bookmarkEl}
        open={Boolean(bookmarkEl)}
        onClose={this.handleBookmarkListClose}
        >
          {this.renderBookmarkList()}
        </Menu>
			</div>
			
	  )
	}
}

