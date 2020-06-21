import React, { Component } from 'react';
import CSS from 'csstype';
import { MeetingSession, VideoTileState,MeetingSessionStatusCode  } from 'amazon-chime-sdk-js';
import axios from 'axios';
import TileAllotment from './TileAllotment';


//this is the way to provide style in typescript
const tileStyle: CSS.Properties = {
  display: 'none',
  height: '300px',
  width: '300px',
  border: '2px red solid'

}
const videoStyle: CSS.Properties = {
  height: '250px',
  width: '300px'

}


interface IProps {
  meetingSession?: MeetingSession
  tileAllotment?: TileAllotment
  leader?:number
  socket?:any
}

interface TileProperty {
  pauseButton: string;
  muteButton: string;
}
//this is state datatype intilaization for the given class
interface Tile {
  [id: number]: VideoTileState;

}
interface IState {
  tileStates?: Tile;
  tileProperties: TileProperty[];

}

export default class VideoTilesControls extends Component<IProps, IState>{
  myRef: any;


  constructor(props) {
    super(props);

    this.state = {
      tileStates: null,
      tileProperties: [{ pauseButton: "pause", muteButton: "mute" },{ pauseButton: "pause", muteButton: "mute" }, { pauseButton: "pause", muteButton: "mute" }, { pauseButton: "pause", muteButton: "mute" }]

    }
    this.myRef = React.createRef();
    this.pause = this.pause.bind(this);
    this.mute = this.mute.bind(this);
    this.leaveMeeting=this.leaveMeeting.bind(this);
    this.endMeeting=this.endMeeting.bind(this);
  
  }

  
//this will call our class after audio video permission are given
  componentDidMount() {
    console.log('component mounted');
    this.b();
}


//this here button function will help us to hide and resume our video on clicking it
  pause(e: any) {

  //this below code is to select the particular button call it by id  
    let s = e.target.id;
    s = s.slice(1);
    console.log(Number(s), 'edtrfbhyjgfrdtfijoyugioy34872910iu8347uqeifgvyf32i90ojqefj28qipowg892i0fewo');
    let index = Number(s);
    // index++;


    (async () => {
      if (this.state.tileStates[index].active) {
      //this the actual code which will do the above work in amazon chime backend
        this.props.meetingSession.audioVideo.stopLocalVideoTile();
        //this udation of state accordingly
        let tilesProperty = [...this.state.tileProperties];
        let tileProperty = { ...tilesProperty[index - 1] };
        tileProperty.pauseButton = "Resume";
        tilesProperty[index - 1] = tileProperty;
        this.props.tileAllotment.releaseTileIndex(this.state.tileStates[index].tileId);
        this.setState({
          tileProperties: tilesProperty
        });

      } else {

        const videoInputDevices = await this.props.meetingSession.audioVideo.listVideoInputDevices();
        console.log(videoInputDevices);
        await this.props.meetingSession.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);

        this.props.meetingSession.audioVideo.startLocalVideoTile()
        let tilesProperty = [...this.state.tileProperties];
        let tileProperty = { ...tilesProperty[index - 1] };
        tileProperty.pauseButton = "Pause";
        tilesProperty[index - 1] = tileProperty;

        this.setState({
          tileProperties: tilesProperty
        });
      }

    })();

  }


//this code will handle the force mute which can only be run by the meeting leader
  muteForce(e:any){
    let s = e.target.id;
    s = s.slice(1);
    console.log(Number(s), 'edtrfbhyjgfrdtfijoyugioy34872910iu8347uqeifgvyf32i90ojqefj28qipowg892i0fewo');
    let index = Number(s);
    // index++;

    console.log(this.state.tileStates[index].boundAttendeeId);
    const params={
      id:this.state.tileStates[index].boundAttendeeId,
    }

    if (this.state.tileProperties[index - 1].muteButton === 'UnMute') {
      this.props.socket.emit('forceUnMute',params);
      let tilesProperty = [...this.state.tileProperties];
     let tileProperty = { ...tilesProperty[index - 1] };
     tileProperty.muteButton = "Mute";
     tilesProperty[index - 1] = tileProperty;

     this.setState({
       tileProperties: tilesProperty
     });
   }

   else {
    
    this.props.socket.emit('forceMute',params);
    
    let tilesProperty = [...this.state.tileProperties];
     let tileProperty = { ...tilesProperty[index - 1] };
     tileProperty.muteButton = "UnMute";
     tilesProperty[index - 1] = tileProperty;
     this.setState({
       tileProperties: tilesProperty
     });
   };
}


