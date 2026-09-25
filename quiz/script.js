/* =========================================================
   STUDENT QUIZ WEBSITE
   Complete JavaScript
   ========================================================= */

const STORAGE_KEY = "studentQuizApp";

/* =========================================================
   GLOBAL STATE
========================================================= */

let state = {
    currentPage: "home",

    quizSettings: {
        subjects: [],
        questionCount: 10,
        difficulty: "Mixed",
        mode: "quiz",
        timer: 0
    },

    quizQuestions: [],
    currentQuestion: 0,
    answers: {},
    marked: [],
    quizStartTime: null,
    timerSeconds: 0,
    timerInterval: null,

    history: [],
    savedQuestions: [],
    achievements: [],

    theme: "purple",
    emojiTheme: "🎓",
    darkMode: false
};


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadState();
    applyPreferences();

    setupHeader();
    setupHome();
    setupQuizSetup();
    setupQuizPage();
    setupResultPage();
    setupReviewPage();
    setupDashboard();
    setupSavedPage();
    setupSettings();
    setupShareModal();

    updateDashboard();
    renderSavedQuestions();

    showPage("home");

    console.log("Student Quiz loaded.");
    console.log(
        "Questions available:",
        Array.isArray(questionBank) ? questionBank.length : 0
    );
});


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadState() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {

        const parsed = JSON.parse(saved);

        state = {
            ...state,
            ...parsed,

            quizSettings: {
                ...state.quizSettings,
                ...(parsed.quizSettings || {})
            },

            history: Array.isArray(parsed.history)
                ? parsed.history
                : [],

            savedQuestions: Array.isArray(parsed.savedQuestions)
                ? parsed.savedQuestions
                : [],

            achievements: Array.isArray(parsed.achievements)
                ? parsed.achievements
                : []
        };

    } catch (error) {

        console.error(
            "Could not load saved data:",
            error
        );
    }
}


function saveState() {

    const data = {
        history: state.history,
        savedQuestions: state.savedQuestions,
        achievements: state.achievements,
        theme: state.theme,
        emojiTheme: state.emojiTheme,
        darkMode: state.darkMode
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageName) {

    state.currentPage = pageName;

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const targetId =
        pageName === "home"
            ? "home"
            : `${pageName}Page`;

    const target =
        document.getElementById(targetId);

    if (target) {
        target.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageName === "dashboard") {
        updateDashboard();
    }

    if (pageName === "saved") {
        renderSavedQuestions();
    }
}
    
/* =========================================================
   HEADER
========================================================= */

function setupHeader() {

    const themeToggle =
        document.getElementById("themeToggle");

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            state.darkMode = !state.darkMode;

            applyPreferences();
            saveState();

        });
    }


    const settingsBtn =
        document.getElementById("settingsBtn");

    if (settingsBtn) {

        settingsBtn.addEventListener("click", () => {
            showPage("settings");
        });
    }


    /*
       Add Dashboard button dynamically because the current
       HTML has no dedicated Dashboard button in the header.
    */

    const headerActions =
        document.querySelector(".header-actions");

    if (
        headerActions &&
        !document.getElementById("dashboardHeaderBtn")
    ) {

        const dashboardButton =
            document.createElement("button");

        dashboardButton.id =
            "dashboardHeaderBtn";

        dashboardButton.className =
            "icon-btn";

        dashboardButton.title =
            "Dashboard";

        dashboardButton.textContent =
            "📊";

        dashboardButton.addEventListener(
            "click",
            () => showPage("dashboard")
        );

        headerActions.insertBefore(
            dashboardButton,
            headerActions.firstChild
        );
    }
}


/* =========================================================
   THEME / CUSTOMIZATION
========================================================= */

function applyPreferences() {

    document.body.classList.toggle(
        "dark",
        state.darkMode
    );


    /*
       Current CSS uses body.theme-purple,
       body.theme-blue, etc.
    */

    const themeNames = [
        "purple",
        "blue",
        "pink",
        "green",
        "orange",
        "red",
        "teal",
        "indigo",
        "rose",
        "slate"
    ];

    themeNames.forEach(theme => {
        document.body.classList.toggle(
            `theme-${theme}`,
            state.theme === theme
        );
    });


    const themeToggle =
        document.getElementById("themeToggle");

    if (themeToggle) {

        themeToggle.textContent =
            state.darkMode ? "☀️" : "🌙";

        themeToggle.title =
            state.darkMode
                ? "Switch to light mode"
                : "Switch to dark mode";
    }


    const settingsThemeToggle =
        document.getElementById("settingsThemeToggle");

    if (settingsThemeToggle) {

        settingsThemeToggle.textContent =
            state.darkMode ? "☀️" : "🌙";
    }


    document
        .querySelectorAll("#colorThemes button")
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.dataset.theme === state.theme
            );
        });


    document
        .querySelectorAll("#emojiThemes button")
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.dataset.emoji === state.emojiTheme
            );
        });


    /*
       Apply selected emoji to the logo/result icon.
    */

    const logo =
        document.querySelector(".logo");

    if (logo) {
        logo.textContent =
            `${state.emojiTheme} Student Quiz Website`;
    }

    const resultIcon =
        document.querySelector(".result-icon");

    if (resultIcon) {
        resultIcon.textContent =
            state.emojiTheme;
    }
}


function setupThemeControls() {

    const settingsThemeToggle =
        document.getElementById(
            "settingsThemeToggle"
        );

    if (settingsThemeToggle) {

        settingsThemeToggle.addEventListener(
            "click",
            () => {

                state.darkMode =
                    !state.darkMode;

                applyPreferences();
                saveState();

            }
        );
    }


    document
        .querySelectorAll("#colorThemes button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.theme =
                        button.dataset.theme;

                    applyPreferences();
                    saveState();

                    showToast(
                        `${capitalize(state.theme)} theme selected ✨`
                    );
                }
            );
        });


    document
        .querySelectorAll("#emojiThemes button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.emojiTheme =
                        button.dataset.emoji;

                    applyPreferences();
                    saveState();

                    showToast(
                        "Emoji theme changed ✨"
                    );
                }
            );
        });
}


/* =========================================================
   HOME
========================================================= */

function setupHome() {

    const startQuizBtn =
        document.getElementById("startQuizBtn");

    if (startQuizBtn) {

        startQuizBtn.addEventListener(
            "click",
            () => {

                state.quizSettings = {
                    subjects: [],
                    questionCount: 10,
                    difficulty: "Mixed",
                    mode: "quiz",
                    timer: 0
                };

                resetSetupSelections();

                showPage("setup");
            }
        );
    }


    /*
       Quick Start cards
    */

    document
        .querySelectorAll(".quick-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const action =
                        card.dataset.action;

                    if (action === "quick") {
                        startQuickQuiz();
                    }

                    else if (action === "random") {
                        startRandomQuiz();
                    }

                    else if (action === "mistakes") {
                        practiceAllMistakes();
                    }

                    else if (action === "saved") {
                        showPage("saved");
                    }
                }
            );
        });


    /*
       Home subject cards
    */

    document
        .querySelectorAll(".subject-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const subject =
                        card.dataset.subject;

                    state.quizSettings = {
                        subjects: [subject],
                        questionCount: 10,
                        difficulty: "Mixed",
                        mode: "quiz",
                        timer: 0
                    };

                    resetSetupSelections();
                    selectSetupSubject(subject);

                    showPage("setup");
                }
            );
        });
}


