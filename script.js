// ================================
// THEME PANEL
// ================================

const themeButton =
    document.getElementById("themeButton");

const themePanel =
    document.getElementById("themePanel");


themeButton.addEventListener("click", function () {

    themePanel.classList.toggle("show");

});


// ================================
// LIGHT / DARK MODE
// ================================

function setMode(mode) {

    if (mode === "dark") {

        document.body.classList.add("dark");

        themeButton.textContent = "☀️";

        localStorage.setItem(
            "themeMode",
            "dark"
        );

    } else {

        document.body.classList.remove("dark");

        themeButton.textContent = "🌙";

        localStorage.setItem(
            "themeMode",
            "light"
        );

    }
}


// ================================
// ACCENT COLOR
// ================================

function setAccent(color) {

    document.documentElement.style
        .setProperty("--accent", color);

    localStorage.setItem(
        "accentColor",
        color
    );
}


// ================================
// LOAD SAVED THEME
// ================================

const savedMode =
    localStorage.getItem("themeMode");

const savedAccent =
    localStorage.getItem("accentColor");


if (savedMode === "dark") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️";

}


if (savedMode === "light") {

    document.body.classList.remove("dark");

    themeButton.textContent = "🌙";

}


if (savedAccent) {

    document.documentElement.style
        .setProperty(
            "--accent",
            savedAccent
        );

}


// ================================
// OPEN STUDENT TOOLS
// ================================

function openTool(tool) {

    if (tool === "gpa") {

        window.location.href = "gpa/index.html";

    }

    else if (tool === "quiz") {

        window.location.href = "quiz/index.html";

    }

    else if (tool === "planner") {

        window.location.href = "planner/index.html";

    }

    else if (tool === "budget") {

        window.location.href = "budget/index.html";

    }

}