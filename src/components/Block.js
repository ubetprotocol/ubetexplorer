import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class Block extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			block: {}
		}
	}

	componentDidMount() {
		this.fetch(this.props.match.params.number)
	}

	componentWillReceiveProps(nextProps) {
		this.fetch(nextProps.match.params.number)
	}

	fetch(number) {
		axios.get(process.env.REACT_APP_SERVER + "/api/tx/block/"+number.toLowerCase()).then(result=>{
			this.setState({block: result.data.block})
		}).catch(e => {
		})
	}

	onChange(e){
		this.setState({searchItem: e.target.value})
	}

	fetchDetails(e) {
		e.preventDefault()
		this.setState({block: {}},()=>{
			if(this.state.searchItem.length === 42)
				this.props.history.push('/address/'+this.state.searchItem)
			else if(this.state.searchItem.length === 66)
				this.props.history.push('/tx/'+this.state.searchItem)
			else if(this.state.searchItem.length < 12)
				this.props.history.push('/block/'+this.state.searchItem)
		})
	}

	render() {
		let {block} = this.state

		const blockTxs = (block && block.transactions && block.transactions.length > 0) ?
			(block.transactions.slice(0).map((ob, key) =>
				<span style={{display: "block"}}>
					<Link to={"/tx/"+ob} key={key}>
						{ob}
					</Link>
				</span>
			)): null

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
						<h1 className="pull-left"><span className="gray-heading TranTex">Block</span> <span className="lead-modify" style={{color: "#999999"}}>&nbsp;{this.props.match.params.number}</span><br />
							<a id="Top"></a>
						</h1>
						<ul className="pull-right breadcrumb">
							<li><a href="#" className="HoTex">Home</a></li>
							<li><a href="#" className="TransTex">Blocks</a></li>
							<li className="active TraInfoTex">Block Information</li>
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
											<h4 className="panel-title TraInfoTex">Block Information</h4>
										</div>
										{block && block.hash &&
										<div className="container">
											<div className="row" style={{marginTop:"20px"}}>
												<div className="col-sm-3 TxHTex">Block Hash :</div>
												<div className="col-sm-9" id="hash"><Link to={"/block/"+block.hash}>{block.hash}</Link></div><br /><br />
												<div className="col-sm-3 TimStTex">TimeStamp :</div>
												<div className="col-sm-9" id="timestamp">{block.timestamp}</div><br /><br />
												<div className="col-sm-3 BloNuTex">Block Number :</div>
												<div className="col-sm-9" id="blocknumber"><Link to={"/block/"+block.number}>{block.number}</Link></div><br /><br />
												<div className="col-sm-3 ForTex">Difficulty :</div>
												<div className="col-sm-9" id="from">{block.difficulty}</div><br /><br />
												<div className="col-sm-3 ValTex">Transactions :</div>
												<div className="col-sm-9" id="value">
													<p>
													{((block.transactions) ? block.transactions.length : "0")+ " Transactions"}<br />
														{blockTxs}
													</p>
												</div><br /><br />
												<div className="col-sm-3 GasLTex">Gas Limit :</div>
												<div className="col-sm-9" id="gaslimit">{block.gasLimit}</div><br /><br />
												<div className="col-sm-3 GaUbyTex">Gas Used By :</div>
												<div className="col-sm-9" id="gasused">{block.gasUsed}</div><br /><br />
												<div className="col-sm-3 GaPTex">Nonce :</div>
												<div className="col-sm-9" id="gasprice">{block.nonce}</div><br /><br />
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

export default Block;
