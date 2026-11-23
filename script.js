// Banco de 5 acertijos navideños (1 minuto promedio por acertijo)
const puzzles = [
    {
        title: "El Guía del Trineo",
        question: "Tengo una nariz roja que brilla en la oscuridad y guío el trineo de Santa a través de las tormentas de nieve. ¿Cuál es mi nombre?",
        answers: ["rodolfo", "rudolph"],
        hint: "Es el noveno reno de Santa Claus."
    },
    {
        title: "Tradición de Medianoche",
        question: "¿Cómo se llama la canción navideña más famosa del mundo, compuesta originalmente en Austria en 1818 como 'Stille Nacht'?",
        answers: ["noche de paz"],
        hint: "Empieza con 'Noche de...'."
    },
    {
        title: "El Visitante Gruñón",
        question: "Vivo en lo alto del monte Crumpit, soy de color verde y una vez intenté robarme toda la Navidad de Villa Quién. ¿Quién soy?",
        answers: ["el grinch", "grinch"],
        hint: "Mi corazón era dos tallas más pequeño."
    },
    {
        title: "Dulce Navideño",
        question: "Soy un caramelo duro con forma de bastón, tradicionalmente de rayas blancas y rojas con sabor a menta. ¿Qué soy? (Dos palabras)",
        answers: ["baston de caramelo", "bastones de caramelo", "baston dulce"],
        hint: "Tiene la forma del cayado de un pastor: '______ de caramelo'."
    },
    {
        title: "La Cuenta Regresiva",
        question: "¿Cuántos días exactos tiene el calendario de Adviento tradicional que comienza el 1 de diciembre y termina en Nochebuena?",
        answers: ["24", "veinticuatro"],
        hint: "Es el número del día en que se celebra la Nochebuena."
    }
];

// Variables de estado
let currentStage = 0;
let timeLeft = 300; // 5 minutos en segundos (5 * 60)
let timerInterval = null;
let hintUsed = false;

// Elementos del DOM
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");

const startBtn = document.getElementById("start-btn");
const timerDisplay = document.getElementById("timer");
const progressText = document.getElementById("progress-text");

const stageBadge = document.getElementById("stage-badge");
const questionTitle = document.getElementById("question-title");
const questionText = document.getElementById("question-text");
const hintText = document.getElementById("hint-text");
const hintBtn = document.getElementById("hint-btn");

const answerForm = document.getElementById("answer-form");
const answerInput = document.getElementById("answer-input");
const feedbackMsg = document.getElementById("feedback-msg");
const finalTime = document.getElementById("final-time");

// Función para normalizar texto (quita acentos, espacios extra y pasa a minúsculas)
function normalizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Formatear segundos a MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Iniciar juego
startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    loadStage();
    startTimer();
});

// Temporizador principal
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        // Alerta visual en el último minuto
        if (timeLeft <= 60) {
            timerDisplay.classList.add("timer-danger");
        }

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// Cargar el acertijo actual
function loadStage() {
    const puzzle = puzzles[currentStage];
    hintUsed = false;

    progressText.textContent = `${currentStage} / ${puzzles.length}`;
    stageBadge.textContent = `Candado ${currentStage + 1} de ${puzzles.length}`;
    questionTitle.textContent = puzzle.title;
    questionText.textContent = puzzle.question;

    hintText.textContent = `💡 Pista: ${puzzle.hint}`;
    hintText.classList.add("hidden");
    hintBtn.disabled = false;
    hintBtn.textContent = "Ver Pista (-15s)";

    feedbackMsg.textContent = "";
    answerInput.value = "";
    answerInput.focus();
}

// Botón de pista (penaliza 15 segundos)
hintBtn.addEventListener("click", () => {
    if (!hintUsed) {
        hintUsed = true;
        timeLeft = Math.max(0, timeLeft - 15);
        timerDisplay.textContent = formatTime(timeLeft);
        hintText.classList.remove("hidden");
        hintBtn.disabled = true;
        hintBtn.textContent = "Pista activada";

        if (timeLeft === 0) {
            endGame(false);
        }
    }
});

// Validar respuesta
answerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userAnswer = normalizeText(answerInput.value);
    const validAnswers = puzzles[currentStage].answers.map(normalizeText);

    if (validAnswers.includes(userAnswer)) {
        feedbackMsg.textContent = "✅ ¡Candado abierto!";
        feedbackMsg.className = "feedback success";
        currentStage++;

        if (currentStage < puzzles.length) {
            setTimeout(loadStage, 700);
        } else {
            progressText.textContent = `${puzzles.length} / ${puzzles.length}`;
            setTimeout(() => endGame(true), 700);
        }
    } else {
        feedbackMsg.textContent = "❌ Código incorrecto. Intenta de nuevo.";
        feedbackMsg.className = "feedback error";
        gameScreen.classList.remove("shake");
        void gameScreen.offsetWidth; // Reinicia la animación CSS
        gameScreen.classList.add("shake");
        answerInput.select();
    }
});

// Finalizar partida
function endGame(isVictory) {
    clearInterval(timerInterval);
    gameScreen.classList.add("hidden");

    if (isVictory) {
        finalTime.textContent = formatTime(timeLeft);
        winScreen.classList.remove("hidden");
    } else {
        timerDisplay.textContent = "00:00";
        loseScreen.classList.remove("hidden");
    }
}