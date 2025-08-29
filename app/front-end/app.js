
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

fetch('http://127.0.0.1:8000/user/create')
  .then(response => response.json())

register_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(register_form);

    // estas lineas son para ver desde la consola en el navegador los datos que se envian
  for(let [key,value] of formData.entries()){
    console.log(`${key}: ${value}`)
  }

    try {
      const response = await fetch(`${API_BASE_URL}/user/create`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Error en el registro");

      const data = await response.json();
      alert(`Registro ok:  ${data.email} ${data.rol}`);

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

