import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class Tx extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			transaction: {}
		}
	}

	componentDidMount() {
		this.fetch(this.props.match.params.hash)
	}

	componentWillReceiveProps(nextProps) {
		this.fetch(nextProps.match.params.hash)
	}

	fetch(address) {
		axios.get(process.env.REACT_APP_SERVER + "/api/tx/hash/"+address.toLowerCase()).then(result=>{
			if(result.data.transaction)
				this.setState({transaction: result.data.transaction})
			else
				this.props.history.push('/block/'+address)
		}).catch(e => {
		})
	}

	onChange(e){
		this.setState({searchItem: e.target.value})
	}

	fetchDetails(e) {
		e.preventDefault()
		this.setState({transaction: {}},()=>{
			if(this.state.searchItem.length === 42)
				this.props.history.push('/address/'+this.state.searchItem)
			else if(this.state.searchItem.length === 66)
				this.props.history.push('/tx/'+this.state.searchItem)
			else if(this.state.searchItem.length < 12)
				this.props.history.push('/block/'+this.state.searchItem)
		})
	}

	render() {
		let {transaction} = this.state

		return (
			<section>
				<nav className="navbar navbar-default navbar-fixed-top header" role="navigation">
					<div className="greenish">
						<div className="container">
							<div className="navbar-header">
								<Link to="/">
									<img src="/img/logo.png" className="navbar-brand" alt="logo" />
								</Link>
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
				<div className="breadcrumbs margin-style">
					<div className="container" style={{paddingTop: "25px"}}>
					{this.state.transaction.transactionHash &&
						<h1 className="pull-left"><span className="gray-heading TranTex">Transaction</span> <span className="lead-modify" style={{color: "#999999"}}>&nbsp;{this.props.match.params.hash}</span><br />
							<a id="Top"></a>
						</h1>
					}
						<ul className="pull-right breadcrumb">
							<li><a href="#" className="HoTex">Home</a></li>
							<li><a href="#" className="TransTex">Transactions</a></li>
							<li className="active TraInfoTex">Transaction Information</li>
						</ul>
					</div>
				</div>
				<div id="outer-div">
					<section>
						<div className="container">
						<br /><br />
							<ul className="nav nav-tabs">
								<li className="active"><a href="#overview" data-toggle="tab" className="oveTex">Overview</a></li>
								<li id="ContentPlaceHolder1_li_disqus"><a href="#comments" data-toggle="tab" className="ComTex">Comments</a></li>
							</ul>
							<div className="tab-content">
								<div id="overview" className="tab-pane active">
									<div className="panel-body panel panel-info panel-style">
										<div className="panel-heading panelheading-color">
											<h4 className="panel-title TraInfoTex">Transaction Information</h4>
										</div>
										{transaction.transactionHash &&
										<div className="container">
											<div className="row" style={{marginTop:"20px"}}>
												<div className="col-sm-3 TxHTex">TxHash :</div>
												<div className="col-sm-9" id="hash">{transaction.transactionHash}</div><br /><br />
												<div className="col-sm-3 TimStTex">TimeStamp :</div>
												<div className="col-sm-9" id="timestamp">{transaction.timestamp}</div><br /><br />
												<div className="col-sm-3 BloNuTex">Block Number :</div>
												<div className="col-sm-9" id="blocknumber">{transaction.blockNumber}</div><br /><br />
												<div className="col-sm-3 ForTex">From :</div>
												<div className="col-sm-9" id="from"><Link className="td-address" to={"/address/"+transaction.from}>{transaction.from}</Link></div><br /><br />
												<div className="col-sm-3 ToTex">To :</div>
												<div className="col-sm-9" id="to"><Link className="td-address" to={"/address/"+transaction.to}>{transaction.to}</Link></div><br /><br />
												<div className="col-sm-3 ValTex">Value :</div>
												<div className="col-sm-9" id="value">{transaction.value / 10**18} B2G</div><br /><br />
												<div className="col-sm-3 GasLTex">Gas Limit :</div>
												<div className="col-sm-9" id="gaslimit">{transaction.gas}</div><br /><br />
												{/*<div className="col-sm-3 GaUbyTex">Gas Used By :</div>
												<div className="col-sm-9" id="gasused"></div><br /><br />*/}
												<div className="col-sm-3 GaPTex">Gas Price :</div>
												<div className="col-sm-9" id="gasprice">{transaction.gasPrice}</div><br /><br />
												{/*<div className="col-sm-3 AcTeFr">Actual Tx Fee :</div>
												<div className="col-sm-9" id="actualfee"></div><br /><br />
												<div className="col-sm-3 CuGUTex">Cumulative Gas Used:</div>
												<div className="col-sm-9" id="cumulativegas"></div><br /><br />
												<div className="col-sm-3 TxReSTex">Tx Receipt Status :</div>
												<div className="col-sm-9" id="status"></div><br /><br />
												<div className="col-sm-3 NonTex">Nonce :</div>
												<div className="col-sm-9" id="nonce"></div><br /><br />
												<div className="col-sm-3 InDaTex">Input Data :</div>
												<div className="col-sm-9">
												</div><br /><br />*/}
											</div>
										</div>
										}
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

export default Tx;
