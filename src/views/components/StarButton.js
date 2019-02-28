import React from 'react';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';

export default class StarButton extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			bookmarks: props.bookmarks,
			url: '',
			key: props.key,
			value: '23'
		}
	}
	value = (val) => {
		this.setState({value: val});
	}

	bookmarks = (newBookmarks) => {
		this.setState({bookmarks: newBookmarks});
	}

	getValue = () => {
		return this.state.value;
	}

	setUrl = (url) => {
		this.setState({url: url});
		
	}

		/* BOOKmARKS */
	  getIndexBookmark = (code) => {
			console.log(code);
			
		if(typeof code !== 'undefined'){ 
		  var output = this.state.bookmarks.filter(
			(bookmarks) => {
			  if(code.includes('http')){
				return bookmarks.url === code;
			  }else{
				return bookmarks.name === code;
			  }
			}
			);
			console.log('entra');
		  return output.length >0? this.state.bookmarks.indexOf(output[0]) : -1;
		}else{
		  return -1;
		}
		
	  }
	  /* BOOKmARKS */

	render() {
		  return (
		
			this.getIndexBookmark(this.state.url)<0?<StarBorder className="icon" />:<Star className="icon" />
			

		  );
	}
}

			//this.state.bookmarks.indexOf(url)<0? <StarBorder className="icon" />: <Star className="icon" />