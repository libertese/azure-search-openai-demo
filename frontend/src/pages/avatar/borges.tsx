// import react, { useEffect, useState } from 'react';
// import { stopAllStreams } from './helper';

// const MAX_RETRY_COUNT = 3;
// const MAX_DELAY_SEC = 4;
// const DID_URL = process.env.REACT_APP_DID_URL;
// const DID_KEY = process.env.REACT_APP_DID_KEY;

// export default function FaceId(talktext: string) {
//     const [peerConection, setPeerConnection] = useState(null)


//     async function getStream() {
//         const sessionResponse = await fetchWithRetries(`${DID_URL}/talks/streams`, {
//             method: 'POST',
//             headers: {
//               Authorization: `Basic ${DID_KEY}`,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               source_url: 'https://create-images-results.d-id.com/google-oauth2%7C107997435472464974782/upl_czWSTDQmOHCdXWdxcX-TK/image.jpeg',
//             }),
//         }); 
        
//         const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = await sessionResponse.json();
//         let streamId = newStreamId;
//         let sessionId = newSessionId;
//     }

//     useEffect(() => {
//         getStream()
//     }, [])

//     useEffect(() => {
//         async function getStream() {
//             const sessionResponse = await fetchWithRetries(`${DID_URL}/talks/streams`, {
//                 method: 'POST',
//                 headers: {
//                   Authorization: `Basic ${DID_KEY}`,
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   source_url: 'https://create-images-results.d-id.com/google-oauth2%7C107997435472464974782/upl_czWSTDQmOHCdXWdxcX-TK/image.jpeg',
//                 }),
//             }); 
            
//             const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = await sessionResponse.json();
//             let streamId = newStreamId;
//             let sessionId = newSessionId;
//         }
//         getStream()

//         const initializePeerConnection = async () => {
//           const newPeerConnection = new RTCPeerConnection({ iceServers });
//           newPeerConnection.addEventListener('icegatheringstatechange', onIceGatheringStateChange, true);
//           newPeerConnection.addEventListener('icecandidate', onIceCandidate, true);
//           newPeerConnection.addEventListener('iceconnectionstatechange', onIceConnectionStateChange, true);
//           newPeerConnection.addEventListener('connectionstatechange', onConnectionStateChange, true);
//           newPeerConnection.addEventListener('signalingstatechange', onSignalingStateChange, true);
//           newPeerConnection.addEventListener('track', onTrack, true);
    
//           setPeerConnection(newPeerConnection);
//         };
    
//         initializePeerConnection();
//       }, [ice_servers]);

//     const handleTalkButtonClick = async () => {
//       // connectionState not supported in Firefox
//       if (peerConnection?.signalingState === 'stable' || peerConnection?.iceConnectionState === 'connected') {
//         try {
//           const talkResponse = await fetchWithRetries(`${DID_URL}/talks/streams/${streamId}`, {
//             method: 'POST',
//             headers: {
//               Authorization: `Basic ${DID_API.key}`,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               script: {
//                 type: 'text',
//                 input: 'Seja Bem vindo aos Guia Pratico do Municipio de Miranda do Douro, Sou o Duarte o seu assistente virtual para te ajudar a conhecer as Maravilhas de Miranda do Douro e sobre a Dança dos Pauliteiros',
//                 subtitles: 'false',
//                 provider: {
//                   type: 'microsoft',
//                   voice_id: 'pt-PT-DuarteNeural',
//                 },
//               },
//               driver_url: 'bank://lively/',
//               source_url: 'https://create-images-results.d-id.com/google-oauth2%7C107997435472464974782/upl_czWSTDQmOHCdXWdxcX-TK/image.jpeg',
//               config: {
//                 stitch: true,
//               },
//               session_id: sessionId,
//             }),
//           });
          
//           // Handle the response as needed
//           // ...
//         } catch (error) {
//           // Handle any error that occurred during the request
//           // ...
//         }
//       }
//     };
  
//     return (
//       <img id="talk-image" onClick={handleTalkButtonClick}>
//         Talk
//       </img>
//     );
//   };

//   async function fetchWithRetries(url: string, options: any, retries = 1) {
//     try {
//         return await fetch(url, options);
//       } catch (err) {
//         if (retries <= MAX_RETRY_COUNT) {
//           const delay = Math.min(Math.pow(2, retries) / 4 + Math.random(), MAX_DELAY_SEC) * 1000;
    
//           await new Promise((resolve) => setTimeout(resolve, delay));
    
//           console.log(`Request failed, retrying ${retries}/${MAX_RETRY_COUNT}. Error ${err}`);
//           return fetchWithRetries(url, options, retries + 1);
//         } else {
//           throw new Error(`Max retries exceeded. error: ${err}`);
//         }
//       }
//   }

export default function FaceID() {
    return (
        <div>faceID</div>
    )
}
  
  