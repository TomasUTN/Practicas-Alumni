
const API_BASE_URL = "http://127.0.0.1:8000";  //aca ponele lo del archivo de configuracion la url que tenes ahi


///////////////// UNION PARA CREAR SOCIOS DESDE EL BACK /////////////////

// Convierte fechas de YYYY-MM-DD a DD/MM/YYYY
function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

const asociateForm = document.getElementById('asociate-form'); //crea el formulario de envio

fetch('http://127.0.0.1:8000/member_type/')
  .then(response => response.json())
  .then(data => {
    const select = document.getElementById('member_type');
    select.innerHTML = '';
    data.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.id; // otorga el valor al seleccionar un campo
      option.text = tipo.name; // muestra esto en la lista desplegable
      select.appendChild(option);
    });
  });

asociateForm.addEventListener("submit", async (e) => {
  e.preventDefault();



  const formData = new FormData(asociateForm);

  formData.set("date_of_birth", formatDateToDDMMYYYY(formData.get("date_of_birth")));
  formData.set("date_of_up", formatDateToDDMMYYYY(formData.get("date_of_up")));
  formData.set("last_pay", formatDateToDDMMYYYY(formData.get("last_pay")));

    // estas lineas son para ver desde la consola en el navegador los datos que se envian
  for(let [key,value] of formData.entries()){
    console.log(`${key}: ${value}`)
  }

    try {
      const response = await fetch(`${API_BASE_URL}/member/create`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Error en el registro");

      const data = await response.json();
      alert(`Registro ok:  ${data.name} ${data.surname}`);

      asociateForm.reset();
      formContainer.classList.add("hidden");
    } catch (error) {
      alert("No se pudo registrar: " + error.message);
    }
});

///////// UNION PARA CREAR NUEVOS USUARIOS /////////////
const register_form = document.getElementById('register-form'); //crea el formulario de envio

///fetch('http://127.0.0.1:8000/user/create')
///  .then(response => response.json())

register_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: register_form.querySelector('input[type="email"]').value,
    password: register_form.querySelector('input[type="password"]').value,
    repeat_password: registerForm.querySelector('input[id="repeat_pass"]').value,
    rol: "client" // valor fijo o dinámico
  };
  
    // estas lineas son para ver desde la consola en el navegador los datos que se envian
  for(let key in data){
    console.log(`${key}: ${data[key]}`)
  }

    try {
      const response = await fetch(`${API_BASE_URL}/user/create`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)

      });

      if (!response.ok) throw new Error("Error en el registro");
      
      const result = await response.json();
      alert(`Registro ok:  usuario: ${result.email}  rol asignado: ${result.rol}`);

      register_form.reset();
      formContainer.classList.add("hidden");
    } catch (error) {
      alert("No se pudo registrar: " + error.message);
    }
});


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

// Inicializar DataTable
$(document).ready(function() {
  $('#tablaUsuarios').DataTable({
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
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
