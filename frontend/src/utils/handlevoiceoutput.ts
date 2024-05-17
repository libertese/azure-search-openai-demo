import { AzureKeyCredential, TextAnalyticsClient } from "@azure/ai-text-analytics";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

interface handleVoiceOutputprops {
    resposta?: any 
    playsound:boolean
    status?: string
    latestaudio?: string
}

export const handleVoiceOutput = async ({resposta ,playsound, status, latestaudio}:handleVoiceOutputprops ) => {

    console.log('here')

   {/*} const player = new sdk.SpeakerAudioDestination()
    const pause = () => {
        player.close()
       } 
     
        const resume = () => {
          player.resume()
       } */}

    const text = status == 'resume' ? latestaudio : resposta

    if( playsound ){

    
    const speechConfig = sdk.SpeechConfig.fromSubscription("54f08182a9654cca8e01cf697e38b004", "westeurope");

    
     // Set the target language for text-to-speech
   const key = "7cd6d206a3b54d2a9e932eb3ce67636f";
   const endpoint = "https://mirandaescuta.cognitiveservices.azure.com/";
   const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

    // Detect the language of the text
    const response = await client.detectLanguage([text]);
   
    const detectedLanguage = response[0];
    
    var language ="pt";
    var VoiceName ="pt-PT-DuarteNeural"
    if ('error' in detectedLanguage) {
        console.error("Error:", detectedLanguage.error);
      } else {
        
        console.log(detectedLanguage.primaryLanguage);
       language =  detectedLanguage.primaryLanguage.iso6391Name.toString()
         console.log(detectedLanguage.primaryLanguage.iso6391Name.toString());
        // Access the properties of detectedLanguage here, if it is not an error.
  
      }
      switch (language) {
        case 'pt':
            var VoiceName = "pt-PT-DuarteNeural";
            break;
        case 'fr':
            VoiceName = "fr-FR-HenriNeural";
            break;
        case 'en':
            VoiceName =  "en-US-GuyNeural";
            break;
        case 'es':
            VoiceName = "es-ES-PabloNeural";
            break;
        case 'de':
            VoiceName ="de-DE-StefanNeural";
            break;
        case 'it':
            VoiceName ="it-IT-CosimoNeural";
            break;
        case 'ja':
            VoiceName = "ja-JP-KeitaNeural";
            break;
        case 'ru':
            VoiceName = "ru-RU-PavelNeural";
            break;
        case 'ar':
            VoiceName = "ar-SA-NaayfNeural";
            break;
        case 'zh':
            VoiceName = "zh-CN-KangkangNeural";
            break;
        default:
            
            console.log('Unsupported language.1111');
            return;
    }


    speechConfig.speechSynthesisLanguage = language;
    speechConfig.speechSynthesisVoiceName = VoiceName;
    console.log("language " +language );
    console.log("VoiceName  " +VoiceName );
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput(); // Use default speaker output for audio
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    const player = new sdk.SpeakerAudioDestination()

    const  audioConfigplayer  = sdk.AudioConfig.fromSpeakerOutput(player);
    //const syn = new sdk.SpeechSynthesizer(speechConfig, audioConfig) 
    const textToSpeak = text; // Replace with your desired text
  
    synthesizer.speakTextAsync(
      textToSpeak,
      (result: { reason: sdk.ResultReason; }) => {
        if (status === 'pause')

        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Speech synthesis is complete.");
        }
        sdk.ResultReason.SynthesizingAudio
        console.log(result)
        console.log("result.reason :"+result.reason)
        console.log(
            sdk.ResultReason.Canceled)
        console.log("Sai02.");
        synthesizer.close();
        
      },
      (err: string) => {
        console.trace("err - " + err);
        synthesizer.close();
      },
    );
} else 
  { console.log("sound off")}

};