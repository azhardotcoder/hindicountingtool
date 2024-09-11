    document.addEventListener("DOMContentLoaded", function () {
    const quizContainer = document.getElementById('quiz-content');
    const feedback = document.getElementById('feedback');
    const nextQuestionButton = document.getElementById('next-question');
    const timerDisplay = document.getElementById('timer');
    const progressBar = document.getElementById('progress-bar');
    const startQuizButton = document.getElementById('start-quiz');
    const pronounceButton = document.getElementById('pronounce-number');
    const hintButton = document.getElementById('hint-button');
    const difficultySelect = document.getElementById('difficulty-level');

    let hindiNumbers = {}; // Will hold the JSON data after fetching
    let correctAnswer;
    let questionIndex = 0; // Track current question index
    let score = 0;
    let totalQuestions = 10; // Set the number of questions in the quiz
    let timerInterval;
    let timeLimit = 15; // 15 seconds per question by default
    let timeRemaining = timeLimit;
    let optionsDisabled = false;

    let speech = new SpeechSynthesisUtterance();
    let voices = [];

    // Load voices
    window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(voice => voice.lang === 'hi-IN');
        speech.voice = hindiVoice || voices[0]; // Use Hindi voice or fallback to default
    };

    // Fetch the JSON data from shuffle.json
    fetch('./json/shuffle.json')
        .then(response => response.json())
        .then(data => {
            hindiNumbers = data; // Store the JSON data in the hindiNumbers object
        })
        .catch(error => {
            console.error("Error loading the JSON file:", error);
        });

    // Function to start the quiz (called after Start Quiz button is clicked)
    function startQuiz() {
        questionIndex = 0;
        score = 0;

        // Set difficulty level (affects the time limit)
        const difficulty = difficultySelect.value;
        if (difficulty === "easy") timeLimit = 20;
        else if (difficulty === "medium") timeLimit = 15;
        else timeLimit = 10;

        timeRemaining = timeLimit;

        // Hide Start Quiz Button and Difficulty Selector
        startQuizButton.classList.add('hidden');
        difficultySelect.classList.add('hidden');

        // Show the timer, progress bar, and quiz elements
        document.getElementById('progress-bar-container').classList.remove('hidden');
        timerDisplay.classList.remove('hidden');
        quizContainer.classList.remove('hidden');
        hintButton.classList.remove('hidden');
        pronounceButton.classList.remove('hidden');

        // Reset everything for the new quiz
        generateQuestion();
    }

    // Generate a new question with 4 options
    function generateQuestion() {
        if (questionIndex >= totalQuestions) {
            showQuizSummary();
            return; // End quiz after totalQuestions
        }

        feedback.classList.add('hidden'); // Hide feedback on new question
        timeRemaining = timeLimit; // Reset timer
        updateTimer();
        startTimer(); // Sync progress bar with timer
        hintButton.disabled = false;  // Enable hint button for new question

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
            <div class="fade-in">
                <!-- Display progress -->
                <p id="question-progress" class="mb-2 text-md font-semibold text-center text-gray-700">Question ${questionIndex + 1} of ${totalQuestions}</p>
                <p class="mb-4 text-lg font-semibold">What is the Hindi pronunciation of ${randomNumber}?</p>
                ${options.map(option => 
                    `<button class="option-btn w-full bg-gray-200 p-2 rounded-lg mb-2 hover:bg-gray-300 transition duration-200 ease-in-out" data-answer="${option === correctAnswer}">${hindiNumbers[option]}</button>`
                ).join('')}
            </div>
        `;

        // Disable options after one is clicked
        optionsDisabled = false;

        // Pronounce the number only when the user clicks the "Hear Pronunciation" button
        document.getElementById('pronounce-number').addEventListener('click', () => {
            speech.text = hindiNumbers[randomNumber]; // Pronounce the correct number
            speech.lang = "hi-IN"; // Ensure it is pronounced in Hindi
            window.speechSynthesis.speak(speech); // Use Speech Synthesis to pronounce the number
        });

        // Add event listeners to the buttons to handle user's choice
        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', () => {
                if (!optionsDisabled) {
                    optionsDisabled = true; // Disable further clicks on the same question
                    clearInterval(timerInterval); // Stop timer
                    const isCorrect = button.getAttribute('data-answer') === "true";
                    
                    if (isCorrect) {
                        button.classList.add('bg-green-500');  // Correct answer turns green
                        playSound(true);  // Play correct answer sound
                        score++;
                    } else {
                        button.classList.add('bg-red-500');  // Incorrect answer turns red
                        playSound(false);  // Play wrong answer sound
                    }
                    
                    questionIndex++;
                    nextQuestionButton.classList.remove('hidden'); // Show Next Question button
                    pronounceButton.classList.add('hidden'); // Hide the Pronunciation button until next question
                    hintButton.disabled = true; // Disable hint after an answer is chosen
                }
            });
        });
    }

    // Timer functions
    function startTimer() {
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimer();
            updateProgressBar(); // Sync the progress bar with the timer
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                feedback.innerHTML = '<span class="text-red-500 font-semibold slide-in">Time\'s up! ⏳</span>';
                feedback.classList.remove('hidden');
                questionIndex++;
                if (questionIndex < totalQuestions) {
                    generateQuestion();
                } else {
                    showQuizSummary();
                }
            }
        }, 1000);
    }

    function updateTimer() {
        timerDisplay.textContent = `${timeRemaining}s`;
    }

    // Sync the progress bar with the timer
    function updateProgressBar() {
        const progressPercentage = (timeRemaining / timeLimit) * 100; // Timer sync with progress bar
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.style.maxWidth = "100%"; // Ensure the progress bar doesn't exceed the container
    }

    // Play sound based on correct or incorrect answer
    function playSound(isCorrect) {
        const sound = document.getElementById(isCorrect ? 'correct-sound' : 'wrong-sound');
        sound.play();
    }

    // Show quiz summary after completion
    function showQuizSummary() {
        // Clear feedback, hide the timer, and remove the progress bar on the summary page
        feedback.classList.add('hidden');
        feedback.innerHTML = ''; // Clear feedback text
        progressBar.parentElement.classList.add('hidden'); // Hide progress bar on summary page
        timerDisplay.classList.add('hidden'); // Hide the timer on summary page
        pronounceButton.classList.add('hidden'); // Hide Pronunciation button on summary page
        hintButton.classList.add('hidden'); // Hide the hint button on the summary page
        difficultySelect.classList.add('hidden'); // Hide the difficulty selector on the summary page

        quizContainer.innerHTML = `
            <div class="fade-in">
                <p class="text-lg font-bold">Quiz Complete!</p>
                <p>Your Score: ${score} / ${totalQuestions}</p>
                <button id="restart-quiz" class="w-full bg-blue-500 text-white mt-2 p-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                    Restart Quiz
                </button>
            </div>
        `;
        document.getElementById('restart-quiz').addEventListener('click', startQuiz);
    }

    // Handle Hint Button click (remove one wrong option)
    hintButton.addEventListener('click', () => {
        const wrongOptions = document.querySelectorAll('.option-btn:not([data-answer="true"])');
        if (wrongOptions.length > 1) {
            wrongOptions[0].classList.add('hidden');  // Remove one wrong option as a hint
        }
        hintButton.disabled = true;  // Disable hint button after use
    });

    // Handle Next Question button click
    nextQuestionButton.addEventListener('click', () => {
        nextQuestionButton.classList.add('hidden'); // Hide the Next Question button again
        pronounceButton.classList.remove('hidden'); // Show the Pronunciation button again
        generateQuestion(); // Load next question
    });

    // Start Quiz button click event
    startQuizButton.addEventListener('click', startQuiz);
    });
