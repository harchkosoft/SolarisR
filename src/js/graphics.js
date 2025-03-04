const audio1 = document.getElementById("audio1");
const audio2 = document.getElementById("audio2");
const audio3 = document.getElementById("audio3");
const canvas = document.getElementById("effectCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let blurElement;
let flashElement;
let intervalId;
let rainbowBackgroundInterval;

// Создание слоя радужного фона
const rainbowBackground = document.createElement("div");
rainbowBackground.className = "rainbow-background";
document.body.appendChild(rainbowBackground);

// Функция для рандомного изменения фона
function changeBackground() {
  // Случайное время для изменения фона (от 1.5 до 2.5 секунд)
  const changeTime = Math.random() * 1000 + 1500;

  // Таймер, который будет менять фон через случайный интервал
  rainbowBackgroundInterval = setTimeout(() => {
    // Генерация случайных радужных цветов
    const randomHue = Math.random() * 360;
    rainbowBackground.style.backgroundColor = `hsla(${randomHue}, 100%, 50%, 1)`;

    // Затем возвращаем фон обратно через 150 мс
    setTimeout(() => {
      rainbowBackground.style.backgroundColor = ""; // Возвращаем исходный фон
    }, 150);

    // Повторяем через случайный интервал
    changeBackground();
  }, changeTime);
}

// Остановка изменения фона после завершения 3-го эффекта
function stopRainbowBackground() {
  clearTimeout(rainbowBackgroundInterval);
  rainbowBackground.style.backgroundColor = ""; // Останавливаем смену фона
}

// Первый эффект: Размытие + Затемнение фона + Квадраты без анимации + Эффект плавления
function startBlurEffect() {
  blurElement = document.createElement("div");
  blurElement.className = "blur-effect";
  document.body.appendChild(blurElement);

  const squaresContainer = document.createElement("div");
  squaresContainer.style.position = "absolute";
  squaresContainer.style.top = "0";
  squaresContainer.style.left = "0";
  squaresContainer.style.width = "100vw";
  squaresContainer.style.height = "100vh";
  squaresContainer.style.pointerEvents = "none";
  squaresContainer.style.zIndex = "15";
  document.body.appendChild(squaresContainer);

  let isDarkening = false; // Флаг для затемнения
  let totalOffset = 0; // Накопленное смещение вправо-влево
  const maxShake = 10; // Максимальная амплитуда дрожания
  const shakeSpeed = 50; // Скорость обновления (миллисекунды)

  const blurInterval = setInterval(() => {
    const randomBlur = Math.random() * 5 + 5;
    blurElement.style.filter = `blur(${randomBlur}px)`;

    if (Math.random() < 0.1) {
      const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.4)`;
      blurElement.style.backgroundColor = randomColor;
    }

    // Затемнение фона
    if (!isDarkening && Math.random() < 0.05) {
      isDarkening = true;

      document.body.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      setTimeout(() => {
        isDarkening = false;
        document.body.style.backgroundColor = "";
      }, 1500);
    }

    // Создание случайных квадратов
    createRandomSquare(squaresContainer);

    // Эффект дрожания вправо-влево
    const shakeOffset = Math.random() * maxShake * 2 - maxShake; // Случайное смещение в пределах [-maxShake, +maxShake]
    totalOffset += shakeOffset * 0.1; // Накапливаем смещение (умеренно)
    document.body.style.transform = `translateX(${totalOffset}px)`; // Применяем смещение
  }, shakeSpeed);

  setTimeout(() => {
    clearInterval(blurInterval);
    document.body.removeChild(blurElement);
    document.body.removeChild(squaresContainer);
    document.body.style.transform = ""; // Сбрасываем transform после завершения эффекта
    startSecondEffect();
  }, 8000); // Продолжительность первого эффекта
}

// Функция для создания случайных квадратов
function createRandomSquare(container) {
  const square = document.createElement("div");
  square.style.position = "absolute";

  // Размер квадратов (от 200px до 450px)
  const size = Math.random() * 250 + 200;
  square.style.width = `${size}px`;
  square.style.height = `${size}px`;

  // Прозрачность 50%
  square.style.backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;

  // Случайное положение на экране
  const x = Math.random() * (window.innerWidth - size);
  const y = Math.random() * (window.innerHeight - size);

  square.style.top = `${y}px`;
  square.style.left = `${x}px`;

  container.appendChild(square);

  // Резкое исчезновение квадратов
  setTimeout(() => {
    container.removeChild(square); // Удаляем квадрат сразу
  }, Math.random() * 300 + 200); // Квадраты исчезают через случайный интервал (0.5-2 секунд)
}

// Функция для добавления эффекта плавления через CSS-фильтры
function applyMeltEffect() {
  const meltFilter = document.createElement("style");
  meltFilter.innerHTML = `
    body {
      filter: contrast(1.5) brightness(0.9) saturate(1.2);
      animation: meltEffect 2s infinite alternate;
    }

    @keyframes meltEffect {
      0% {
        filter: contrast(1.5) brightness(0.9) saturate(1.2);
      }
      50% {
        filter: contrast(1.2) brightness(1.1) saturate(1.5);
      }
      100% {
        filter: contrast(1.5) brightness(0.9) saturate(1.2);
      }
    }
  `;
  document.head.appendChild(meltFilter);
}

// Функция для удаления эффекта плавления
function removeMeltEffect() {
  const meltFilters = document.querySelectorAll("style");
  meltFilters.forEach((style) => {
    if (style.innerHTML.includes("meltEffect")) {
      document.head.removeChild(style);
    }
  });
  document.body.style.filter = ""; // Сбрасываем фильтр
}

// Глобальный массив аудиофайлов для второго эффекта
const audioFiles = [
  "src/audio/2.mp3",
  "src/audio/2a.mp3",
  "src/audio/2b.mp3",
  "src/audio/2c.mp3",
  "src/audio/2d.mp3",
  "src/audio/2e.mp3",
  "src/audio/2f.mp3",
  "src/audio/2g.mp3",
];

// Функция для случайного выбора аудиофайла
function getRandomAudioFile() {
  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  return audioFiles[randomIndex];
}
function startSecondEffect() {
  const flashElement = document.createElement("div");
  flashElement.className = "flash";
  document.body.appendChild(flashElement);

  // Случайный выбор аудиофайла из глобального массива
  const randomAudioFile = getRandomAudioFile();
  const audioElement = new Audio(randomAudioFile);
  audioElement.volume = 1;
  audioElement.play();

  // Интервал для создания вспышек
  const flashInterval = setInterval(() => {
    createFlash();
  }, 85); // Более частые и резкие вспышки

  // Остановка эффекта после завершения аудио
  audioElement.addEventListener("ended", () => {
    clearInterval(flashInterval);
    document.body.removeChild(flashElement);
    startThirdEffect(); // Переход к следующему эффекту
  });
}
const randomPhrases = [
  "Life is pain...",
  "I'm lost in the darkness.",
  "No one understands me.",
  "The world is meaningless.",
  "Escape is the only way out.",
  "Why bother trying?",
  "Alone in this world.",
  "There's no light at the end of the tunnel.",
  "Everything fades away.",
  "I don't belong here.",
  "Nothing really matters anymore.",
  "Silence is my only friend.",
  "I'm just a shadow.",
  "Every step feels heavier.",
  "No one would notice if I disappeared.",
  "The stars don't shine for me.",
  "Drowning in my own thoughts.",
  "Happiness is just an illusion.",
  "Everything I touch turns to dust.",
  "I'm screaming, but no one hears.",
  "My heart is as empty as my soul.",
  "The echoes of my past haunt me.",
  "Dreams crumble into nightmares.",
  "I wear a mask so no one sees the pain.",
  "Hope is a lie we tell ourselves.",
  "The cold embraces me like an old friend.",
  "I've forgotten how to feel anything.",
  "Every smile I force feels like a lie.",
  "I'm a ghost trapped in a body.",
  "Time drags on, but nothing changes.",
  "Love is just another way to suffer.",
  "I've given up on finding peace.",
  "I'm a stranger in my own life.",
  "All roads lead to the same emptiness.",
  "Memories hurt more than reality.",
  "Nothing I do ever matters.",
  "My thoughts are a prison I can't escape.",
  "I've lost myself somewhere along the way.",
  "Even my shadow leaves me in the dark.",
  "The weight of existence is unbearable.",
  "No one is coming to save me.",
  "The more I reach out, the further I fall.",
  "I'm nothing more than a passing whisper.",
  "The darkness is the only thing that's real.",
  "Even the sun feels cold to me.",
  "My reflection doesn't recognize me.",
  "I drift through life like a forgotten melody.",
  "I no longer believe in happy endings.",
  "All I see are broken dreams and empty promises.",
  "The wind carries my whispers into the void.",
  "Even silence feels too loud.",
  "My mind is a battlefield I can't win.",
  "No matter how much I sleep, I wake up exhausted.",
  "I wish I could just disappear forever.",
  "Every second feels like a lifetime of suffering.",
  "I don't even know who I am anymore.",
  "The pain never fades, it just changes shape.",
  "I fake a smile so no one asks questions.",
  "Some wounds never heal, they just stay hidden.",
  "I don't feel alive, just less dead.",
  "It's exhausting pretending I'm okay.",
  "The walls are closing in, and I don't care anymore.",
  "I keep waiting for something to change, but it never does.",
  "I'm just waiting for the day I finally let go.",
  "I'm tired of fighting a war I can't win.",
  "No one sees the storm inside me.",
  "I whisper for help, but the world is deaf.",
  "If I disappeared, how long would it take for anyone to notice?",
  "I don't belong anywhere, not even in my own skin.",
  "Every breath feels like a burden.",
  "I wake up hoping I won’t.",
  "Nothing is ever enough to fill the void.",
  "Even my dreams are empty.",
  "I feel like a mistake that shouldn't exist.",
  "The deeper I go, the harder it is to climb back up.",
  "It's not that I want to die, I just don't want to be here.",
  "I feel like a ghost pretending to be human.",
  "My own thoughts are my worst enemy.",
  "The weight of the past crushes me every day.",
  "I wish I could restart, or just stop.",
  "No matter how much I scream inside, no one hears.",
  "The world keeps moving, but I'm stuck in place.",
  "Nothing feels real anymore, not even me.",
  "I laugh so people don't see me breaking inside.",
  "I'm just running out of reasons to keep going.",
  "I keep thinking ‘what’s the point?’",
  "The pain is the only thing that reminds me I’m still here.",
  "Some days I wonder if I was meant to exist at all.",
  "I don’t cry anymore. Even that takes too much energy.",
  "People say it gets better, but they don’t know how deep the hole is.",
  "I'm just an empty shell, waiting to crack.",
  "Every goodbye feels like it should be the last.",
  "I wish I could tell someone, but the words never come.",
  "I'm drowning in my own mind, and no one sees it.",
  "Even the things I once loved feel hollow now.",
  "I keep waiting for the pain to stop, but it never does.",
  "It feels like I'm screaming into an empty world.",
  "I've been strong for too long, and I have nothing left.",
  "It’s not that I don’t care anymore. It’s that I don’t feel anything at all.",
  "Made of rotten flesh, every part of me decays.",
  "Pills work... for a moment. But nothing lasts forever.",
];

// Функция для создания вспышек
function createFlash() {
  const flash = document.createElement("div");
  flash.className = "flash";

  const size = 40; // Размер каждого квадратика
  const rows = Math.ceil(window.innerHeight / size);
  const cols = Math.ceil(window.innerWidth / size);

  const canvasFlash = document.createElement("canvas");
  canvasFlash.width = window.innerWidth;
  canvasFlash.height = window.innerHeight;

  const ctxFlash = canvasFlash.getContext("2d");

  // Оригинальные цвета: зеленый и фиолетовый
  const colors = ["#00ff00", "#800080"];

  // Рисуем квадратики на канве
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * size;
      const y = row * size;
      const color = colors[Math.floor(Math.random() * colors.length)];
      ctxFlash.fillStyle = color;
      ctxFlash.fillRect(x, y, size, size);
    }
  }

  // Применяем канву как фон вспышки
  flash.style.backgroundImage = `url(${canvasFlash.toDataURL()})`;
  flash.style.animation = "flashAnimation 0.2s linear"; // Быстрая анимация

  document.body.appendChild(flash);

  // Добавляем случайный текст
  addRandomText(); // Вызов функции для добавления текста

  flash.addEventListener("animationend", () => {
    document.body.removeChild(flash);
  });
}
// Функция для добавления случайного текста
function addRandomText() {
  const textElement = document.createElement("div");
  textElement.className = "flash-text";

  // Выбираем случайную фразу
  const randomPhrase = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
  textElement.textContent = randomPhrase;

  // Стилизация текста
  textElement.style.position = "absolute";
  textElement.style.color = "white";
  textElement.style.fontFamily = "'Times New Roman', sans-serif";
  textElement.style.fontSize = "48px";
  textElement.style.fontWeight = "bold";
  // textElement.style.textShadow = "0 0 15px black";
  textElement.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  textElement.style.padding = "10px 20px";
  textElement.style.borderRadius = "5px";
  textElement.style.pointerEvents = "none";

  // Случайная позиция текста
  const randomX = Math.random() * (window.innerWidth - 400);
  const randomY = Math.random() * (window.innerHeight - 100);
  textElement.style.top = `${randomY}px`;
  textElement.style.left = `${randomX}px`;

  // Добавляем текст на страницу
  document.body.appendChild(textElement);

  // Удаляем текст после завершения анимации
  setTimeout(() => {
    document.body.removeChild(textElement);
  }, 300); // Увеличим время до 300 мс, чтобы текст был заметнее
}
// function testText() {
//   addRandomText();
// }

// setTimeout(testText, 1); // Добавляем текст через 1 секунду
// Третий эффект: Геометрические фигуры
function startThirdEffect() {
  audio3
    .play()
    .then(() => {
      intervalId = setInterval(animate);

      audio3.addEventListener("timeupdate", setAnimationSpeed);
      audio3.addEventListener("ended", () => {
        clearInterval(intervalId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stopRainbowBackground(); // Останавливаем радужный фон, когда 3-й эффект завершен
      });

      // Начинаем радужный фон только после начала третьего эффекта
      changeBackground();
    })
    .catch((err) =>
      console.error("Ошибка воспроизведения третьего аудио:", err)
    );
}

// Генерация случайных данных для фигур
function getRandomPosition(size) {
  return {
    x: Math.random() * (canvas.width - size),
    y: Math.random() * (canvas.height - size),
  };
}

function getRandomColor() {
  return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  }, 0.5)`;
}

function getRandomSize() {
  // Размер фигур теперь от 150 до 375
  return 150 + Math.random() * 500;
}

function getRandomAngle() {
  return Math.random() * 360;
}

function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const shapes = [
    {
      type: "square",
      size: getRandomSize(),
      color: getRandomColor(),
      angle: getRandomAngle(),
    },
    {
      type: "circle",
      size: getRandomSize(),
      color: getRandomColor(),
      angle: getRandomAngle(),
    },
    {
      type: "triangle",
      size: getRandomSize(),
      color: getRandomColor(),
      angle: getRandomAngle(),
    },
  ];

  shapes.forEach((shape) => {
    const { x, y } = getRandomPosition(shape.size);

    ctx.save();
    ctx.translate(x + shape.size / 2, y + shape.size / 2);
    ctx.rotate((shape.angle * Math.PI) / 180);

    if (shape.type === "square") {
      ctx.beginPath();
      ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      ctx.fillStyle = shape.color;
      ctx.fill();
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = shape.color;
      ctx.fill();
    } else if (shape.type === "triangle") {
      ctx.beginPath();
      ctx.moveTo(-shape.size / 2, shape.size / 2);
      ctx.lineTo(0, -shape.size / 2);
      ctx.lineTo(shape.size / 2, shape.size / 2);
      ctx.closePath();
      ctx.fillStyle = shape.color;
      ctx.fill();
    }

    ctx.restore();
  });
}

// Настройка скорости анимации в зависимости от времени проигрывания звука
function setAnimationSpeed() {
  const currentTime = audio3.currentTime;
  clearInterval(intervalId);

  if (currentTime < 16) intervalId = setInterval(animate, 200);
  else if (currentTime < 25) intervalId = setInterval(animate, 120);
  else intervalId = setInterval(animate, 95);
}

function animate() {
  drawShapes();
}
// Четвёртый эффект: Мгновенные выколотые круги с увеличением
// Четвёртый эффект: Резкие растущие круги без анимации, увеличивающиеся из центра
function startFourthEffect() {
  // Создание мерцающего и искажённого фона
  const glitchBackground = document.createElement("div");
  glitchBackground.className = "glitch-background";
  document.body.appendChild(glitchBackground);

  // Стили для круга и искажения
  const style = document.createElement("style");
  style.innerHTML = `
    .hollow-circle {
      position: absolute;
      border: 10px solid rgba(0, 255, 0, 0.9); /* Фиксированный цвет */
      border-radius: 50%;
      box-shadow: 0 0 30px 10px rgba(0, 255, 0, 0.8);
      pointer-events: none;
      opacity: 1;
      z-index: 1000;
      width: 150px;
      height: 150px;
      transition: width 1.5s, height 1.5s; /* Увеличение размера за 1.5 секунды */
      transform-origin: center; /* Увеличение из центра */
    }

    .hollow-circle.static {
      width: 750px;
      height: 750px;
    }
  `;
  document.head.appendChild(style);

  let activeCircles = 0; // Счётчик активных кругов

  // Функция для создания круга
  function createGrowingCircle() {
    if (activeCircles >= 2) return; // Ограничение до 2 кругов одновременно

    activeCircles++;

    const circle = document.createElement("div");
    circle.className = "hollow-circle";

    // Случайное расположение (центр круга будет в этом месте)
    const randomX = Math.random() * (window.innerWidth - 750);
    const randomY = Math.random() * (window.innerHeight - 750);

    circle.style.top = `${randomY}px`;
    circle.style.left = `${randomX}px`;

    document.body.appendChild(circle);

    // Увеличиваем круг до 750px за 1.5 секунды
    setTimeout(() => {
      circle.classList.add("static");
    }, 10); // Начнём увеличивать почти сразу

    // Удаляем круг после завершения
    setTimeout(() => {
      document.body.removeChild(circle);
      activeCircles--;
    }, 1500); // Круг остаётся 1.5 секунды
  }

  // Запускаем круги с интервалом
  createGrowingCircle(); // Первый круг сразу
  setInterval(createGrowingCircle, 1000); // Следующий круг каждые 1 секунду

  // Аудио для 4-го эффекта
  const audio4 = new Audio("src/audio/4.mp3");
  audio4
    .play()
    .catch((err) =>
      console.error("Ошибка воспроизведения четвёртого аудио:", err)
    );

  // Завершение эффекта
  audio4.addEventListener("ended", () => {
    document.body.removeChild(glitchBackground);
    document.head.removeChild(style);
    startFifthEffect(); // Запуск пятого эффекта
  });
}

// Переход от третьего к четвёртому эффекту
audio3.addEventListener("ended", () => {
  clearInterval(intervalId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stopRainbowBackground(); // Останавливаем радужный фон
  startFourthEffect(); // Запуск четвёртого эффекта
});
function startFifthEffect() {
  const audio5 = new Audio("src/audio/5.mp3");
  audio5
  .play()
  .catch((err) => console.error("Ошибка воспроизведения пятого аудио:", err));
  
  // Контейнер для эффекта
  const fifthEffectContainer = document.createElement("div");
  fifthEffectContainer.id = "fifth-effect";
  fifthEffectContainer.style.position = "absolute";
  fifthEffectContainer.style.top = "0";
  fifthEffectContainer.style.left = "0";
  fifthEffectContainer.style.width = "100%";
  fifthEffectContainer.style.height = "100%";
  fifthEffectContainer.style.pointerEvents = "none";
  fifthEffectContainer.style.zIndex = "999";
  document.body.appendChild(fifthEffectContainer);
  
  // Инициализация Three.js
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true }); // Прозрачный фон
  renderer.setSize(window.innerWidth, window.innerHeight);
  fifthEffectContainer.appendChild(renderer.domElement);
  
  // Устанавливаем прозрачный фон
  renderer.setClearColor(0x000000, 0); // Черный фон с полной прозрачностью
  
  const spheres = [];
  const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16); // Маленькие сферы
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Для радужной сферы
  
  const borderGeometry = new THREE.SphereGeometry(0.055, 16, 16); // Немного большая сфера для бордера
  const borderMaterial = new THREE.MeshBasicMaterial({
  color: 0x808080, // Серый цвет для бордера
  opacity: 0.5, // Немного прозрачности, чтобы увидеть радужный цвет
  transparent: true, // Включаем прозрачность
  });
  
  const group = new THREE.Group(); // Группа для управления всеми сферами
  scene.add(group);
  
  for (let i = 0; i < 1000; i++) {
  // Сфера с радужным цветом
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
  // Бордер
  const border = new THREE.Mesh(borderGeometry, borderMaterial.clone());
  
  group.add(sphere);
  group.add(border); // Добавляем бордер вокруг каждой сферы
  
  spheres.push({ sphere, border }); // Храним пары для дальнейшего использования
  }
  
  camera.position.z = 5;
  
  let colorShift = 0; // Для смены цветов
  let sphereOffset = 0; // Смещение для диагонального движения
  let pulseTime = 0; // Время для синхронной пульсации
  const pulseFrequency = 50; // Частота пульсации в ударах в минуту
  const pulseSpeed = (pulseFrequency / 60) * Math.PI * 2; // Сколько радиан наращивается за один кадр для пульсации
  
  // Функция для обновления фона
  function updateBackground() {
  const colors = [
  new THREE.Color(0x550000), // Темно-красный
  new THREE.Color(0x000000), // Черный
  new THREE.Color(0x333333), // Темно-серый
  new THREE.Color(0x990000), // Красный
  ];
  
  // Меняем фон с плавными переходами
  const backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Добавляем прозрачность (например, 0.7)
  scene.background = backgroundColor * 1;
  
  // Устанавливаем прозрачность фона через setClearColor
  renderer.setClearColor(backgroundColor, 0.7); // Устанавливаем прозрачность фона в 0.7
  }
  
  // Анимация и обновление фона
  function animate() {
  requestAnimationFrame(animate);
  
  colorShift += 0.01; // Плавное изменение цвета
  sphereOffset += 0.005; // Смещение для диагонального движения
  pulseTime += pulseSpeed; // Время для пульсации
  
  updateBackground(); // Обновляем фон
  
  // Диагональное движение группы
  group.position.x = Math.sin(sphereOffset) * 1.5; // Движение по X
  group.position.y = Math.cos(sphereOffset) * 1.5; // Движение по Y
  
  // Распределение в форме сферы
  spheres.forEach(({ sphere, border }, index) => {
  const phi = Math.acos(-1 + (2 * index) / spheres.length);
  const theta = Math.sqrt(spheres.length * Math.PI) * phi;
  
  sphere.position.x = 1.5 * Math.sin(phi) * Math.cos(theta);
  sphere.position.y = 1.5 * Math.sin(phi) * Math.sin(theta);
  sphere.position.z = 1.5 * Math.cos(phi);
  
  border.position.x = sphere.position.x;
  border.position.y = sphere.position.y;
  border.position.z = sphere.position.z;
  
  // Цвет сферы плавно меняется на радужный
  const hue = (index / spheres.length + colorShift) % 1; // Радужный цвет на основе индекса
  sphere.material.color.setHSL(hue, 1, 0.5); // Изменяем основной цвет на радужный
  
  // Быстрая синхронная пульсация с частотой 120 ударов в минуту
  const scale = 1 + 0.3 * Math.sin(pulseTime); // Пульсация с амплитудой 0.3
  sphere.scale.setScalar(scale);
  border.scale.setScalar(scale + 0.005); // Бордер немного больше, но очень маленький
  
  // Серый цвет для бордера с прозрачностью
  border.material.color.set(0x808080);
  });
  
  // Вращение группы для создания ощущения 3D
  group.rotation.x += 0.01;
  group.rotation.y += 0.01;
  
  renderer.render(scene, camera);
  }
  
  animate();
  
  audio5.addEventListener("ended", () => {
  document.body.removeChild(fifthEffectContainer);
  });
  }
// Запуск первого эффекта

document.body.addEventListener("click", () => {
  if (audio1.paused && audio2.paused && audio3.paused) {
    audio1
      .play()
      .then(() => startBlurEffect())
      .catch((err) =>
        console.error("Ошибка воспроизведения первого аудио:", err)
      );
  }
});
