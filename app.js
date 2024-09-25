let categories = [];
let transactions = [];
let monthlyIncome = 0;
let monthlyExpenses = 0;
let incomeGoal = 0;
let expensesGoal = 0;

// DOM Elements
const incomeForm = document.getElementById('income-form');
const expenseForm = document.getElementById('expense-form');
const categoryForm = document.getElementById('category-form');
const expenseCategorySelect = document.getElementById('expense-category');
const incomeSourceInput = document.getElementById('income-source');
const incomeAmountInput = document.getElementById('income-amount');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const categoryNameInput = document.getElementById('category-name');
const transactionHistoryTable = document.getElementById('transaction-history').getElementsByTagName('tbody')[0];

const goalForm = document.getElementById('goal-form');
const goalIncomeInput = document.getElementById('goal-income');
const goalExpensesInput = document.getElementById('goal-expenses');
const incomeGoalDisplay = document.getElementById('income-goal-display');
const expensesGoalDisplay = document.getElementById('expenses-goal-display');

const incomeProgressBar = document.getElementById('income-progress-bar');
const expensesProgressBar = document.getElementById('expenses-progress-bar');

// Function to update progress bars
function updateProgressBars() {
    const incomeProgress = (monthlyIncome / incomeGoal) * 100;
    incomeProgressBar.style.width = `${Math.min(incomeProgress, 100)}%`;

    const expenseProgress = (monthlyExpenses / expensesGoal) * 100;
    expensesProgressBar.style.width = `${Math.min(expenseProgress, 100)}%`;
}

// Function to update transaction history
function updateTransactionHistory() {
    transactionHistoryTable.innerHTML = '';
    transactions.forEach(transaction => {
        const row = transactionHistoryTable.insertRow();
        row.insertCell(0).innerHTML = transaction.date;
        row.insertCell(1).innerHTML = transaction.type;
        row.insertCell(2).innerHTML = transaction.category || 'N/A';
        row.insertCell(3).innerHTML = transaction.details;
        row.insertCell(4).innerHTML = transaction.amount;
    });
}

// Function to update monthly totals
function updateMonthlyTotals() {
    monthlyIncome = 0;
    monthlyExpenses = 0;

    const currentMonth = new Date().getMonth();

    transactions.forEach(transaction => {
        const transactionMonth = new Date(transaction.date).getMonth();

        if (transactionMonth === currentMonth) {
            if (transaction.type === 'Income') {
                monthlyIncome += parseFloat(transaction.amount);
            } else if (transaction.type === 'Expense') {
                monthlyExpenses += parseFloat(transaction.amount);
                // Update category totals
                const categoryObj = categories.find(cat => cat.name === transaction.category);
                if (categoryObj) {
                    categoryObj.totalAmount += parseFloat(transaction.amount);
                }
            }
        }
    });

    updateProgressBars();
}

// Handle setting goals
goalForm.addEventListener('submit', function(event) {
    event.preventDefault();

    incomeGoal = parseFloat(goalIncomeInput.value);
    expensesGoal = parseFloat(goalExpensesInput.value);

    incomeGoalDisplay.textContent = incomeGoal.toFixed(2);
    expensesGoalDisplay.textContent = expensesGoal.toFixed(2);

    updateProgressBars();

    goalIncomeInput.value = '';
    goalExpensesInput.value = '';
});

// Handle category submission
categoryForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const categoryName = categoryNameInput.value.trim();

    if (categoryName && !categories.some(category => category.name === categoryName)) {
        categories.push({ name: categoryName, totalAmount: 0 });
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        expenseCategorySelect.appendChild(option);
        categoryNameInput.value = '';
    } else {
        alert('Category already exists or is invalid.');
    }
});

// Handle income submission
incomeForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const source = incomeSourceInput.value.trim();
    const amount = parseFloat(incomeAmountInput.value);

    if (source && !isNaN(amount)) {
        transactions.push({
            date: new Date().toISOString().split('T')[0],
            type: 'Income',
            category: null,
            details: source,
            amount: amount
        });

        updateMonthlyTotals();
        updateTransactionHistory();
        incomeSourceInput.value = '';
        incomeAmountInput.value = '';
    } else {
        alert('Please enter a valid source and amount.');
    }
});

// Handle expense submission
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategorySelect.value;

    if (name && !isNaN(amount) && category) {
        transactions.push({
            date: new Date().toISOString().split('T')[0],
            type: 'Expense',
            category: category,
            details: name,
            amount: amount
        });

        updateMonthlyTotals();
        updateTransactionHistory();
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        expenseCategorySelect.value = '';
    } else {
        alert('Please enter a valid expense name, amount, and category.');
    }
});
