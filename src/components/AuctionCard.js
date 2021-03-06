import React, {  Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';

import BidTable from "./BidTable";
import Carousel from "./Carousel";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const green_theme = createMuiTheme({
	palette: {
		primary: {
       main: '#2196f3',
    }
	},
	typography: {
		useNextVariants: true,
	},
});

const red_theme = createMuiTheme({
	palette: {
		primary: {
       main: '#e53935',
    }
	},
	typography: {
		useNextVariants: true,
	},
});

const styles = theme => ({
  paper: {
		position: 'absolute',
		width: theme.spacing.unit * 110,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		borderRadius: 4,
		outline: 'none',
  },
  chip: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  multilineColor:{
    color:'black'
  }
});

export class AuctionCard extends  Component {
  _isMounted = false
  
	state = {
		images: this.props.data.media.images,
		desc: this.props.data.media.desc,
		rent_type: this.props.data.media.rent_type,
		beds: this.props.data.media.beds,
		baths: this.props.data.media.baths,
		furnished: this.props.data.media.furnished,
		amount: this.props.data.media.amount,
    open: false,
    auctionFunc: this.props.data.auctionFunc,
    web3: this.props.web3,
    bidAmount: 0,
    biddingLog: [],
    hasBalance: false,
    withdrawDisabled: true,
    media: this.props.data.media,
    county: this.props.data.media.county,
    town: this.props.data.media.town,
    seller: '',
    highestBid: 0,
    ended: false,
    daysLeft: 0,
    hoursLeft: 0 ,
	}
  
  componentDidMount = () => { 
    this._isMounted = true; 
    this.handleSeller();
    setInterval(async()=>{
      await this.handleTimeLeft();
      await this.handleBidderLog();
      await this.handleBalanceOf();
      
    }, 1000);
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  handleOpen = () => {
    if (this._isMounted) {
      this.setState({ open: true });
    }
  };

  handleClose = () => {
    if (this._isMounted) {
      this.setState({ open: false, bidAmount: 0  });
    }
  };
  
  handleBid = async () => {
    if (this._isMounted) {
      await this.setState({hasBalance: true});
    }
    if(this.state.bidAmount > 0){
      const {auctionFunc, web3} = this.state;
      const accounts = await web3.eth.getAccounts();
      await auctionFunc.methods
        .placeBid()
        .send({ from: accounts[0], value: web3.utils.toWei(this.state.bidAmount, 'ether') })
        .then(result => result).catch(function(e){});; 
    }
  }
  
  handleWithdraw = async () => {
    if (this._isMounted) {
      await this.setState({withdrawDisabled: true});
    }
    const {auctionFunc, web3} = this.state;
    const accounts = await web3.eth.getAccounts();
    var withdraw = await auctionFunc.methods
      .withdrawBid()
      .send({ from: accounts[0] })
      .then(result => result)
    console.log(withdraw);
  }
  
  handleBidderLog = async () => {
    const {auctionFunc, web3} = this.state;
    const accounts = await web3.eth.getAccounts();
    var bidderLog = await auctionFunc.methods
      .getBidderLog()
      .call({ from: accounts[0] })
      .then(result => result);
    var bidLog = await auctionFunc.methods
      .getBidLog()
      .call({ from: accounts[0] })
      .then(result => result);
    
    var biddingLog = bidderLog.map(function(v,i) {
        return [v, web3.utils.fromWei(bidLog[i], 'ether')];
    });
    
    var highestBid = await auctionFunc.methods
      .highestBid()
      .call({ from: web3.eth.getAccounts[0] })
      .then(result => result);        
     
    if (this._isMounted) {
      await this.setState({biddingLog: biddingLog});
      await this.setState({highestBid: highestBid});

    }
  }
  
  handleTimeLeft = async () => {
    const {auctionFunc, web3} = this.state;
    var getDate = new Date();
    var currentDate = getDate.getTime() / 1000;
    
    var auctionEnd = await auctionFunc.methods
      .auctionEnd()
      .call({ from: web3.eth.getAccounts[0] })
      .then(result => result);
      
    var timeLeft = (auctionEnd - currentDate) / 86400;
    
    let days = 0;
    let hours = 0;
    
    if(timeLeft > 0){
      days = Math.floor(timeLeft);
      hours = (timeLeft % 1 * 24).toFixed(2);
    }
     
    if (this._isMounted) {
      await this.setState({daysLeft: days}); 
      await this.setState({hoursLeft: hours});

      if(currentDate > auctionEnd){
        this.setState({ended: true});
      }
    }
  }
  
  handleBidAmount = async (event) => { 
    if (this._isMounted) {
      await this.setState({ bidAmount: event.target.value });
    }
  }
  
  handleSeller = async () => {
    const {auctionFunc, web3} = this.state;
    var auctionSeller = await auctionFunc.methods
      .auctionSeller()
      .call({ from: web3.eth.getAccounts[0] })
      .then(result => result);
    if (this._isMounted) {
      await this.setState({seller: auctionSeller});
    }
  }
  
  handleBalanceOf = async () => {
    const {auctionFunc, web3} = this.state;
    const CurrentUserAddress = await web3.eth.getAccounts();
    var balance = await auctionFunc.methods
      .balanceOf(CurrentUserAddress[0])
      .call({ from: web3.eth.getAccounts[0] })
      .then(result => result);
    if (this._isMounted) {
      if(balance > 0 || this.state.ended === true){
        await this.setState({hasBalance: true});
      }else{
        await this.setState({hasBalance: false});
      }
    }
    var highestBidder = await auctionFunc.methods
      .highestBidder()
      .call({ from: web3.eth.getAccounts[0] })
      .then(result => result);
    if (this._isMounted) {
      if (balance > 0 && CurrentUserAddress[0] !== highestBidder){
        await this.setState({withdrawDisabled: false});
      }else{
        await this.setState({withdrawDisabled: true});
      }
    }
  }
  
  AuctionModal = () => {
    const { classes } = this.props;
    let ethStyle = {
      width: "40px",
      marginLeft: "-15px",
      marginRight: "-10px"
    }
    return(   
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.open}
        onClose={this.handleClose}
      >
        <div style={getModalStyle()} className={classes.paper}>
            <Grid container justify="center" direction="row" alignItems="center">
              <Grid container justify="flex-start" style={{width: '400px'}}>
                {/* Image carousel */}
                <Grid item>
                  <Carousel images={this.state.images} />
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
                style={{width: '400px', border: '1px solid #EFEFEF', borderRadius: '0px 4px 4px 0px', paddingTop: 5}}
              >
                {/* BID INPUT AMOUNT */}
                <Grid item>
                  <MuiThemeProvider theme={green_theme}>
                    <TextField
                      id="outlined-helperText"
                      placeholder="ETH"
                      className={classes.textField}
                      label={"€ " + (this.props.ex * this.state.bidAmount).toFixed(2)}
                      margin="dense"
                      type="number"
                      variant="outlined"
                      style={{width: "150px"}}
                      required onChange={this.handleBidAmount}
                      color='#fafafa'
                      InputProps={{
                        startAdornment: 
                        <InputAdornment position="start">
                          <img style={ethStyle} src="https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black_small.png" alt=""/>
                        </InputAdornment>,
                      }}
                    />
                  </MuiThemeProvider>
                </Grid>
                {/* WITHDRAW BUTTON */}
                <Grid item>
                  <MuiThemeProvider theme={red_theme}>
                    <Button onClick={this.handleWithdraw} variant="outlined" disabled={this.state.withdrawDisabled} color="primary" className={classes.button} >
                      WITHDRAW
                    </Button>
                  </MuiThemeProvider>
                </Grid>
                {/* BID BUTTON */}
                <Grid item>
                  <MuiThemeProvider theme={green_theme}>
                    <Button onClick={this.handleBid} disabled={this.state.hasBalance} variant="outlined" color="primary" className={classes.button} >
                      Bid
                    </Button>
                  </MuiThemeProvider>
                </Grid>
                {/* TITLE BIDDING HISTORY */}
                <Grid style={{width: 400, marginLeft: 10}} item>
                  <Typography  variant="h6">
                    Bidding History
                  </Typography>               
                </Grid>
                {/* BIDDING LIST */}
                <Grid style={{width: 400}} item>
                  <BidTable data={this.state.biddingLog.slice(0).reverse()} ex={this.props.ex} />
                </Grid>
              </Grid>
            </Grid>
            <Grid container style={{paddingLeft:'10px'}} alignItems="center">             
              <Grid item>
                <TextField
                  placeholder="Description"
                  disabled
                  multiline={true}
                  rows={3}
                  style = {{width: '800px'}}
                  value= {this.state.media.desc}
                  margin="dense"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    classes: {
                      input: classes.multilineColor
                    }
                  }}
                />
              </Grid>
              <Grid item>
                {Object.entries(this.state.media).map((row,x) =>{
                  if(row[0] !== "images" && row[0] !== "amount" && row[0] !== "desc"){
                    return(<Chip variant="outlined" key={"t"+x} label={row[1]} className={classes.chip} />);
                  }
                  return null
                })}
              </Grid>
              <Grid item>
                <Chip color="primary" href={"https://rinkeby.etherscan.io/address/"+this.props.data.scanAddress} variant="outlined" key={"address"} label={this.props.data.scanAddress} clickable component="a" className={classes.chip} />
                <Chip color="primary" href={"https://rinkeby.etherscan.io/address/"+this.state.seller} variant="outlined" key={"seller"} label="seller" clickable component="a" className={classes.chip} />
              </Grid>
            </Grid>
        </div>
      </Modal>
    );
  }
  
  updatePrice = () => {
    const {web3} = this.state;
    let high = web3.utils.fromWei((this.state.highestBid).toString(), 'ether')
    if(this.state.ended === true){
      return (<>Ended</>)
    }else if(this.state.highestBid > this.state.amount){
      return (<>Ξ{high} (€{(parseFloat(high) * this.props.ex).toFixed(2)})</>)
    }else{
      return (<>Ξ{this.state.amount} (€{(this.state.amount * this.props.ex).toFixed(2)})</>)
    }
  }
	render() {
    let headerStyle = {
      color: 'white',
      position: 'absolute', 
      zIndex: 1, 
      pointerEvents: 'none',
      bottom: '10px',
      left: '10px',
      textShadow: '1px 1px 2px rgba(0,0,0,1)',
      fontSize: '80%'
    }
    
    let townStyle = {
      color: 'white',
      position: 'absolute', 
      zIndex: 1, 
      pointerEvents: 'none',
      top: '25px',
      left: '10px',
      textShadow: '1px 1px 2px rgba(0,0,0,1)',
      fontSize: '80%'
    }
    
    let countyStyle = {
      color: 'white',
      position: 'absolute', 
      zIndex: 1, 
      pointerEvents: 'none',
      top: '10px',
      left: '10px',
      textShadow: '1px 1px 2px rgba(0,0,0,1)',
      fontSize: '80%'
    }
    
    let priceStyle = {
      color: 'white',
      position: 'absolute', 
      zIndex: 1, 
      bottom: '10px',
      right: '10px',
      textShadow: '1px 1px 2px rgba(0,0,0,1)',
      fontSize: '80%'
    }
    
    let daysStyle = {
      color: 'white',
      position: 'absolute', 
      zIndex: 1, 
      top: '10px',
      right: '10px',
      textShadow: '1px 1px 2px rgba(0,0,0,1)',
      fontSize: '80%'
    }

		return(
    <div>
			<Card style={{position: 'relative', borderRadius: '2px'}} className="Auction-card">
        <Typography style={townStyle}>
          {this.state.town}  
        </Typography>
        <Typography style={countyStyle}>
          {this.state.county}  
        </Typography>
        <Typography style={headerStyle}>
          {this.state.rent_type}  
        </Typography>
        <Typography style={daysStyle}>
          {this.state.daysLeft + " days " + this.state.hoursLeft+" hours"}  
        </Typography>
        <Tooltip placement="top" title="Ether (Euro)">
          <Typography style={priceStyle}>
            {this.updatePrice()}
          </Typography>
        </Tooltip>
				<CardActionArea onClick={this.handleOpen}>
          <CardMedia
						component="img"
						className="media"
						src={this.state.images[0]}
            style={{height: '200px'}}
					/>
				</CardActionArea>
			</Card>
      {this.AuctionModal()}
      </div>
		);
	}
}
export default withStyles(styles)(AuctionCard);