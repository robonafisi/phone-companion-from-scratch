import { SpeechConfig, SpeechSynthesizer, AudioConfig, SpeakerAudioDestination } from "microsoft-cognitiveservices-speech-sdk";

let speechSynthesizer; // Declare the speechSynthesizer variable outside the function
let browserSound;
const voiceUsed = "en-US-BrandonNeural"

const SynthesizeSpeech = async (inputText) => {
  const speechConfig = SpeechConfig.fromSubscription("6d4e591a60994b67a422162ace40b378", "eastus");
  speechConfig.speechSynthesisVoiceName = voiceUsed;
  browserSound = new SpeakerAudioDestination();
  const audioConfig = AudioConfig.fromSpeakerOutput(browserSound);
  speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig); // Assign the instance to the speechSynthesizer variable
  await speechSynthesizer.speakTextAsync(inputText);

}

const StopSpeech = async () => {
  if (typeof browserSound !== 'undefined') {
  browserSound.pause();
  browserSound.close();
  }
}



export { SynthesizeSpeech, StopSpeech };
