/* global Db */
let db = new Db();
let tasks;
db.getItem('tasks').then(data => tasks = data || []); 

window.addEventListener('load', () => {
    new CheckList().renderTable();
})

document.querySelector('#add-task').addEventListener('click', (ev) => {
    ev.preventDefault();
    new CheckList().addTask();
});

document.addEventListener('change', (ev) => {
    if (ev.target.classList.contains('task-done-checkbox')) {
        ev.target.parentNode.parentNode.classList.toggle('is-done');
        tasks.find((el, i, arr) => {
            if (el.name == ev.target.parentNode.nextElementSibling.innerHTML) {
                el.done = !el.done;
            }
        });
        db.setItem('tasks', tasks).then(() => {
            new CheckList().renderTable();
        });
    }
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
            <tr class="${item.done ? 'is-done' : ''}">
              <td><input type="checkbox" class="task-done-checkbox" ${item.done ? ' checked': ''}></td>
              <td>${item.name}</td>
              <td>${item.priority}</td>
            </tr>
          `
                });
                divContent.innerHTML = `
          <table>
            <tr>
              <th class="task-done-checkbox-header">Сделано!</th>
              <th class="task-body-header">Задание</th>
              <th class="task-priority-header">Приоритет</th>
            </tr>
            ${valueTable}
          </table>
        `;
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