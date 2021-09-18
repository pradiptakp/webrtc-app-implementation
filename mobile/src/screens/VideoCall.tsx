import React from 'react';
import {Alert, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
  RTCSessionDescriptionType,
  EventOnCandidate,
  RTCIceCandidateType,
} from 'react-native-webrtc';
import {io} from 'socket.io-client';
import {AppRoute} from '../navigations/routes';
import {v4 as uuidv4} from 'uuid';

const socketIoURL = 'http://192.168.1.5:3002';

export const VideoCall: AppScreen<AppRoute.VideoCall> = ({
  route: {
    params: {username},
  },
  navigation,
}) => {
  const [uuid] = React.useState(uuidv4());
  const [isFront] = React.useState(true);
  const [disableCall, setDisableCall] = React.useState(false);
  const [opponentUsername, setOpponentUsername] = React.useState('');
  const [localStream, setLocalStream] = React.useState<MediaStream>();
  const [remoteStream, setRemoteStream] = React.useState<MediaStream>();
  const [socket] = React.useState(io(socketIoURL));
  const [socketActive, setSocketActive] = React.useState(false);
  const [rtc] = React.useState(
    //change the config as you need
    new RTCPeerConnection({
      iceServers: [
        {
          url: 'stun:stun.l.google.com:19302',
        },
        {
          url: 'stun:stun1.l.google.com:19302',
        },
        {
          url: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  React.useEffect(() => {
    socket.on('connect', () => {
      setSocketActive(true);
    });

    // 2. B Answer A
    socket.on(
      'offer',
      async (e: {
        username: string;
        offer: RTCSessionDescriptionType;
        uuid: string;
      }) => {
        if (e.uuid !== uuid) {
          await rtc.setRemoteDescription(new RTCSessionDescription(e.offer));
          const answer = await rtc.createAnswer();

          await rtc.setLocalDescription(answer);

          socket.emit('answer', {username, answer});
          setDisableCall(true);
          setOpponentUsername(e.username);
        }
      },
    );

    // 4. A receive B's answer
    socket.on(
      'answer',
      async (e: {
        username: string;
        answer: RTCSessionDescriptionType;
        uuid: string;
      }) => {
        if (e.uuid !== uuid) {
          rtc.setRemoteDescription(new RTCSessionDescription(e.answer));
          setOpponentUsername(e.username);
        }
      },
    );

    // 3 & 5. ICE send candidates to A and B
    socket.on(
      'candidate',
      async (e: {
        username: string;
        candidate: RTCIceCandidateType;
        uuid: string;
      }) => {
        if (e.uuid !== uuid) {
          await rtc.addIceCandidate(new RTCIceCandidate(e.candidate));
        }
      },
    );

    socket.on('leave', () => {
      Alert.alert('', 'Opponent left the room', [
        {
          onPress: () => {
            navigation.pop();
          },
        },
      ]);
    });

    // 0. Initiate media on A and B
    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 640,
              minHeight: 480,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: [{sourceId: videoSourceId}],
          },
        })
        .then(stream => {
          setLocalStream(stream as MediaStream);
          rtc.addStream(stream as MediaStream);
        })
        .catch(error => {
          // Log error
        });
    });

    rtc.onaddstream = event => {
      setRemoteStream(event.stream);
    };

    rtc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('candidate', {username, candidate: event.candidate});
      }
    };

    return () => {
      socket.emit('leave');
      // close rtc connection on destroy screen
      rtc.close();

      socket.close();
    };
  }, []);

  // 1. A Calling B
  const onCall = async () => {
    if (socketActive) {
      const offer = await rtc.createOffer();

      await rtc.setLocalDescription(offer);
      socket.emit('offer', {
        username,
        offer,
      });
      setDisableCall(true);
    }
  };

  return (
    <View style={{flex: 1, display: 'flex', padding: 12}}>
      <Text>{username}</Text>
      <RTCView
        streamURL={localStream?.toURL() || ''}
        style={{
          flex: 1,
          backgroundColor: 'black',
          marginBottom: 20,
        }}
      />

      <Text>{opponentUsername}</Text>
      <RTCView
        streamURL={remoteStream?.toURL() || ''}
        style={{
          flex: 1,
          backgroundColor: 'black',
        }}
      />

      <View style={{padding: 12}}>
        <Button disabled={disableCall} onPress={onCall} mode="contained">
          Call Opponent
        </Button>
      </View>
    </View>
  );
};

export default VideoCall;
