"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Shivam Sharma",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Glenn Maxwell",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// todo ---- Creating amount rows ---------------------->>>>>

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    // console.log(type);

    const html = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">3 days ago</div>
     <div class="movements__value">${mov}€</div>
   </div>
   `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

// todo --- Making shortform of names ----------------->>>>>>>>>>

const user = "Steven Thomas Williams";
const createUsername = function (accounts) {
  accounts.forEach(function (name) {
    name.username = name.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsername(accounts);

// todo Calling all functions --------------------->>>>>>>>>>>>>

const displayUi = function (currentAccount) {
  // Display Movements
  displayMovements(currentAccount.movements);
  // Display Balance
  calPrintBalance(currentAccount);
  // Display Summary
  displaySummery(currentAccount.movements, currentAccount.interestRate);
};

// todo ---- Calculating total amount ------------------>>>>>>>>>>>

const calPrintBalance = function (acc) {
  const bal = acc.movements.reduce((res, mov) => mov + res, 0);
  acc.balance = bal;
  labelBalance.textContent = `${bal}€`;
};
// calPrintBalance(account1.movements);

// todo ---- Calculating display summanry ------------------>>>>>>>>

const displaySummery = function (movement, intr) {
  const income = movement
    .filter((mov) => mov > 0)
    .reduce((ans, mov) => ans + mov);
  labelSumIn.textContent = `${income}€`;

  const out = movement
    .filter((mov) => mov < 0)
    .reduce((ans, mov) => ans + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const intrest = movement
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * intr) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((ans, mov) => ans + mov);
  labelSumInterest.textContent = `${intrest.toFixed(2)}€`;
};
// displaySummery(account1.movements);

// todo ---- Login implementation ----------------------->>>>>>>>>>>>>

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome ${currentAccount.owner}`;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    displayUi(currentAccount);
  }
});

// todo ---- transfer implementation --------------------->>>>>>>>>>

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciveAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciveAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);

    displayUi(currentAccount);
  }
});

// todo ----------------- Loan Implement -------------------->>>>>

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    displayUi(currentAccount);
  }
  inputLoanAmount.value = "";
});

// todo ------- Close Index --------------------------->>>>>>>>>>>

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const Index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(Index);

    accounts.splice(Index, 1);

    containerApp.style.opacity = 0;
  }
});

// todo ------------- Sort Button -------------------------

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
