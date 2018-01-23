/* global Db */
let db = new Db(),
    tasks;
const CB_DONE = 'task-done-checkbox';
db.getItem('tasks').then(data => tasks = data || []);

window.addEventListener('load', () => {
    new CheckList().renderTable();
})

document.querySelector('#add-task').addEventListener('click', (ev) => {
    ev.preventDefault();
    new CheckList().addTask();
});

document.addEventListener('change', (ev) => {
    if (!ev.target.classList.contains(CB_DONE)) {
        return;
    }
    ev.target.parentNode.parentNode.classList.toggle('is-done');
    tasks.find((el, i, arr) => {
        if (el.name == ev.target.parentNode.nextElementSibling.innerHTML) {
            el.done = !el.done;
        }
    });
    db.setItem('tasks', tasks).then(() => {
        new CheckList().renderTable();
    });
})

document.addEventListener('change', (ev)=> {
    
    document.querySelectorAll('.is-done').forEach((el) => {
        if (document.getElementById('show-done').checked) return;
        el.style.display = 'none';
    })
})

document.getElementById('show-done').addEventListener('change', (ev) => {
    document.querySelectorAll('.is-done').forEach((el) => {
        if (el.style.display === 'none' && ev.target.checked) {
            new CheckList().renderTable();
        } else if (!ev.target.checked) {
            el.style.display = 'none';
        }
    })
})

class CheckList {
    renderTable() {
        let divContent = document.querySelector('.content');
        db.getItem('tasks')
            .then((data) => {
                let valueTable = '';
                data.map((item) => {
                    valueTable += `
            <div class="${item.done ? 'is-done' : ''} row ${item.priority === 'Важно' ? 'important' : ''}">
              <div class="col1"><input type="checkbox" class="${CB_DONE}" ${item.done ? ' checked': ''}></div>
              <div class="col2">${item.name}</div>
              <div class="col3">${item.priority}</div>
            </div>
          `
                });
                divContent.innerHTML = `
          <div class="table">
            <div class="row">
              <div class="${CB_DONE}-header col1">Сделано!</div>
              <div class="task-body-header col2">Задание</div>
              <div class="task-priority-header col3">Приоритет</div>
            </div>
            ${valueTable}
          </div>
        `;
            })

        if (document.getElementById('show-done').style.checked) return;
        document.querySelectorAll('.is-done').forEach((el) => {
            debugger;
            el.style.display = 'none';
        })
    }

    addTask() {
        let addedTask = {
            done: false,
            name: document.querySelector('#task-name').value,
            priority: document.querySelector('#task-priority').value
        }

        tasks.push(addedTask);
        db.setItem('tasks', tasks).then(() => {
            this.renderTable()
        });

        document.querySelector('form').reset();
    }
}