const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Formulario de asociación
const asociateBtn = document.getElementById('asociate-btn');
const formContainer = document.getElementById('form-container');
asociateBtn.addEventListener('click', () => {
  formContainer.classList.toggle('hidden');
});

// Modal de login/registro
const authBtn = document.getElementById('auth-btn');
const authModal = document.getElementById('auth-modal');
const closeModal = document.getElementById('close-modal');

authBtn.addEventListener('click', () => {
  authModal.classList.remove('hidden');
});
closeModal.addEventListener('click', () => {
  authModal.classList.add('hidden');
});
window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.add('hidden');
  }
});

// Tabs
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

loginTab.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
});
registerTab.addEventListener('click', () => {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
});

// Barra de ADMINS
document.addEventListener("DOMContentLoaded", () => {
  // Submenú Administración
  const adminLink = document.querySelector(".has-submenu > a");
  adminLink.addEventListener("click", (event) => {
    event.preventDefault();
    const submenu = adminLink.nextElementSibling;
    submenu.style.display = submenu.style.display === "block" ? "none" : "block";
  });

  // Vista Admins
  const adminBtn = document.querySelector('.nav-links li:last-child a'); // ADMINISTRADOR
  const adminContainer = document.querySelector(".admin-container");
  const publicView = document.getElementById("publicView");

  // Mostrar solo Admin
  adminBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Ocultamos la vista pública
    publicView.style.display = "none";

    // Mostramos admin
    adminContainer.style.display = "flex";
    adminContainer.classList.add("flex");
    // Quitar cualquier contenido previo
    const contenido = document.querySelector(".contenido");
    contenido.style.display = "none";
    document.querySelectorAll(".seccion-admin").forEach(sec => sec.style.display = "none");

    // Volvemos a mostrar solo el fondo de bienvenida
    const fondoAdmin = document.getElementById("fondo-admin");
    if (fondoAdmin) fondoAdmin.style.display = "flex";
    
    // Fondo especial (opcional)
    document.body.style.backgroundImage = "url('statics-front/fondo_admin.jpg')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    
  });
 const sidebarInicio = document.getElementById("sidebarInicio");
  if (sidebarInicio) {
    sidebarInicio.addEventListener("click", (event) => {
      event.preventDefault();

      // Resetear contenido
      const contenido = document.querySelector(".contenido");
      contenido.style.display = "none";
      document.querySelectorAll(".seccion-admin").forEach(sec => sec.style.display = "none");

      // Mostrar fondo
      const fondoAdmin = document.getElementById("fondo-admin");
      if (fondoAdmin) fondoAdmin.style.display = "flex";

      // Mantener fondo admin
      document.body.style.backgroundImage = "url('statics-front/fondo_admin.jpg')";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    });
  }

  // Volver a vista pública al presionar cualquier otro link del navbar
  const navLinks = document.querySelectorAll(".nav-links li a");
  navLinks.forEach((link) => {
    if (link !== adminBtn) { // ignoramos ADMINISTRADOR
      link.addEventListener("click", () => {
        // Ocultar admin
        adminContainer.style.display = "none";
        adminContainer.classList.remove("flex");

        // Mostrar vista pública
        publicView.style.display = "block";

        // Quitar fondo admin
        document.body.style.backgroundImage = "";
      });
    }
  });
});


// Función para mostrar/ocultar secciones
function mostrarSeccion(id) {
  const contenido = document.querySelector(".contenido");
  
  // mostrar contenedor de contenido
  contenido.style.display = "block";

  // ocultar todas las secciones
  document.querySelectorAll(".seccion-admin").forEach(sec => sec.style.display = "none");
  
  // mostrar solo la seleccionada
  document.getElementById(id).style.display = "block";
}

// carrusel
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const items = Array.from(track.children);
  const nextBtn = document.querySelector(".arrow.right");
  const prevBtn = document.querySelector(".arrow.left");

  let index = 0;

  function updateCarousel() {
    items.forEach((item, i) => item.classList.remove("active"));
    items[index].classList.add("active");

    const offset = -index * (items[0].offsetWidth + 20); // mover según el ancho real + margen
    track.style.transform = `translateX(${offset}px)`;
  }

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % items.length;
    updateCarousel();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + items.length) % items.length;
    updateCarousel();
  });

  // Auto-slide
  setInterval(() => {
    index = (index + 1) % items.length;
    updateCarousel();
  }, 8000);

  updateCarousel(); // inicial
});

window.mostrarSeccion = function(id) {
  const contenido = document.querySelector(".contenido");
  
  // mostrar contenedor de contenido
  contenido.style.display = "block";

  // ocultar todas las secciones
  document.querySelectorAll(".seccion-admin").forEach(sec => sec.style.display = "none");
  
  // mostrar solo la seleccionada
  document.getElementById(id).style.display = "block";
};