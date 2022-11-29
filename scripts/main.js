function getTasks() {
    axios.get('http://localhost:3000/tasks/?token=123').then((respuesta) => {
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
    console.log("Completando tarea: " + taskId)
    axios.put('http://localhost:3000/tasks/complete/'+taskId+'?token=123').then((respuesta) => {
        console.log(respuesta);
    }).then(data => {
        location.reload()
    })
}


function getCategories() {
    axios.get('http://localhost:3000/categories/?token=123').then((respuesta) => {
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
            axios.get('http://localhost:3000/tasks/category/'+descripcion+'?token=123').then((response) => {
                const tareas = response.data;
                const contenedor = document.getElementById(descripcion+'Tasks');

                tareas.forEach(element => {
                    const _id = element._id;
                    const descripcion = element.descripcion;
                    const observacion = element.observacion;
                    console.log(_id);
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
    console.log("Le pique al boton: " + taskId)
    //window.location.href = window.location.origin + "/editActivity.html";

    axios.get('http://localhost:3000/tasks/'+taskId+'/?token=123').then((respuesta) => { 
        const tarea = respuesta.data;
        console.log("Tarea front " + tarea.descripcion);
    }) 
}


function getCategoriesSelect() {
    axios.get('http://localhost:3000/categories/?token=123').then((respuesta) => {
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
        console.log(elementosForm);
        elementosForm.forEach(function (elemento) {
            campos[elemento.name] = elemento.value;
        })
        console.log(campos);

        const respuesta = await axiosCreate(campos);
        console.log(respuesta);
        if(respuesta != "error"){
            divSuccess.textContent="Se creo correctamente la tarea: " + respuesta.data.descripcion;
            divSuccess.style.visibility="visible"
        }else{
            divError.textContent="Ocurrio un error al crar la tarea" 
            divError.style.visibility="visible"
        }
    })
}

async function axiosCreate(campos) {
    // create a promise for the axios request
    try {
        const respuesta = await axios.post('http://localhost:3000/tasks/create?token=123', campos) 
        return(respuesta)
    } catch (error) {
        console.log(error);
        return("error")
    }
    
}

function UpdateTask() {
    
    
    const form = document.getElementById('formTask');
    const campos = {};
    console.log("En el update task");
    let params = new URLSearchParams(document.location.search);
    const taskId = params.get("task")
    
    form.addEventListener('submit', async function (event) {
        console.log("Hubo un submit");
        event.preventDefault();
        const elementosForm = this.querySelectorAll(".form-Item")
        console.log(elementosForm);
        elementosForm.forEach(function (elemento) {
            campos[elemento.name] = elemento.value;
        });
        //console.log(campos);
        const datos = await axiosUpdate(taskId, campos);
        console.log(datos);
        if(datos.status == 200){
            const divSuccess = document.getElementById("alert-success");
            divSuccess.textContent="Se edito correctamente la tarea" 
            divSuccess.style.visibility="visible"
        }
        else{
            const divError = document.getElementById("alert-error");
            divError.textContent="Ocurrio un error al editar la tarea" 
            divError.style.visibility="visible"
        }
    })
}

async function axiosUpdate(taskId, campos) {
    // create a promise for the axios request
    try {
        const respuesta = await axios.put('http://localhost:3000/tasks/update/'+taskId+'?token=123', campos)    
        return(respuesta)
    } catch (error) {
        console.log(error);
        return("error")
    }
    
}

function initEditTask() {
    const divSuccess = document.getElementById("alert-success");
    const divError = document.getElementById("alert-error");
    divSuccess.style.visibility = 'hidden' ;
    divError.style.visibility = 'hidden' ;
    console.log(document.location.search);
    let params = new URLSearchParams(document.location.search);
    const taskId = params.get("task")
    console.log(taskId); 

    axios.get('http://localhost:3000/categories/?token=123').then((respuesta) => {
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
        axios.get('http://localhost:3000/tasks/'+taskId+'?token=123').then((respuesta) => {
            console.log(respuesta);
            return respuesta.data;
        }).then(respuesta => {
            console.log(respuesta)
            return(respuesta)
        }).then(respuesta => {
            document.getElementById('descripcion').value = respuesta.descripcion;
            console.log(respuesta.prioridad)
            document.getElementById('observacion').value = respuesta.observacion;
            document.getElementById('prioridad').value = respuesta.prioridad;
            document.getElementById('fecha_inicio').value = new Date(respuesta.fecha_inicio).toISOString().substring(0,10);
            document.getElementById('fecha_fin').value = new Date(respuesta.fecha_fin).toISOString().substring(0,10);
        })  
    })
}


function initCreateCategory() {
    const form = document.getElementById('formCategory');
    const campos = {};
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const elementosForm = this.querySelectorAll(".form-category-Item")
        console.log(elementosForm);
        elementosForm.forEach(function (elemento) {
            campos[elemento.name] = elemento.value;
        })
        console.log(campos);

        axios.post('http://localhost:3000/categories/create?token=123', campos).then((respuesta) => {
            console.log(respuesta);

        });
    })
}