import { API_BASE_URL } from "./config.js";

export function initMemberFunctions() {
  console.log("Member module initialized with API:", API_BASE_URL);
  // acá metés todo el código de socios
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

    const userId = localStorage.getItem("id");
    if (!userId) {
        alert("Debes iniciar sesión antes de gestionar asociaciones.");
        return; // para cortar la ejecucion
}

    const formData = new FormData(asociateForm);

    formData.append("id_user", userId);

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

        //if (!response.ok) throw new Error("Error en el registro");
        //const data = await response.json();
        //alert(`Registro ok:  ${data.name} ${data.surname}`);

    const result = await response.json();

    if (!result.ok) {
        alert(result.error.detail);
        return;
    }

    alert(`Registro ok: ${result.data.name} ${result.data.surname}`);


        // ver aca porque se registra correctamente pero  luego vuelve a entrar en el catch de abajo diciendo que from container no esta definido
        asociateForm.reset();
        if(formContainer) formContainer.classList.add("hidden");
        } catch (error) {
        alert("No se pudo registrar: " + error.message);
        }
    });

  // Inicializar DataTable de Socios

    let tabla_socios;
    $(document).ready(function() {
    tabla_socios= $('#tablaSocios').DataTable({
        language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        columns: [
        { data: "id", title: "Nro Socio" ,defaultContent: ""},
        { data: "id_user", title: "ID user", defaultContent: "" },
        { data: "photo", title: "Foto", defaultContent: "" },
        { data: "name", title: "Nombre", defaultContent: "" },
        { data: "surname", title: "Apellido" , defaultContent: ""},
        { data: "dni", title: "DNI" ,defaultContent: ""},
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
        console.log("Datos recibidos del backend:", data);
        tabla_socios.clear();

    // recorrer los socios
        data.forEach(member => {
        //console.log(member);
        tabla_socios.row.add({
            id: member.id,
            id_user: member.id_user,
            photo: "/static/photos/generico",
            name: member.name,
            surname: member.surname,
            dni: member.DNI,
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
            <button class="btn btn-warning btn-sm btn-editar-socio">✏️</button>
            <button class="btn btn-danger btn-sm btn-eliminar-socio">🗑️</button>
            `
        });
        });

        // refrescar DataTable
        tabla_socios.draw();
        })
        .catch(error => console.error("Error cargando los socios:", error));

    // agregar nuevos o editar socios desde la vista de admin
    const form_container_member = document.getElementById("form_member_container");
    const member_form = document.getElementById("member_form"); /// estoy modificando para que funcione con miembros
    const close_member_form = document.querySelector(".close-form-member");

    // Abrir en modo CREAR
    document.querySelector(".btn-agregar-member").addEventListener("click", () => {
    member_form.reset();
    member_form.querySelector(".id").value = "";
    member_form.querySelector(".id_user").style.display = "block";
    form_container_member.style.display = "block";
    member_form.querySelector(".date_of_up").style.display = "none";
    member_form.querySelector(".last_pay").style.display = "none";
    });

    // Abrir en modo EDITAR
    $('#tablaSocios tbody').on('click', '.btn-editar-socio', function () {
    const fila = tabla_socios.row($(this).parents('tr')).data();
    console.log("Fila seleccionada para editar:", fila);
    member_form.querySelector(".date_of_up").style.display = "none";
    member_form.querySelector(".id_user").style.display = "none";
    member_form.querySelector(".last_pay").style.display = "block";

    member_form.querySelector(".id").value = fila.id;
    member_form.querySelector(".id_user").value = fila.id_user;

    member_form.querySelector(".name").value = fila.name;
    member_form.querySelector(".surname").value = fila.surname;
    member_form.querySelector(".dni").value = fila.dni;
    member_form.querySelector(".date_of_birth").value = fila.date_of_birth;
    member_form.querySelector(".phone").value = fila.phone;
    member_form.querySelector(".city").value = fila.city;
    member_form.querySelector(".post_code").value = fila.post_code;
    member_form.querySelector(".adress").value = fila.adress;
    member_form.querySelector(".date_of_up").value = fila.date_of_up;
    member_form.querySelector(".type_member").value = fila.type_member;
    member_form.querySelector(".last_pay").value = fila.last_pay;
    member_form.querySelector(".debt").value = fila.debt;
    document.getElementById("photo-preview").src = fila.photo ? fila.photo : "/static/photos/generico";

    form_container_member.style.display = "block";
    });

    // Cerrar formulario
    close_member_form.addEventListener("click", () => {
    form_container_member.style.display = "none";
    });

    // Submit del formulario (CREAR o EDITAR según corresponda)
    member_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = member_form.querySelector(".id").value;

    // Crear FormData para enviar como multipart/form-data
    const formData = new FormData();
    formData.append("id_user", parseInt(member_form.querySelector(".id_user").value))
    formData.append("name", member_form.querySelector(".name").value);
    formData.append("surname", member_form.querySelector(".surname").value);
    formData.append("DNI", parseInt(member_form.querySelector(".dni").value));
    
    formData.append("phone", parseInt(member_form.querySelector(".phone").value));
    formData.append("city", member_form.querySelector(".city").value);
    formData.append("post_code", parseInt(member_form.querySelector(".post_code").value));
    formData.append("adress", member_form.querySelector(".adress").value);
    
    formData.append("type_member", parseInt(member_form.querySelector(".type_member").value));
    
    formData.append("debt", parseInt(member_form.querySelector(".debt").value));


    formData.append("date_of_birth", formatDateToDDMMYYYY(document.querySelector(".date_of_birth").value));
    formData.append("date_of_up", formatDateToDDMMYYYY(document.querySelector(".date_of_up").value));
    formData.append("last_pay", formatDateToDDMMYYYY(document.querySelector(".last_pay").value));
    // Adjuntar foto como archivo (si seleccionaron algo)
    const photoFile = member_form.querySelector(".photo").files[0];
    if (photoFile) {
        formData.append("photo", photoFile);
    }

    try {
        let url = `${API_BASE_URL}/member/create`;
        let method = "POST";

        if (id) {
        url = `${API_BASE_URL}/member/update/${id}`;
        method = "PUT";
        }

        const response = await fetch(url, {
        method,
        body: formData, // 🚨 importante: no usar JSON.stringify acá
        });
        console.log("Datos a enviar al backend:");
        formData.forEach((value, key) => {
        console.log(key, value);
        });

        if (!response.ok) throw new Error("Error al guardar");

        const member = await response.json();
        form_container_member.style.display = "none";
        alert(id ? "Actualizado correctamente" : "Creado correctamente");

        // refresco la base de datos para que se cargue el nuevo registro
        fetch('http://127.0.0.1:8000/member/')
        .then(res => res.json())
        .then(socios => {
            tabla_socios.clear();
            socios.forEach(socio => {
                tabla_socios.row.add({
                id: socio.id,
                id_user: socio.id_user,
                photo: "/static/photos/generico",
                name: socio.name,
                surname: socio.surname,
                dni: socio.DNI,
                date_of_birth: socio.date_of_birth,
                phone: socio.phone,
                city: socio.city,
                post_code: socio.post_code,
                adress: socio.adress,
                date_of_up: socio.date_of_up,
                type_member: socio.type_member, // ver de modificar para que en lugar del id aparezca el nombre de ese tipo
                last_pay: socio.last_pay,
                debt: socio.debt,
                acciones: `
                <button class="btn btn-warning btn-sm btn-editar-socio">✏️</button>
                <button class="btn btn-danger btn-sm btn-eliminar-socio">🗑️</button>
                `
            });
            });
            tabla_socios.draw();
        });

    } catch (error) {
        alert("Error: " + error.message);
    }
    });

    // eliminar filas (socios) desde panel de admins

    $('#tablaSocios tbody').on('click', '.btn-eliminar-socio', async function () {
    const fila = tabla_socios.row($(this).parents('tr')).data();
    console.log("Eliminar:", fila);

    if (confirm(`¿Seguro que quieres eliminar el socio "${fila.name}"?`)) {
        try {
        const response = await fetch(`http://127.0.0.1:8000/member/delete/${fila.id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Error al eliminar");

        const res = await fetch('http://127.0.0.1:8000/member/');
        const socios = await res.json();

        tabla_socios.clear();
        socios.forEach(socio => {
            tabla_socios.row.add({
            id: socio.id,
            id_user: socio.id_user,
            photo: "/static/photos/generico",
            name: socio.name,
            surname: socio.surname,
            dni: socio.DNI,
            date_of_birth: socio.date_of_birth,
            phone: socio.phone,
            city: socio.city,
            post_code: socio.post_code,
            adress: socio.adress,
            date_of_up: socio.date_of_up,
            type_member: socio.type_member,
            last_pay: socio.last_pay,
            debt: socio.debt,
            acciones: `
                <button class="btn btn-warning btn-sm btn-editar-socio">✏️</button>
                <button class="btn btn-danger btn-sm btn-eliminar-socio">🗑️</button>
            `
            });
        });
        tabla_socios.draw();

        alert("Eliminado correctamente");

        } catch (error) {
        alert("No se pudo eliminar: " + error.message);
        }
    }
    });
}
