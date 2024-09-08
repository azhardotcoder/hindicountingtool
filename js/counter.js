document.addEventListener("DOMContentLoaded", function () {
  // Initialize the speech synthesis
  let speech = new SpeechSynthesisUtterance();
  let voices = [];

  // Load available voices
  window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
  };

  // Tab functionality to toggle sections
  const manualTab = document.getElementById('manual-tab');
  const counterTab = document.getElementById('counter-tab');
  const manualSection = document.getElementById('manual-section');
  const counterSection = document.getElementById('counter-section');

  // Show manual section, hide counter section
  manualTab.addEventListener('click', () => {
      manualSection.classList.remove('hidden');
      counterSection.classList.add('hidden');
      manualTab.classList.add('bg-green-600');
      counterTab.classList.remove('bg-blue-600');
  });

  // Show counter section, hide manual section
  counterTab.addEventListener('click', () => {
      counterSection.classList.remove('hidden');
      manualSection.classList.add('hidden');
      counterTab.classList.add('bg-blue-600');
      manualTab.classList.remove('bg-green-600');
  });

  // Pronunciation button for the Counter section
  document.getElementById('play-pronunciation').addEventListener('click', () => {
      const number = parseInt(document.getElementById('custom-number').value);
      const selectedLanguage = document.getElementById('language-select-counter').value; // Get language for Counter section

      if (isNaN(number) || number < 1 || number > 100000) {
          alert("Please enter a valid number between 1 and 100000.");
          return;
      }

      // Set the number as the text to be spoken
      speech.text = number.toString();
      speech.lang = selectedLanguage; // Set the selected language

      // Speak the number in the selected language
      window.speechSynthesis.speak(speech);
  });

  // Manual pronunciation (speech recognition)
  document.getElementById('pronounce-manually').addEventListener('click', () => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
          const selectedLanguage = document.getElementById('language-select-manual').value;

          recognition.lang = selectedLanguage; // Set recognition language

          recognition.onresult = function (event) {
              const spokenText = event.results[0][0].transcript;
              const spokenNumber = parseInt(spokenText.replace(/\D/g, '')); // Remove non-numeric characters

              if (!isNaN(spokenNumber)) {
                  // Display recognized number
                  document.getElementById('recognized-text').textContent = `Recognized Number: ${spokenNumber}`;
              } else {
                  alert('Please pronounce a valid number.');
              }
          };

          recognition.onerror = function (event) {
              console.error("Speech recognition error:", event.error);
              alert('Error recognizing speech. Please try again.');
          };

          // Start recognition
          recognition.start();
      } else {
          alert('Speech Recognition is not supported in this browser.');
      }
  });
});
