import { API_BASE_URL } from "./config.js";

export function initLoginFunctions() {
  console.log("Login module initialized with API:", API_BASE_URL);

    //capturas necesarias del DOM
    const authBtn = document.getElementById("auth-btn");
    const modal = document.getElementById("auth-modal");
    const closeModal = document.getElementById("close-modal");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");

    authBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    });

    loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    });

    registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    });

    // LOGIN
    loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector("input[type='email']").value;
    const password = loginForm.querySelector("input[type='password']").value;

    try {
        const response = await fetch(API_BASE_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.detail);
        return;
        }

        const data = await response.json();

        // Guardar token en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("id",data.id);
        localStorage.setItem("email", data.email);
        localStorage.setItem("rol", data.rol);

        alert("Login exitoso ✅");
        modal.classList.add("hidden");
        console.log("id" , data.id,
            "email", data.email,
            "rol", data.rol,
        )

        // Cambiar texto del botón
        actualizarBotonAuth();
    } catch (err) {
        console.error("Error al iniciar sesión:", err);
    }
    });

    //
    // LOGOUT
    // 
    authBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    // Si no hay token, mostrar modal de login
    if (!token) {
        modal.classList.remove("hidden");
        return;
    }

    // Si hay token, es logout
    if (confirm("¿Deseas cerrar sesión?")) {
        try {
        const response = await fetch(API_BASE_URL + "/login/logout", {
            method: "POST",
            headers: { Authorization: "Bearer " + token },
        });

        if (response.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("rol");
            alert("Sesión cerrada correctamente 👋");
            actualizarBotonAuth();
        } else {
            alert("Error al cerrar sesión");
        }
        } catch (err) {
        console.error("Error en logout:", err);
        }
    }
    });

    function actualizarBotonAuth() {
    const token = localStorage.getItem("token");
    if (token) {
        authBtn.textContent = "Cerrar sesión";
    } else {
        authBtn.textContent = "Registrarse / Iniciar Sesión";
    }
    }

    // Llamar al cargar la página
    actualizarBotonAuth();
}