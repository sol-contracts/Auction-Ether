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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

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

const main_theme = createMuiTheme({
	palette: {
		primary: {
			main: '#fafafa',
		}
	},
	typography: {
		useNextVariants: true,
	},
});

const styles = theme => ({
  paper: {
		position: 'absolute',
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		borderRadius: 2,
		outline: 'none',
  },
});

class BidListItem extends Component {
  componentDidMount = async () => {
    //console.log(this.props);
  }
  render () {
    const {web3} = this.props;
    return (
      <div>
        <ListItem style={{marginLeft:"-20px"}}>
          <ListItemText
            primary={"Ξ " + web3.utils.fromWei(this.props.data[1]) + " (€" + (web3.utils.fromWei(this.props.data[1]) * this.props.ex).toFixed(2)+")"}
            secondary={this.props.data[0]}
          />
        </ListItem>
        <Divider style={{width: '330px'}} />
      </div>
    );
  }
}

class AuctionCard extends  Component {
  
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
    creator: null,
    bidAmount: 0,
    biddingLog: [],
    hasBalance: false,
    withdrawDisabled: true,
	}
  
  componentDidMount = async () => {
    this.handleContract();
    this.handleBidderLog();
    this.handleBalanceOf();
    setInterval(async()=>{
      await this.handleBidderLog();
      await this.handleBalanceOf();
    }, 1000);
  }
  
  handleContract = async() => {
    const {auctionFunc, web3} = this.state;
    const accounts = await web3.eth.getAccounts();
    var auctionSeller = await auctionFunc.methods
      .auctionSeller()
      .call({ from: accounts[0] })
      .then(result => result);
    //console.log(auctionFunc.methods);
    this.setState({creator: auctionSeller});
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, bidAmount: 0  });
  };
  
  handleBid = async () => {
    if(this.state.bidAmount > 0){
      this.setState({hasBalance: true});
      const {auctionFunc, web3} = this.state;
      const accounts = await web3.eth.getAccounts();
      const bid = await auctionFunc.methods
        .placeBid()
        .send({ from: accounts[0], value: web3.utils.toWei(this.state.bidAmount, 'ether') })
        .then(result => result); 
      //console.log(bid);
    }
  }
  
  handleWithdraw = async () => {
    this.setState({withdrawDisabled: true});
    const {auctionFunc, web3} = this.state;
    const accounts = await web3.eth.getAccounts();
    console.log('hello');
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
        return [v, bidLog[i]];
    });
    
    await this.setState({biddingLog: biddingLog});
  }
  
  handleBidAmount = async (event) => {
    await this.setState({ bidAmount: event.target.value });
  }
  
  handleBalanceOf = async () => {
    const {auctionFunc, web3} = this.state;
    const CurrentUserAddress = await web3.eth.getAccounts();
    var balance = await auctionFunc.methods
      .balanceOf(CurrentUserAddress[0])
      .call({ from: web3.eth.getAccounts[0] })
      .then(result => result);
    //console.log(balance);
    if(balance > 0){
      this.setState({hasBalance: true});
    }else{
      this.setState({hasBalance: false});
    }
    
    var highestBidder = await auctionFunc.methods
      .highestBidder()
      .call({ from: web3.eth.getAccounts[0] })
      .then(result => result);
    
    if (balance > 0 && CurrentUserAddress[0] != highestBidder){
      this.setState({withdrawDisabled: false});
    }else{
      this.setState({withdrawDisabled: true});
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
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={16}
            >
              <Grid item>
              <MuiThemeProvider theme={main_theme}>
                <TextField
                  id="outlined-helperText"
                  placeholder="ETH"
                  className={classes.textField}
                  label={"€ " + (this.props.ex.EUR * this.state.bidAmount).toFixed(2)}
                  margin="dense"
                  variant="outlined"
                  style={{width: "120px"}}
                  required onChange={this.handleBidAmount}
                  color='#fafafa'
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                       <img style={ethStyle} src="https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black_small.png" alt=""/>
                    </InputAdornment>,
                  }}
                />
                </MuiThemeProvider>
              </Grid>
              <Grid item>
                <MuiThemeProvider theme={green_theme}>
                  <Button onClick={this.handleBid} disabled={this.state.hasBalance} variant="contained" color="primary" className={classes.button} >
                    Bid
                  </Button>
                </MuiThemeProvider>
              </Grid>
              <Grid item>
                <MuiThemeProvider theme={red_theme}>
                  <Button onClick={this.handleWithdraw} variant="contained" disabled={this.state.withdrawDisabled} color="primary" className={classes.button} >
                    WITHDRAW
                  </Button>
                </MuiThemeProvider>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Typography variant="h6" id="modal-title">
                  Bidding History
                </Typography>               
              </Grid>
            </Grid>
            <Grid 
            container
            justify="flex-start"
            >
              <Grid item>
                  <Divider style={{width: '330px'}} />
                  <List dense={true}>
                    {this.state.biddingLog.map((content, x) => <BidListItem ex={this.props.ex.EUR} key={"li"+x} data={content} web3={this.state.web3}/>
                    )}
                  </List>
              </Grid>
            </Grid>
          </div>
      </Modal>
    );
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
    
    let priceStyle = {
      color: 'white',
      position: 'absolute', 
      zIndex: 1, 
      bottom: '10px',
      right: '10px',
      textShadow: '1px 1px 2px rgba(0,0,0,1)',
      fontSize: '80%'
    }

		return(
    <div>
			<Card style={{position: 'relative', borderRadius: '2px'}} className="Auction-card">
        <Typography style={headerStyle}>
          {this.state.rent_type}  
        </Typography>
        <Tooltip placement="top" title="Ether (Euro)">
          <Typography style={priceStyle}>
            Ξ{this.state.amount} (€{(this.state.amount * this.props.ex.EUR).toFixed(2)})
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