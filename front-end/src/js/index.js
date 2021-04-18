import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import '../css/style.css';


const BASE_URL = 'http://localhost:3000/users';

/**
 * Mostra o alerta de erro se ocorreu um e o esconde caso contrário.
 * @param {Boolean} hasError Informa se há erro na operação.
 * @void
 */
 function showError(hasError) {
  const errorMsg = document.getElementById('error-msg');

  if (hasError) {
    errorMsg.classList.remove('hide');
    return;
  }

  errorMsg.classList.add('hide');
}

/**
 * Solicita à API a exclusão de um usuário e remove o item da lista de usuário
 * caso a requisição retorne com sucesso.
 * @param {String} userId O ID de usuário fornecido pela API.
 * @void
 */
function deleteUser(event) {
  const userId = event.target.parentElement.id;
  const url = `${BASE_URL}/${userId}`;

  axios
    .delete(url)
    .then(({ status }) => {
      if (status === 200) {
        const user = document.getElementById(userId);
        user.remove();
      }
    })
    .catch((error) => {
      showError(true);
      console.error('[deleteUser] Error: ', error);
    });
}

/**
 * Cria na tela uma lista de usuários com um botão ao lado de cada um para
 * excluir o respectivo item.
 * @param {Array} users Lista de objetos com `name` e `id`.
 * @void
 */
function showUsersList(users) {
  const usersNotFound = document.getElementById('users-not-found');

  if (users.length) {
    usersNotFound.classList.add('hide');

    users.forEach((user) => {
      appendUser(user.id, user.name);
    });

    return;
  }

  usersNotFound.classList.remove('hide');
}

/**
 * Obtém a lista de usuários cadastrados e chama a função que exibe
 * os usuário na tela ou exibe um erro se houver a ocorrência de um.
 * @void
 */
function getUsers() {
  const loadingMsg = document.getElementById('users-loading');
  loadingMsg.classList.remove('hide');

  axios
    .get(BASE_URL)
    .then(({ data, status }) => {
      if (status === 200) {
        showUsersList(data);
        loadingMsg.classList.add('hide');
      }
    })
    .catch((error) => {
      showError(true);
      console.error('[getUsers] Error: ', error);
    });
}

/**
 * Adiciona um item a lista de usuários apresentada na página. É mostrado o nome
 * e um botão para excluir o respectivo registro.
 * @param {String} id UUID que identifica o usuário.
 * @param {String} name Nome do usuário.
 * @void
 */
function appendUser(id, name) {
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn--delete');
  deleteButton.innerText = 'Excluir';
  deleteButton.addEventListener('click', deleteUser);

  const usersListItem = document.createElement('li');
  usersListItem.setAttribute('id', id);
  usersListItem.classList.add('users__list__item');
  usersListItem.innerText = name;
  usersListItem.appendChild(deleteButton);
  
  const usersList = document.getElementById('js-users-list');
  usersList.appendChild(usersListItem);
}

/**
 * Solicita à API a adição de um novo usuário ao banco.
 * @param {String} name Nome do noov usuário.
 * @void
 */
function addUser(e) {
  e.preventDefault();
  showError(false);

  const newUser = document.getElementById('new-user').value;
  const id = uuidv4();
  const name = newUser;
  const params = {
    id,
    name,
  };

  axios
    .post(BASE_URL, params)
    .then((response) => {
      if (response.status === 201) appendUser(id, name);
    })
    .catch((error) => {
      showError(true);
      console.error('[addUser] error: ', error);
    });
}

const addUserButton = document.getElementById('add-user');
addUserButton.addEventListener('click', addUser);

getUsers();