//this will handle the normal mute which a attendee can do on its on its tile
mute(e: any) {

    let s = e.target.id;
    s = s.slice(1);
    console.log(Number(s), 'edtrfbhyjgfrdtfijoyugioy34872910iu8347uqeifgvyf32i90ojqefj28qipowg892i0fewo');
    let index = Number(s);
    if (this.state.tileProperties[index - 1].muteButton === 'UnMute') {
       this.props.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
      let tilesProperty = [...this.state.tileProperties];
      let tileProperty = { ...tilesProperty[index - 1] };
      tileProperty.muteButton = "Mute";
      tilesProperty[index - 1] = tileProperty;

      this.setState({
        tileProperties: tilesProperty
      });
    }

    else {
       this.props.meetingSession.audioVideo.realtimeMuteLocalAudio();
      let tilesProperty = [...this.state.tileProperties];
      let tileProperty = { ...tilesProperty[index - 1] };
      tileProperty.muteButton = "UnMute";
      tilesProperty[index - 1] = tileProperty;
      this.setState({
        tileProperties: tilesProperty
      });
    }
 
  }


//this is the main function which will handle our tile visible and change in any tile state  
  async b() {
    if (this.props.meetingSession != null) {
      const videoInputDevices = await this.props.meetingSession.audioVideo.listVideoInputDevices();

      await this.props.meetingSession.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);
      const observerV = {
        //this will get trigger whenver a new tile is made or there is any change in tile state
        videoTileDidUpdate: (tileState: VideoTileState) => {

          if (!tileState.boundAttendeeId || !tileState.localTile) {
            return;
          }

          const tileIndex = tileState.localTile ? 3 : this.props.tileAllotment.acquireTileIndex(tileState.tileId);
          console.log(tileState, tileIndex, this.myRef.current.childNodes, "werhbtfsdadfgrbsagervrtnuaectigugvmmmcfsgern23444445625643f36g5hljkp9'[;plokiukl;]){_/9;0p8ljkoiyhjugtewfxefgrthuyiolp,[/olki");


          const TileElement = this.myRef.current.childNodes[tileIndex];

          const videoElement = this.myRef.current.childNodes[tileIndex].childNodes[0];
          TileElement.style.display = 'block';



          this.props.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
          this.setState({
            tileStates: { ...this.state.tileStates, [tileIndex + 1]: tileState }
          });

        }
      };

      this.props.meetingSession.audioVideo.addObserver(observerV);
//this here will start the video in our window
      this.props.meetingSession.audioVideo.startLocalVideoTile();

//this obsever is normally to made tile of other attendee visble to him
      const observer = {
        videoTileDidUpdate: tileState => {
          if (!tileState.boundAttendeeId || tileState.localTile || tileState.isContent) {
            return;
          }

          const tileIndex = tileState.localTile ? 3 : this.props.tileAllotment.acquireTileIndex(tileState.tileId);

          const TileElement = this.myRef.current.childNodes[tileIndex];

          const videoElement = this.myRef.current.childNodes[tileIndex].childNodes[0];
          TileElement.style.display = 'block';

          this.setState({
            tileStates: { ...this.state.tileStates, [tileIndex + 1]: tileState }
          });

          console.log(this.state.tileStates, tileState);
          this.props.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
        },

        videoTileWasRemoved: (tileId: number) => {
          console.log(`video tile removed: ${tileId}`);
          const tileIndex = this.props.tileAllotment.releaseTileIndex(tileId);
          const TileElement = this.myRef.current.childNodes[tileIndex];
          console.log(`video tile index: ${tileIndex}`);

          TileElement.style.display = 'block';

        }
      };

      this.props.meetingSession.audioVideo.addObserver(observer);
     
      //this handle will handle any change related to volume ,mute unmute of an attendee
      const handler = (attendeeId: string, present: boolean, externalUserId: string): void => {
        console.log(`${attendeeId} present = ${present} (${externalUserId})`);
        
        this.props.meetingSession.audioVideo.realtimeSubscribeToVolumeIndicator(
          attendeeId,
          async (
            attendeeId: string,
            volume: number | null,
            muted: boolean | null,
            signalStrength: number | null
          ) => {
            if (volume !== null) {
              console.log("volume changed");
            }
            if (muted !== null) {
              console.log(`hello i am smart ${muted}  , ${attendeeId}, ${this.state.tileStates}`);
              
              //to find 
              let x=0;
              for (var key in this.state.tileStates) {
                // skip loop if the property is from prototype
                if (!this.state.tileStates.hasOwnProperty(key)) continue;
            
                var obj = this.state.tileStates[key];
                for (var prop in obj) {
                    if (!obj.hasOwnProperty(prop)) continue;
                    if(prop==="boundAttendeeId" && obj[prop]===attendeeId){
                      if (muted) {
                        let tilesProperty = [...this.state.tileProperties];
                        let tileProperty = { ...tilesProperty[Number(key) - 1] };
                        tileProperty.muteButton = "UnMute";
                        tilesProperty[Number(key) - 1] = tileProperty;
                  
                        this.setState({
                          tileProperties: tilesProperty
                        });
                      }
                  
                      else {
                        let tilesProperty = [...this.state.tileProperties];
                        let tileProperty = { ...tilesProperty[Number(key) - 1] };
                        tileProperty.muteButton = "Mute";
                        tilesProperty[Number(key) - 1] = tileProperty;
                        this.setState({
                          tileProperties: tilesProperty
                        });
                      }
                      x=1;
                      break;
                    }
                    // console.log(prop,obj[prop]);
                }
                if(x===1)break;
            }
              }
            
           
          }
        );
      };


      this.props.meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(handler);
     
     
    //this will mute a attendee if the leader has done this to mute him aur not 
      this.props.socket.on('message', (message)=> {
        console.log(message);
        const t=document.getElementById('m4') as HTMLButtonElement;
        
        if(message==='mute'){
          this.props.meetingSession.audioVideo.realtimeMuteLocalAudio();
          let tilesProperty = [...this.state.tileProperties];
          let tileProperty = { ...tilesProperty[3] };
          tileProperty.muteButton = "UnMute";
          tilesProperty[3] = tileProperty;
          t.style.display='none';
          this.setState({
            tileProperties: tilesProperty
          });
        }
    
        else if(message==='unmute'){
          this.props.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
          let tilesProperty = [...this.state.tileProperties];
          let tileProperty = { ...tilesProperty[3] };
          tileProperty.muteButton = "Mute";
          tilesProperty[3] = tileProperty;
          t.style.display='block';
          this.setState({
            tileProperties: tilesProperty
          });
        }
    
      });


     // leaving of meeting 
     
      const observerO = {
      audioVideoDidStop: sessionStatus => {
        const sessionStatusCode = sessionStatus.statusCode();
        if (sessionStatusCode === MeetingSessionStatusCode.AudioCallEnded) {
          window.location.assign('/');
        } else {
          console.log('Stopped with a session status code: ', sessionStatusCode);
        }
      }
    };
     
    this.props.meetingSession.audioVideo.addObserver(observerO);
    }
  }


