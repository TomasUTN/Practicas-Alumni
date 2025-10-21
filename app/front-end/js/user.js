import { API_BASE_URL } from "./config.js";

export function initUserFunctions() {
  console.log("User module initialized with API:", API_BASE_URL);
  // acá metés todo el código relacionado con usuarios
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
        //////////// ver aca porque se registra correctamente pero  luego vuelve a entrar en el catch de abajo diciendo que from container no esta definido
        register_form.reset();
        formContainer.classList.add("hidden");
        } catch (error) {
        alert("No se pudo registrar: " + error.message);
        }
    });
    // Inicializar DataTable de usuarios
    let tabla_usuarios;

    $(document).ready(function() {

    tabla_usuarios = $('#tablaUsuarios').DataTable({
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
    // Relleno de la tabla 
    fetch('http://127.0.0.1:8000/user/')
    .then(response => response.json())
    .then(data => {
        tabla_usuarios.clear();

    // recorrer los usuarios
        data.forEach(user => {
        // console.log(user);
        tabla_usuarios.row.add({
            id: user.id,
            email: user.email,
            password: user.password,
            rol: user.rol,
            acciones: `
            <button class="btn btn-warning btn-sm btn-editar-user">✏️</button>
            <button class="btn btn-danger btn-sm btn-eliminar-user">🗑️</button>
            `
        });
        });

        // refrescar DataTable
        tabla_usuarios.draw();
        })
        .catch(error => console.error("Error cargando usuarios:", error));

    });


        // agregar nuevos o editar users desde la vista de admin
    const form_container_user = document.getElementById("form_user_container");
    const user_form = document.getElementById("user_form");
    const close_user_form = document.querySelector(".close-form-user");

    // Abrir en modo CREAR
    document.querySelector(".btn-agregar-user").addEventListener("click", () => {
    user_form.reset();
    user_form.querySelector(".id").value = "";
    form_container_user.style.display = "block";
    });

    // Abrir en modo EDITAR
    $('#tablaUsuarios tbody').on('click', '.btn-editar-user', function () {
    const fila = tabla_usuarios.row($(this).parents('tr')).data();

    user_form.querySelector(".id").value = fila.id;
    user_form.querySelector(".email").value = fila.email;
    user_form.querySelector(".password").value = fila.password;
    user_form.querySelector(".repeat_password").value = "";
    user_form.querySelector(".rol").value = fila.rol;

    form_container_user.style.display = "block";
    });

    // Cerrar formulario
    close_user_form.addEventListener("click", () => {
    form_container_user.style.display = "none";
    });

    // Submit del formulario (CREAR o EDITAR según corresponda)
    user_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = user_form.querySelector(".id").value;
    const data = {
        email: user_form.querySelector(".email").value,
        password: user_form.querySelector(".password").value,
        repeat_password: user_form.querySelector(".repeat_password").value,
        rol: user_form.querySelector(".rol").value
    };
    //para ir viendo q se manda al back
    console.log("Datos a enviar al backend:", data);
    try {
        let url = `${API_BASE_URL}/user/create`;
        let method = "POST";

        // Si hay id, significa que estamos EDITANDO
        if (id) {
        url = `${API_BASE_URL}/user/update/${id}`;
        method = "PUT"; 
        }

        const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Error al guardar");

        const user = await response.json();

        form_container_user.style.display = "none";
        alert(id ? "Actualizado correctamente" : "Creado correctamente");

    } catch (error) {
        alert("Error: " + error.message);
    }
    // refresco la base de datos para que se cargue el nuevo registro

    fetch('http://127.0.0.1:8000/user/')
        .then(res => res.json())
        .then(users => {
        tabla_usuarios.clear();
        users.forEach(user => {
            tabla_usuarios.row.add({
            id: user.id,
            email: user.email,
            password: user.password,
            rol: user.rol,
            acciones: `
                <button class="btn btn-warning btn-sm btn-editar-user">✏️</button>
                <button class="btn btn-danger btn-sm btn-eliminar-user">🗑️</button>
            `
            });
        });
        tabla_usuarios.draw();
        });
    });
    // eliminar filas (Usuarios) desde panel de admins

    $('#tablaUsuarios tbody').on('click', '.btn-eliminar-user', async function () {
    const fila = tabla_usuarios.row($(this).parents('tr')).data();
    //console.log("Eliminar:", fila);

    if (confirm(`¿Seguro que quieres eliminar el usuario "${fila.email}"?`)) {
        try {
        const response = await fetch(`http://127.0.0.1:8000/user/delete/${fila.id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Error al eliminar");

        const listaActualizada = await response.json();

        // refrescamos tabla completa
        tabla_usuarios.clear();
        listaActualizada.forEach(type => {
            tabla_usuarios.row.add({
            id: type.id,
            email: type.email,
            password: type.password,
            rol: type.rol,
            acciones: `
                <button class="btn btn-warning btn-sm btn-editar">✏️</button>
                <button class="btn btn-danger btn-sm btn-eliminar">🗑️</button>
            `
            });
        });
        tabla_usuarios.draw();

        alert("Eliminado correctamente");

        } catch (error) {
        alert("No se pudo eliminar: " + error.message);
        }
    }
    });



}