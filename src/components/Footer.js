import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import footerImage from '../images/macEngLogo.png';


const useStyles = makeStyles((theme) => ({
    footer: {
       // marginTop: 'calc(1% + 20px)',
        bottom: 0,
       // margin: 0,
      //  justifyContent: 'center',
       // display: 'flex',
        width: '100%',
        height: '10vh',
        flexgrow: 1
      }
  }));
  
  export default function Footer() {
  
    const classes = useStyles();

    return (
       
        <div className={classes.footer}><img alt="footer" src={footerImage} width={'100%'} height={'147'}/></div>
    )
    }