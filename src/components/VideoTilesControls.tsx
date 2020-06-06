import React,{Component} from 'react';
import update from 'react-addons-update';
import   CSS   from 'csstype';
import { MeetingSession,VideoTileState } from 'amazon-chime-sdk-js';
import TileAllotment from './TileAllotment';

    const tileStyle:CSS.Properties={
        display:'none',
        height:'150px',
        width:'150px',
        border:'2px red solid'

    }
    const videoStyle:CSS.Properties={
      height:'50px',
      width:'50px'

    }
    
    interface IProps {
      meetingSession?:MeetingSession
      tileAllotment?:TileAllotment
    }

    interface TileProperty{
      tileState:VideoTileState;
      pauseButton:string;
      muteButton:string;
    }

    interface IState {
      tileStates?:TileProperty[];
     
      
    }

    export  default class VideoTilesControls extends Component<IProps,IState>{
    myRef:any;


    constructor(props){
      super(props);

      this.state={
        tileStates:[],
        
      }
      this.myRef=React.createRef();
      this.pause=this.pause.bind(this);
      this.mute=this.mute.bind(this);


    }
      
      pause(e:any){
        let s=e.target.id;
        s=s.slice(1);
        console.log(Number(s),'edtrfbhyjgfrdtfijoyugioy34872910iu8347uqeifgvyf32i90ojqefj28qipowg892i0fewo');
        let index=Number(s);
        if (!this.state.tileStates[index].tileState.paused) {
          this.props.meetingSession.audioVideo.pauseVideoTile(this.state.tileStates[index].tileState.tileId);
          // this.props.meetingSession.audioVideo.chooseVideoInputDevice(null);
          // this.props.meetingSession.audioVideo.stopVideoPreviewForVideoInput(null);
          // this.props.meetingSession.audioVideo.stopLocalVideoTile();
          let tileStates=this.state.tileStates;
          let tileState=tileStates[index];
          tileState.pauseButton='resume';
           tileStates[index]=tileState;
          this.setState({
            tileStates:tileStates
          });
        
        } else {
          this.props.meetingSession.audioVideo.unpauseVideoTile(this.state.tileStates[index].tileState.tileId);
          let tileStates={...this.state.tileStates};
          let tileState={...tileStates[index]};
          tileState.pauseButton='pause';
           tileStates[index]=tileState;
          this.setState({
            tileStates:tileStates
          });
        }
      }
      mute(e:any){
         console.log(e.target.id);
          // if (this.state.muteButton==='UnMute') {
          //   this.props.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
          //   this.setState({
          //     muteButton:'Mute'
          //   })
          // } else {
          //   this.props.meetingSession.audioVideo.realtimeMuteLocalAudio();
          //   this.setState({
          //     muteButton:'UnMute'
          //   })}
        

      }

        
          async b(){ 
            if(this.props.meetingSession!=null){
            const videoInputDevices =await  this.props.meetingSession.audioVideo.listVideoInputDevices(); 
            
            await this.props.meetingSession.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);
            // let tileIndex,TileElement,videoElement;
            const observerV = {
              // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
              videoTileDidUpdate: (tileState:VideoTileState) => {
                // Ignore a tile without attendee ID and other attendee's tile.
                
                if (!tileState.boundAttendeeId || !tileState.localTile) {
                  return;
                }
      
                const tileIndex = tileState.localTile ? 2 : this.props.tileAllotment.acquireTileIndex(tileState.tileId);
            console.log(tileState,tileIndex,this.myRef.current.childNodes,"werhbtfsdadfgrbsagervrtnuaectigugvmmmcfsgern23444445625643f36g5hljkp9'[;plokiukl;]){_/9;0p8ljkoiyhjugtewfxefgrthuyiolp,[/olki");
            
                
                const TileElement =  this.myRef.current.childNodes[tileIndex] ;
      
                const videoElement =  this.myRef.current.childNodes[tileIndex].childNodes[0];
                TileElement.style.display='block';
                
                let tileStates=this.state.tileStates;

                console.log(tileStates,'waesrdtfgserdtcfvgybhujnubygtfvdxtfgvybhujnbgvytfcrdxftgvybhujnimnhubygvtcdrxeszdrctfgvybhujnimnhubygvtfcrdxcftgvyhyuhijh8yg7t6fr5de4w3ss4edt5yuhjiu8hy7gt6fr5de43sw2456t5r4e');
                tileStates.push({tileState:tileState,muteButton:'Mute',pauseButton:'Pause'});
                this.setState({
                  tileStates:tileStates
                });
               
                
                this.props.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
              }
            };
            
            this.props.meetingSession.audioVideo.addObserver(observerV);
            
            this.props.meetingSession.audioVideo.startLocalVideoTile();
          
            
          const observer = {
        // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
            videoTileDidUpdate: tileState => {
          // Ignore a tile without attendee ID, a local tile (your video), and a content share.
            if (!tileState.boundAttendeeId || tileState.localTile || tileState.isContent) {
            return;
          }
          const tileIndex = tileState.localTile ? 2 : this.props.tileAllotment.acquireTileIndex(tileState.tileId);
            
          const TileElement =  this.myRef.current.childNodes[tileIndex] ;
      
          const videoElement =  this.myRef.current.childNodes[tileIndex].childNodes[0];
          TileElement.style.display='block';
          this.props.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
        }
      };
      
      this.props.meetingSession.audioVideo.addObserver(observer);
      
      
           
    }    
          }
      
      
      
      
      render(){
     
              this.b();
        return (
            <div ref={this.myRef}>
          <div id="tile-1"  style={tileStyle} >
                <video id="video-1" style={videoStyle} ></video>
                <div id="nameplate-1">Ram</div>
        <button id="p1" onClick={e=>this.pause(e)}> {this.state.tileStates[0]?this.state.tileStates[0].pauseButton:''}</button>
                <button id="m1" onClick={e=>this.mute(e)} >
                {this.state.tileStates[0]?this.state.tileStates[0].muteButton:''}
              </button>
              </div>

              <div id="tile-2"  style={tileStyle} >
                <video id="video-2" style={videoStyle} ></video>
                <div id="nameplate-2">Rahul</div>
        <button id="p2" onClick={e=>this.pause(e)}> {this.state.tileStates[1]?this.state.tileStates[1].pauseButton:''}</button>
                <button id="m2" onClick={e=>this.mute(e)} >
                {this.state.tileStates[1]?this.state.tileStates[1].muteButton:''}
              </button>
              </div>
              <div id="tile-3"  style={tileStyle} >
                <video id="video-3" style={videoStyle} ></video>
                <div id="nameplate-3">Raghav</div>
        <button id="p3" onClick={e=>this.pause(e)}> {this.state.tileStates[2]?this.state.tileStates[2].pauseButton:''}</button>
                <button id="m3" onClick={e=>this.mute(e)} >
                {this.state.tileStates[2]?this.state.tileStates[2].muteButton:''}
              </button>
              </div>    
          
            </div>
            )
      }


    }




