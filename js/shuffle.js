document.addEventListener("DOMContentLoaded", function() {
    const quizContainer = document.getElementById('quiz-content');
    let hindiNumbers = {}; // Will hold the JSON data after fetching
    let correctAnswer;
  
    // Fetch the JSON data from shuffle.json
    fetch('./json/shuffle.json')
      .then(response => response.json())
      .then(data => {
        hindiNumbers = data; // Store the JSON data in the hindiNumbers object
        generateQuestion();  // Generate the first question after loading data
      })
      .catch(error => {
        console.error("Error loading the JSON file:", error);
      });
  
    // Generate a new question with 4 options
    function generateQuestion() {
      if (Object.keys(hindiNumbers).length === 0) return; // Wait for JSON to load
  
      const randomNumber = Math.floor(Math.random() * (89 - 31 + 1)) + 31; // Get a random number between 31 and 89
      correctAnswer = randomNumber; // Correct answer is the random number itself
  
      const options = [];
      options.push(correctAnswer); // Push the correct answer into the options array first
  
      // Generate 3 incorrect options
      while (options.length < 4) {
        const wrongNumber = Math.floor(Math.random() * (89 - 31 + 1)) + 31; // Generate a random number between 31 and 89
        if (!options.includes(wrongNumber)) { // Ensure the incorrect option is not the correct answer
          options.push(wrongNumber);
        }
      }
  
      // Shuffle the options array so that the correct answer is randomly placed
      options.sort(() => Math.random() - 0.5);
  
      // Display the question and options in the quiz container
      quizContainer.innerHTML = `
        <p class="mb-4 text-lg font-semibold">What is the Hindi pronunciation of ${randomNumber}?</p>
        ${options.map(option => `
          <button class="option-btn w-full bg-gray-200 p-2 rounded mb-2 hover:bg-gray-300">${hindiNumbers[option]}</button>
        `).join('')}
        <button id="pronounce-number" class="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Hear Pronunciation</button>
      `;
  
      // Pronounce the number only when the user clicks the "Hear Pronunciation" button
      document.getElementById('pronounce-number').addEventListener('click', () => {
        speech.text = hindiNumbers[randomNumber]; // Pronounce the correct number
        window.speechSynthesis.speak(speech); // Use Speech Synthesis to pronounce the number
      });
  
      // Add event listeners to the buttons to handle user's choice
      document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', () => {
          if (button.innerText === hindiNumbers[correctAnswer]) {
            alert('Correct!');
          } else {
            alert('Wrong answer. Try again.');
          }
        });
      });
    }
  
    // Load a new question when "Next Question" is clicked
    document.getElementById('next-question').addEventListener('click', generateQuestion);
  });
  