import { API_BASE_URL } from "./config.js";

export function initMemberTypeFunctions() {
  console.log("Member type module initialized with API:", API_BASE_URL);
  // acá metés lo de tipos de socios
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
        //console.log(type);
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

}
