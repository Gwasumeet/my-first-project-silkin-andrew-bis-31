const API_URL = 'http://localhost:3000/api';

const form = document.getElementById('register-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const formMessage = document.getElementById('form-message');
const submitBtn = document.getElementById('submit-btn');

const userList = document.getElementById('user-list');
const loadingUsers = document.getElementById('loading-users');

async function loadUsers() {
    loadingUsers.style.display = 'block';
    userList.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const users = await response.json();

        if (users.length === 0) {
            userList.innerHTML = '<li>Нет зарегистрированных пользователей</li>';
        } else {
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email})`;
                li.dataset.id = user.id;
                li.addEventListener('click', deleteUser);
                userList.appendChild(li);
            });
        }
    } catch (error) {
        userList.innerHTML = `<li style="color:red;">Ошибка загрузки: ${error.message}</li>`;
    } finally {
        loadingUsers.style.display = 'none';
    }
}

async function deleteUser(event) {
    const li = event.currentTarget;
    const id = li.dataset.id;

    if (!confirm(`Удалить пользователя ${li.textContent}?`)) return;

    try {
        const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Ошибка удаления: ${response.status}`);
        li.remove();
        if (userList.children.length === 0) {
            userList.innerHTML = '<li>Нет зарегистрированных пользователей</li>';
        }
    } catch (error) {
        alert(error.message);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    nameError.textContent = '';
    emailError.textContent = '';
    formMessage.textContent = '';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name) {
        nameError.textContent = 'Имя обязательно';
        return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
        emailError.textContent = 'Некорректный email';
        return;
    }

    formMessage.style.color = 'blue';
    formMessage.textContent = 'Отправка данных...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Ошибка при регистрации');

        formMessage.style.color = 'green';
        formMessage.textContent = 'Регистрация успешна!';
        nameInput.value = '';
        emailInput.value = '';

        loadUsers();

        setTimeout(() => { formMessage.textContent = ''; }, 3000);

    } catch (error) {
        formMessage.textContent = '';
        if (error.message.includes('уже существует')) {
            emailError.textContent = error.message;
        } else {
            alert(`Ошибка: ${error.message}`);
        }
    } finally {
        submitBtn.disabled = false;
    }
});

loadUsers();