/* =========================================================
   QUICK / RANDOM QUIZ
========================================================= */

function startQuickQuiz() {

    state.quizSettings = {
        subjects: ["All"],
        questionCount: 5,
        difficulty: "Mixed",
        mode: "quiz",
        timer: 0
    };

    startQuiz();
}


function startRandomQuiz() {

    state.quizSettings = {
        subjects: ["All"],
        questionCount: 10,
        difficulty: "Mixed",
        mode: "quiz",
        timer: 0
    };

    startQuiz();
}


/* =========================================================
   QUIZ SETUP
========================================================= */

function setupQuizSetup() {

    /*
       Setup subject buttons
    */

    document
        .querySelectorAll(".setup-subject")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const subject =
                        button.dataset.subject;

                    toggleSetupSubject(subject);
                }
            );
        });


    /*
       Question count
    */

    document
        .querySelectorAll(".choice-btn[data-count]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.quizSettings.questionCount =
                        Number(button.dataset.count);

                    document
                        .querySelectorAll(
                            ".choice-btn[data-count]"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "selected"
                            )
                        );

                    button.classList.add("selected");
                }
            );
        });


    /*
       Difficulty
    */

    document
        .querySelectorAll(
            ".difficulty-btn[data-difficulty]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.quizSettings.difficulty =
                        button.dataset.difficulty;

                    document
                        .querySelectorAll(
                            ".difficulty-btn"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "selected"
                            )
                        );

                    button.classList.add("selected");
                }
            );
        });


    /*
       Quiz mode
    */

    document
        .querySelectorAll(".mode-btn[data-mode]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.quizSettings.mode =
                        button.dataset.mode;

                    document
                        .querySelectorAll(".mode-btn")
                        .forEach(btn =>
                            btn.classList.remove(
                                "selected"
                            )
                        );

                    button.classList.add("selected");
                }
            );
        });


    /*
       Timer
    */

    document
        .querySelectorAll(".timer-btn[data-timer]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.quizSettings.timer =
                        Number(button.dataset.timer);

                    document
                        .querySelectorAll(".timer-btn")
                        .forEach(btn =>
                            btn.classList.remove(
                                "selected"
                            )
                        );

                    button.classList.add("selected");
                }
            );
        });


    /*
       Begin Quiz
    */

    const beginQuizBtn =
        document.getElementById("beginQuizBtn");

    if (beginQuizBtn) {

        beginQuizBtn.addEventListener(
            "click",
            startQuiz
        );
    }


    /*
       Back
    */

    const setupBackBtn =
        document.getElementById("setupBackBtn");

    if (setupBackBtn) {

        setupBackBtn.addEventListener(
            "click",
            () => showPage("home")
        );
    }
}


function toggleSetupSubject(subject) {

    if (
        !Array.isArray(
            state.quizSettings.subjects
        )
    ) {
        state.quizSettings.subjects = [];
    }


    /*
       Remove subject if already selected
    */

    if (
        state.quizSettings.subjects.includes(subject)
    ) {

        state.quizSettings.subjects =
            state.quizSettings.subjects.filter(
                item => item !== subject
            );

    } else {

        /*
           "All" is removed when selecting a
           specific subject.
        */

        state.quizSettings.subjects =
            state.quizSettings.subjects.filter(
                item => item !== "All"
            );

        state.quizSettings.subjects.push(subject);
    }


    updateSetupSubjectUI();
}


function selectSetupSubject(subject) {

    state.quizSettings.subjects = [subject];

    updateSetupSubjectUI();
}


function updateSetupSubjectUI() {

    const selectedSubjects =
        document.getElementById(
            "selectedSubjects"
        );


    document
        .querySelectorAll(".setup-subject")
        .forEach(button => {

            button.classList.toggle(
                "selected",
                state.quizSettings.subjects.includes(
                    button.dataset.subject
                )
            );
        });


    if (!selectedSubjects) return;


    if (
        !state.quizSettings.subjects.length ||
        state.quizSettings.subjects.includes("All")
    ) {

        selectedSubjects.innerHTML = `
            <p class="muted">
                Choose at least one subject.
            </p>
        `;

        return;
    }


    selectedSubjects.innerHTML =
        state.quizSettings.subjects
            .map(subject => `
                <span class="selected-subject-tag">
                    ${escapeHTML(subject)}
                </span>
            `)
            .join("");
}


function resetSetupSelections() {

    document
        .querySelectorAll(
            ".setup-subject, .choice-btn, .difficulty-btn, .mode-btn, .timer-btn"
        )
        .forEach(button => {
            button.classList.remove("selected");
        });


    updateSetupSubjectUI();


    /*
       Restore default setup choices
    */

    const countButton =
        document.querySelector(
            `.choice-btn[data-count="${state.quizSettings.questionCount}"]`
        );

    if (countButton) {
        countButton.classList.add("selected");
    }


    const difficultyButton =
        document.querySelector(
            `.difficulty-btn[data-difficulty="${state.quizSettings.difficulty}"]`
        );

    if (difficultyButton) {
        difficultyButton.classList.add("selected");
    }


    const modeButton =
        document.querySelector(
            `.mode-btn[data-mode="${state.quizSettings.mode}"]`
        );

    if (modeButton) {
        modeButton.classList.add("selected");
    }


    const timerButton =
        document.querySelector(
            `.timer-btn[data-timer="${state.quizSettings.timer}"]`
        );

    if (timerButton) {
        timerButton.classList.add("selected");
    }


    updateSetupSubjectUI();
}


/* =========================================================
   START QUIZ
========================================================= */

function startQuiz() {

    if (
        !Array.isArray(questionBank) ||
        questionBank.length === 0
    ) {

        showToast(
            "Question bank could not be loaded."
        );

        return;
    }


    if (
        !state.quizSettings.subjects.length
    ) {

        showToast(
            "Please choose at least one subject."
        );

        return;
    }


    let available =
        [...questionBank];


    /*
       SUBJECT FILTER
    */

    if (
        !state.quizSettings.subjects.includes(
            "All"
        )
    ) {

        available =
            available.filter(question =>
                state.quizSettings.subjects.includes(
                    question.subject
                )
            );
    }


    /*
       DIFFICULTY FILTER
    */

    if (
        state.quizSettings.difficulty !==
        "Mixed"
    ) {

        available =
            available.filter(
                question =>
                    question.difficulty ===
                    state.quizSettings.difficulty
            );
    }


    /*
       Shuffle
    */

    available =
        shuffleArray(available);


    /*
       Number of questions
    */

    const count =
        Math.min(
            state.quizSettings.questionCount,
            available.length
        );


    state.quizQuestions =
        available.slice(0, count);


    if (!state.quizQuestions.length) {

        showToast(
            "No questions match your selection."
        );

        return;
    }


    /*
       Reset quiz state
    */

    state.currentQuestion = 0;
    state.answers = {};
    state.marked = [];
    state.quizStartTime = Date.now();

    stopTimer();


    /*
       Timer
    */

    if (state.quizSettings.timer > 0) {

        state.timerSeconds =
            state.quizSettings.timer;

        startTimer();

    } else {

        state.timerSeconds = 0;
    }


    showPage("quiz");

    renderQuestion();
    renderQuestionNavigator();
}


