document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const startButton = document.getElementById('startButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const question = document.getElementById('question');
    const hyonteisImage = document.getElementById('hyonteisImage');
    const trueButton = document.getElementById('trueButton');
    const falseButton = document.getElementById('falseButton');
    const stars = document.getElementById('stars');
    const finalStars = document.getElementById('finalStars');
    const finalFeedback = document.getElementById('finalFeedback');
    const scoreText = document.getElementById('scoreText');
    const nextArrow = document.getElementById('nextArrow');
    const speakerIcon = document.getElementById('speakerIcon');

    // Väitteet ja niiden vastaavat kuvat
    const statements = [
        "POIKA HIIPII",      // 0
        "TYTTÖ HYPPII",      // 1
        "POIKA KÄVELEE",     // 2
        "TYTTÖ KONTTAA",     // 3
        "TYTTÖ KURKOTTAA",   // 4
        "POIKA LOIKKII",     // 5
        "POIKA RYÖMII",      // 6
        "POIKA TANSSII",     // 7
        "TYTTÖ TANSSII"      // 8
    ];

    // Kuvavastaavuudet väitteille
    const imageMap = {
        0: 'Valinta_hiipia',
        1: 'Valinta_hyppia',
        2: 'Valinta_kavella',
        3: 'Valinta_kontata',
        4: 'Valinta_kurkottaa',
        5: 'Valinta_loikkia',
        6: 'Valinta_ryomia',
        7: 'Valinta_tanssii_poika',
        8: 'Valinta_tanssii_tytto'
    };

    let currentRound = 0;
    let score = 0;
    let gameQuestions = [];

    function generateQuestions() {
        let questions = [];
        let usedStatements = new Set();
        
        // Valitaan 2 oikeaa väitettä (näytetään _o kuva)
        while (questions.length < 2) {
            let statementIndex = Math.floor(Math.random() * statements.length);
            if (!usedStatements.has(statementIndex)) {
                questions.push({
                    statementIndex: statementIndex,
                    isCorrect: true
                });
                usedStatements.add(statementIndex);
            }
        }

        // Valitaan 3 väärää väitettä (näytetään _v kuva)
        while (questions.length < 5) {
            let statementIndex = Math.floor(Math.random() * statements.length);
            if (!usedStatements.has(statementIndex)) {
                questions.push({
                    statementIndex: statementIndex,
                    isCorrect: false
                });
                usedStatements.add(statementIndex);
            }
        }
        
        shuffleArray(questions);
        return questions;
    }

    function loadQuestionContent(question) {
        const { statementIndex, isCorrect } = question;
        const imageSuffix = isCorrect ? '_o' : '_v';
        hyonteisImage.src = `${imageMap[statementIndex]}${imageSuffix}.png`;
        hyonteisImage.style.display = 'block';
        this.question.textContent = statements[statementIndex];
        nextArrow.classList.add('hidden');
        trueButton.disabled = false;
        falseButton.disabled = false;
    }

    function checkAnswer(isTrue) {
        const { isCorrect } = gameQuestions[currentRound];
        if (isTrue === isCorrect) {
            score++;
            playAudio('oikein.mp3');
            addStar();
        } else {
            playAudio('vaarin.mp3');
        }
        trueButton.disabled = true;
        falseButton.disabled = true;
        if (currentRound < 4) {
            nextArrow.classList.remove('hidden');
        } else {
            setTimeout(endGame, 1000);
        }
    }

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        currentRound = 0;
        score = 0;
        stars.innerHTML = '';
        gameQuestions = generateQuestions();
        loadQuestionContent(gameQuestions[currentRound]);
        playAudio('avaiv.mp3', () => {
            playQuestionAudio();
        });
    }

    function playQuestionAudio() {
        const { statementIndex } = gameQuestions[currentRound];
        const audioMap = {
            0: 'Valintapeli_hiipia',
            1: 'Valintapeli_hyppia',
            2: 'Valintapeli_kavella',
            3: 'Valintapeli_kontata',
            4: 'Valintapeli_kurkottaa',
            5: 'Valintapeli_loikkia',
            6: 'Valintapeli_ryomia',
            7: 'Valintapeli_tanssia_poika',
            8: 'Valintapeli_tanssia_tytto'
        };
        playAudio(`${audioMap[statementIndex]}.mp3`);
    }

    function nextQuestion() {
        if (currentRound < 4) {
            currentRound++;
            loadQuestionContent(gameQuestions[currentRound]);
            playQuestionAudio();
        } else {
            endGame();
        }
    }

    function addStar() {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.classList.add('star');
        stars.appendChild(star);
    }
    
    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStars.innerHTML = '';
        for (let i = 0; i < score; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.png';
            star.classList.add('star');
            finalStars.appendChild(star);
        }
        finalFeedback.textContent = 'HIENOA!';
        scoreText.textContent = `${score}/5 OIKEIN`;
    }

    function playAudio(filename, callback) {
        const audio = new Audio(filename);
        audio.play();
        if (callback) {
            audio.onended = callback;
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
    nextArrow.addEventListener('click', nextQuestion);
    speakerIcon.addEventListener('click', playQuestionAudio);
});