const globalParam = {
    serverName:'http://restnoteserver/'
}



function createAlgorithmInterfaceBtn(algorithmId, buttonText){
    let controlAlgorithmButtons = document.createElement("div");
    let wrapperGetAlgorithmButton = document.createElement("div");
    let wrapperDeleteAlgorithmButton = document.createElement("div");

    let getAlgorithmButton = document.createElement("button");
    let deleteAlgorithmButton = document.createElement("button");

    controlAlgorithmButtons.classList.add('control_algorithm_buttons');
    wrapperGetAlgorithmButton.classList.add('wrapper_get_algorithm_button');
    wrapperDeleteAlgorithmButton.classList.add('wrapper_delete_algorithm_button');

    getAlgorithmButton.classList.add('get_algorithm_button');
    getAlgorithmButton.setAttribute("data-algorithmId",algorithmId);
    getAlgorithmButton.innerText = htmlDecode(buttonText);
    getAlgorithmButton.addEventListener("click",handlerBtnGetAlgorithmById);

    deleteAlgorithmButton.classList.add('delete_algorithm_button');
    deleteAlgorithmButton.innerHTML = '<img src="source/img/btnDelete.png" alt="">';
    deleteAlgorithmButton.addEventListener("click",handlerBtnDeleteAlgorithm);
    deleteAlgorithmButton.setAttribute("data-algorithmId",algorithmId);

    wrapperGetAlgorithmButton.appendChild(getAlgorithmButton);
    wrapperDeleteAlgorithmButton.appendChild(deleteAlgorithmButton);
    controlAlgorithmButtons.appendChild(wrapperGetAlgorithmButton);
    controlAlgorithmButtons.appendChild(wrapperDeleteAlgorithmButton);

    return controlAlgorithmButtons;
}
function createItemRecord(recordObj) {
    let item_record = document.createElement('div');
    item_record.classList.add("item_record");

    let exec_record_container_checkbox = document.createElement('div');
    exec_record_container_checkbox.classList.add("exec_record_container_checkbox");

    let input_exec_record_container_checkbox = document.createElement('input');
    input_exec_record_container_checkbox.type = 'checkbox';
    input_exec_record_container_checkbox.classList.add("input_exec_record_container_checkbox");

    input_exec_record_container_checkbox.checked  = JSON.parse(recordObj.done);

    exec_record_container_checkbox.appendChild(input_exec_record_container_checkbox);

    let record_container_input = document.createElement('div');
    record_container_input.classList.add("record_container_input");

    let record_input = document.createElement('input');
    record_input.value = htmlDecode(recordObj.text);
    record_input.classList.add("record_input");
    record_container_input.appendChild(record_input);

    let delete_record_container_btn = document.createElement('delete_record_container_btn');
    delete_record_container_btn.classList.add("delete_record_container_btn");

    let delete_record_btn = document.createElement('button');
    delete_record_btn.innerText = 'удалить';
    delete_record_btn.classList.add("delete_record_btn");
    delete_record_btn.addEventListener('click', handlerBtnDeleteRecord)
    delete_record_container_btn.appendChild(delete_record_btn);


    item_record.appendChild(exec_record_container_checkbox);
    item_record.appendChild(record_container_input);
    item_record.appendChild(delete_record_container_btn);


    return item_record;

}
function renameAlgorithm(id){
    let input_algorithm_title = document.querySelector('.input_algorithm_title');
    let get_algorithm_button = document.querySelector(`.wrapper_get_algorithm_button > button[data-algorithmid = "${id}" ]`);
    let oldTitle = get_algorithm_button.innerText;
    let newTitle = input_algorithm_title.value;
    if(oldTitle !== newTitle){
        get_algorithm_button.innerText = newTitle;
    }
}
function clearAlgorithm(){
    let save_algorithm_btn = document.querySelector('.save_algorithm_btn');
    save_algorithm_btn.setAttribute("data-algorithmId",'');
    let items_record = document.querySelector(".items_record");
    let input_algorithm_title = document.querySelector(".input_algorithm_title");
    items_record.classList.add("hidden");
    items_record.innerHTML = "";
    input_algorithm_title.value = "";
}