/* =========================================================
   QUIZ PAGE SETUP
========================================================= */

function setupQuizPage() {

    const previousBtn =
        document.getElementById(
            "previousBtn"
        );

    if (previousBtn) {

        previousBtn.addEventListener(
            "click",
            previousQuestion
        );
    }


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            nextQuestion
        );
    }


    const submitBtn =
        document.getElementById(
            "submitBtn"
        );

    if (submitBtn) {

        submitBtn.addEventListener(
            "click",
            () => submitQuiz(false)
        );
    }

    const markBtn =
    document.getElementById("markBtn");

    if (markBtn) {
    markBtn.onclick = toggleMarkQuestion;
   }


    const hintBtn =
    document.getElementById("hintBtn");

  if (hintBtn) {
    hintBtn.onclick = showHint;
  }
    


    const quizHomeBtn =
        document.getElementById(
            "quizHomeBtn"
        );

    if (quizHomeBtn) {

        quizHomeBtn.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Exit this quiz? Your current progress will be lost."
                    );

                if (!confirmed) return;

                stopTimer();

                showPage("home");
            }
        );
    }
}


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderQuestion() {

    const question =
        state.quizQuestions[
            state.currentQuestion
        ];


    if (!question) return;


    const questionNumber =
        state.currentQuestion + 1;

    const total =
        state.quizQuestions.length;


    /*
       Counter
    */

    setText(
        "questionCounter",
        `Question ${questionNumber} of ${total}`
    );


    /*
       Subject
    */

    setText(
        "questionSubject",
        question.subject
    );


    /*
       Difficulty
    */

    setText(
        "questionDifficulty",
        question.difficulty
    );


    /*
       Question
    */

    setText(
        "questionText",
        question.question
    );


    /*
       Progress bar
    */

    const progress =
        (questionNumber / total) * 100;

    const progressBar =
        document.getElementById(
            "quizProgress"
        );

    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;
    }


    /*
       Options
    */

    const optionsContainer =
        document.getElementById(
            "optionsContainer"
        );

    if (optionsContainer) {

        optionsContainer.innerHTML = "";

        question.options.forEach(
            (option, index) => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";

                button.className =
                    "option-btn";

                button.dataset.index =
                    index;

                button.innerHTML = `
                    <span class="option-letter">
                        ${String.fromCharCode(
                            65 + index
                        )}
                    </span>

                    <span>
                        ${escapeHTML(option)}
                    </span>
                `;


                /*
                   Selected answer
                */

                if (
                    state.answers[question.id] ===
                    index
                ) {

                    button.classList.add(
                        "selected"
                    );
                }


                button.addEventListener(
                    "click",
                    () => selectAnswer(index)
                );


                optionsContainer.appendChild(
                    button
                );
            }
        );
    }


    /*
       Practice feedback
    */

    if (
        state.quizSettings.mode ===
        "practice"
    ) {

        showPracticeFeedback();

    } else {

        clearPracticeFeedback();
    }


    /*
       Buttons
    */

    updateMarkButton();
    updatePreviousNextButtons();
    updateSaveButton();


    /*
       Navigator
    */

    updateQuestionNavigator();
}


/* =========================================================
   ANSWER SELECTION
========================================================= */

function selectAnswer(index) {

    const question =
        state.quizQuestions[
            state.currentQuestion
        ];


    if (!question) return;


    state.answers[question.id] =
        index;


    document
        .querySelectorAll(
            "#optionsContainer .option-btn"
        )
        .forEach(button => {

            button.classList.toggle(
                "selected",
                Number(button.dataset.index) ===
                index
            );
        });


    updateQuestionNavigator();


    if (
        state.quizSettings.mode ===
        "practice"
    ) {

        showPracticeFeedback();
    }
}


/* =========================================================
   PRACTICE FEEDBACK
========================================================= */

function showPracticeFeedback() {

    const question =
        state.quizQuestions[
            state.currentQuestion
        ];


    if (!question) return;


    const selected =
        state.answers[question.id];


    const existing =
        document.getElementById(
            "practiceFeedback"
        );


    if (existing) {
        existing.classList.add("hidden");
    }


    if (selected === undefined) {
        return;
    }


    const isCorrect =
        selected === question.correctAnswer;


    if (existing) {

        existing.className =
            `practice-feedback ${
                isCorrect
                    ? "correct"
                    : "incorrect"
            }`;

        existing.innerHTML = `
            <strong>
                ${
                    isCorrect
                        ? "✓ Correct!"
                        : "✗ Incorrect"
                }
            </strong>

            <p>
                ${
                    isCorrect
                        ? escapeHTML(
                            question.explanation
                        )
                        : `
                            Correct answer:
                            <strong>
                                ${escapeHTML(
                                    question.options[
                                        question.correctAnswer
                                    ]
                                )}
                            </strong>
                            <br>
                            ${escapeHTML(
                                question.explanation
                            )}
                        `
                }
            </p>
        `;

        existing.classList.remove(
            "hidden"
        );
    }
}


/* =========================================================
   CLEAR PRACTICE FEEDBACK
========================================================= */

function clearPracticeFeedback() {

    const feedback =
        document.getElementById(
            "practiceFeedback"
        );

    if (!feedback) return;

    feedback.className =
        "practice-feedback hidden";

    feedback.innerHTML = "";
}


/* =========================================================
   PREVIOUS / NEXT
========================================================= */

function previousQuestion() {

    if (
        state.currentQuestion > 0
    ) {

        state.currentQuestion--;

        renderQuestion();
    }
}


function nextQuestion() {

    if (
        state.currentQuestion <
        state.quizQuestions.length - 1
    ) {

        state.currentQuestion++;

        renderQuestion();

    } else {

        submitQuiz(false);
    }
}


function updatePreviousNextButtons() {

    const previousBtn =
        document.getElementById(
            "previousBtn"
        );

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    const submitBtn =
        document.getElementById(
            "submitBtn"
        );


    if (previousBtn) {

        previousBtn.disabled =
            state.currentQuestion === 0;
    }


    const isLast =
        state.currentQuestion ===
        state.quizQuestions.length - 1;


    if (nextBtn) {

        nextBtn.classList.toggle(
            "hidden",
            isLast
        );
    }


    if (submitBtn) {

        submitBtn.classList.toggle(
            "hidden",
            !isLast
        );
    }
}


/* =========================================================
   MARK FOR REVIEW
========================================================= */

function toggleMarkQuestion() {

    const question =
        state.quizQuestions[
            state.currentQuestion
        ];


    if (!question) return;


    if (
        state.marked.includes(
            question.id
        )
    ) {

        state.marked =
            state.marked.filter(
                id => id !== question.id
            );

        showToast(
            "Removed from review."
        );

    } else {

        state.marked.push(
            question.id
        );

        showToast(
            "Marked for review 🔖"
        );
    }


    updateMarkButton();
    updateQuestionNavigator();
}


