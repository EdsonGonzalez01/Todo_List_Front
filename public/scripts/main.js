const RUTA = "https://to-do-project-dasw-backend.herokuapp.com"
//const RUTA ="http://localhost:3000"
function getTasks() {
    const token = localStorage.getItem('token');
    axios.get(RUTA + '/tasks/?token=123', {headers: {'token': token}}).then((respuesta) => { //
        const tareas = respuesta.data;
        const contenedor = document.getElementById('taskList');

        tareas.forEach(element => {
            const _id = element._id;
            const descripcion = element.descripcion;
            const fila = `                
                <li class="list-group-item border-0 d-flex align-items-center ps-0">
                    <input class="form-check-input me-3" type="checkbox" onclick="completedTask('${_id}')" id ="${_id}" aria-label="..." />
                    ${descripcion}
                </li>
            `;
            contenedor.innerHTML += fila;
        });

    })
}

function completedTask(taskId) {
    const token = localStorage.getItem('token');
    axios.post(RUTA + '/tasks/complete/'+taskId+'?token=123', null,  {headers: {'token': token}}).then((respuesta) => {
        console.log(respuesta);
    }).then(data => {
        location.reload()
    })
}


function getCategories() {
    const token = localStorage.getItem('token');
    axios.get(RUTA + '/categories/?token=123', {headers: {'token': token}}).then((respuesta) => {
        const categorias = respuesta.data;
        const contenedor = document.getElementById('tasksContainer');

        categorias.forEach(element => {
            const descripcion = element.descripcion;
            const color = element.color;
            const fila = ` 
                <div class="card flex-item" style="width: 18rem;">
                    <h4 style="color:${color}">
                        ${descripcion}
                    </h4>
                    <p id="${descripcion}Tasks">
                    </p>
                </div>
            `;
            axios.get(RUTA + '/tasks/category/'+descripcion+'?token=123', {headers: {'token': token}}).then((response) => {
                const tareas = response.data;
                const contenedor = document.getElementById(descripcion+'Tasks');

                tareas.forEach(element => {
                    const _id = element._id;
                    const descripcion = element.descripcion;
                    const observacion = element.observacion;
                    const fila = ` 
                        <div class="card flex-item" style="width: 100%;">
                            <div class="card-body">
                            <h5 class="card-title">${descripcion}</h5>
                            <p class="card-text">${observacion}</p>
                            <a id="${_id}" href="../editActivity.html?task=${_id}" class="btn btn-primary">Edit Task</a>
                            </div>
                        </div>
                    `;
                contenedor.innerHTML += fila;
                });
            });
            contenedor.innerHTML += fila;
        });

    });
}

function editTask(taskId) {
    //window.location.href = window.location.origin + "/editActivity.html";
    const token = localStorage.getItem('token');
    axios.get(RUTA + '/tasks/'+taskId+'/?token=123', {headers: {'token': token}}).then((respuesta) => { 
        const tarea = respuesta.data;
    }) 
}


function getCategoriesSelect() {
    const token = localStorage.getItem('token');
    axios.get(RUTA + '/categories/?token=123', {headers: {'token': token}}).then((respuesta) => {
        const categorias = respuesta.data;
        const contenedor = document.getElementById('prioridad');

        categorias.forEach(element => {
            const descripcion = element.descripcion;
            const fila = `                
                <option value="${descripcion}">${descripcion}</option>
            `;
            contenedor.innerHTML += fila;
        });

    })
}




function initCreateTask() {
    const form = document.getElementById('formTask');
    const divSuccess = document.getElementById("alert-success");
    const divError = document.getElementById("alert-error");
    divSuccess.style.visibility = 'hidden' ;
    divError.style.visibility = 'hidden' ;
    const campos = {};
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const elementosForm = this.querySelectorAll(".form-Item")
        elementosForm.forEach(function (elemento) {
            campos[elemento.name] = elemento.value;
        })

        const respuesta = await axiosCreate(campos);
        if(respuesta != "error"){
            divSuccess.textContent="Se creo correctamente la tarea: " + respuesta.data.descripcion;
            divSuccess.style.visibility="visible"
        }else{
            divError.textContent="Ocurrio un error al crear la tarea" 
            divError.style.visibility="visible"
        }
    })
}

async function axiosCreate(campos) {
    // create a promise for the axios request
    const token = localStorage.getItem('token');
    try {
        const respuesta = await axios.post(RUTA + '/tasks/create?token=123', campos, {headers: {'token': token}}) 
        return(respuesta)
    } catch (error) {
        return("error")
    }
    
}

function UpdateTask() {
    const form = document.getElementById('formTask');
    const campos = {};
    let params = new URLSearchParams(document.location.search);
    const taskId = params.get("task")
    
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const elementosForm = this.querySelectorAll(".form-Item")
        console.log(elementosForm);
        elementosForm.forEach(function (elemento) {
            campos[elemento.name] = elemento.value;
        });
        const datos = await axiosUpdate(campos);
        if(datos.status == 200){
            const divSuccess = document.getElementById("alert-success");
            divSuccess.textContent="Se editó correctamente la tarea" 
            divSuccess.style.visibility="visible"
            window.location = "./Tablero.html";
        }
        else{
            const divError = document.getElementById("alert-error");
            divError.textContent="Ocurrio un error al editar la tarea" 
            divError.style.visibility="visible"
        }
    })
}

