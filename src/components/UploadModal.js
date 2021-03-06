import React, { Component } from "react";
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import ipfs from '../api/ipfsAPI';
import contract from "../contract.js";

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

function getModalStyle() {
	const top = 50;
	const left = 50;
	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const base_64 = (inputFile) => {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onerror = () => {
			reader.abort();
			reject(new DOMException("Problem parsing input file."));
		};
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.readAsDataURL(inputFile);
	});
};

const styles = theme => ({
	paper: {
		position: 'absolute',
		width: 'auto',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		borderRadius: 4,
		outline: 'none',
	},
	root: {
		flexGrow: 1,
	},
  menuButton: {
    marginRight: 1,
  },
});

const blue_theme = createMuiTheme({
	palette: {
		primary: {
       main: '#2196f3',
    }
	},
	typography: {
		useNextVariants: true,
	},
});

const green_theme = createMuiTheme({
	palette: {
		primary: {
       main: '#43a047',
    }
	},
	typography: {
		useNextVariants: true,
	},
});

const beds = [
	{
		value: 'One Bed',
	},
	{
		value: 'Two Bed',
	},
	{
		value: 'Three Bed',
	},
	{
		value: 'Four Bed',
	},
	{
		value: 'Five Bed',
	},
];

const rent_type = [
	{
		value: 'House',
	},
	{
		value: 'Apartment',
	},
	{
		value: 'Studio Apartment',
	},
	{
		value: 'Single Room',
	},
	{
		value: 'Double Room',
	},
	{
		value: 'Twin Room',
	},
];

const baths = [
	{
		value: 'One Bath',
	},
	{
		value: 'Two Bath',
	},
	{
		value: 'Three Bath',
	},
	{
		value: 'Four Bath',
	},
	{
		value: 'Five Bath',
	},
];

const furnished = [
	{
		value: 'Furnished',
	},
	{
		value: 'Unfurnished',
	},
];

const counties = [
  {
    value: 'Antrim',
  },
  {
    value: 'Armagh',
  },
  {
    value: 'Carlow',
  },
  {
    value: 'Cavan',
  },
  {
    value: 'Clare',
  },
  {
    value: 'Cork',
  },
  {
    value: 'Kerry',
  },
  {
    value: 'Donegal',
  },
  {
    value: 'Down',
  },
  {
    value: 'Dublin',
  },
  {
    value: 'Fermanagh',
  },
  {
    value: 'Galway',
  },
  {
    value: 'Kerry',
  },
  {
    value: 'Kildare',
  },
  {
    value: 'Kilkenny',
  },
  {
    value: 'Laois',
  },
  {
    value: 'Leitrim',
  },
  {
    value: 'Limerick',
  },
  {
    value: 'Longford',
  },
  {
    value: 'Louth',
  },
  {
    value: 'Mayo',
  },
  {
    value: 'Meath',
  },
  {
    value: 'Monaghan',
  },
  {
    value: 'Offaly',
  },
  {
    value: 'Roscommon',
  },
  {
    value: 'Sligo',
  },
  {
    value: 'Tipperary',
  },
  {
    value: 'Tyrone',
  },
  {
    value: 'Waterford',
  },
  {
    value: 'Westmeath',
  },
  {
    value: 'Wexford',
  },
  {
    value: 'Wicklow',
  }
];

