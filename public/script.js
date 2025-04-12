// Получение и отображение списка
async function loadUsers() {
  const res = await fetch('/users');
  const users = await res.json();

  const list = document.getElementById('user-list');
  list.innerHTML = '';

  users.forEach(user => {
    const li = document.createElement('li');
    li.classList.add('user-item');

    // Создаём элементы вручную, а не через innerHTML — это безопаснее
    const span = document.createElement('span');
    span.textContent = `${user.name} (${user.email})`;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редактировать';
    editBtn.onclick = () => openEditModal(user.id, user.name, user.email);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.onclick = () => deleteUser(user.id);

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnGroup);

    list.appendChild(li);
  });
}

async function deleteUser(id) {
  if (!confirm('Удалить пользователя?')) return;

  await fetch(`/users/${id}`, { method: 'DELETE' });
  loadUsers();
}

function editUser(id, currentName, currentEmail) {
  const name = prompt('Новое имя:', currentName);
  const email = prompt('Новый email:', currentEmail);
  if (!name || !email) return;

  fetch(`/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  }).then(() => loadUsers());
}
function openEditModal(id, name, email) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = name;
  document.getElementById('edit-email').value = email;
  document.getElementById('edit-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

document.getElementById('edit-form').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('edit-name').value;
  const email = document.getElementById('edit-email').value;

  await fetch(`/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });

  closeModal();
  loadUsers();
});


  // Добавление нового пользователя
  document.getElementById('user-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
  
    await fetch('/users', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email })
    });
  
    document.getElementById('user-form').reset();
    loadUsers();
  });
  
  loadUsers();