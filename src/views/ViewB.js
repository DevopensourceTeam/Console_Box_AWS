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
/* NAVBAR */
const { remote } = window.require('electron');
/* STORE */
const Store = window.require('electron-store');
const store = new Store();
/* STORE */

window.React = React;
const { BrowserWindow, BrowserView } = window.require('electron').remote;

export default class ViewB extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
      anchorEl: null,
			session : props.session,
			tabs:[
        (<Tab key={'tab0'} title={'Fixed - ' + props.session} unclosable={true}>
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
              </div>
              <IconButton onClick={()=>{this.handleDevTools('tab0')}}>
                <VerticalSplitIcon className="icon" />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div className="fullSpace">
						<webview id={'tab0'} ref={ref => this['tab0'] = ref} className="webview" autosize="true" src="https://signin.aws.amazon.com/console" partition={"persist:"+ props.session} onContextMenu={()=>{alert('context menu')}}></webview>
					</div>
        </Tab>),
      ],
      badgeCount: 0
    }
    
  }

  handleFocus = (event) => event.target.select();

  changeURL = (key) => {
    this[key + '-search'].value = this[key].getURL();
  }
  addListener = (key) => {
    this[key].addEventListener('dom-ready', ()=>{this.changeURL(key)});
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.tabs.length < this.state.tabs.length){
      console.log('* Se añade el tab: ', this.state.selectedTab);
      this[this.state.selectedTab].addEventListener('dom-ready', ()=>{this.changeURL(this.state.selectedTab)});
    }else if(prevState.tabs.length > this.state.tabs.length){
      console.log('* Se elimina el tab: ', prevState.selectedTab);
      this[this.state.selectedTab].removeEventListener('dom-ready', ()=>{this.changeURL(this.state.selectedTab)});
    }
  }
  
	componentDidMount = () => {
    window.addEventListener('resize', this._handleResize);
    this['tab0'].addEventListener('dom-ready', ()=>{this.changeURL('tab0')});
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
                        </div>
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

	render() {
    const { anchorEl } = this.state;
    
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
          <MenuItem onClick={() => { this.loadImage('../icon-devo.png')}}>Change workspace image</MenuItem>
          <MenuItem onClick={() => {this._deteteWorkspace()}}>Delete workspace</MenuItem>
        </Menu>
			</div>
			
	  )
	}
}

