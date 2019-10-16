// Get display elements that need to be controlled
var gameOverText = document.getElementById("gameover-text");
var directionsText = document.getElementById("directions-text");
var subDirectionsText = document.getElementById("subDirections-text");
var userChoiceText = document.getElementById("hiddenword-text");
var guessesText = document.getElementById("guesses-text");
var workingWordText = document.getElementById("workingword-text");
var winsText = document.getElementById("wins-text");
var lossesText = document.getElementById("losses-text");
var guessesRemainingText = document.getElementById("remainingGuesses");

var wgGame = {
    maxGuesses: 0,
    guesses: 0,
    wins: 0,
    losses: 0,
    wordList: ["cow", "pig", "horse", "rooster", "goat", "sheep", "chick", "dog", "cat"],
    currentWordIndex: 0,
    currentKey: " ",
    workingWord: [],
    currentGuesses: [],
    gameOver: "gameOn",
    resetArray: [],

    // Initialize the game
    initialize: function (numTries) {
        this.maxGuesses = numTries;
        this.loadWord();

        console.log("Starting game with first word = " + this.wordList[this.currentWordIndex]);

        //Update the screen
        workingWordText.textContent = this.workingWord.join("");
        guessesText.textContent = this.currentGuesses.join("");
    },

    loadWord: function () {
        this.currentWordIndex = Math.floor((Math.random() * this.wordList.length));

        // Load spaces into our working word
        var w = this.wordList[this.currentWordIndex]; //Get a word
        var jj = w.length; //Determine it's length
        //Load in matching number of underscores into our working word
        var tmpArray = [];
        for (i = 0; i < jj; i++) {
            tmpArray[i] = " _ ";
        }
        this.workingWord = tmpArray;
    },

    // Console logging function
    logCurrValues: function () {
        console.log("maxGuesses: " + this.maxGuesses + "\nguesses: " + this.guesses +
            "\nwins: " + this.wins + "\nlosses: " + this.losses + "\ncurrentWordIndex: " +
            this.currentWordIndex + "\ncurrentWord: " + this.wordList[this.currentWordIndex] + "\ncurrentKey: " + this.currentKey + "\nworkingWord: " +
            this.workingWord + "\ncurrentGuesses: " + this.currentGuesses + "\ngameOver: " + this.gameOver);
    },

    // Returns true if keyValue is a - z and not already used
    validateKey: function (keyValue) {
        var asciiValue = keyValue.charCodeAt(0);
        console.log("asciiValue = " + asciiValue);

        if ((asciiValue > 96) && (asciiValue < 123)) {
            console.log("currentGuesses length = " + this.currentGuesses.length);
            
            if ((this.currentGuesses.length === 0) || (this.currentGuesses.indexOf(" " + keyValue + " ") === -1)) {
                return true;
            }
            else {
                return false;
            }
        }
        
    },

    // If the word contains the user selected letter then update workingWord with all occurrances of it
    checkLetter: function (l) {
        if (this.validateKey(l)) {
            ++this.guesses;
            this.currentKey = l;

            // Check to see if the current letter is in our current word
            var charIndex = this.wordList[this.currentWordIndex].indexOf(l);
            if (charIndex > -1) {
                // Loop through the current word characters and insert all occurrances of the correct letter
                for (i = 0; i < this.wordList[this.currentWordIndex].length; ++i) {
                    if (this.wordList[this.currentWordIndex].charAt(i) === l) {
                        this.workingWord[i] = " " + l + " ";
                        this.currentGuesses[this.guesses - 1] = " " + l + " ";

                        // Update our working word and current guesses on the display
                        workingWordText.textContent = this.workingWord.join("");
                        guessesText.textContent = this.currentGuesses.join("");

                        // If we've replaced all our underscores then player wins
                        if (this.workingWord.indexOf(" _ ") === -1) {this.gameOver = "playerWin";}
                    }
                }
            }
            else {
                this.currentGuesses[this.guesses - 1] = " " + l + " ";
                guessesText.textContent = this.currentGuesses.join("");
            }
        }
        if (this.guesses > this.maxGuesses) { this.gameOver = "playerLoose";}
        this.logCurrValues();
    },

    gameStatus: function () {
        if (this.gameOver === "playerWin") {
            this.wins++;
            directionsText.textContent = "You WON!";
            
            //play audio may give us the time we need to reload ...
            // setTimeout(function () { confirm("YOU WON! Play another round?")}, 500);
        }
        else {
            if(this.gameOver === "playerLoose") {
                this.losses++;
                directionsText.textContent = "Better luck next time.";
            }
        }
        this.updateStats();
    },

    updateStats: function () {
        winsText.textContent = wgGame.wins;
        lossesText.textContent = wgGame.losses;
        guessesRemainingText.textContent = wgGame.maxGuesses - wgGame.guesses;
        // subDirectionsText.textContent = "Play another round?";
    },

    reset: function () {
        this.loadWord();
        this.currentGuesses = this.resetArray;
        this.guesses = 0;
        this.gameOver = "gameOn";
        guessesRemainingText.textContent = wgGame.maxGuesses;
        directionsText.textContent = "GAME ON!";
        workingWordText.textContent = this.workingWord.join("");
        guessesText.textContent = this.currentGuesses.join("");
    }
};

function updateScreen(game, callback) {
    game.updateStats();
    callback();
  }

wgGame.initialize(9);

// This function is run whenever the user presses a key.
document.onkeyup = function (event) {
    // Update Directions on first key presse
    directionsText.textContent = "GAME ON!";

    // Start playing the game on second key press
    document.onkeyup = function (event) {
        // Process the letter selected
        wgGame.checkLetter(String.fromCharCode(event.keyCode).toLowerCase());
        
        wgGame.updateStats();
        if (wgGame.gameOver !== "gameOn") {
            wgGame.gameStatus();
            var playAgain = confirm('Play another round?');
            if (playAgain === true) {
                wgGame.reset();
                wgGame.logCurrValues();
            }
        }
    };
};