// import react,{Component} from 'react';

import { MeetingSession } from "amazon-chime-sdk-js";

export default class AudioVideoPermission {
  meetingSession: MeetingSession;

  constructor(meetingSession: MeetingSession) {
    this.meetingSession = meetingSession;
  }

  audioInputDevices: any;
  async x() {
  
  //this here will select the audio device for input from our system
    this.audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
    // this.audioInputDevices.forEach(mediaDeviceInfo => {
    //   console.log(mediaDeviceInfo);
    //   // this.meetingSession.audioVideo.chooseAudioInputDevice(mediaDeviceInfo.deviceId);

    // });
    await this.meetingSession.audioVideo.chooseAudioInputDevice('default');


    
  //this here will select the audio device for output from our system
    const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();
    audioOutputDevices.forEach(mediaDeviceInfo => {
      this.meetingSession.audioVideo.chooseAudioOutputDevice(mediaDeviceInfo.deviceId);

    });

    
  //this here will select the video device for output from our system
    const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();
    videoInputDevices.forEach(mediaDeviceInfo => {
      console.log(mediaDeviceInfo.deviceId);
      this.meetingSession.audioVideo.chooseVideoInputDevice(mediaDeviceInfo.deviceId);

    });

    const audioElement = document.getElementById('audio-element-id') as HTMLAudioElement;
  //this here will bind the data finding or searched above
    this.meetingSession.audioVideo.bindAudioElement(audioElement);
    

    //this act as a pemission provider and after result changes as a event handler
    const observer = {
      audioInputsChanged: (freshAudioInputDeviceList: any) => {
        // An array of MediaDeviceInfo objects
        freshAudioInputDeviceList.forEach((mediaDeviceInfo: any) => {
          console.log(`Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`);
        });
      },
      audioOutputsChanged: (freshAudioOutputDeviceList: any) => {
        console.log('Audio outputs updated: ', freshAudioOutputDeviceList);
      },
      videoInputsChanged: (freshVideoInputDeviceList: any) => {
        console.log('Video inputs updated: ', freshVideoInputDeviceList);
      }
    };

    this.meetingSession.audioVideo.addDeviceChangeObserver(observer);
    // this.meetingSession.audioVideo.realtimeSetCanUnmuteLocalAudio(false);
      
   
    const observers = {
      audioVideoDidStart: () => {
        console.log('Started');
      }
    };

    this.meetingSession.audioVideo.addObserver(observers);
//this will actually start the selected audio and video device
    this.meetingSession.audioVideo.start();


  //this observer will nofify when a session has been started and when a session end aur somebody leave   
    const observe = {
      audioVideoDidStart: () => {
        console.log('Started');
      },
      audioVideoDidStop: (sessionStatus: any) => {
        // See the "Stopping a session" section for details.
        console.log('Stopped with a session status code: ', sessionStatus.statusCode());
      },
      audioVideoDidStartConnecting: (reconnecting: any) => {
        if (reconnecting) {
          // e.g. the WiFi connection is dropped.
          console.log('Attempting to reconnect');
        }
      }
    };

    this.meetingSession.audioVideo.addObserver(observe);
  
  };

  

}