function updateMarkButton() {

    const button =
        document.getElementById(
            "markBtn"
        );


    if (!button) return;


    const question =
        state.quizQuestions[
            state.currentQuestion
        ];


    if (!question) return;


    const marked =
        state.marked.includes(
            question.id
        );


    button.classList.toggle(
        "active",
        marked
    );


    button.textContent =
        marked
            ? "🔖 Marked"
            : "🔖 Mark for Review";
}


/* =========================================================
   HINT
========================================================= */

function showHint() {

    const question =
        state.quizQuestions[
            state.currentQuestion
        ];


    if (!question) return;


    showToast(
        `💡 ${question.hint}`
    );
}


/* =========================================================
   SAVE QUESTION
========================================================= */

function createSaveButton() {

    const questionActions =
        document.querySelector(
            ".question-actions"
        );


    if (
        !questionActions ||
        document.getElementById(
            "saveQuestionBtn"
        )
    ) {
        return;
    }


    const button =
        document.createElement(
            "button"
        );

    button.id =
        "saveQuestionBtn";

    button.className =
        "secondary-btn";

    button.type =
        "button";
    button.onclick = () => {
    const question =
        state.quizQuestions[
            state.currentQuestion
        ];

    if (!question) return;

    toggleSavedQuestion(
        question.id
    );
};
    
questionActions.appendChild(
        button
    );
}


function updateSaveButton() {

    createSaveButton();


    const button =
        document.getElementById(
            "saveQuestionBtn"
        );


    if (!button) return;


    const question =
        state.quizQuestions[
            state.currentQuestion
        ];


    if (!question) return;


    const saved =
        isQuestionSaved(
            question.id
        );


    button.textContent =
        saved
            ? "★ Saved"
            : "☆ Save Question";

    button.classList.toggle(
        "saved",
        saved
    );
}


function toggleSavedQuestion(id) {

    if (
        state.savedQuestions.includes(id)
    ) {

        state.savedQuestions =
            state.savedQuestions.filter(
                questionId =>
                    questionId !== id
            );

        showToast(
            "Removed from saved questions."
        );

    } else {

        state.savedQuestions.push(id);

        showToast(
            "Question saved ⭐"
        );
    }


    saveState();

    renderSavedQuestions();

    updateSaveButton();
}


function isQuestionSaved(id) {

    return state.savedQuestions.includes(
        id
    );
}


/* =========================================================
   QUESTION NAVIGATOR
========================================================= */

function renderQuestionNavigator() {

    const container =
        document.getElementById(
            "questionNumbers"
        );


    if (!container) return;


    container.innerHTML = "";


    state.quizQuestions.forEach(
        (question, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "question-number";

            button.textContent =
                index + 1;


            if (
                index ===
                state.currentQuestion
            ) {

                button.classList.add(
                    "current"
                );
            }


            if (
                state.answers[
                    question.id
                ] !== undefined
            ) {

                button.classList.add(
                    "answered"
                );
            }


            if (
                state.marked.includes(
                    question.id
                )
            ) {

                button.classList.add(
                    "marked"
                );
            }


            button.addEventListener(
                "click",
                () => {

                    state.currentQuestion =
                        index;

                    renderQuestion();
                }
            );


            container.appendChild(
                button
            );
        }
    );
}


function updateQuestionNavigator() {

    const buttons =
        document.querySelectorAll(
            "#questionNumbers .question-number"
        );


    buttons.forEach(
        (button, index) => {

            const question =
                state.quizQuestions[
                    index
                ];


            if (!question) return;


            button.classList.toggle(
                "current",
                index ===
                state.currentQuestion
            );


            button.classList.toggle(
                "answered",
                state.answers[
                    question.id
                ] !== undefined
            );


            button.classList.toggle(
                "marked",
                state.marked.includes(
                    question.id
                )
            );
        }
    );
}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    updateTimerDisplay();


    state.timerInterval =
        setInterval(
            () => {

                state.timerSeconds--;

                updateTimerDisplay();


                if (
                    state.timerSeconds <=
                    0
                ) {

                    stopTimer();

                    showToast(
                        "Time is up! ⏰"
                    );

                    submitQuiz(true);
                }

            },
            1000
        );
}


function stopTimer() {

    if (
        state.timerInterval
    ) {

        clearInterval(
            state.timerInterval
        );

        state.timerInterval =
            null;
    }
}


function updateTimerDisplay() {

    const element =
        document.getElementById(
            "timerDisplay"
        );


    if (!element) return;


    if (
        state.quizSettings.timer <=
        0
    ) {

        element.textContent =
            "";

        return;
    }


    const minutes =
        Math.floor(
            state.timerSeconds / 60
        );


    const seconds =
        state.timerSeconds % 60;


    element.textContent =
        `⏱ ${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(
            2,
            "0"
        )}`;
}


/* =========================================================
   SUBMIT QUIZ
========================================================= */

function submitQuiz(autoSubmitted = false) {

    if (
        !state.quizQuestions.length
    ) {
        return;
    }


    if (!autoSubmitted) {

        const unanswered =
            state.quizQuestions.filter(
                question =>
                    state.answers[
                        question.id
                    ] === undefined
            ).length;


        if (unanswered > 0) {

            const confirmed =
                confirm(
                    `You have ${unanswered} unanswered question${
                        unanswered === 1
                            ? ""
                            : "s"
                    }. Submit anyway?`
                );


            if (!confirmed) {
                return;
            }
        }
    }


    stopTimer();


    const endTime =
        Date.now();


    const elapsedSeconds =
        state.quizStartTime
            ? Math.floor(
                (
                    endTime -
                    state.quizStartTime
                ) / 1000
            )
            : 0;


    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;


    state.quizQuestions.forEach(
        question => {

            const answer =
                state.answers[
                    question.id
                ];


            if (
                answer === undefined
            ) {

                unanswered++;

            } else if (
                answer ===
                question.correctAnswer
            ) {

                correct++;

            } else {

                incorrect++;
            }
        }
    );


    const total =
        state.quizQuestions.length;


    const percentage =
        total > 0
            ? Math.round(
                (correct / total) * 100
            )
            : 0;


    const answered =
        correct + incorrect;


    const accuracy =
        answered > 0
            ? Math.round(
                (correct / answered) *
                100
            )
            : 0;


    const result = {

        id: Date.now(),

        date:
            new Date().toISOString(),

        subjects: [
            ...new Set(
                state.quizQuestions.map(
                    question =>
                        question.subject
                )
            )
        ],

        questionCount:
            total,

        correct:
            correct,

        incorrect:
            incorrect,

        unanswered:
            unanswered,

        percentage:
            percentage,

        accuracy:
            accuracy,

        timeSeconds:
            elapsedSeconds,

        difficulty:
            state.quizSettings.difficulty,

        mode:
            state.quizSettings.mode,

        questions:
            state.quizQuestions.map(
                question => ({

                    id:
                        question.id,

                    selected:
                        state.answers[
                            question.id
                        ] ?? null,

                    correctAnswer:
                        question.correctAnswer
                })
            )
    };


    const previousBest =
        getPersonalBest();


    state.history.push(
        result
    );


    checkAchievements(
        result
    );


    saveState();


    const isPersonalBest =
        result.percentage >
        previousBest;


    renderResult(
        result,
        isPersonalBest
    );


    showPage(
        "result"
    );
}


