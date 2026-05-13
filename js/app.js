// js/app.js

const form =
  document.getElementById("transaction-form");

const nameInput =
  document.getElementById("name");

const amountInput =
  document.getElementById("amount");

const typeInput =
  document.getElementById("type");

const dateInput =
  document.getElementById("date");

const incomeElement =
  document.getElementById("income");

const expenseElement =
  document.getElementById("expense");

const balanceElement =
  document.getElementById("balance");

const transactionList =
  document.getElementById("transaction-list");

const emptyMessage =
  document.getElementById("empty-message");

const exportButton =
  document.getElementById("export-btn");


// ===============================
// CEK LOGIN
// ===============================

const loggedInUser =
  localStorage.getItem("loggedInUser");

if (!loggedInUser) {

  window.location.href =
    "login.html";

}


// ===============================
// PROFILE USER
// ===============================

const profileName =
  document.getElementById("profile-name");

profileName.textContent =
  loggedInUser;


// ===============================
// TRANSAKSI PER USER
// ===============================

// tiap user punya data sendiri
const transactionKey =
  `transactions_${loggedInUser}`;

// ambil data transaksi user
let transactions = JSON.parse(
  localStorage.getItem(transactionKey)
) || [];


// ===============================
// LOAD AWAL
// ===============================

renderTransactions();

updateSummary();


// ===============================
// TAMBAH TRANSAKSI
// ===============================

form.addEventListener(
  "submit",
  function (e) {

    e.preventDefault();

    const transaction = {

      id: Date.now(),

      name: nameInput.value,

      amount: Number(
        amountInput.value
      ),

      type: typeInput.value,

      date: dateInput.value

    };

    transactions.unshift(
      transaction
    );

    saveTransactions();

    renderTransactions();

    updateSummary();

    form.reset();

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text:
        "Transaksi berhasil ditambahkan",
      confirmButtonColor:
        "#2563eb"
    });

  }
);


// ===============================
// RENDER TRANSAKSI
// ===============================

function renderTransactions() {

  transactionList.innerHTML =
    "";

  if (
    transactions.length === 0
  ) {

    emptyMessage.style.display =
      "block";

    return;

  }

  emptyMessage.style.display =
    "none";

  transactions.forEach(
    (transaction) => {

      const li =
        document.createElement("li");

      li.classList.add(
        "transaction-item"
      );

      const isIncome =
        transaction.type ===
        "income";

      li.innerHTML = `
      
        <div class="transaction-left">

          <span class="transaction-name">
            ${transaction.name}
          </span>

          <span class="transaction-date">
            ${formatDate(transaction.date)}
          </span>

        </div>

        <div class="transaction-right">

          <span class="${
            isIncome
              ? "income-text"
              : "expense-text"
          }">

            ${
              isIncome
                ? "+"
                : "-"
            }

            Rp ${formatNumber(
              transaction.amount
            )}

          </span>

          <button
            class="delete-btn"
            onclick="deleteTransaction(${transaction.id})"
          >
            Hapus
          </button>

        </div>

      `;

      transactionList.appendChild(
        li
      );

    }
  );

}


// ===============================
// UPDATE SUMMARY
// ===============================

function updateSummary() {

  let income = 0;

  let expense = 0;

  transactions.forEach(
    (transaction) => {

      if (
        transaction.type ===
        "income"
      ) {

        income +=
          transaction.amount;

      } else {

        expense +=
          transaction.amount;

      }

    }
  );

  const balance =
    income - expense;

  incomeElement.textContent =
    "Rp " +
    formatNumber(income);

  expenseElement.textContent =
    "Rp " +
    formatNumber(expense);

  balanceElement.textContent =
    "Rp " +
    formatNumber(balance);

}


// ===============================
// DELETE TRANSAKSI
// ===============================

