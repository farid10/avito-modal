import React, {Component} from 'react';
import Modal from "./Modal";

class ImageList extends Component {
	constructor(props) {
		super(props);
		this.state = {images: [], open: false, id: ''}
	}

	componentDidMount = async () => {
		const res = await fetch('https://boiling-refuge-66454.herokuapp.com/images');
		const images = await res.json();
		this.setState({images})
	};

	maximize = id => {
		this.setState({id, open: true})
	};

	render() {
		const {images, id, open} = this.state;
		return (
			<div className="d-flex flex-wrap">
				{images.map(image => (
					<img onClick={() => this.maximize(image.id)} src={image.url} key={image.id}/>
				))}
				<Modal id={id} open={open} close={() => this.setState({open: false})}/>
			</div>
		);
	}
}

export default ImageList;
