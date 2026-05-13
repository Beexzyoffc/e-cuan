const form =
  document.querySelector(".login-box");

form.addEventListener(
  "submit",
  function (e) {

    e.preventDefault();

    const username =
      document.getElementById("username").value;

    const password =
      document.getElementById("password").value;

    let users = JSON.parse(
      localStorage.getItem("users")
    ) || [];

    const validUser = users.find(
      user =>
        user.username === username &&
        user.password === password
    );

    if (validUser) {

      // SIMPAN USER LOGIN
      localStorage.setItem(
        "loggedInUser",
        validUser.username
      );

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: `Selamat datang ${validUser.username}`,
        confirmButtonColor: "#2563eb"
      }).then(() => {

        window.location.href =
          "dashboard.html";

      });

    } else {

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Username atau password salah",
        confirmButtonColor: "#2563eb"
      });

    }

  }
);