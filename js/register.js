const form = document.querySelector(".register-box");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // ambil semua user
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // cek username sudah ada
    const userExists = users.find(user => user.username === username);

    if (userExists) {

        Swal.fire({
            icon: "error",
            title: "Username Sudah Ada!",
            text: "Gunakan username lain.",
            confirmButtonColor: "#1e3c72"
        });

        return;
    }

    // cek password
    if (password !== confirmPassword) {

        Swal.fire({
            icon: "error",
            title: "Password Tidak Sama!",
            text: "Konfirmasi password salah.",
            confirmButtonColor: "#1e3c72"
        });

        return;
    }

    // tambah user baru
    users.push({
        nama,
        username,
        password
    });

    // simpan semua user
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
        icon: "success",
        title: "Register Berhasil!",
        text: "Silakan login.",
        confirmButtonColor: "#1e3c72"
    }).then(() => {

        window.location.href = "./login.html";

    });

});