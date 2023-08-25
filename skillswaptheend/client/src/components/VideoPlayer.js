import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles, Button } from '@material-ui/core';
import { Mic, MicOff, Videocam, VideocamOff } from '@material-ui/icons';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px', 
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',

    margin: '10px',
  },
}));

const VideoPlayer = ({email,othername}) => {
  const {
    name, callAccepted, myVideo, userVideo, callEnded, stream, call,
    isAudioMuted, toggleAudio,
    isVideoMuted, toggleVideo,
  } = useContext(SocketContext);
  const classes = useStyles();


  return (
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
            <Button onClick={toggleAudio} color="primary">
              {!isAudioMuted ? <MicOff /> : <Mic />}
              {!isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            </Button>
            <Button onClick={toggleVideo} color="primary">
              {!isVideoMuted ? <VideocamOff /> : <Videocam />}
              {!isVideoMuted ? 'Unmute Video' : 'Mute Video'}
            </Button>
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{othername || 'Name'}</Typography>
            <video playsInline ref={userVideo} autoPlay className={classes.video} />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
