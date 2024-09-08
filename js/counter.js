document.addEventListener("DOMContentLoaded", function() {
    // Speech synthesis setup
    let speech = new SpeechSynthesisUtterance();
    let voices = [];
  
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      
      // Setting a default voice (Google Hindi, if available)
      const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
      speech.voice = hindiVoice || voices[0]; // Fallback to the first voice if Hindi isn't available
    };
  
    // Pronunciation button click handler for number input
    document.getElementById('play-pronunciation').addEventListener('click', () => {
      const number = parseInt(document.getElementById('custom-number').value);
      
      if (isNaN(number) || number < 1 || number > 100000) {
        alert("Please enter a valid number between 1 and 10000.");
        return;
      }
  
      // Set the number as the text to be spoken
      speech.text = number.toString(); // Convert the number to string for TTS
      
      // Speak the number in the selected voice (Hindi if available)
      window.speechSynthesis.speak(speech);
    });
  });
  