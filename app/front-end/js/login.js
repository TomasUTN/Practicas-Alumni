import { API_BASE_URL } from "./config.js";
import { inicializarVistaAdmin } from './set_visual.js';


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
    const adminItem = document.createElement("li");

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

        if (data.rol === "admin") {
            const navLinks = document.getElementById("nav-links");
            const adminLink = document.createElement("a");
            adminLink.id = "admin_button";
            adminLink.href = "#";
            adminLink.textContent = "ADMINISTRADOR";
            adminItem.appendChild(adminLink);
            navLinks.appendChild(adminItem);
            inicializarVistaAdmin();
        };


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


    function actualizarBotonAuth() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const logoutMenu = document.getElementById("logout-menu");
    const logoutBtn = document.getElementById("logout-btn");

    if (token && email) {   
        // Mostrar el email como texto principal
        authBtn.textContent = email;

        // Mostrar u ocultar el menú al hacer clic en el email
        authBtn.onclick = () => {
        logoutMenu.classList.toggle("hidden");
        };

        // Acción al presionar el botón de "Cerrar sesión"
        logoutBtn.onclick = async () => {
        try {
            const response = await fetch(API_BASE_URL + "/login/logout", {
            method: "POST",
            headers: { Authorization: "Bearer " + token },
            });

            if (response.ok) {
            localStorage.clear();
            window.location.hash = 'inicio';
            if (adminItem){
                adminItem.remove();
            }

            logoutMenu.classList.add("hidden");
            alert("Sesión cerrada correctamente 👋");
            actualizarBotonAuth();
            } else {
            alert("Error al cerrar sesión");
            }
        } catch (err) {
            console.error("Error en logout:", err);
        }
        };
    } else {
        // Si el usuario no está logueado
        authBtn.textContent = "Registrarse / Iniciar Sesión";
        authBtn.onclick = () => {
        modal.classList.remove("hidden");
        };
        logoutMenu.classList.add("hidden");
    }
    }


    // Llamar al cargar la página
    actualizarBotonAuth();
}