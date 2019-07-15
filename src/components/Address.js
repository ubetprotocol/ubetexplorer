import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BigNumber } from 'bignumber.js';

var QRCode = require('qrcode-react');

class Address extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			searchItem: '',
			total: 0,
			balance: 0
		}
	}

	componentDidMount() {
		this.fetch(this.props.match.params.addr)
	}

	componentWillReceiveProps(nextProps) {
		this.fetch(nextProps.match.params.addr)
	}

	onChange(e){
		this.setState({searchItem: e.target.value})
	}

	fetch(address) {
		address = address.toLowerCase()
		axios.post(process.env.REACT_APP_SERVER+"/api/tx", {address: address.toLowerCase(), page: 1}).then(result=>{
			this.setState({transactions: result.data.transactions, total: result.data.total})
		}).catch(e => {})
		axios.post(process.env.REACT_APP_NODE, {id: address.toLowerCase(), jsonrpc: "2.0", method: "eth_getBalance", params: [address.toLowerCase(),"latest"]}).then(result=>{
			let balance = new BigNumber(result.data.result)
			balance = balance.div(1e18).toString(10)
			this.setState({balance: balance})
		}).catch(e => {})
	}

	fetchDetails(e) {
		e.preventDefault()
		this.setState({transactions: []},()=>{
			if(this.state.searchItem.length === 42)
				this.props.history.push('/address/'+this.state.searchItem)
			else if(this.state.searchItem.length === 66)
				this.props.history.push('/tx/'+this.state.searchItem)
			else if(this.state.searchItem.length < 12)
				this.props.history.push('/block/'+this.state.searchItem)
		})
	}

	address(a, b) {
		if(a===b)
			return <span className="td-address">{b}</span>
		else
			return <Link className="td-address" to={"/address/"+b}>{b}</Link>
	}

	render() {
		let addr = this.props.match.params.addr.toLowerCase()

		const transactions = (this.state.transactions && this.state.transactions.length > 0) ?
			(this.state.transactions.slice(0).map((ob, key) =>
			<tr key={key}>
				<td><Link className="td-address" to={"/tx/"+ob.transactionHash}>{ob.transactionHash}</Link></td>
				<td className="hidden-sm text-center"><Link className="td-address" to={"/block/"+ob.blockNumber}>{ob.blockNumber}</Link></td>
				<td><span rel="tooltip" title="">{new Date(ob.timestamp * 1000).toGMTString()}</span></td>
				<td>{this.address(addr, ob.from)}</td>
				{<td><span className={(addr === ob.from)? 'label label-orange rounded' : 'label label-success rounded'}>{(addr === ob.from)? 'OUT' : 'IN'}</span></td>}
				<td>{this.address(addr, ob.to)}</td>
				<td>{(new BigNumber(ob.value)).div(1e18).toString(10) + " Ubets"}</td>
				{/*<td><font color="gray" size="1">0<b>.</b>000042</font></td>*/}
			</tr>
			)): <tr><td colSpan="6">No Transactions to display</td></tr>

		return (
			<section>
				<nav className="navbar navbar-default navbar-fixed-top header" role="navigation">
					<div className="greenish">
						<div className="container">
							<div className="navbar-header">
								<Link to="/">
									<img src="/img/logo.png" className="navbar-brand" alt="logo" />
								</Link>
								<a className="navbar-brand soarcoin-style" href="/"></a>
							</div>
							<form onSubmit={this.fetchDetails.bind(this)}>
								<div className="navbar-form navbar-right" role="search">
									<div className="input-group" style={{top: "25px"}}>
										<input type="text" className="form-control nav-search shadow" style={{width: "330px", height: "34px"}} id="address" placeholder="Enter Tx Hash / Address / Block" required onChange={this.onChange.bind(this)} />
										<div className="input-group-btn">
											<button className="btn border GoTex" type="submit">GO</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</nav>
				<div className="breadcrumbs margin-style">
					<div className="container" style={{paddingtop: "25px"}}>
						<h1 className="pull-left"><span className="gray-heading AddTex">Address</span>
						<span className="lead-modify" style={{color: "#999999", marginLeft:"10px"}}>
							{addr}
						</span>
						<br />
						<a id="Top"></a>
						</h1>
						<ul className="pull-right breadcrumb">
						<li>
							<a href="#" className="HoTex">Home</a>
						</li>
						<li className="active AddTex">Address</li>
						</ul>
					</div>
				</div>
				<div id="outer-div">
				<div className="container" style={{paddingTop: "25px"}}>
					<div className="row" >
						<div className="col-md-6">
							<table className="table">
							<thead>
								<tr>
								<th colSpan="2" className="oveTex">Overview</th>
								</tr>
							</thead>
							<tbody>
								<tr>
								<td className="EthBaTex">Ubets Balance</td>
								<td>
									<span id="eth-bal">{this.state.balance+ ' Ubets'}</span>
								</td>
								</tr>
								<tr>
								<td className="ToInTex">No of Transactions</td>
								<td>
									<span id="total-in">{this.state.total}</span>
								</td>
								</tr>
								{/*<tr>
								<td className="ToOuTex">Total Out</td>
								<td>
									<span id="total-out">$0.47 (@ $683.48/ETH)</span>
								</td>
								</tr>*/}
							</tbody>
							</table>
						</div>
						<div className="col-md-6">
							<div className="text-center" style={{paddingTop: "20px"}}><QRCode value={addr} size={64} /></div>
						</div>
					</div>
				</div>
				<section>
					<div className="container">
						<ul className="nav nav-tabs">
							<li className="active"><a href="#overview" data-toggle="tab" className="oveTex">Transaction</a></li>
						</ul>
						<div className="tab-content">
							<div id="overview" className="tab-pane active">
								<div className="panel-body panel panel-info panel-style">
									<div className="container">
										<div style={{overflowX: "auto", padding: "15px 0px 0px 0px", width: "97.2%"}}>
									<table className="table table-hover" id="address-table">
									<thead>
										<tr>
											<th className="text-center TxHTex">TxHash</th>
											<th className="text-center bloTex">Block</th>
											<th className="text-center TimStTex">Timestamp</th>
											<th className="text-center ForTex">From</th>
											<th className="text-center ToTex"></th>
											<th className="text-center ValTex">To</th>
											<th className="text-center inOuTex">IN/OUT</th>
										</tr>
										{transactions}
									</thead>
									</table>
								</div>
									</div>
								</div>
							</div>
							<div id="comments" className="tab-pane">
								<div className="panel-body panel panel-info panel-style">
								</div>
							</div>
						</div>
					</div>
				</section>
				</div>

			</section>
		);
	}
}

export default Address;
