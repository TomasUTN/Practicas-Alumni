
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
    repeat_password: register_form.querySelector('input[id="repeat_pass"]').value,
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

///////////////////////////////////////////////// USUARIOS ///////////////////////////////////////////////////////////////////
// Inicializar DataTable de usuarios
$(document).ready(function() {
  $('#tablaUsuarios').DataTable({
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
    },
      columns: [
      { data: "id", title: "ID" ,defaultContent: ""},
      { data: "email", title: "Email", defaultContent: "" },
      { data: "password", title: "Contraseña", defaultContent: "" },
      { data: "rol", title: "Rol", defaultContent: "" },
      { data: "acciones", title: "Acciones" , defaultContent: ""}
    ]
  });
});

// Relleno de la tabla 
fetch('http://127.0.0.1:8000/user/')
  .then(response => response.json())
  .then(data => {
    const tabla = $('#tablaUsuarios').DataTable();
    tabla.clear();

  // recorrer los usuarios
    data.forEach(user => {
      // console.log(user);
      tabla.row.add({
        id: user.id,
        email: user.email,
        password: user.password,
        rol: user.rol,
        acciones: `
          <button class="btn btn-warning btn-sm">✏️</button>
          <button class="btn btn-danger btn-sm">🗑️</button>
        `
      });
    });

      // refrescar DataTable
      tabla.draw();
    })
    .catch(error => console.error("Error cargando usuarios:", error));

///////////////////////////////////////////////// SOCIOS ///////////////////////////////////////////////////////////////////
// Inicializar DataTable de Socios

$(document).ready(function() {
  $('#tablaSocios').DataTable({
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
    },
      columns: [
      { data: "id", title: "Nro Socio" ,defaultContent: ""},
      { data: "id_user", title: "ID user", defaultContent: "" },
      { data: "photo", title: "Foto", defaultContent: "" },
      { data: "name", title: "Nombre", defaultContent: "" },
      { data: "surname", title: "Apellido" , defaultContent: ""},
      { data: "DNI", title: "DNI" ,defaultContent: ""},
      { data: "date_of_birth", title: "Fecha Nac", defaultContent: "" },
      { data: "phone", title: "Telefono", defaultContent: "" },
      { data: "city", title: "Ciudad", defaultContent: "" },
      { data: "post_code", title: "Codigo postal" , defaultContent: ""},
      { data: "adress", title: "Direccion" ,defaultContent: ""},
      { data: "date_of_up", title: "Fecha de alta", defaultContent: "" },
      { data: "type_member", title: "Tipo de miembro", defaultContent: "" },
      { data: "last_pay", title: "Ultimo pago", defaultContent: "" },
      { data: "debt", title: "Deuda" , defaultContent: ""},
      { data: "acciones", title: "Acciones" , defaultContent: ""}
    ]
  });
});

// Relleno de la tabla 
fetch('http://127.0.0.1:8000/member/')
  .then(response => response.json())
  .then(data => {
    const tabla = $('#tablaSocios').DataTable();
    tabla.clear();

  // recorrer los socios
    data.forEach(member => {
      //console.log(member);
      tabla.row.add({
        id: member.id,
        id_user: member.id_user,
        photo: "/static/photos/generico",
        name: member.name,
        surname: member.surname,
        DNI: member.DNI,
        date_of_birth: member.date_of_birth,
        phone: member.phone,
        city: member.city,
        post_code: member.post_code,
        adress: member.adress,
        date_of_up: member.date_of_up,
        type_member: member.type_member, // ver de modificar para que en lugar del id aparezca el nombre de ese tipo
        last_pay: member.last_pay,
        debt: member.debt,
        acciones: `
          <button class="btn btn-warning btn-sm">✏️</button>
          <button class="btn btn-danger btn-sm">🗑️</button>
        `
      });
    });

      // refrescar DataTable
      tabla.draw();
    })
    .catch(error => console.error("Error cargando los socios:", error));

///////////////////////////////////////////////// TIPO DE SOCIOS ///////////////////////////////////////////////////////////////////
// Inicializar DataTable de Tipo de Socios

