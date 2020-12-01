import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import  Toolbar from '@material-ui/core/ToolBar';
import { makeStyles } from '@material-ui/core/styles';
import macEngLogo from '../images/macEngLogo.png';
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    logo: {
      flex: 1,
      marginTop: '5px'
    }
  }));
 
export default function Header() {

    const classes = useStyles();

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
                <span className={classes.logo} >
                <Link  to={
                        { 
                            pathname: "/"
                        } }>
                    <img 
                        src={macEngLogo} 
                        alt={'logo'} 
                        height={'50px'}
                        ></img> 
                </Link>  
                </span>
               {/*  <AboutDialog/>
                <ContactDialog/> */}
            </Toolbar>
        </AppBar>
    )
}