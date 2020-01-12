import React, {Component} from 'react';
import "./styles/modal.css";

const getFullSizeImage = async id => {
	const url = `https://boiling-refuge-66454.herokuapp.com/images/${id}`;
	return await (await fetch(url)).json()
};

class Modal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			open: false,
			image: null,
			name: '',
			text: ''
		}
	}

	componentWillUnmount() {
		this.setState({
			id: '',
			open: false,
			image: null,
			name: '',
			text: ''
		})
	}

	componentDidUpdate = async (prevProps, prevState) => {
		if (prevState.open !== this.state.open) {
			const image = await getFullSizeImage(this.props.id);
			this.setState({image})
		}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.open !== prevState.open) {
			return {
				open: nextProps.open,
				id: nextProps.id
			}
		} else
			return null
	}

	handleClose = e => {
		e.stopPropagation();
		this.setState({image: null}, () => this.props.close())
	};

	postComment = async (e, imageID) => {
		e.preventDefault();
		const {name, text, image} = this.state;
		if (!name || !text) {
			alert('Name and text is required');
			return;
		}
		const url = `https://boiling-refuge-66454.herokuapp.com/images/${imageID}/comments`;
		await fetch(url, {
			method: "POST",
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({name, comment: text})
		});
		const id = image.comments[image.comments.length - 1] ? image.comments[image.comments.length - 1].id : new Date().getTime();
		image.comments.push({id: id + 1, text, date: new Date().getTime()});
		this.setState({name: '', text: ''});
	};

	render() {
		const {open, image, name, text} = this.state;
		if (!this.props.open)
			return null;
		return (
			<div className="d-flex justify-content-center align-items-center modal-overlay">
				<div className="col-6 p-0">
					{image ?
						<React.Fragment>
							<div className="card d-flex flex-row">
								<button type="button" className="close" aria-label="Close"
								        onClick={this.handleClose}>
									<span aria-hidden="true">&times;</span>
								</button>
								<div className="col-8 p-0">
									<img src={image.url} className="card-img-top" alt="..."/>
									<div className="card-body p-0 mt-2">
										<form>
											<div className="form-group">
												<input
													type="text"
													value={name}
													onChange={e => this.setState({
														name: e.target.value
													})}
													className="form-control"
													placeholder="Ваше имя"/>
											</div>
											<div className="form-group">
												<input type="text"
												       className="form-control"
												       value={text}
												       onChange={e => this.setState({
													       text: e.target.value
												       })}
												       placeholder="Ваше комментарий"/>
											</div>
											<button onClick={e => this.postComment(e, image.id)}
											        className="btn btn-primary btn-block">
												Оставить комментарий
											</button>
										</form>
									</div>
								</div>
								<div className="col-4">
									{image.comments.length > 0 ?
										<ul className="comment-list p-0">
											{image.comments.map(comment => (
												<li key={comment.id}>
												<span
													className="text-secondary">
                                                    {new Date(comment.date)
	                                                    .toLocaleDateString()
	                                                    .split('/').join('.')}
												</span>
													<p>{comment.text}</p>
												</li>
											))}
										</ul>
										: 'No Comments'
									}
								</div>
							</div>
						</React.Fragment>
						:
						<p className="text-white">loading</p>}


				</div>
			</div>
		);
	}
}

export default Modal;
