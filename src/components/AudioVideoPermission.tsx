// import react,{Component} from 'react';

import { MeetingSession } from "amazon-chime-sdk-js";

export default class AudioVideoPermission {
  meetingSession:MeetingSession;
  
  constructor(meetingSession:MeetingSession){
      this.meetingSession=meetingSession;
  }

  audioInputDevices:any; 
 async x(){
   this.audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
   this.audioInputDevices.forEach(mediaDeviceInfo => {
     this.meetingSession.audioVideo.chooseAudioInputDevice(mediaDeviceInfo.deviceId);
    
    });
  
  const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();
  audioOutputDevices.forEach(mediaDeviceInfo => {
     this.meetingSession.audioVideo.chooseAudioOutputDevice(mediaDeviceInfo.deviceId);

 });
 
  const videoInputDevices =await  this.meetingSession.audioVideo.listVideoInputDevices(); 
  videoInputDevices.forEach(mediaDeviceInfo => {
    this.meetingSession.audioVideo.chooseVideoInputDevice(mediaDeviceInfo.deviceId);

 });

const observer = {
  audioInputsChanged: (freshAudioInputDeviceList:any) => {
    // An array of MediaDeviceInfo objects
    freshAudioInputDeviceList.forEach((mediaDeviceInfo:any) => {
      console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
    });
  },
  audioOutputsChanged: (freshAudioOutputDeviceList:any) => {
    console.log('Audio outputs updated: ', freshAudioOutputDeviceList);
  },
  videoInputsChanged: (freshVideoInputDeviceList:any) => {
    console.log('Video inputs updated: ', freshVideoInputDeviceList);
  }
};

this.meetingSession.audioVideo.addDeviceChangeObserver(observer);

const audioElement =  document.getElementById('audio-element-id') as HTMLAudioElement ;
this.meetingSession.audioVideo.bindAudioElement(audioElement);

const observers = {
  audioVideoDidStart: () => {
    console.log('Started');
  }
};

this.meetingSession.audioVideo.addObserver(observers);

this.meetingSession.audioVideo.start();

const observe = {
  audioVideoDidStart: () => {
    console.log('Started');
  },
  audioVideoDidStop: (sessionStatus:any) => {
    // See the "Stopping a session" section for details.
    console.log('Stopped with a session status code: ', sessionStatus.statusCode());
  },
  audioVideoDidStartConnecting: (reconnecting:any) => {
    if (reconnecting) {
      // e.g. the WiFi connection is dropped.
      console.log('Attempting to reconnect');
    }
  }
};

this.meetingSession.audioVideo.addObserver(observe);
};


}