/* =========================================================
   RESULT PAGE
========================================================= */

function setupResultPage() {

    const reviewBtn =
        document.getElementById(
            "reviewBtn"
        );

    if (reviewBtn) {

        reviewBtn.addEventListener(
            "click",
            () => {

                renderReview();

                showPage(
                    "review"
                );
            }
        );
    }


    const retryBtn =
        document.getElementById(
            "retryBtn"
        );

    if (retryBtn) {

        retryBtn.addEventListener(
            "click",
            retryQuiz
        );
    }


    const mistakesBtn =
        document.getElementById(
            "mistakesBtn"
        );

    if (mistakesBtn) {

        mistakesBtn.addEventListener(
            "click",
            practiceLastMistakes
        );
    }


    const shareBtn =
        document.getElementById(
            "shareBtn"
        );

    if (shareBtn) {

        shareBtn.addEventListener(
            "click",
            openShareModal
        );
    }


    const resultHomeBtn =
        document.getElementById(
            "resultHomeBtn"
        );

    if (resultHomeBtn) {

        resultHomeBtn.addEventListener(
            "click",
            () => showPage("home")
        );
    }
}


function renderResult(
    result,
    isPersonalBest
) {

    setText(
        "resultTitle",
        "Quiz Complete!"
    );


    setText(
        "resultSubject",
        result.subjects.join(
            ", "
        )
    );


    setText(
        "resultPercentage",
        `${result.percentage}%`
    );


    setText(
        "resultScore",
        `${result.correct} / ${result.questionCount} Correct`
    );


    setText(
        "correctCount",
        result.correct
    );


    setText(
        "incorrectCount",
        result.incorrect
    );


    setText(
        "unansweredCount",
        result.unanswered
    );


    setText(
        "resultTime",
        formatTime(
            result.timeSeconds
        )
    );


    const personalBest =
        document.getElementById(
            "personalBest"
        );


    if (personalBest) {

        personalBest.classList.toggle(
            "hidden",
            !isPersonalBest
        );
    }


    /*
       Create extra accuracy information
       without requiring HTML changes.
    */

    let accuracyElement =
        document.getElementById(
            "resultAccuracyExtra"
        );


    if (!accuracyElement) {

        accuracyElement =
            document.createElement(
                "p"
            );

        accuracyElement.id =
            "resultAccuracyExtra";

        accuracyElement.style.marginTop =
            "10px";

        accuracyElement.style.color =
            "var(--text-light)";

        const score =
            document.getElementById(
                "resultScore"
            );

        if (score) {
            score.after(
                accuracyElement
            );
        }
    }


    accuracyElement.textContent =
        `Accuracy: ${result.accuracy}%`;


    /*
       Extra result summary
    */

    let summary =
        document.getElementById(
            "resultSummaryExtra"
        );


    if (!summary) {

        summary =
            document.createElement(
                "p"
            );

        summary.id =
            "resultSummaryExtra";

        summary.style.marginTop =
            "8px";

        summary.style.color =
            "var(--text-light)";

        accuracyElement.after(
            summary
        );
    }


    summary.textContent =
        getResultMessage(
            result.percentage
        );
}


function getResultMessage(
    percentage
) {

    if (percentage === 100) {
        return "Perfect score! 💯";
    }

    if (percentage >= 80) {
        return "Excellent work! Keep it up! 🎓";
    }

    if (percentage >= 60) {
        return "Good job! Keep practicing. 📚";
    }

    return "Keep practicing — you're improving! 💪";
}


function retryQuiz() {

    if (
        !state.quizQuestions.length
    ) {
        return;
    }


    stopTimer();


    state.quizQuestions =
        shuffleArray(
            [...state.quizQuestions]
        );


    state.currentQuestion =
        0;

    state.answers =
        {};

    state.marked =
        [];

    state.quizStartTime =
        Date.now();


    if (
        state.quizSettings.timer >
        0
    ) {

        state.timerSeconds =
            state.quizSettings.timer;

        startTimer();

    } else {

        state.timerSeconds =
            0;

        updateTimerDisplay();
    }


    showPage(
        "quiz"
    );

    renderQuestion();
    renderQuestionNavigator();
}


/* =========================================================
   REVIEW
========================================================= */

function setupReviewPage() {

    const reviewBackBtn =
        document.getElementById(
            "reviewBackBtn"
        );


    if (reviewBackBtn) {

        reviewBackBtn.addEventListener(
            "click",
            () => showPage("result")
        );
    }
}