function handlerBtnCreateRecord() {
    let create_record_input =  document.querySelector(".create_record_input");
    let nameNewRecord = create_record_input.value;
    if(!nameNewRecord){
        alert("Введите имя записи!");
        return;
    }
    create_record_input.value = "";
    let items_record = document.querySelector('.items_record');
    items_record.classList.remove("hidden");
    let recordObj ={
        done:0,
        text:nameNewRecord
    };
    let item_record = createItemRecord(recordObj);
    items_record.appendChild(item_record);

}
function handlerBtnDeleteRecord(){
    this.parentNode.parentNode.remove();
}
function handlerBtnSaveAlgorithm(){
    let idAlgorithm = this.dataset.algorithmid;
    let dataToServer = getData(idAlgorithm);

    if(dataToServer){
        let res = sendDataToServer(dataToServer);


        if(!idAlgorithm){
            handlerDataOfServer(res, function (response) {

                let input_algorithm_title = document.querySelector('.input_algorithm_title');
                let nameAlgorithm = input_algorithm_title.value;

                let strLocation = response.headers.get('location');
                let reg = new RegExp("id=(\\d*).*");
                let idAlgorithm = strLocation.match(reg)[1];

                renderNewAlgorithm(idAlgorithm,nameAlgorithm);
                showMessage();

            });

            return;
        }
        handlerDataOfServer(res);
        renameAlgorithm(idAlgorithm);
        showMessage();

        return;
    }
    alert("Введите имя алгоритма!")
}
function handlerBtnCreateAlgorithm(){
    clearAlgorithm();
}
function handlerBtnDeleteAlgorithm() {

    deleteAlgorithmFromServer(this.dataset.algorithmid, this);
}
function handlerBtnGetAlgorithmById() {
    let algorithmId = this.dataset.algorithmid;
    let algorithmName = this.innerText;

    let response = fetch(`${globalParam.serverName}?id=${algorithmId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html; charset=UTF-8'
        },

    });


    handlerDataOfServer(response, function (objAlgorithm){


        renderSingleAlgorithm(algorithmName, objAlgorithm.records, algorithmId);})


}
function handlerBtnGetOptions() {

    let available_options = document.querySelector('.available_options');
    available_options.classList.toggle("hidden");


}
function handlerDataOfServer(responsePromise, callback = ()=>{} ,  arrParams = []) {

    responsePromise.then(function (responseObj) {

        return  handlerStatusCode(responseObj, callback, arrParams);
    }).catch(function (error){
        alert(error.message);
    })



}
function handlerStatusCode(responseObj, callback, arrParams){

    let code = responseObj.status;
    let message = responseObj.statusText;

    switch (code){
        case 200:
            responseObj.json().then(function (resObj) {
             //   console.dir(resObj);
                callback(resObj, arrParams);
            }).catch(function (error){

                alert('Ознакомтесь с документацией API! Возвращенные данные обработаны неправильно!');
            });
            break;
        case 204:
        case 201:
            callback(responseObj);
            break;
        default:
            let clientMessage = `На сервере произошла ошибка с кодом -  ${code}. Сервер прислал следующее сообщение : ${message}`;
            return  Promise.reject(new Error(clientMessage));
    }


}


function deleteAlgorithmFromServer(idAlgorithm, deleteBtn) {
    let response = fetch(`${globalParam.serverName}?id=${idAlgorithm}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'text/html; charset=UTF-8'
        },

    });
    handlerDataOfServer(response, function () {
        deleteAlgorithmFromClient(deleteBtn);
    });




}
function deleteAlgorithmFromClient(button) {
    button.parentNode.parentNode.remove();
    clearAlgorithm();
}

function renderSingleAlgorithm(algorithmName,recordsArr,algorithmId) {
    let inputAlgorithmName = document.querySelector('.input_algorithm_title');
    let save_algorithm_btn = document.querySelector('.save_algorithm_btn');

    save_algorithm_btn.setAttribute("data-algorithmId",algorithmId);
    let items_record = document.querySelector('.items_record');

    items_record.innerHTML = "";
    items_record.classList.remove("hidden");
    inputAlgorithmName.value = algorithmName;

    if(recordsArr.length >= 1){
        recordsArr.forEach(function (recordObj) {
            let item_record = createItemRecord(recordObj);
            items_record.appendChild(item_record);

        })
    }


}
function renderNewAlgorithm(idAlgorithm,nameAlgorithm){
    let wrapperAvailableAlgorithms = document.querySelector(".wrapper_available_algorithms");
    let saveAlgorithmBtn = document.querySelector(".save_algorithm_btn");
    saveAlgorithmBtn.setAttribute("data-algorithmId",idAlgorithm);


    wrapperAvailableAlgorithms.appendChild(createAlgorithmInterfaceBtn(idAlgorithm, nameAlgorithm));

}
function renderAvailableAlgorithms(renderArr){

        let wrapperAvailableAlgorithms = document.querySelector(".wrapper_available_algorithms");

        if(renderArr.length != 0){
            renderArr.forEach(function (item) {
                wrapperAvailableAlgorithms.appendChild(createAlgorithmInterfaceBtn(item.id, item.name));
            })
        }else {
            let pMessageOfEmptyAlgorithms = document.createElement("p");
            pMessageOfEmptyAlgorithms.classList.add('p_message_of_empty_algorithms');
            pMessageOfEmptyAlgorithms.innerHTML = "В базе данных отсутствуют алгоритмы. Создайте новые!";
            wrapperAvailableAlgorithms.appendChild(pMessageOfEmptyAlgorithms);
        }



}




function getData(idAlgorithm) {

    let input_algorithm_title_value = document.querySelector('.input_algorithm_title').value;
    if(input_algorithm_title_value){
        let dataToServer = {
            id: idAlgorithm,
            name: input_algorithm_title_value,
            records: []
        };

        let items_records = document.querySelectorAll('.item_record');

        items_records.forEach(function (record) {
            dataToServer.records.push({
                text : record.childNodes[1].childNodes[0].value,
                done : record.childNodes[0].childNodes[0].checked
            });
        });


        return dataToServer;

    }
    return false
}
function sendDataToServer(dataToServer) {

    let method = dataToServer.id ? "PUT" : "POST";

    return  fetch(globalParam.serverName, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToServer)
    });


}
function htmlDecode(input){
    let elem = document.createElement('div');
    elem.innerHTML = input;
    return elem.childNodes.length === 0 ? "" : elem.childNodes[0].nodeValue;
}

function showMessage() {
    let message = document.querySelector('.message');
    message.classList.remove("hidden");
    setTimeout(function () {
        message.classList.add("hidden");
    },1500);
}