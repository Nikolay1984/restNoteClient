window.onload =
    function () {

        let create_algorithm_button = document.querySelector(".create_algorithm_button");
        create_algorithm_button.addEventListener("click",handlerBtnCreateAlgorithm);
        let save_algorithm_btn = document.querySelector('.save_algorithm_btn');
        save_algorithm_btn.addEventListener('click',handlerBtnSaveAlgorithm);
        let create_record_btn = document.querySelector(".create_record_btn");
        create_record_btn.addEventListener("click",handlerBtnCreateRecord);
        let btn_get_options = document.querySelector(".btn_get_options");
        btn_get_options.addEventListener("click",handlerBtnGetOptions);



        let responsePromise = fetch(globalParam.serverName, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html; charset=UTF-8'
        },

    });

        handlerDataOfServer(responsePromise, function (availableAlgorithmsArr){
            renderAvailableAlgorithms(availableAlgorithmsArr);
        })




};
