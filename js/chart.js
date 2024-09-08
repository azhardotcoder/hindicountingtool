document.addEventListener("DOMContentLoaded", function () {
  const chartContent = document.getElementById("chart-content");
  let pronunciationData = {}; // This will hold the fetched data from the JSON file
  let speech = new SpeechSynthesisUtterance();
  let voices = [];

  // Load voices
  window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
      speech.voice = hindiVoice || voices[0]; // Use Hindi voice or fallback to default
  };

  // Fetch the JSON data from chart.json
  fetch("./json/chart.json")
    .then((response) => response.json())
    .then((data) => {
      pronunciationData = data; // Store the JSON data in pronunciationData
      generateChart(); // Generate the chart after data is fetched
    })
    .catch((error) => {
      console.error("Error loading the JSON file:", error);
    });

  // Function to generate the chart content
  function generateChart() {
    chartContent.innerHTML = Object.keys(pronunciationData)
      .map((number) => {
        return `
          <div class="grid grid-cols-4 gap-4 p-2 border-b border-gray-300">
            <div>${number}</div>
            <div class="pronunciation hindi cursor-pointer" data-pronunciation="${pronunciationData[number].hindi}">${pronunciationData[number].hindi}</div>
            <div class="pronunciation romanized cursor-pointer" data-pronunciation="${pronunciationData[number].romanized}">${pronunciationData[number].romanized}</div>
            <div class="pronunciation english cursor-pointer" data-pronunciation="${pronunciationData[number].english}">${pronunciationData[number].english}</div>
          </div>`;
      })
      .join("");

    addPronunciationListeners();
  }

  // Function to add event listeners to the pronunciation elements
  function addPronunciationListeners() {
    const pronunciationElements = document.querySelectorAll(".pronunciation");

    pronunciationElements.forEach((element) => {
      element.addEventListener("click", () => {
        const pronunciationText = element.getAttribute("data-pronunciation");
        speech.text = pronunciationText;
        speech.lang = "hi-IN"; // Ensure it is pronounced in Hindi
        window.speechSynthesis.speak(speech);
      });
    });
  }
});
