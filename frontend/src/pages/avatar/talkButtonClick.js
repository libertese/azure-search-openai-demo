function talkButtonClick() {
  const talkButton = document.getElementById('talk-button');
  talkButton.onclick = async () => {
    // connectionState not supported in firefox
    if (
      peerConnection?.signalingState === 'stable' ||
      peerConnection?.iceConnectionState === 'connected'
    ) {
      const talkResponse = await fetchWithRetries(`${DID_API.url}/talks/streams/${streamId}`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${DID_API.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            type: 'text',
            input:
              'Seja Bem vindo aos Guia Pratico do Municipio de Miranda do Douro, Sou o Duarte o seu assistente virtual para te ajudar a conhecer as Maravilhas de Miranda do Douro e sobre a Dança dos Pauliteiros',
            subtitles: 'false',
            provider: {
              type: 'microsoft',
              voice_id: 'pt-PT-DuarteNeural',
            },
          },
          driver_url: 'bank://lively/',
          source_url:
            'https://create-images-results.d-id.com/google-oauth2%7C107997435472464974782/upl_czWSTDQmOHCdXWdxcX-TK/image.jpeg',
          config: {
            stitch: true,
          },
          session_id: sessionId,
        }),
      });
    }
  };
}