const tabla = $('#tablaTipoSocios').DataTable({
  language: {
    url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
  },
  columns: [
    { data: "id", title: "ID" , defaultContent: "" },
    { data: "name", title: "Nombre", defaultContent: "" },
    { data: "description", title: "Descripcion", defaultContent: "" },
    { data: "price", title: "Precio", defaultContent: "" },
    { data: "acciones", title: "Acciones", defaultContent: "" }
  ]
});

// Relleno de la tabla 
fetch('http://127.0.0.1:8000/member_type/')
  .then(response => response.json())
  .then(data => {
    tabla.clear();

  // recorrer los tipos de socios
    data.forEach(type => {
      console.log(type);
      tabla.row.add({
        id: type.id,
        name: type.name,
        description: type.description,
        price: type.price,
        acciones: `
          <button class="btn btn-warning btn-sm btn-editar">✏️</button>
          <button class="btn btn-danger btn-sm btn-eliminar">🗑️</button>
        `
      });
    });

      // refrescar DataTable
      tabla.draw();
    })
    .catch(error => console.error("Error cargando los tipos de socios:", error));

  // agregar nuevos o editar tipos de miembros desde la vista de admin
const form_container = document.getElementById("form_tipo_container");
const type_form = document.getElementById("type_form");
const closeForm = document.querySelector(".close-form");

// Abrir en modo CREAR
document.querySelector(".btn-agregar-member-type").addEventListener("click", () => {
  type_form.reset();
  type_form.querySelector(".id").value = "";
  form_container.style.display = "block";
});

// Abrir en modo EDITAR
$('#tablaTipoSocios tbody').on('click', '.btn-editar', function () {
  const fila = tabla.row($(this).parents('tr')).data();

  type_form.querySelector(".id").value = fila.id;
  type_form.querySelector(".name").value = fila.name;
  type_form.querySelector(".description").value = fila.description;
  type_form.querySelector(".price").value = fila.price;

  form_container.style.display = "block";
});

// Cerrar formulario
closeForm.addEventListener("click", () => {
  form_container.style.display = "none";
});

// Submit del formulario (CREAR o EDITAR según corresponda)
type_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = type_form.querySelector(".id").value;
  const data = {
    name: type_form.querySelector(".name").value,
    description: type_form.querySelector(".description").value,
    price: type_form.querySelector(".price").value,
  };
  // para ir viendo q se manda al back console.log("Datos a enviar al backend:", data);
  try {
    let url = `${API_BASE_URL}/member_type/create`;
    let method = "POST";

    // Si hay id, significa que estamos EDITANDO
    if (id) {
      url = `${API_BASE_URL}/member_type/edit/${id}`;
      method = "PUT"; 
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error al guardar");

    const listaActualizada = await response.json();

    // refrescar tabla
    tabla.clear();
    listaActualizada.forEach(type => {
      tabla.row.add({
        id: type.id,
        name: type.name,
        description: type.description,
        price: type.price,
        acciones: `
          <button class="btn btn-warning btn-sm btn-editar">✏️</button>
          <button class="btn btn-danger btn-sm btn-eliminar">🗑️</button>
        `
      });
    });
    tabla.draw();

    form_container.style.display = "none";
    alert(id ? "Actualizado correctamente" : "Creado correctamente");

  } catch (error) {
    alert("Error: " + error.message);
  }
});
// eliminar filas (tipo de socios) desde panel de admins

$('#tablaTipoSocios tbody').on('click', '.btn-eliminar', async function () {
  const fila = tabla.row($(this).parents('tr')).data();
  console.log("Eliminar:", fila);

  if (confirm(`¿Seguro que quieres eliminar el tipo de socio "${fila.name}"?`)) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/member_type/delete/${fila.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar");

      const listaActualizada = await response.json();

      // refrescamos tabla completa
      tabla.clear();
      listaActualizada.forEach(type => {
        tabla.row.add({
          id: type.id,
          name: type.name,
          description: type.description,
          price: type.price,
          acciones: `
            <button class="btn btn-warning btn-sm btn-editar">✏️</button>
            <button class="btn btn-danger btn-sm btn-eliminar">🗑️</button>
          `
        });
      });
      tabla.draw();

      alert("Eliminado correctamente");

    } catch (error) {
      alert("No se pudo eliminar: " + error.message);
    }
  }
});



/////////////////////////////////////////// FIN DE FUNCIONES PARA ADMINS ////////////////////////////////////////

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
