import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Tx from './components/Tx';
import Block from './components/Block';
import Index from './components/Index';
import Address from './components/Address';
import Error404 from './components/errors/Error404';

import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<Switch location={this.props.location}>
						<Route exact path="/" component={Index} />
						<Route exact path="/address/:addr" component={Address} />
						<Route exact path="/tx/:hash" component={Tx} />
						<Route exact path="/block/:number" component={Block} />
						<Route component={Error404} />
					</Switch>
				</BrowserRouter>
				<footer>
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<div  className="color pull-right">
								&copy;2018 B2G Explorer, All Rights Reserved.
								</div>
							</div>
						</div>
					</div>
				</footer>
			</div>
		);
	}
}

export default App;
