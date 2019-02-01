# ![Icon](public/components/cbaws-icono.svg)  Console Box AWS 

***
Console Box AWS is an application that allows you to open different `AWS` sessions in the same window.

You create a workspace to work with an aws session and inside you have a full browser to navigate. You can create as many workspaces as you want.

***

![gif](Screenshots/CBAWS-demo.gif) 

***



## Available Scripts

* First install all node dependencies with yarn.
* 
In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode at [http://localhost:3000].<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You have to edit these lines to change between production and development.
Comment the line that you do not use.
**For production to work, you have to use the prebuild command**

```javascript
//view.webContents.loadURL(`http://localhost:3000?view=viewB&session=${workSpace}`);
view.webContents.loadURL(`file://${path.join(remote.app.getAppPath(), `./build/index.html?view=viewB&session=${workSpace}`)}`);
```

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn prebuild-pack`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be packaged!

### `yarn dist-all`

Package and create the executables for windows and mac in the dist folder.

