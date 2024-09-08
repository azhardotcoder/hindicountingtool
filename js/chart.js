document.addEventListener("DOMContentLoaded", function () {
    const chartContent = document.getElementById("chart-content");
    let pronunciationData = {}; // This will hold the fetched data from the JSON file
  
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
      // Loop through the data and display each number with Hindi and English pronunciation
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
      
      // Add event listeners to the pronunciation elements
      addPronunciationListeners();
    }
  
    // Function to add event listeners to the pronunciation elements
    function addPronunciationListeners() {
      // Get all elements with the class 'pronunciation' (Hindi, Romanized, and English)
      const pronunciationElements = document.querySelectorAll(".pronunciation");
  
      // Attach a click event listener to each pronunciation element
      pronunciationElements.forEach((element) => {
        element.addEventListener("click", () => {
          // Get the pronunciation text from the data attribute
          const pronunciationText = element.getAttribute("data-pronunciation");
  
          // Pronounce the text using the SpeechSynthesis API
          pronounceText(pronunciationText);
        });
      });
    }
  
    // Function to pronounce the text using Speech Synthesis API
    function pronounceText(text) {
      let speech = new SpeechSynthesisUtterance();
      speech.text = text;
      
      // Set language based on pronunciation type (use Hindi for Devanagari or Romanized Hindi)
      if (/[a-zA-Z]/.test(text)) {
        speech.lang = "hi-IN"; // For Romanized or Hindi
      } else {
        speech.lang = "hi-IN"; // For Hindi (Devanagari)
      }
      
      window.speechSynthesis.speak(speech);
    }
  });
  