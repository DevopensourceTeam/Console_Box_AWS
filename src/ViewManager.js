import React from 'react';
import {
 BrowserRouter as Router,
 Route
} from 'react-router-dom';
import queryString from 'query-string';
import ViewA from './views/ViewA';
import ViewB from './views/ViewB';

export default class ViewManager extends React.Component {
  
	static Views(sess) {
    return {
      viewA: <ViewA />,
      viewB: <ViewB session={sess} />
    }
	}
	static View(props) {

    const values = queryString.parse(props.location.search);
    let name = values.view;
    let session = values.session;
    let view = ViewManager.Views(session)[name];


    if(view == null){
      throw new Error("View '" + name + "' is undefined");
    }
    return view;
  }
	
	render() {
    return (
      <Router>
        <div>
          <Route path='/' component={ViewManager.View}/>
        </div>
      </Router>
    );
	}
}
//export default ViewManager