class SimpleModal extends Component {
	state = {
		open: false,
		beds: '',
		rent_type: '',
		desc: '',
		chars_left: 180,
		fileList: [],
		amount: '',
		baths: '',
		furnished: '',
    county: '',
    town: '',
		images: [],
		ipfs: '',
		txHash: [],
    color: 'green',
    disableButton: false,
    date: ''
	};
	
	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({
      open: false,
      beds: '',
      rent_type: '',
      desc: '',
      chars_left: 180,
      fileList: [],
      amount: '',
      baths: '',
      furnished: '',
      county: '',
      town: '',
      images: [],
      ipfs: '',
      txHash: [],
      color: 'green',
      disableButton: false,
      date: ''
		});
	};
  
  currentTime = () => {
    let today = new Date().getTime() / 1000;
    let date = new Date(1970, 0, 1); // Epoch
    date.setSeconds(today + 86400);

    var options = {
        year: "numeric",
        month: "2-digit",
        day: "numeric"
    };
    var time = date.toLocaleDateString('eu-ES', options);
    return time;
  }

  handleTime = (event) => {
    var inputDate = new Date(event.target.value).getTime() / 1000;
    var getDate = new Date();
    var currentDate = getDate.getTime() / 1000;
    
    if(inputDate < currentDate + 86400 ){
      var options = {
          year: "numeric",
          month: "2-digit",
          day: "numeric"
      };
      
      let today = new Date().getTime() / 1000;
      let date = new Date(1970, 0, 1); // Epoch
      date.setSeconds(today + 86400);
     
      var time = date.toLocaleDateString('eu-ES', options);
      event.target.value = time;
    }else{
      this.setState({ date: inputDate });
    }
  }
	
	handleWordCount = (event) => {
		const charCount = event.target.value.length;
		const charLeft = 180 - charCount;
		if(charLeft <= 0){
			this.setState({ chars_left: 0, color: 'red'});
			event.target.value = event.target.value.slice(0, 180);
	  
		}else if(charLeft <= 20 && charLeft >=1){
	  this.setState({ chars_left: charLeft,color: 'orange'});
	}else{
			this.setState({ chars_left: charLeft,color: 'green'});
		}
		this.setState({ desc: event.target.value});
	}

	handleFiles = async (event) => {
		var files = [...event.target.files]
	if(files.length >= 5){
	  files = files.slice(0,5);
	}
		var files_64 = []
		try {
			for(var file of files){
				const fileContents = await base_64(file)
				files_64.push(fileContents);
			}
		} catch (e) {
			console.warn(e.message)
		}
		var fileNames = []
		for(var f of files){
			fileNames.push(f.name)
		}
		this.setState({ fileList: fileNames });
		this.setState({ images: files_64 })
		//console.log(this.state.fileList);
	}

	handleUploadIPFS = async () => {

	  this.setState({ disableButton: true});
	  const details = {
		beds: this.state.beds,
		rent_type: this.state.rent_type,
		desc: this.state.desc,
		amount: this.state.amount,
		baths: this.state.baths,
		furnished: this.state.furnished,
		images: this.state.images,
		county: this.state.county,
		town: this.state.town,
	  }

	  const buffer = await Buffer.from(JSON.stringify(details));
	  await ipfs.provider().add(buffer, (err, ipfsHash) => {
		if(err){
		  console.log(err)
		}else{
		  this.setState({ ipfsHash: ipfsHash[0].hash });
		  this.deployContract();
		}
	  })
	}
  
  handleAmount = (event) => {
    if(event.target.value < 0){
      event.target.value = 0;
    }
    this.setState({amount: event.target.value});
  }
	
  deployContract = async () => {
    const web3 = await this.props.web3;
		const accounts = await web3.eth.getAccounts();
		const { interf, bytecode} = contract;
		const result = await new web3.eth.Contract(JSON.parse(interf))
			.deploy({ data: '0x'+ bytecode, arguments: [web3.utils.toWei(this.state.amount, 'ether'),this.state.date,this.state.ipfsHash] })
			.send({ gas: '3000000', value: web3.utils.toWei('0.0002', 'ether'), from: accounts[0] }).catch(function(e){});
		console.log('Contract deployed to', result.options.address);
		var nHash = this.state.txHash;
		nHash.push(result.options.address);
		await this.setState({ txHash: nHash});
    this.handleClose();

	}
	
	TextField_ = (obj, desc, id, width='120px') => {
		const { classes } = this.props;
		return(
			<TextField
				id = {"outlined-select-"+id}
				select
				className = {classes.textField}
				value = {this.state[id]}
				onChange = {this.handleChange(id)}
				SelectProps = {{
					MenuProps: {
						className: classes.menu,
					},
				}}
				style={{ width: width}}
				helperText={desc}
				margin="dense"
				variant="outlined"
			>
				{obj.map((option, x) => (
					<MenuItem key={option+x} value={option.value}>
						{option.value}
					</MenuItem>
				))}
			</TextField>	
		);
	}
	
	render() {
		const { classes } = this.props;
    let ethStyle = {
      width: "40px",
      marginLeft: "-15px",
      marginRight: "-10px"
    }
		return (
		<div>
			<Button onClick={this.handleOpen} variant="outlined" color="inherit">Create Auction</Button>
			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={this.state.open}
				onClose={this.handleClose}>
				<div style={getModalStyle()} className={classes.paper}>
					<Grid container className={classes.root}>
						<Grid item >
							<Typography variant="h6" id="modal-title">
								Create New Auction
							</Typography>
						</Grid>
						<Grid container justify="flex-start" className={classes.root} spacing={16}>
							<Grid item >
								{this.TextField_(beds, "How many beds", "beds")}
							</Grid>
							<Grid item >
								{this.TextField_(rent_type, "Rental Type", "rent_type")}
							</Grid>
              {/* AMOUNT */}
							<Grid item >
                  <TextField
                    id="outlined-adornment-amount"
                    className={classes.textField}
                    variant="outlined"
                    placeholder="ETH"
                    type="number"
                    value={this.state.amount}
                    onChange={this.handleAmount}
                    margin="dense"
                    helperText="Initial Price"
                    style={{ width: '180px'}}
                    label={"€ " + (this.props.ex * this.state.amount).toFixed(2)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">
                         <img style={ethStyle} src="https://www.ethereum.org/images/logos/ETHEREUM-ICON_Black_small.png" alt=""/>
                      </InputAdornment>,
                    }}
                  />
							</Grid>
              {/* END DATE */}
              <Grid item>
                <TextField
                  id="outlined-helperText"
                  type="date"
                  
                  helperText="End Date"
                  margin="dense"
                  onChange={this.handleTime}
                  variant="outlined"
                  className={classes.textField}
                  style={{width: "180px"}}
                  defaultValue={this.currentTime()}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
						</Grid>
						<Grid container justify="flex-start" spacing={16} className={classes.root}>
							<Grid item >
								{this.TextField_(baths, "Bathrooms", "baths")}
							</Grid>
							<Grid item >
								{this.TextField_(furnished, "Furnishing", "furnished")}
							</Grid>
              {/* TOWN/CITY */}
              <Grid item>
                <TextField
                  id="outlined-helperText"
                  helperText="Town/City"
                  margin="dense"
                  variant="outlined"
                  style={{width: "180px"}}
                  onChange = {this.handleChange('town')}
                />
              </Grid>
              {/* COUNTY */}
              <Grid item>
                {this.TextField_(counties, "County", "county", "180px")}
              </Grid>
						</Grid>
            {/* DESCRIPTION */}
						<Grid container justify="flex-start" className={classes.root}>
							<div>
								<TextField
									placeholder="description, contact details... etc."
									multiline={true}
									rows={3}
									style = {{width: '648px'}}
									maxLength={140}
									required onChange={this.handleWordCount}
									margin="dense"
									variant="outlined"
									InputProps={{
										endAdornment: <InputAdornment style={{color: this.state.color}} position="end">{this.state.chars_left}</InputAdornment>,
									}}
								/>
							</div>
						</Grid>
            {/* IMAGE FILE NAMES */}
						<Grid container className={classes.root}>
							<div>
								{this.state.fileList.map(option => (
									<p style={{display: 'inline', margin: '5px'}} key={option} value={option}>
										{option}
									</p>
								))}
							</div>
						</Grid>
						<Grid style={{marginTop: '5px'}} container className={classes.root} spacing={16}>
							{/* SELECT IMAGES*/}
							<Grid item>
								<div>
									<input
										accept="image/*"
										className={classes.button}
										id="flat-button-file"
										multiple
										type="file"
										style={{ display: 'none' }}
										onChange={this.handleFiles.bind(this)}
									/>
									<label htmlFor="flat-button-file">
                  <MuiThemeProvider theme={green_theme}>
										<Button disabled={this.state.disableButton}  color="primary" variant="outlined" component="span" className={classes.button}>
											Select Images
										</Button>
                  </MuiThemeProvider>
									</label>
								</div>
							</Grid>
              {/* DEPLOY BUTTON */}
							<Grid item>
								<MuiThemeProvider theme={blue_theme}>
									<Button onClick={this.handleUploadIPFS} disabled={this.state.disableButton} color="primary" variant="outlined" component="span" className={classes.button}>
										Deploy
									</Button>
								</MuiThemeProvider>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</Modal>
		</div>
		);
	}
}

export default withStyles(styles)(SimpleModal);
