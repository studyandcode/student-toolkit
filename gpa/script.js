function addCourse() {

    const courses = document.getElementById("courses");

    const course = document.createElement("div");

    course.className = "course";

    course.innerHTML = `
        <input type="text" placeholder="Subject">

        <input type="number" placeholder="Credits" min="1">

        <select>
            <option value="">Grade</option>
            <option value="4.0">A</option>
            <option value="3.7">A-</option>
            <option value="3.3">B+</option>
            <option value="3.0">B</option>
            <option value="2.7">B-</option>
            <option value="2.3">C+</option>
            <option value="2.0">C</option>
            <option value="1.7">C-</option>
            <option value="1.3">D+</option>
            <option value="1.0">D</option>
            <option value="0.0">F</option>
        </select>
    `;

    courses.appendChild(course);
}


function calculateGPA() {

    const courses = document.querySelectorAll(".course");

    let totalQualityPoints = 0;
    let totalCredits = 0;

    for (let course of courses) {

        const credits =
            parseFloat(course.querySelector("input[type='number']").value);

        const grade =
            parseFloat(course.querySelector("select").value);

        if (isNaN(credits) || isNaN(grade)) {
            continue;
        }

        totalQualityPoints += credits * grade;

        totalCredits += credits;
    }

    const result = document.getElementById("result");

    if (totalCredits === 0) {

        result.textContent =
            "Please enter your course information.";

        return;
    }

    const gpa = totalQualityPoints / totalCredits;

    result.textContent =
        "Your GPA is " + gpa.toFixed(2);
}


function resetCalculator() {

    document.getElementById("courses").innerHTML = `
        <div class="course">

            <input type="text" placeholder="Subject">

            <input type="number" placeholder="Credits" min="1">

            <select>
                <option value="">Grade</option>
                <option value="4.0">A</option>
                <option value="3.7">A-</option>
                <option value="3.3">B+</option>
                <option value="3.0">B</option>
                <option value="2.7">B-</option>
                <option value="2.3">C+</option>
                <option value="2.0">C</option>
                <option value="1.7">C-</option>
                <option value="1.3">D+</option>
                <option value="1.0">D</option>
                <option value="0.0">F</option>
            </select>

        </div>
    `;

    document.getElementById("result").textContent = "";
}
