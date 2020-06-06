import React ,{Component} from 'react';
// import {Button} from 'reactstrap';
import axios from 'axios';
import AudioVideoPermission from './AudioVideoPermission';
import {
    ConsoleLogger,
    DefaultDeviceController,
    DefaultMeetingSession,
    LogLevel,
    MeetingSessionConfiguration,
    // VideoTileState,
    MeetingSession
  } from 'amazon-chime-sdk-js';
import VideoTilesControls from './VideoTilesControls';
import TileAllotment from './TileAllotment';

interface IProps {
}

interface IState {
  meetingSession?:MeetingSession,
  numbers:number
}

class MainComponent extends Component<IProps,IState>{
  //  meetingSession:MeetingSession;
  tileAllotment:TileAllotment=new TileAllotment();
  constructor(props){
    super(props);
    this.state={
      meetingSession:null,
      numbers:1
    } 
    this.createMeeting=this.createMeeting.bind(this);
    this.joinMeeting=this.joinMeeting.bind(this);
  }
  
   createMeeting(){
    
    let meetingResponse ; 
    let attendeeResponse ; 
 
  axios.get('http://localhost:4000/')
    .then((res)=>
  {
    meetingResponse=res.data.meeting;
    attendeeResponse=res.data.attendee;
    console.log(meetingResponse,attendeeResponse);
 
   
const logger = new ConsoleLogger('MyLogger', LogLevel.INFO);

const deviceController = new DefaultDeviceController(logger);

const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);

// In the usage examples below, you will use this meetingSession object.
   this.setState({
     meetingSession :new DefaultMeetingSession(
  configuration,
  logger,
  deviceController
  ),
  numbers:2
});
 console.log(this.state.meetingSession)
let audioVideoPermission:AudioVideoPermission=new AudioVideoPermission(this.state.meetingSession);
audioVideoPermission.x();

});
   }


 joinMeeting(){

 
    
    let meetingResponse ; 
    let attendeeResponse ; 
 console.log(window.location.pathname,'dgfdhmgsvgfghvsdbnfmdbsrveavsdbhtnygkyrbtvesgdbfjvdsacfdvgjtgyrefrscdg hbryev');
  axios.get(`http://localhost:4000${window.location.pathname}`)
    .then((res)=>
  {
    meetingResponse=res.data.meeting;
    attendeeResponse=res.data.attendee;
    console.log(meetingResponse,attendeeResponse);
 
   
const logger = new ConsoleLogger('MyLogger', LogLevel.INFO);

const deviceController = new DefaultDeviceController(logger);

const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);

// In the usage examples below, you will use this meetingSession object.
   this.setState({
     meetingSession :new DefaultMeetingSession(
  configuration,
  logger,
  deviceController
  ),
  numbers:2
});
 console.log(this.state.meetingSession)
let audioVideoPermission:AudioVideoPermission=new AudioVideoPermission(this.state.meetingSession);
audioVideoPermission.x();

});


}




  render(){
  

    return(
       <div> 
            
          <button onClick={this.createMeeting}>create meeting</button>
          
          <button onClick={this.joinMeeting}>join meeting</button>
          <VideoTilesControls meetingSession={this.state.meetingSession} tileAllotment={this.tileAllotment}></VideoTilesControls>
       {/* <div>hello {this.state.meetingSession}</div> */}
          <audio id="audio-element-id"></audio>
          
          <div>{this.state.numbers}</div>

          {/* <video id="video-element-id"></video> */}
          {/* <button id="video-pause">Pause</button> */}




    </div>

    );
  
}
  


};



export default MainComponent;