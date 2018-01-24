let input = document.getElementById('json-file-input');
let output = document.getElementById('download-tasks-json');

input.addEventListener('change', (ev) => {
    let file = input.files[0];
    let fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);

    function receivedText(e) {
        let newArr = JSON.parse(e.target.result);
        newArr.forEach((el) => {
            tasks.push(el);
        })

        db.setItem('tasks', tasks);
        new CheckList().renderTable();
    }

})

output.addEventListener('click', (ev) => {
    let blob = new Blob([JSON.stringify(tasks)], {
        type: "text/plain;charset=utf-8"
    });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
})