//this code will make the attendee leave the meet by closing its session  
leaveMeeting(){

  const observerL = {
    audioVideoDidStop: sessionStatus => {
      const sessionStatusCode = sessionStatus.statusCode();
      if (sessionStatusCode === MeetingSessionStatusCode.Left) {
        console.log('You left the session');
      } else {
        console.log('Stopped with a session status code: ', sessionStatusCode);
      }
    }
  };
   
  this.props.meetingSession.audioVideo.addObserver(observerL);

  this.props.meetingSession.audioVideo.stop();
   window.location.assign('/');
}

//thsi code will make the meeting over for all and only done by the creater
endMeeting(){

  axios.get(`http://localhost:4000/end`)
  .then((res) => {
    console.log(res);
  })

  
  this.props.meetingSession.audioVideo.stop();
  window.location.assign('/');  
}


render() {

  //thsi code is for leader with more functionality to handle other attendee also  
    if(this.props.leader){
      return (
        <div ref={this.myRef}>
          <div id="tile-1" style={tileStyle} >
            <video id="video-1" style={videoStyle} ></video>
            <div id="nameplate-1">Ram</div>
            <button id="p1" onClick={e => this.pause(e)}> {this.state.tileProperties[0].pauseButton}</button>
            <button id="m1" onClick={e => this.muteForce(e)} >
              {this.state.tileProperties[0].muteButton}
            </button>
          </div>
  
          <div id="tile-2" style={tileStyle} >
            <video id="video-2" style={videoStyle} ></video>
            <div id="nameplate-2">Rahul</div>
            <button id="p2" onClick={e => this.pause(e)}> {this.state.tileProperties[1].pauseButton}</button>
            <button id="m2" onClick={e => this.muteForce(e)} >
              {this.state.tileProperties[1].muteButton}
            </button>
          </div>
          <div id="tile-3" style={tileStyle} >
            <video id="video-3" style={videoStyle} ></video>
            <div id="nameplate-3">Raghav</div>
            <button id="p3" onClick={e => this.pause(e)}> {this.state.tileProperties[2].pauseButton}</button>
            <button id="m3" onClick={e => this.muteForce(e)} >
              {this.state.tileProperties[2].muteButton}
            </button>
          </div>
          <div id="tile-4" style={tileStyle} >
            <video id="video-4" style={videoStyle} ></video>
            <div id="nameplate-4">Mayank</div>
            <button id="p4" onClick={e => this.pause(e)}> {this.state.tileProperties[3].pauseButton}</button>
            <button id="m4" onClick={e => this.mute(e)} >
              {this.state.tileProperties[3].muteButton}
            </button>
          </div>
          <button onClick={this.leaveMeeting}>Leave Meeting</button>
          <button onClick={this.endMeeting}>End Meeting</button>
         
        </div>
      )
    }
    
  
  //this is for all other attendee
    else{
      return (
        <div ref={this.myRef}>
          
          <div id="tile-1" style={tileStyle} >
            <video id="video-1" style={videoStyle} ></video>
            <div id="nameplate-1">Ram</div>
               <div>
              {this.state.tileProperties[0].muteButton}
              </div>
          </div>
  
          <div id="tile-2" style={tileStyle} >
            <video id="video-2" style={videoStyle} ></video>
            <div id="nameplate-2">Rahul</div>
            <div>
              {this.state.tileProperties[1].muteButton}
              </div>
          </div>
          <div id="tile-3" style={tileStyle} >
            <video id="video-3" style={videoStyle} ></video>
            <div id="nameplate-3">Raghav</div>
            <div>
              {this.state.tileProperties[2].muteButton}
              </div>
          </div>
          <div id="tile-4" style={tileStyle} >
            <video id="video-4" style={videoStyle} ></video>
            <div id="nameplate-4">Mayank</div>
            <button id="p4" onClick={e => this.pause(e)}> {this.state.tileProperties[3].pauseButton}</button>
            <button id="m4" onClick={e => this.mute(e)} >
              {this.state.tileProperties[3].muteButton}
            </button>
          </div>
          <button onClick={this.leaveMeeting}>Leave Meeting</button>
         
        </div>
      )
    }
    }
  
 }