function renderReview() {

    const container =
        document.getElementById(
            "reviewContainer"
        );


    if (!container) return;


    container.innerHTML = "";


    state.quizQuestions.forEach(
        (question, index) => {

            const selected =
                state.answers[
                    question.id
                ];


            const isUnanswered =
                selected === undefined;


            const isCorrect =
                !isUnanswered &&
                selected ===
                question.correctAnswer;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                `review-item ${
                    isUnanswered
                        ? "unanswered"
                        : isCorrect
                            ? "correct"
                            : "incorrect"
                }`;


            let answerText;


            if (isUnanswered) {

                answerText =
                    "Unanswered";

            } else {

                answerText =
                    `${String.fromCharCode(
                        65 + selected
                    )}. ${
                        question.options[
                            selected
                        ]
                    }`;
            }


            const correctText =
                `${String.fromCharCode(
                    65 +
                    question.correctAnswer
                )}. ${
                    question.options[
                        question.correctAnswer
                    ]
                }`;


            card.innerHTML = `

                <div class="question-meta">

                    <span class="question-tag">
                        ${escapeHTML(
                            question.subject
                        )}
                    </span>

                    <span class="difficulty-tag">
                        ${escapeHTML(
                            question.difficulty
                        )}
                    </span>

                </div>


                <h3>
                    Question ${index + 1}:
                    ${escapeHTML(
                        question.question
                    )}
                </h3>


                <p class="review-answer">
                    <strong>Your answer:</strong>
                    ${escapeHTML(
                        answerText
                    )}
                </p>


                <p class="review-answer">
                    <strong>Correct answer:</strong>
                    ${escapeHTML(
                        correctText
                    )}
                </p>


                <div class="review-explanation">

                    <strong>
                        Explanation:
                    </strong>

                    <p>
                        ${escapeHTML(
                            question.explanation
                        )}
                    </p>

                </div>
            `;


            container.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   PRACTICE MISTAKES
========================================================= */

function getAllMistakeQuestions() {

    const mistakeIds =
        new Set();


    state.history.forEach(
        result => {

            result.questions.forEach(
                item => {

                    if (
                        item.selected !==
                            null &&
                        item.selected !==
                            item.correctAnswer
                    ) {

                        mistakeIds.add(
                            item.id
                        );
                    }
                }
            );
        }
    );


    return [
        ...mistakeIds
    ]
        .map(id =>
            questionBank.find(
                question =>
                    question.id === id
            )
        )
        .filter(Boolean);
}


function practiceLastMistakes() {

    if (
        !state.history.length
    ) {

        showToast(
            "No quiz history yet."
        );

        return;
    }


    const lastResult =
        state.history[
            state.history.length - 1
        ];


    const mistakes =
        lastResult.questions
            .filter(
                item =>
                    item.selected !==
                        null &&
                    item.selected !==
                        item.correctAnswer
            )
            .map(
                item =>
                    questionBank.find(
                        question =>
                            question.id ===
                            item.id
                    )
            )
            .filter(Boolean);


    if (!mistakes.length) {

        showToast(
            "No mistakes to practice! 🎉"
        );

        return;
    }


    startMistakePractice(
        mistakes
    );
}


function practiceAllMistakes() {

    const mistakes =
        getAllMistakeQuestions();


    if (!mistakes.length) {

        showToast(
            "You don't have any mistakes yet. 🎉"
        );

        return;
    }


    startMistakePractice(
        mistakes
    );
}


function startMistakePractice(
    questions
) {

    state.quizQuestions =
        shuffleArray(
            [...questions]
        );


    state.currentQuestion =
        0;

    state.answers =
        {};

    state.marked =
        [];

    state.quizSettings.mode =
        "practice";

    state.quizSettings.timer =
        0;

    state.quizStartTime =
        Date.now();


    stopTimer();

    state.timerSeconds =
        0;


    showPage(
        "quiz"
    );

    renderQuestion();
    renderQuestionNavigator();
}


/* =========================================================
   SAVED QUESTIONS PAGE
========================================================= */

function setupSavedPage() {

    const savedBackBtn =
        document.getElementById(
            "savedBackBtn"
        );


    if (savedBackBtn) {

        savedBackBtn.addEventListener(
            "click",
            () => showPage("home")
        );
    }


    /*
       Add search box because current HTML
       doesn't contain one.
    */

    const pageHeading =
        document.querySelector(
            "#savedPage .page-heading"
        );


    if (
        pageHeading &&
        !document.getElementById(
            "savedSearchInput"
        )
    ) {

        const search =
            document.createElement(
                "input"
            );

        search.id =
            "savedSearchInput";

        search.type =
            "search";

        search.placeholder =
            "Search saved questions...";

        search.style.width =
            "100%";

        search.style.marginTop =
            "15px";

        search.style.padding =
            "12px 14px";

        search.style.border =
            "1px solid var(--border)";

        search.style.borderRadius =
            "10px";

        search.style.background =
            "var(--surface)";

        search.style.color =
            "var(--text)";


        search.addEventListener(
            "input",
            () =>
                renderSavedQuestions(
                    search.value
                )
        );


        pageHeading.appendChild(
            search
        );
    }
}


function renderSavedQuestions(
    searchTerm = ""
) {

    const container =
        document.getElementById(
            "savedQuestionsContainer"
        );


    if (!container) return;


    let saved =
        state.savedQuestions
            .map(
                id =>
                    questionBank.find(
                        question =>
                            question.id === id
                    )
            )
            .filter(Boolean);


    if (
        searchTerm.trim()
    ) {

        const term =
            searchTerm
                .toLowerCase()
                .trim();


        saved =
            saved.filter(
                question =>

                    question.question
                        .toLowerCase()
                        .includes(term)

                    ||

                    question.subject
                        .toLowerCase()
                        .includes(term)

                    ||

                    question.topic
                        .toLowerCase()
                        .includes(term)
            );
    }


    if (!saved.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⭐
                </div>

                <h3>
                    No saved questions
                </h3>

                <p>
                    Save questions while studying
                    and they will appear here.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        saved
            .map(
                question => `

                    <div class="saved-question">

                        <div class="saved-question-meta">

                            <span class="question-tag">
                                ${escapeHTML(
                                    question.subject
                                )}
                            </span>

                            <span class="difficulty-tag">
                                ${escapeHTML(
                                    question.difficulty
                                )}
                            </span>

                        </div>


                        <h3>
                            ${escapeHTML(
                                question.question
                            )}
                        </h3>


                        <div class="saved-options">

                            ${question.options
                                .map(
                                    (
                                        option,
                                        index
                                    ) => `

                                        <div
                                            class="${
                                                index ===
                                                question.correctAnswer
                                                    ? "correct-option"
                                                    : ""
                                            }"
                                            style="
                                                padding:8px 0;
                                            "
                                        >

                                            <strong>
                                                ${String.fromCharCode(
                                                    65 + index
                                                )}.
                                            </strong>

                                            ${escapeHTML(
                                                option
                                            )}

                                        </div>
                                    `
                                )
                                .join("")}

                        </div>


                        <div
                            class="saved-explanation"
                            style="
                                margin:15px 0;
                                padding:15px;
                                background:var(--surface-2);
                                border-radius:var(--radius-sm);
                            "
                        >

                            <strong>
                                Explanation:
                            </strong>

                            <p>
                                ${escapeHTML(
                                    question.explanation
                                )}
                            </p>

                        </div>


                        <button
                            type="button"
                            class="secondary-btn"
                            data-saved-remove="${
                                question.id
                            }"
                        >
                            ★ Remove
                        </button>

                    </div>
                `
            )
            .join("");


    /*
       Remove buttons
    */

    container
        .querySelectorAll(
            "[data-saved-remove]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    toggleSavedQuestion(
                        Number(
                            button.dataset
                                .savedRemove
                        )
                    );
                }
            );
        });
}


/* =========================================================
   DASHBOARD
========================================================= */

 function setupDashboard() {

    const dashboardBackBtn =
        document.getElementById(
            "dashboardBackBtn"
        );

    if (dashboardBackBtn) {
        dashboardBackBtn.addEventListener(
            "click",
            () => showPage("home")
        );
    }

    updateDashboard();
}

function updateDashboard() {

    const history =
        state.history || [];


    const totalQuizzes =
        history.length;


    const totalQuestions =
        history.reduce(
            (sum, result) =>
                sum +
                Number(
                    result.questionCount || 0
                ),
            0
        );


    const averageAccuracy =
        totalQuizzes
            ? Math.round(
                history.reduce(
                    (sum, result) =>
                        sum +
                        Number(
                            result.accuracy || 0
                        ),
                    0
                ) / totalQuizzes
            )
            : 0;


    const streak =
        calculateStreak();


    /*
       Home stats
    */

    setText(
        "totalQuizzes",
        totalQuizzes
    );

    setText(
        "totalQuestions",
        totalQuestions
    );

    setText(
        "averageAccuracy",
        `${averageAccuracy}%`
    );

    setText(
        "currentStreak",
        streak
    );


    /*
       Dashboard stats
    */

    setText(
        "dashboardQuizzes",
        totalQuizzes
    );

    setText(
        "dashboardQuestions",
        totalQuestions
    );

    setText(
        "dashboardAccuracy",
        `${averageAccuracy}%`
    );

    setText(
        "dashboardStreak",
        streak
    );


    renderLastSevenDays();
    renderAchievements();
    renderSubjectProgress();
    renderRecentResults();
}


/* =========================================================
   LAST 7 DAYS
========================================================= */

