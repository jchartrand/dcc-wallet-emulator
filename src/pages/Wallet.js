import React, { useState } from 'react';
import '../App.css';

import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { createIssuer } from '@digitalcredentials/sign-and-verify-core'

import unlockedDidDocument from '../data/unlockedDID'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1000,
    },
    multiline: {
        fontWeight: 'bold',
        fontSize: '20px',
        color: 'purple',
        width: '50vw'
    },
    textfield: {
        width: '60vw'
    }
}));

const sectionProps = {
    bgcolor: 'background.paper',
    m: 4,
    p: 4,
    border: 1,
    borderColor: 'text.primary',
    borderRadius: 16
};

function Wallet() {

    const classes = useStyles();
    const location = useLocation();

    const [challenge, setChallenge] = useState('')
    const [requestURL, setRequestURL] = useState('')
    const [initiateRequestURL, setInitiateRequestURL] = useState('http://localhost:4010/request?student_id=400000002&batch=first&redirect_uri=http://localhost:3000/wallet')
    const [didAuthResponse, setDidAuthResponse] = useState('')
    const [credential, setCredential] = useState('')
    const [currentState, setCurrentState] = useState(1)


    const buildRequest = async () => {
        const presentationId = '323'  // not sure what this is for
        const presentationOptions = {
            verificationMethod: "did:web:digitalcredentials.github.io#96K4BSIWAkhcclKssb8yTWMQSz4QzPWBy-JsAFlwoIs",
            challenge: challenge
        }
        const holderDID = unlockedDidDocument.id
        const issuer = createIssuer(unlockedDidDocument)
        const verifiablePresentation = await issuer.createAndSignPresentation(null, presentationId, holderDID, presentationOptions);
        setDidAuthResponse(JSON.stringify(verifiablePresentation, null, 2))
        setCurrentState(3)
    }

    const sendRequest = async () => {
        console.log(didAuthResponse)
        const res = await fetch(requestURL, {
            method: "POST",
            mode: 'cors',
            body: didAuthResponse,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
        setCredential(JSON.stringify(res.credential, null, 2))
        setCurrentState(4)
    }

    const initiateRequest = () => {
        window.location.href = initiateRequestURL;
    }

    const getBackgroundColor = section => {
        return currentState === section ? 'lightgreen' : 'background.paper'
    }
    const getStepMessage = section => {
        return currentState === section ? <Box fontWeight="fontWeightBold" m={3}>You appear to be on this step</Box> : null
    }
    React.useEffect(() => {
        const params = queryString.parse(location.search)
        if (params.request_url && params.challenge) {
            setCurrentState(2)
            setChallenge(params.challenge)
            setRequestURL(params.request_url)
        } else {
            setCurrentState(1)
        }
    }, [location]);

    return (
        <Box display="flex" justifyContent="center" m={1} p={1} >
            <div className="App" >

                <Box className={classes.root}>
                    <Typography variant="h4" gutterBottom>
                        Digital Credentials Consortium Wallet Simulator
            </Typography>
                    <Typography>
                        Use this page to simulate the exchange between the recipient (normally on a mobile) and the issuer.  This page plays the part
                        of the recipient's phone, especially the Wallet on their phone.  The idea here is to test the issuing server.  The exchange follows
                        the Digital Credential Consortium's <a href="https://github.com/digitalcredentials/docs/blob/main/request/credential_request.md">Credential Request Flow</a>
                    </Typography>
                    <Box {...sectionProps} bgcolor={getBackgroundColor(1)}>
                        <Typography variant="h5" gutterBottom>Step 1 - Initiate Exchange</Typography>
                        {getStepMessage(1)}
                        <Typography gutterBottom>
                            At this point in the exchange (the beginning), a link will have been given (e.g., emailed)
                            to the student, like the link below in the 'Initiate Credential Request' field (note the query params on the link).
                            The student would click this link (in the email) while on their phone, which would send
                            the request to the issuer's server to start the issuance exchange.  The link
                            will likely first take the student to some authentication page (and so open a
                            web browser on the phone). After authentication the issuer will
                            generate a one time token/challenge, maybe verify the user is entitled to a credential, and then redirect
                            the request to the redirect_uri that was included as a query parameter
                            on the original link, adding on two additional query parameters to that link:
                        </Typography>
                        <Box display="flex" justifyContent="center" m={1} p={1} >
                            <List component="nav" aria-label="secondary mailbox folders" >
                                <ListItem >
                                    <ListItemText inset primary="challenge=valueOfToken" secondary="One time token generated by the issuer." />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText inset primary="request_url=http://...." secondary="The url from which the wallet should request the credential." />
                                </ListItem>
                            </List>
                        </Box>
                        <Typography gutterBottom>
                            Normally the redirect_uri would be a deep link that opens the Wallet on the recipient's phone, but we instead
                            make it point to this page, like in the example url below.
                            Change the example url below to match what you need, e.g., change the server location to yours,
                            possibly the link in the redirect_uri (if for example you are hosting a copy of this page), and
                            add in any other query parameters that your issuing server expects.  Then click the button to send off
                            the request.  It should end up right back at this page (after the redirect), but at Step 2 below.
                     </Typography>
                        <Box m={3}>
                            <FormControl> <TextField className={classes.textfield} p={3} label="Initiate Credential Request" value={initiateRequestURL} onChange={e => setInitiateRequestURL(e.currentTarget.value)} /></FormControl>
                        </Box>
                        <Box m={1}>
                            <Button variant="outlined" color="primary" onClick={initiateRequest}>Send Initial Request</Button></Box>
                    </Box>
                    <Box {...sectionProps} p={4} bgcolor={getBackgroundColor(2)}>
                        <Typography variant="h5" gutterBottom>Step 2 - Redirected into Wallet - Now Build and Sign VerifiablePresentation</Typography>
                        {getStepMessage(2)}
                        <Typography gutterBottom>The issuer's server has redirected our intial request from 1 (after authenticating us and generating a one-time token/challenge) to the
                        the redirect_uri that we supplied as part of the initial url above.  The 'challenge' and 'request_url' that the server has sent us
                        are shown below.  Now our job (well, the Wallet's job) is to construct a VerifiablePresentation that
                        includes that challenge, sign the VP, and send it to the request_url.  This does a few things:

                            <List component="nav" aria-label="secondary mailbox folders">
                                <ListItem button>
                                    <ListItemText primary="Submits our DID" secondary="Gives our DID to
                            the server so it can be included in our credential"/>
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Proves DID ownership" secondary="We sign the VP with our private key proving we own the DID" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary="Proves identity" secondary="Because we include the token we got from authenticating earlier" />
                                </ListItem>
                            </List>

                            This Wallet uses a hardcoded unlocked DID to
                            sign the Verifiable Presentation (so is only for demonstation).

                            When you are ready, click Build Collection Request to have this Wallet emulator construct and sign the VP (but not send it - that's the next step).</Typography>


                        <div>
                            <FormControl>
                                <TextField
                                    label="Request URL"
                                    value={requestURL}
                                    onChange={e => setRequestURL(e.currentTarget.value)}
                                    className={classes.textfield} />
                            </FormControl>
                        </div>
                        <div>
                            <FormControl> <TextField label="Challenge" value={challenge} onChange={e => setChallenge(e.currentTarget.value)} className={classes.textfield} /></FormControl>
                        </div>

                        <Box p={3}><Button variant="outlined" color="primary" onClick={buildRequest} >Build and Sign Collection Request</Button></Box>
                    </Box>

                    <Box {...sectionProps} bgcolor={getBackgroundColor(3)}>
                        <Typography variant="h5" gutterBottom>Step 3 - Collect the Credential</Typography>
                        {getStepMessage(3)}
                        <Typography gutterBottom>Okay then, we (the Wallet) have now constructed our signed Verifiable Presentation (as shown below).
                        Now you can click 'Send Cred Request' to ship it off to the issuer's server and hopefuly get back our credential (to be
                        shown in the next step).  The server will verify the VP signature,  check that the challenge matches, check that
                        the recipient is in fact entitled to a certificate, construct the certificate, sign it, and send it back.
                    </Typography>
                        <Box p={3}>
                            <FormControl> <TextField
                                className={classes.multiline}
                                id="outlined-multiline-static"
                                label="DID-Auth-response to send to issuer"
                                multiline
                                rows={23}
                                variant="outlined"
                                placeholder="Your DID Auth Response will appear here after you click 'Build Cred Request'"
                                value={didAuthResponse}
                                onChange={e => setDidAuthResponse(e.currentTarget.value)}
                            />
                            </FormControl>
                        </Box>
                        <Typography gutterBottom>
                            Click 'Send Cred Request' to send the signed verifiable presentation to <Box fontWeight="fontWeightBold">{requestURL}</Box> (the 'request_url the issuer gave us back in Step 2 when it redirected us into the wallet), to
                            collect our credential.  Again, this request would normally be sent by the wallet.
                    </Typography>
                        <Box p={3}>
                            <Button variant="outlined" color="primary" onClick={sendRequest}>Send Cred Request</Button>
                        </Box>
                    </Box>
                    <Box {...sectionProps} bgcolor={getBackgroundColor(4)}>
                        <Typography variant="h5" gutterBottom>Step 4 - Admire the Credential</Typography>

                        {getStepMessage(4)}
                        <Typography gutterBottom>Okay, okay now - we've got our credential!  The Wallet would now store it away for future sharing/admiration.
                    </Typography>
                        <div>
                            <FormControl> <TextField
                                className={classes.multiline}
                                id="outlined-multiline-static"
                                label="Returned Credential"
                                multiline
                                rows={30}
                                variant="outlined"
                                placeholder="The returned credential will be shown here after you click Send Cred Request"
                                value={credential}
                                onChange={e => setCredential(e.currentTarget.value)}
                            />
                            </FormControl>
                        </div>
                    </Box>
                </Box>
            </div>

        </Box>

    );
}

export default Wallet;