import React, {useState, Fragment} from 'react';
import '../App.css';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import { useForm } from "react-hook-form";

import Footer from '../components/Footer';
import Header from '../components/Header';

import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  popover: {
    pointerEvents: 'none',
  },
  searchButton: {
    fontSize: '11pt',
    width: "23vw", 
    height: "100%",
    backgroundColor: '#A8DBF6',
    marginRight:'.41vw'
  },
  paging: {
    fontSize: '10pt'
  },
  noresults: {
    color: 'red'
  }

}));

function Verify() {

  const classes = useStyles();


 // const [{ response, universities, uniShortNames, subjects, degrees, years, isLoading, isError }, doQuery] = useSOLRQuery();
  
  const { register, handleSubmit, setValue, reset, errors } = useForm();
  
  const onSubmit = queryInputs => {
  //  doQuery({...queryInputs, page: 0});
  }

  const resetForm = () => {
    reset()
  }


  return (
    
<div>
    <Header/>
  
  <div className="App">

    
    <div className={classes.root}>

      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
     
      <Grid container  spacing={1} style={{paddingRight:"1vw"}} >
        <Grid item sm={6} >
          <FormControl> <TextField  style={{ width: "47.5vw" }} variant={'outlined'} type="search" label={"Batch Name"} inputRef={register} name="batch_name"/></FormControl>
        </Grid>

      </Grid>
      <Grid container spacing={1}  style={{paddingRight:"1vw"}} >
      
 

        <Grid item sm={3} style={{textAlign:'right'}}>
        <Button className={classes.searchButton} variant="outlined" color="primary" type="submit" style={{ width: "11vw",  height:"56px", marginRight:'1vw' }}>Submit</Button>
        <Button className={classes.searchButton} variant="outlined" color="primary" style={{ width: "11vw",  height:"56px" }} onClick={resetForm}>Reset</Button>
      </Grid>
    
      </Grid>
      </form>


      
   
      
   
  </div>
  
  </div>
  <Footer/>
    </div>
  
   
  );
}

export default Verify;