function renderLastSevenDays() {

    const container =
        document.getElementById(
            "weeklyChart"
        );


    if (!container) return;


    const days = [];


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setHours(
            0,
            0,
            0,
            0
        );


        date.setDate(
            date.getDate() - i
        );


        const key =
            getLocalDateKey(
                date
            );


        const results =
            state.history.filter(
                result =>
                    getLocalDateKey(
                        new Date(
                            result.date
                        )
                    ) === key
            );


        const best =
            results.length
                ? Math.max(
                    ...results.map(
                        result =>
                            result.percentage
                    )
                )
                : 0;


        const questions =
            results.reduce(
                (sum, result) =>
                    sum +
                    Number(
                        result.questionCount ||
                        0
                    ),
                0
            );


        days.push({
            date,
            best,
            questions
        });
    }


    container.innerHTML =
        days
            .map(
                day => {

                    const height =
                        day.best > 0
                            ? Math.max(
                                day.best,
                                4
                            )
                            : 4;


                    return `

                        <div class="chart-day">

                            <span class="chart-score">
                                ${
                                    day.best > 0
                                        ? `${day.best}%`
                                        : "—"
                                }
                            </span>

                            <div
                                class="chart-bar"
                                style="
                                    height:${height}%;
                                "
                                title="${
                                    day.questions
                                } questions"
                            ></div>

                            <span class="chart-label">
                                ${day.date.toLocaleDateString(
                                    undefined,
                                    {
                                        weekday:
                                            "short"
                                    }
                                )}
                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   SUBJECT PROGRESS
========================================================= */

function renderSubjectProgress() {

    const container =
        document.getElementById(
            "subjectProgressContainer"
        );


    if (!container) return;


    const subjects = [
        "Biology",
        "Chemistry",
        "Mathematics",
        "Physics",
        "Computer Science",
        "English"
    ];


    container.innerHTML =
        subjects
            .map(
                subject => {

                    const results =
                        state.history.filter(
                            result =>
                                result.subjects &&
                                result.subjects.includes(
                                    subject
                                )
                        );


                    const average =
                        results.length
                            ? Math.round(
                                results.reduce(
                                    (
                                        sum,
                                        result
                                    ) =>
                                        sum +
                                        result.percentage,
                                    0
                                ) /
                                results.length
                            )
                            : 0;


                    return `

                        <div
                            class="subject-progress-item"
                        >

                            <div
                                class="subject-progress-header"
                            >

                                <span>
                                    ${subject}
                                </span>

                                <strong>
                                    ${average}%
                                </strong>

                            </div>


                            <div
                                class="subject-progress-track"
                            >

                                <div
                                    class="subject-progress-fill"
                                    style="
                                        width:${average}%;
                                    "
                                ></div>

                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   RECENT RESULTS
========================================================= */

function renderRecentResults() {

    const container =
        document.getElementById(
            "recentResultsContainer"
        );


    if (!container) return;


    const recent =
        [...state.history]
            .reverse()
            .slice(
                0,
                8
            );


    if (!recent.length) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    📚
                </div>

                <h3>
                    No quiz results yet
                </h3>

                <p>
                    Take your first quiz to see
                    your history here.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        recent
            .map(
                result => `

                    <div class="recent-result">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    result.subjects.join(
                                        ", "
                                    )
                                )}
                            </strong>

                            <small>
                                ${new Date(
                                    result.date
                                ).toLocaleDateString()}
                            </small>

                        </div>


                        <strong>
                            ${result.percentage}%
                        </strong>

                    </div>
                `
            )
            .join("");
}


/* =========================================================
   STREAK
========================================================= */

function calculateStreak() {

    if (
        !state.history.length
    ) {
        return 0;
    }


    const uniqueDates =
        [
            ...new Set(
                state.history.map(
                    result =>
                        getLocalDateKey(
                            new Date(
                                result.date
                            )
                        )
                )
            )
        ]
        .sort()
        .reverse();


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let streak = 0;


    for (
        let i = 0;
        i < uniqueDates.length;
        i++
    ) {

        const expected =
            new Date(
                today
            );


        expected.setDate(
            today.getDate() - i
        );


        const expectedKey =
            getLocalDateKey(
                expected
            );


        if (
            uniqueDates[i] ===
            expectedKey
        ) {

            streak++;

        } else {

            break;
        }
    }


    return streak;
}


function getLocalDateKey(
    date
) {

    return [
        date.getFullYear(),
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        ),
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )
    ].join("-");
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function checkAchievements(
    result
) {

    const unlocked =
        new Set(
            state.achievements
        );


    /*
       First Quiz
    */

    if (
        state.history.length >= 1
    ) {

        unlocked.add(
            "first-quiz"
        );
    }


    /*
       Perfect Score
    */

    if (
        result.percentage === 100
    ) {

        unlocked.add(
            "perfect-score"
        );
    }


    /*
       Quiz Explorer
    */

    const subjects =
        new Set();


    state.history.forEach(
        historyResult => {

            (
                historyResult.subjects ||
                []
            ).forEach(
                subject =>
                    subjects.add(
                        subject
                    )
            );
        }
    );


    if (
        subjects.size >= 3
    ) {

        unlocked.add(
            "quiz-explorer"
        );
    }


    /*
       Consistent Learner
    */

    if (
        calculateStreak() >= 5
    ) {

        unlocked.add(
            "consistent-learner"
        );
    }


    /*
       Mistake Master
       Unlock when user completes a
       practice quiz after mistakes.
    */

    const hasPracticeAfterMistakes =
        state.history.some(
            historyResult =>
                historyResult.mode ===
                    "practice" &&
                historyResult.questionCount >
                    0
        );


    const hasMistakes =
        state.history.some(
            historyResult =>
                historyResult.incorrect >
                0
        );


    if (
        hasPracticeAfterMistakes &&
        hasMistakes
    ) {

        unlocked.add(
            "mistake-master"
        );
    }


    state.achievements =
        [...unlocked];
}


function renderAchievements() {

    const container =
        document.getElementById(
            "achievementsContainer"
        );


    if (!container) return;


    const achievements = [

        {
            id:
                "first-quiz",

            icon:
                "🎓",

            title:
                "First Quiz",

            description:
                "Complete your first quiz."
        },

        {
            id:
                "perfect-score",

            icon:
                "💯",

            title:
                "Perfect Score",

            description:
                "Get 100% on a quiz."
        },

        {
            id:
                "quiz-explorer",

            icon:
                "🌎",

            title:
                "Quiz Explorer",

            description:
                "Practice at least 3 subjects."
        },

        {
            id:
                "consistent-learner",

            icon:
                "🔥",

            title:
                "Consistent Learner",

            description:
                "Maintain a 5-day quiz streak."
        },

        {
            id:
                "mistake-master",

            icon:
                "🧠",

            title:
                "Mistake Master",

            description:
                "Practice questions after making mistakes."
        }
    ];


    container.innerHTML =
        achievements
            .map(
                achievement => {

                    const unlocked =
                        state.achievements.includes(
                            achievement.id
                        );


                    return `

                        <div
                            class="
                                achievement-card
                                ${
                                    unlocked
                                        ? "unlocked"
                                        : "locked"
                                }
                            "
                        >

                            <div
                                class="achievement-icon"
                            >
                                ${
                                    achievement.icon
                                }
                            </div>

                            <strong>
                                ${
                                    achievement.title
                                }
                            </strong>

                            <p>
                                ${
                                    achievement.description
                                }
                            </p>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   PERSONAL BEST
========================================================= */

function getPersonalBest() {

    if (
        !state.history.length
    ) {
        return 0;
    }


    return Math.max(
        ...state.history.map(
            result =>
                Number(
                    result.percentage || 0
                )
        )
    );
}


/* =========================================================
   SETTINGS
========================================================= */

function setupSettings() {

    const settingsBackBtn =
        document.getElementById(
            "settingsBackBtn"
        );


    if (settingsBackBtn) {

        settingsBackBtn.addEventListener(
            "click",
            () => showPage("home")
        );
    }


    setupThemeControls();


    const resetProgressBtn =
        document.getElementById(
            "resetProgressBtn"
        );


    if (resetProgressBtn) {

        resetProgressBtn.addEventListener(
            "click",
            resetProgress
        );
    }
}


function resetProgress() {

    const confirmed =
        confirm(
            "Are you sure you want to reset all quiz progress, saved questions, achievements, and streak data?"
        );


    if (!confirmed) {
        return;
    }


    state.history =
        [];

    state.savedQuestions =
        [];

    state.achievements =
        [];


    localStorage.removeItem(
        STORAGE_KEY
    );


    saveState();


    updateDashboard();
    renderSavedQuestions();


    showToast(
        "All progress has been reset."
    );
}


/* =========================================================
   SHARE MODAL
========================================================= */

function setupShareModal() {

    const closeButton =
        document.getElementById(
            "closeShareModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeShareModal
        );
    }


    const copyButton =
        document.getElementById(
            "copyShareLinkBtn"
        );


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            () => {

                const shareURL =
                    createShareURL();

                copyToClipboard(
                    shareURL
                );

                showToast(
                    "Share link copied! 🔗"
                );
            }
        );
    }


    const nativeShareBtn =
        document.getElementById(
            "nativeShareBtn"
        );


    if (nativeShareBtn) {

        nativeShareBtn.addEventListener(
            "click",
            () =>
                handleShare(
                    "native"
                )
        );
    }


    document
        .querySelectorAll(
            ".share-buttons [data-share]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    handleShare(
                        button.dataset.share
                    );
                }
            );
        });


    const modal =
        document.getElementById(
            "shareModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    closeShareModal();
                }
            }
        );
    }
}


function openShareModal() {

    const modal =
        document.getElementById(
            "shareModal"
        );


    if (!modal) return;


    renderSharePreview();


    /*
       Current HTML starts with class="hidden".
       Remove hidden when opening.
    */

    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "active"
    );
}


function closeShareModal() {

    const modal =
        document.getElementById(
            "shareModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );

    modal.classList.add(
        "hidden"
    );
}


function getLatestResult() {

    return state.history[
        state.history.length - 1
    ];
}


function getShareText() {

    const result =
        getLatestResult();


    if (!result) {

        return (
            "I just completed a quiz " +
            "on Student Quiz! 🎓"
        );
    }


    return (
        `I scored ${result.percentage}% ` +
        `on a ${result.subjects.join(
            ", "
        )} quiz on Student Quiz! 🎓`
    );
}


function createShareURL() {

    const result =
        getLatestResult();


    const base =
        window.location.href.split(
            "#"
        )[0];


    if (!result) {
        return base;
    }


    const data = {
        score:
            result.percentage,

        correct:
            result.correct,

        total:
            result.questionCount,

        subjects:
            result.subjects
    };


    return (
        base +
        "#result=" +
        encodeURIComponent(
            JSON.stringify(data)
        )
    );
}


function renderSharePreview() {

    const container =
        document.getElementById(
            "shareCardPreview"
        );


    if (!container) return;


    const result =
        getLatestResult();


    if (!result) {

        container.innerHTML = `
            <strong>
                Student Quiz
            </strong>
            <p>
                Complete a quiz to share your result.
            </p>
        `;

        return;
    }


    container.innerHTML = `

        <div
            style="
                font-size:40px;
                margin-bottom:10px;
            "
        >
            ${state.emojiTheme}
        </div>

        <strong>
            Student Quiz Result
        </strong>

        <div
            style="
                font-size:48px;
                font-weight:900;
                color:var(--primary);
                margin:10px 0;
            "
        >
            ${result.percentage}%
        </div>

        <p>
            ${result.correct} /
            ${result.questionCount}
            correct
        </p>

        <p>
            ${escapeHTML(
                result.subjects.join(", ")
            )}
        </p>
    `;
}


async function handleShare(
    platform
) {

    const text =
        getShareText();


    const url =
        createShareURL();


    if (
        platform === "native"
    ) {

        if (
            navigator.share
        ) {

            try {

                await navigator.share({
                    title:
                        "My Quiz Result",

                    text:
                        text,

                    url:
                        url
                });

            } catch (error) {

                console.log(
                    "Share cancelled."
                );
            }

        } else {

            copyToClipboard(
                `${text} ${url}`
            );

            showToast(
                "Result copied to clipboard!"
            );
        }

        return;
    }


    let shareURL =
        "";


    const encodedText =
        encodeURIComponent(
            text
        );


    const encodedURL =
        encodeURIComponent(
            url
        );


    switch (platform) {

        case "whatsapp":

            shareURL =
                `https://wa.me/?text=${encodedText}%20${encodedURL}`;

            break;


        case "facebook":

            shareURL =
                `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;

            break;


        case "x":

            shareURL =
                `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedURL}`;

            break;


        case "linkedin":

            shareURL =
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`;

            break;


        case "telegram":

            shareURL =
                `https://t.me/share/url?url=${encodedURL}&text=${encodedText}`;

            break;


        case "reddit":

            shareURL =
                `https://www.reddit.com/submit?url=${encodedURL}&title=${encodedText}`;

            break;
    }


    if (shareURL) {

        window.open(
            shareURL,
            "_blank",
            "noopener,noreferrer"
        );
    }
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            state.currentPage !==
            "quiz"
        ) {
            return;
        }


        /*
           Don't hijack keyboard while
           typing in an input.
        */

        const tag =
            event.target.tagName;

        if (
            tag === "INPUT" ||
            tag === "TEXTAREA"
        ) {
            return;
        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousQuestion();

            return;
        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextQuestion();

            return;
        }


        if (
            ["1", "2", "3", "4"]
                .includes(
                    event.key
                )
        ) {

            selectAnswer(
                Number(
                    event.key
                ) - 1
            );
        }
    }
);


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function shuffleArray(
    array
) {

    const shuffled =
        [...array];


    for (
        let i =
            shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] =
        [
            shuffled[j],
            shuffled[i]
        ];
    }


    return shuffled;
}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;
    }
}


function formatTime(
    totalSeconds
) {

    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    return (
        `${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(
            2,
            "0"
        )}`
    );
}


function copyToClipboard(
    text
) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(text)
            .catch(
                () =>
                    fallbackCopy(
                        text
                    )
            );

        return;
    }


    fallbackCopy(
        text
    );
}


function fallbackCopy(
    text
) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );

    } catch (error) {

        console.error(
            "Copy failed:",
            error
        );
    }


    textarea.remove();
}
 function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(
        window.toastTimeout
    );

    window.toastTimeout =
        setTimeout(
            () => {
                toast.classList.remove(
                    "show"
                );
            },
            2500
        );
}

function escapeHTML(
    value
) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


function capitalize(
    text
) {

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
}


/* =========================================================
   INITIAL SETUP AFTER DOM EXISTS
========================================================= */

resetSetupSelections();