function initLogin(){
    const divError = document.getElementById("alert-error");
    divError.style.visibility = 'hidden';

    const form = document.getElementById('Login_Form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const correo = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        const obj = {
            correo: correo,
            password: password
        }


        const respuesta = await axiosLogin(obj);
        if(respuesta == "error"){
            divError.textContent="Usuario o contraseña incorrecto. Intentalo de nuevo" 
            divError.style.visibility="visible"
        }
    })
}

async function axiosLogin(obj) {
    // create a promise for the axios request
    try {
        
        const respuesta = await axios.post(RUTA + '/users/login?token=123', obj).then((respuesta) => { 
            const token = respuesta.data.token;
            localStorage.setItem('token', token);
            window.location = './project.html';  
        })
        return(respuesta);
    } catch (error) {
        return("error")
    }
    
}


function initRegister(){
    const divError = document.getElementById("alert-error");
    divError.style.visibility = 'hidden';
    const form = document.getElementById('formSignUp');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const correo = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        const obj={
            correo: correo,
            password: password
        }

        const respuesta = await axiosSignUp(obj);
        if(respuesta == "error"){
            divError.textContent="Usuario o contraseña incorrecto. Intentalo de nuevo" 
            divError.style.visibility="visible"
        }else{

        }

    })

}

async function axiosSignUp(obj) {
    // create a promise for the axios request
    try {
        const respuesta = await axios.post(RUTA + '/users/create?token=123', obj).then((respuesta) => { 
            window.location = './Login.html';  
        })
        return(respuesta);
    } catch (error) {
        return("error")
    }
    
}



async function axiosUpdate(campos) {
    // create a promise for the axios request
    const token = localStorage.getItem('token');
    try {
        const respuesta = await axios.post(RUTA + '/users/create/?token=123', campos).then((respuesta) => { 
            if(respuesta.status == 200){
                window.location = "./Tablero.html"

            }
            console.log(respuesta);
        })
        return(respuesta)
    } catch (error) {
        console.log(error);
        return("error")
    }
    
}

function initEditTask() {
    const divSuccess = document.getElementById("alert-success");
    const divError = document.getElementById("alert-error");
    divError.style.visibility = 'hidden' ;
    divSuccess.style.visibility = 'hidden' ;
    let params = new URLSearchParams(document.location.search);
    const taskId = params.get("task")
    const token = localStorage.getItem('token');

    axios.get(RUTA + '/categories/?token=123', {headers: {'token': token}}).then((respuesta) => {
        const categorias = respuesta.data;
        const contenedor = document.getElementById('prioridad');

        categorias.forEach(element => {
            const descripcion = element.descripcion;
            const fila = `                
                <option value="${descripcion}">${descripcion}</option>
            `;
            contenedor.innerHTML += fila;
        });
    }).then(data=>{
        axios.get(RUTA + '/tasks/'+taskId+'?token=123', {headers: {'token': token}}).then((respuesta) => {
            return respuesta.data;
        }).then(respuesta => {
            return(respuesta)
        }).then(respuesta => {
            document.getElementById('descripcion').value = respuesta.descripcion;
            document.getElementById('observacion').value = respuesta.observacion;
            document.getElementById('prioridad').value = respuesta.prioridad;
            document.getElementById('fecha_inicio').value = new Date(respuesta.fecha_inicio).toISOString().substring(0,10);
            document.getElementById('fecha_fin').value = new Date(respuesta.fecha_fin).toISOString().substring(0,10);
        })  
    })
}


function initCreateCategory() {
    const form = document.getElementById('formCategory');
    const token = localStorage.getItem('token');
    const divError = document.getElementById("alert-error");
    divError.style.visibility = 'hidden' ;
    const campos = {};
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const elementosForm = this.querySelectorAll(".form-category-Item")
        elementosForm.forEach(function (elemento) {
            campos[elemento.name] = elemento.value;
        })

        const respuesta = await axiosCreateCat(campos);
        if(respuesta == "error"){
            divError.textContent="Error al crear categoria. Intentalo de nuevo" 
            divError.style.visibility="visible"
        }


    })
}


async function axiosCreateCat(campos) {
    // create a promise for the axios request
    const token = localStorage.getItem('token');
    try {
        const respuesta = await axios.post(RUTA + '/categories/create?token=123', campos, {headers: {'token': token}}).then((respuesta) => {
            if(respuesta.status == 200){

                window.location = "./Tablero.html"
            }
            console.log(respuesta);

        });
        return(respuesta)
    } catch (error) {
        console.log(error);
        return("error")
    }
    
}