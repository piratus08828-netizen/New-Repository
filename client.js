const API_BASE = '/api';

const state = {
  currentScreen: 'screen-main-menu',
  token: localStorage.getItem('token') || '',
};

const toast = document.getElementById('toast');
const modal = document.getElementById('account-modal');
const levelsList = document.getElementById('levels-list');
const multiplayerFeed = document.getElementById('multiplayer-feed');

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2400);
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });
  state.currentScreen = screenId;

  if (screenId === 'screen-levels' || screenId === 'screen-multiplayer-feed') {
    void refreshLevels();
  }
}

async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

async function refreshLevels() {
  try {
    const { levels } = await api('/levels');
    const items = levels.map((level) => `<li><strong>${level.title}</strong><br>${level.description}<br><small>ID: ${level.id} · Автор: ${level.author}</small></li>`);
    levelsList.innerHTML = items.join('') || '<li>Пока нет опубликованных уровней.</li>';
    multiplayerFeed.innerHTML = items.join('') || '<li>Лента пустая.</li>';
  } catch (error) {
    showToast(error.message);
  }
}

async function handleAuth(event, mode) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    const payload = {
      username: String(formData.get('username') || ''),
      password: String(formData.get('password') || ''),
    };
    const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
    const result = await api(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    state.token = result.token;
    localStorage.setItem('token', result.token);
    showToast(`${mode === 'register' ? 'Регистрация' : 'Вход'} успешны`);
    modal.classList.add('hidden');
  } catch (error) {
    showToast(error.message);
  }
}

async function handlePublishLevel(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  try {
    const payload = {
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      data: String(formData.get('data') || '{}'),
    };

    const result = await api('/levels', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    showToast(`Уровень опубликован: ${result.level.id}`);
    event.currentTarget.reset();
    await refreshLevels();
  } catch (error) {
    showToast(error.message);
  }
}

document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => switchScreen(button.dataset.target));
});

document.getElementById('open-account-modal').addEventListener('click', () => {
  modal.classList.remove('hidden');
});

document.getElementById('close-account-modal').addEventListener('click', () => {
  modal.classList.add('hidden');
});

document.getElementById('register-form').addEventListener('submit', (event) => handleAuth(event, 'register'));
document.getElementById('login-form').addEventListener('submit', (event) => handleAuth(event, 'login'));
document.getElementById('publish-level-form').addEventListener('submit', handlePublishLevel);

void refreshLevels();
