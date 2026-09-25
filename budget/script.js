const expenseCategories = [
    {
        id: "housing",
        name: "Housing"
    },
    {
        id: "food",
        name: "Food"
    },
    {
        id: "transport",
        name: "Transportation"
    },
    {
        id: "books",
        name: "Books & Supplies"
    },
    {
        id: "phone",
        name: "Phone & Internet"
    },
    {
        id: "entertainment",
        name: "Entertainment"
    },
    {
        id: "shopping",
        name: "Shopping"
    },
    {
        id: "other",
        name: "Other"
    }
];


function calculateBudget() {

    const currency =
        document.getElementById("currency").value;

    const income =
        parseFloat(document.getElementById("income").value) || 0;


    let totalExpenses = 0;

    let categoryData = [];


    for (let category of expenseCategories) {

        const spent =
            parseFloat(
                document.getElementById(category.id).value
            ) || 0;

        const budget =
            parseFloat(
                document.getElementById(category.id + "Budget").value
            ) || 0;


        totalExpenses += spent;


        categoryData.push({
            name: category.name,
            spent: spent,
            budget: budget
        });
    }


    const remaining =
        income - totalExpenses;


    let percentage = 0;


    if (income > 0) {
        percentage =
            (totalExpenses / income) * 100;
    }


    document.getElementById("totalIncome").textContent =
        currency + income.toFixed(2);


    document.getElementById("totalExpenses").textContent =
        currency + totalExpenses.toFixed(2);


    document.getElementById("remaining").textContent =
        currency + remaining.toFixed(2);


    document.getElementById("percentage").textContent =
        percentage.toFixed(1) + "%";


    updateStatus(
        income,
        totalExpenses,
        categoryData
    );


    updateBreakdown(
        currency,
        totalExpenses,
        categoryData
    );
}


function updateStatus(
    income,
    totalExpenses,
    categoryData
) {

    const status =
        document.getElementById("status");


    if (income === 0) {

        status.textContent =
            "Please enter your monthly income.";

        return;
    }


    if (totalExpenses > income) {

        status.textContent =
            "Over Budget";

        return;
    }


    const categoryOverLimit =
        categoryData.some(
            category =>
                category.budget > 0 &&
                category.spent > category.budget
        );


    if (categoryOverLimit) {

        status.textContent =
            "Some categories are over their budget limits.";

        return;
    }


    if (totalExpenses >= income * 0.8) {

        status.textContent =
            "Almost at Budget";

        return;
    }


    status.textContent =
        "Under Budget";
}


function updateBreakdown(
    currency,
    totalExpenses,
    categoryData
) {

    const breakdown =
        document.getElementById("breakdown");


    if (totalExpenses === 0) {

        breakdown.innerHTML = `
            <p class="empty-message">
                No expenses entered yet.
            </p>
        `;

        return;
    }


    let html = "";


    for (let category of categoryData) {

        if (category.spent === 0) {
            continue;
        }


        const percentage =
            (category.spent / totalExpenses) * 100;


        let width =
            Math.min(percentage, 100);


        let limitMessage = "";


        if (
            category.budget > 0 &&
            category.spent > category.budget
        ) {

            limitMessage =
                " • Over limit";
        }


        html += `

            <div class="breakdown-item">

                <div class="breakdown-header">

                    <span>
                        ${category.name}
                    </span>

                    <span>
                        ${currency}${category.spent.toFixed(2)}
                        (${percentage.toFixed(1)}%)
                        ${limitMessage}
                    </span>

                </div>


                <div class="bar-background">

                    <div
                        class="bar"
                        style="width: ${width}%"
                    ></div>

                </div>

            </div>
        `;
    }


    breakdown.innerHTML = html;
}


function resetPlanner() {

    document.getElementById("income").value = "";

    document.getElementById("currency").value = "$";


    for (let category of expenseCategories) {

        document.getElementById(category.id).value = "";

        document.getElementById(
            category.id + "Budget"
        ).value = "";
    }


    document.getElementById("totalIncome").textContent =
        "$0.00";


    document.getElementById("totalExpenses").textContent =
        "$0.00";


    document.getElementById("remaining").textContent =
        "$0.00";


    document.getElementById("percentage").textContent =
        "0%";


    document.getElementById("status").textContent =
        "Enter your income and expenses to see your budget status.";


    document.getElementById("breakdown").innerHTML = `
        <p class="empty-message">
            Calculate your budget to see your spending breakdown.
        </p>
    `;
}
