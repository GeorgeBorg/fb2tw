import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import calendar from '../../images/calendar.png';
import spinner from '../../images/spinner.svg';

class Application extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		};
	}

	componentDidMount() {
		chrome.runtime.onMessage.addListener(
			function(msg) {
				this.setState({
					loading: false
				});
			}.bind(this)
		);
	}

	sync = () => {
		this.setState({
			loading: true
		});
		chrome.extension.sendMessage({ type: 'sync' });
	};

	render() {
		return (
			<div>
				<button className="sync" onClick={this.sync}>
					{this.state.loading ? (
						<img src={spinner} alt="loading..." />
					) : (
						<img src={calendar} />
					)}
				</button>
			</div>
		);
	}
}
export default hot(module)(Application);
