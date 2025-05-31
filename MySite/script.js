
// Игровые переменные
let gameState = {
    score: 0,
    level: 1,
    coins: 0,
    playerPosition: { x: 50, y: 50 },
    isGameActive: false,
    achievements: {
        firstCoin: false,
        collector: false,
        master: false
    }
};

// Элементы DOM
let elements = {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Красивый сайт успешно загружен! Наслаждайтесь интерактивностью!');
    
    initializeElements();
    setupEventListeners();
    createParticles();
    startGame();
});

// Инициализация элементов
function initializeElements() {
    elements = {
        score: document.getElementById('score'),
        level: document.getElementById('level'),
        coins: document.getElementById('coins'),
        player: document.getElementById('player'),
        startBtn: document.getElementById('startGame'),
        gameArea: document.querySelector('.game-area'),
        collectibles: document.querySelector('.collectibles'),
        navBtns: document.querySelectorAll('.nav-btn'),
        sections: document.querySelectorAll('.section'),
        gameBtns: document.querySelectorAll('.game-btn'),
        achievements: document.querySelectorAll('.achievement')
    };
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Навигация
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });
    
    // Кнопка старта игры
    elements.startBtn.addEventListener('click', startMiniGame);
    
    // Игровые кнопки
    elements.gameBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const gameType = e.target.closest('.game-card').dataset.game;
            playGame(gameType);
        });
    });
    
    // Управление игроком
    document.addEventListener('keydown', handlePlayerMovement);
    
    // Клики по социальным ссылкам
    document.querySelectorAll('.social-links span').forEach(link => {
        link.addEventListener('click', () => {
            link.style.transform = 'scale(1.5) rotate(360deg)';
            setTimeout(() => {
                link.style.transform = '';
            }, 300);
        });
    });
}

// Переключение секций
function switchSection(sectionId) {
    // Обновляем активную кнопку навигации
    elements.navBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Обновляем активную секцию
    elements.sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // Добавляем эффект
    const activeSection = document.getElementById(sectionId);
    activeSection.style.animation = 'none';
    setTimeout(() => {
        activeSection.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

// Запуск мини-игры
function startMiniGame() {
    gameState.isGameActive = true;
    elements.startBtn.textContent = 'Игра активна!';
    elements.startBtn.disabled = true;
    
    // Создаем монеты
    createCoins();
    
    // Анимация кнопки
    elements.startBtn.classList.add('pulse');
    
    setTimeout(() => {
        elements.startBtn.textContent = 'Начать игру';
        elements.startBtn.disabled = false;
        elements.startBtn.classList.remove('pulse');
        gameState.isGameActive = false;
    }, 30000);
}

// Создание монет
function createCoins() {
    const coinInterval = setInterval(() => {
        if (!gameState.isGameActive) {
            clearInterval(coinInterval);
            return;
        }
        
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.textContent = '🪙';
        coin.style.left = Math.random() * 80 + 10 + '%';
        coin.style.top = Math.random() * 70 + 10 + '%';
        
        coin.addEventListener('click', () => collectCoin(coin));
        
        elements.collectibles.appendChild(coin);
        
        // Удаляем монету через 5 секунд
        setTimeout(() => {
            if (coin.parentNode) {
                coin.remove();
            }
        }, 5000);
        
    }, 1000);
}

// Сбор монет
function collectCoin(coin) {
    gameState.coins++;
    gameState.score += 10;
    
    updateGameStats();
    checkAchievements();
    
    // Анимация сбора
    coin.classList.add('collected');
    
    setTimeout(() => {
        if (coin.parentNode) {
            coin.remove();
        }
    }, 500);
    
    // Эффект на игроке
    elements.player.classList.add('pulse');
    setTimeout(() => {
        elements.player.classList.remove('pulse');
    }, 300);
}

// Управление игроком
function handlePlayerMovement(e) {
    if (!gameState.isGameActive) return;
    
    const step = 5;
    const gameAreaRect = elements.gameArea.getBoundingClientRect();
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            gameState.playerPosition.y = Math.max(5, gameState.playerPosition.y - step);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            gameState.playerPosition.y = Math.min(85, gameState.playerPosition.y + step);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            gameState.playerPosition.x = Math.max(5, gameState.playerPosition.x - step);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            gameState.playerPosition.x = Math.min(85, gameState.playerPosition.x + step);
            break;
    }
    
    elements.player.style.left = gameState.playerPosition.x + '%';
    elements.player.style.top = gameState.playerPosition.y + '%';
}

// Обновление статистики игры
function updateGameStats() {
    elements.score.textContent = gameState.score;
    elements.coins.textContent = gameState.coins;
    elements.level.textContent = Math.floor(gameState.score / 100) + 1;
}

// Проверка достижений
function checkAchievements() {
    // Первая монета
    if (gameState.coins >= 1 && !gameState.achievements.firstCoin) {
        unlockAchievement(0, 'firstCoin');
    }
    
    // Коллекционер
    if (gameState.coins >= 10 && !gameState.achievements.collector) {
        unlockAchievement(1, 'collector');
    }
    
    // Мастер игр
    if (gameState.score >= 100 && !gameState.achievements.master) {
        unlockAchievement(2, 'master');
    }
}

// Разблокировка достижения
function unlockAchievement(index, achievementKey) {
    gameState.achievements[achievementKey] = true;
    const achievement = elements.achievements[index];
    
    achievement.classList.remove('locked');
    achievement.classList.add('unlocked');
    achievement.classList.add('pulse');
    
    // Показываем уведомление
    showNotification(`🎉 Достижение разблокировано: ${achievement.querySelector('h3').textContent}!`);
    
    setTimeout(() => {
        achievement.classList.remove('pulse');
    }, 1000);
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Игровые функции
function playGame(gameType) {
    const messages = {
        puzzle: 'Загружается игра "Пазлы"... 🧩',
        memory: 'Запускается тренировка памяти... 🧠',
        arcade: 'Включается аркадный режим... 🕹️'
    };
    
    showNotification(messages[gameType]);
    
    // Добавляем очки за попытку
    gameState.score += 5;
    updateGameStats();
    checkAchievements();
}

// Создание частиц
function createParticles() {
    const particles = document.querySelector('.particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #6366f1;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            opacity: ${0.3 + Math.random() * 0.7};
        `;
        particles.appendChild(particle);
    }
}

// Стартовая функция
function startGame() {
    // Анимация загрузки
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in';
        document.body.style.opacity = '1';
    }, 100);
    
    // Первоначальное обновление статистики
    updateGameStats();
    
    // Автоматическое увеличение счета каждые 10 секунд
    setInterval(() => {
        if (gameState.isGameActive) {
            gameState.score += 1;
            updateGameStats();
            checkAchievements();
        }
    }, 10000);
}

// CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;
document.head.appendChild(style);
