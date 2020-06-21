import React, { Component } from 'react';
//this here is imported to fetch up data from the server such as meeting details and attendee details
import axios from 'axios';
//this here file include all the information related to system audio input output and video and camera permission 
import AudioVideoPermission from './AudioVideoPermission';
//this is included to create a realtime effect to our system
import io from 'socket.io-client';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
  MeetingSession
} from 'amazon-chime-sdk-js';

//this file contain all the information about how a tile me visible in the beowser window and function of mute force mute and pause also
import VideoTilesControls from './VideoTilesControls';
//this will handle all the information about which tile out of 4 is allocated to whom
import TileAllotment from './TileAllotment';
//this here is to see whether aur audio output is clear aur not
import TestSound from './SoundCheck';

//the sever where the socket will send and recieve data
const socketUrl = 'http://localhost:3001/';


//this is done to define the datatype of props used in our class particular to type script
interface IProps {
}

//this is done to define the datatype of state used in our class particular to type script
interface IState {
  meetingSession?: MeetingSession,
  meetingStarted: number,
  leader: number,
  socket: any
}


//this our actual main class
class MainComponent extends Component<IProps, IState>{
  
  //this is the stance created of the allotment of tile in the browser
  tileAllotment: TileAllotment = new TileAllotment();
  constructor(props) {
    super(props);
    this.state = {
      meetingSession: null,
      meetingStarted: 0,
      leader: 0,
      socket: null
    }
    this.createMeeting = this.createMeeting.bind(this);
    this.joinMeeting = this.joinMeeting.bind(this);
    this.testAudio = this.testAudio.bind(this);
  }

  //intilaization of socket connection and its connection 
  componentDidMount() {
    const socket = io(socketUrl);
    this.setState({
      socket: socket
    });


    socket.on('connect', () => {
      console.log('connected');
    });
  }


//this is to test our audio output device
  testAudio() {
    new TestSound("default");
  }


  //this function here will create a new meeting 
  createMeeting() {

    let meetingResponse;
    let attendeeResponse;
    //this will fetch the data related to meeting and attendee
    axios.get('http://localhost:4000/')
      .then((res) => {
        meetingResponse = res.data.meeting;
        attendeeResponse = res.data.attendee;
        console.log(meetingResponse, attendeeResponse);

        (async () => {
          const logger = new ConsoleLogger('MyLogger', LogLevel.ERROR);

          const deviceController = new DefaultDeviceController(logger);

          const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);

          // In the usage examples below, you will use this meetingSession object.
          this.setState({
            meetingSession: new DefaultMeetingSession(
              configuration,
              logger,
              deviceController
            )

          });
          console.log(attendeeResponse,attendeeResponse.Attendee.AttendeeId,'hello');

    //this here is the including our attendee to our socket join meet      
          this.state.socket.emit('join', attendeeResponse.Attendee.AttendeeId, function (err) {
            if (err) {
              alert(err);
              window.location.href = '/';
            } else {
              console.log('No error');
            }
          });
          

          console.log(this.state.meetingSession.audioVideo);

     //this here will create a instance our object to be created which will help us in finding data     
          let audioVideoPermission: AudioVideoPermission = new AudioVideoPermission(this.state.meetingSession);
       
          await audioVideoPermission.x();


          this.setState({
            meetingStarted: 1,
       //this here is tell that the this one is the leader of the meeting
            leader: 1
          });
          console.log(this.state.meetingSession.audioVideo, 'rsdtfgyuhtfrdesdtfyhuijyugtrdtfgyhuijgyutrd');
        })();

      });
  }

//same as above code but in this we create only attendee and add it to existing meeting
  joinMeeting() {



    let meetingResponse;
    let attendeeResponse;
    console.log(window.location.pathname, 'dgfdhmgsvgfghvsdbnfmdbsrveavsdbhtnygkyrbtvesgdbfjvdsacfdvgjtgyrefrscdg hbryev');
    axios.get(`http://localhost:4000${window.location.pathname}`)
      .then((res) => {
        meetingResponse = res.data.meeting;
        attendeeResponse = res.data.attendee;
        console.log(meetingResponse, attendeeResponse);

        (async () => {
          const logger = new ConsoleLogger('MyLogger', LogLevel.ERROR);

          const deviceController = new DefaultDeviceController(logger);

          const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);

          // In the usage examples below, you will use this meetingSession object.
          this.setState({
            meetingSession: new DefaultMeetingSession(
              configuration,
              logger,
              deviceController
            )

          });
          this.state.socket.emit('join',attendeeResponse.Attendee.AttendeeId, function (err) {
            if (err) {
              alert(err);
              window.location.href = '/';
            } else {
              console.log('No error');
            }
          });
          // this.state.socket.on('message', function (message) {
          //   console.log(message, 'hi there is am using this app');
          // });

          console.log(this.state.meetingSession)
          let audioVideoPermission: AudioVideoPermission = new AudioVideoPermission(this.state.meetingSession);
          await audioVideoPermission.x();
          this.setState({
            meetingStarted: 1
          })
        })();
      });


  }




  render() {
    //this code will execute for creater of meeting
    if (this.state.meetingStarted && this.state.leader) {
      return (
        <div>

          <button onClick={this.createMeeting}>create meeting</button>

          <button onClick={this.joinMeeting}>join meeting</button>
          <VideoTilesControls meetingSession={this.state.meetingSession} tileAllotment={this.tileAllotment} leader={this.state.leader} socket={this.state.socket}></VideoTilesControls>
          <audio id="audio-element-id"></audio>
          <button onClick={this.testAudio}  >Test</button>






        </div>

      );

}
 
//this code here will run for all other attendee
  else if (this.state.meetingStarted) {
      return (
        <div>

          <button onClick={this.createMeeting}>create meeting</button>

          <button onClick={this.joinMeeting}>join meeting</button>
          <VideoTilesControls meetingSession={this.state.meetingSession} tileAllotment={this.tileAllotment} leader={this.state.leader} socket={this.state.socket}></VideoTilesControls>
          {/* <div>hello {this.state.meetingSession}</div> */}
          <audio id="audio-element-id"></audio>
          <button onClick={this.testAudio}  >Test</button>




        </div>

      );

    }

    else {
      return (
        <div>

          <button onClick={this.createMeeting}>create meeting</button>

          <button onClick={this.joinMeeting}>join meeting</button>
          <audio id="audio-element-id"></audio>
        </div>

      );
    }

  }

};

export default MainComponent;