import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { BigNumber } from 'bignumber.js';
var classNames = require('classnames');

class Index extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			searchItem: '',
			transactions: [],
			blocks: [],
			supply: 0,
			page: 1,
			totalPage: 1000,
			startPage: 1,
			endPage: 5
		}
		this.changePage = this.changePage.bind(this)
		this.fetchTx = this.fetchTx.bind(this)
	}

	componentDidMount() {
		axios.post(process.env.REACT_APP_SERVER + "/api/tx",{page: this.state.page}).then(result => {
			this.setState({transactions:result.data.transactions})
		}).catch(error => {})
		axios.get(process.env.REACT_APP_SERVER + "/api/tx/blocks").then(result => {
			this.setState({blocks:result.data.blocks})
			localStorage.setItem('supply',50000000+(result.data.blocks[0].number * 3))
		}).catch(error => {})
		axios.get(process.env.REACT_APP_SERVER + "/api/supply").then(result => {
			this.setState({supply:result.data.supply})
		}).catch(error => {})
	}

	fetchTx() {
		axios.post(process.env.REACT_APP_SERVER + "/api/tx",{page: this.state.page}).then(result => {
			this.setState({transactions:result.data.transactions})
		}).catch(error => {})
	}

	onChange(e){
		this.setState({searchItem: e.target.value})
	}

	fetchDetails(e) {
		e.preventDefault()
		if(this.state.searchItem.length === 42)
			this.props.history.push('/address/'+this.state.searchItem)
		else if(this.state.searchItem.length === 66)
			this.props.history.push('/tx/'+this.state.searchItem)
		else if(this.state.searchItem.length < 12)
			this.props.history.push('/block/'+this.state.searchItem)
	}

	changePage(e) {
		let page = parseInt(e.target.attributes['data-page'].value)
		let { startPage, endPage, totalPage } = this.state
		if(page < 1 || page > this.state.totalPage) return
			if(page >= startPage && page <= endPage) {
				this.setState({page: page}, this.fetchTx)
			} else if(page < startPage) {
				this.setState({page: page, startPage: page, endPage: ((totalPage > (page + 3)) ? page + 3 : totalPage)}, this.fetchTx)
			} else if(page > endPage) {
				this.setState({page: page, endPage: page, startPage: (1 > page - 3) ? 1: page - 3}, this.fetchTx)
			}
	}

	render() {
		let end = moment(new Date())
		const transactions = (this.state.transactions && this.state.transactions.length > 0) ?
			(this.state.transactions.slice(0).map((ob, key) =>
			<tr key={key}>
				<td><Link className="td-address" to={"/tx/"+ob.transactionHash}>{ob.transactionHash}</Link></td>
				<td className="hidden-sm text-center"><Link className="td-address" to={"/block/"+ob.blockNumber}>{ob.blockNumber}</Link></td>
				<td><span rel="tooltip" title="">{new Date(ob.timestamp * 1000).toGMTString()}</span></td>
				<td><Link className="td-address" to={"/address/"+ob.from}>{ob.from}</Link></td>
				<td><Link className="td-address" to={"/address/"+ob.to}>{ob.to}</Link></td>
				<td>{(new BigNumber(ob.value)).div(1e18).toString(10) + " B2G"}</td>
				{/*<td><font color="gray" size="1">0<b>.</b>000042</font></td>*/}
			</tr>
			)): <tr><td colSpan="7">No Transactions to display</td></tr>

		const blocks = (this.state.blocks && this.state.blocks.length > 0) ?
			(this.state.blocks.slice(0).map((ob, key) =>
			<div className="col-md-2" key={key}>
				<div className="box">
					<Link to={"/block/"+ob.number}>
						<p>Block <strong>#{ob.number}</strong><br /> {ob.transactions.length} txns{/* <br />{moment.duration(end.diff(ob.timestamp * 1000)).seconds()} s ago*/}</p>
					</Link>
				</div>
			</div>
			)): <br />

		let { page, totalPage, startPage, endPage } = this.state
		let paginationHtml = []
		let i = startPage
		for (i = startPage; i <= startPage + 3 && i <= totalPage; i++) {
			paginationHtml.push(<li key={i}><a className={classNames('btn', {'btn-primary': page === i, 'btn-default': page !== i})} data-page={i} onClick={this.changePage}>{i}</a></li>)
		}

		return (
			<div>
				<nav className="navbar navbar-default navbar-fixed-top header" role="navigation">
					<div className="greenish">
						<div className="container">
							<div className="navbar-header">
								<a href="/">
									<img src="/img/logo.png" className="navbar-brand" alt="logo" />
								</a>
								<a className="navbar-brand" href="/"></a>
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
				<div id="outer-div">
					<div className="container" style={{paddingTop: "120px"}}>
						<section>
								<div className="row">
									<div className="col-md-12">
										<div className="row">
											{blocks}
										</div>
									</div>
								</div>
								<ul className="nav nav-tabs">
									<li className="active"><a href="#overview" data-toggle="tab" className="oveTex">Last 10,000 Transactions</a></li>
									<li style={{float: 'right',lineHeight: '0',fontWeight: 'bold'}}>
											<span style={{color: '#1e65ae', display: 'block',lineHeight: '1.6',textAlign: 'right', fontWeight:'normal'}}>Premined: 50,000,000 B2G </span>
										{(this.state.supply) ?
											<span style={{color: '#1e65ae',lineHeight: '1',fontWeight:'normal'}}>Circulating supply: {this.state.supply} B2G <a href="https://history.bitcoiin.com/api/supply" target="_blank" style={{float: 'right', fontSize: '9px', color: '#444', marginLeft: '5px'}}>API <i className="fa fa-external-link"></i> </a></span> : null
										}
									</li>
								</ul>
								<div className="tab-content">
									<div id="overview" className="tab-pane active">
										<div className="panel-body panel panel-info panel-style">
											<div className="container">
												<div style={{overflowX: "auto", padding: "15px 0px 0px 0px", width: "97.2%", marginBottom:'20px'}}>
													<table className="table table-hover" id="address-table">
														<thead>
															<tr>
																<th className="text-center TxHTex">TxHash</th>
																<th className="text-center bloTex">Block</th>
																<th className="text-center TimStTex">Timestamp</th>
																<th className="text-center ForTex">From</th>
																<th className="text-center ValTex">To</th>
																<th className="text-center inOuTex">IN/OUT</th>
															</tr>
														</thead>
														<tbody>
															{transactions}
														</tbody>
													</table>
													{this.state.transactions.length > 0 &&
													<section>
														<div className="col-md-12 text-center">
															<ul className="pagination pagination-sm">
																<li><a className="btn btn-default" disabled={startPage === 1} onClick={ this.changePage } data-page="1">First</a></li>
																<li><a className="btn btn-default" disabled={startPage === 1} onClick={ this.changePage } data-page={parseInt(page) - 1}>Previous</a></li>
																{paginationHtml}
																<li><a className="btn btn-default" disabled={endPage === totalPage} onClick={ this.changePage } data-page={parseInt(page) + 1}>Next</a></li>
																<li><a className="btn btn-default"  disabled={endPage === totalPage} onClick={ this.changePage } data-page={totalPage}>Last</a></li>
															</ul>
														</div>
														<div className="col-md-12 text-center" >
																Showing page {page} of {totalPage}
														</div>
													</section>
													}
												</div>
											</div>
										</div>
									</div>
								</div>
						</section>
					</div>
				</div>
			</div>
		);
	}
}

export default Index;