function deleteTransaction(
  id
) {

  Swal.fire({

    title:
      "Hapus transaksi?",

    text:
      "Data yang dihapus tidak bisa dikembalikan",

    icon: "warning",

    showCancelButton: true,

    confirmButtonColor:
      "#2563eb",

    cancelButtonColor:
      "#dc2626",

    confirmButtonText:
      "Ya, Hapus"

  }).then((result) => {

    if (result.isConfirmed) {

      transactions =
        transactions.filter(
          (transaction) =>
            transaction.id !==
            id
        );

      saveTransactions();

      renderTransactions();

      updateSummary();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text:
          "Transaksi berhasil dihapus",
        confirmButtonColor:
          "#2563eb"
      });

    }

  });

}


// ===============================
// SAVE TRANSAKSI
// ===============================

function saveTransactions() {

  localStorage.setItem(
    transactionKey,
    JSON.stringify(
      transactions
    )
  );

}


// ===============================
// FORMAT ANGKA
// ===============================

function formatNumber(
  number
) {

  return number.toLocaleString(
    "id-ID"
  );

}


// ===============================
// FORMAT TANGGAL
// ===============================

function formatDate(
  dateString
) {

  const options = {

    day: "numeric",

    month: "long",

    year: "numeric"

  };

  return new Date(
    dateString
  ).toLocaleDateString(
    "id-ID",
    options
  );

}


// ===============================
// EXPORT CSV
// ===============================

// ===============================
// EXPORT CSV
// ===============================

exportButton.addEventListener(
  "click",
  exportCSV
);

function exportCSV() {

  if (
    transactions.length === 0
  ) {

    Swal.fire({
      icon: "error",
      title: "Kosong",
      text:
        "Belum ada transaksi",
      confirmButtonColor:
        "#2563eb"
    });

    return;

  }

  let csv = "";

  let totalIncome = 0;

  let totalExpense = 0;

  transactions.forEach(
    (transaction, index) => {

      // hitung total

      if (
        transaction.type ===
        "income"
      ) {

        totalIncome +=
          transaction.amount;

      } else {

        totalExpense +=
          transaction.amount;

      }

      // data transaksi

      csv +=
        `Data ${index + 1}\n` +
        `Keterangan : ${transaction.name}\n` +
        `Kategori : ${
          transaction.type ===
          "income"
            ? "Pemasukan"
            : "Pengeluaran"
        }\n` +
        `Tanggal : ${transaction.date}\n` +
        `Jumlah : Rp ${formatNumber(
          transaction.amount
        )}\n\n`;

    }
  );

  // ringkasan total

  const totalSaldo =
    totalIncome - totalExpense;

  csv +=
    "====================\n" +
    "RINGKASAN\n" +
    "====================\n" +
    `Total Pemasukan : Rp ${formatNumber(totalIncome)}\n` +
    `Total Pengeluaran : Rp ${formatNumber(totalExpense)}\n` +
    `Total Saldo : Rp ${formatNumber(totalSaldo)}\n`;

  // buat file csv

  const blob = new Blob(
    [csv],
    {
      type:
        "text/csv;charset=utf-8;"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    `laporan-${loggedInUser}.csv`;

  a.click();

  Swal.fire({
    icon: "success",
    title:
      "Export berhasil",
    text:
      "CSV berhasil didownload",
    confirmButtonColor:
      "#2563eb"
  });

}


// ===============================
// LOGOUT
// ===============================

const logoutButton =
  document.getElementById(
    "logout-btn"
  );

logoutButton.addEventListener(
  "click",
  function () {

    Swal.fire({

      title: "Logout?",

      text:
        "Anda akan keluar dari akun",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor:
        "#2563eb",

      cancelButtonColor:
        "#dc2626",

      confirmButtonText:
        "Logout"

    }).then((result) => {

      if (
        result.isConfirmed
      ) {

        localStorage.removeItem(
          "loggedInUser"
        );

        window.location.href =
          "login.html";

      }

    });

  }
);