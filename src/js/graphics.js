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

const rainbowBackground = document.createElement("div");
rainbowBackground.className = "rainbow-background";
document.body.appendChild(rainbowBackground);

function changeBackground() {
  const changeTime = Math.random() * 1000 + 1500;

  rainbowBackgroundInterval = setTimeout(() => {
    const randomHue = Math.random() * 360;
    rainbowBackground.style.backgroundColor = `hsla(${randomHue}, 100%, 50%, 1)`;

    setTimeout(() => {
      rainbowBackground.style.backgroundColor = "";
    }, 150);

    changeBackground();
  }, changeTime);
}

function stopRainbowBackground() {
  clearTimeout(rainbowBackgroundInterval);
  rainbowBackground.style.backgroundColor = "";
}

function startBlurEffect() {
  blurElement = document.createElement("div");
  blurElement.className = "blur-effect";
  blurElement.style.position = "absolute";
  blurElement.style.top = "-50%";
  blurElement.style.left = "-50%";
  blurElement.style.width = "200vw";
  blurElement.style.height = "200vh";
  blurElement.style.pointerEvents = "none";
  blurElement.style.zIndex = "10";
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

  let isDarkening = false;
  let totalOffsetX = 0;
  let totalOffsetY = 0;
  const maxShake = 40;
  const shakeSpeed = 50;

  const blurInterval = setInterval(() => {
    const randomBlur = Math.random() * 5 + 5;
    blurElement.style.filter = `blur(${randomBlur}px)`;

    if (Math.random() < 0.1) {
      const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.4)`;
      blurElement.style.backgroundColor = randomColor;
    }

    if (!isDarkening && Math.random() < 0.2) {
      isDarkening = true;

      document.body.style.transition = "background-color 2s ease-in-out";
      document.body.style.backgroundColor = "rgba(0, 0, 0, 0.95)";

      setTimeout(() => {
        document.body.style.transition = "background-color 0.5s ease-in-out";
        document.body.style.backgroundColor = "";
        isDarkening = false;
      }, 4000);
    }

    createRandomSquare(squaresContainer);

    const shakeOffsetX = Math.random() * maxShake * 2 - maxShake;
    const shakeOffsetY = Math.random() * maxShake * 2 - maxShake;
    totalOffsetX += shakeOffsetX * 0.2;
    totalOffsetY += shakeOffsetY * 0.2;

    blurElement.style.transform = `
      translate(${totalOffsetX}px, ${totalOffsetY}px)
    `;

    squaresContainer.style.transform = `
      translate(${totalOffsetX}px, ${totalOffsetY}px)
    `;
  }, shakeSpeed);

  applyMeltEffect();

  setTimeout(() => {
    clearInterval(blurInterval);
    document.body.removeChild(blurElement);
    document.body.removeChild(squaresContainer);
    blurElement.style.transform = "";
    removeMeltEffect();
    startSecondEffect();
  }, 79245);
}

function createRandomSquare(container) {
  const square = document.createElement("div");
  square.style.position = "absolute";

  const size = Math.random() * 250 + 200;
  square.style.width = `${size}px`;
  square.style.height = `${size}px`;

  square.style.backgroundColor = `rgba(${Math.random() * 255}, ${
    Math.random() * 255
  }, ${Math.random() * 255}, 0.5)`;

  const x = Math.random() * (window.innerWidth - size);
  const y = Math.random() * (window.innerHeight - size);

  square.style.top = `${y}px`;
  square.style.left = `${x}px`;

  container.appendChild(square);

  setTimeout(() => {
    container.removeChild(square);
  }, Math.random() * 300 + 200);
}

function applyMeltEffect() {
  const meltFilter = document.createElement("style");
  meltFilter.innerHTML = `
    body {
      animation: meltEffect 2s infinite alternate ease-in-out;
    }

    @keyframes meltEffect {
      0% {
        filter: contrast(1.5) brightness(0.9) saturate(1.2) hue-rotate(0deg) blur(0px);
      }
      50% {
        filter: contrast(1.2) brightness(1.1) saturate(1.5) hue-rotate(20deg) blur(2px);
      }
      100% {
        filter: contrast(1.5) brightness(0.9) saturate(1.2) hue-rotate(-20deg) blur(1px);
      }
    }
  `;
  document.head.appendChild(meltFilter);
}

function removeMeltEffect() {
  const meltFilters = document.querySelectorAll("style");
  meltFilters.forEach((style) => {
    if (style.innerHTML.includes("meltEffect")) {
      document.head.removeChild(style);
    }
  });
  document.body.style.filter = "";
}

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

function getRandomAudioFile() {
  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  return audioFiles[randomIndex];
}
function startSecondEffect() {
  const flashElement = document.createElement("div");
  flashElement.className = "flash";
  document.body.appendChild(flashElement);

  const randomAudioFile = getRandomAudioFile();
  const audioElement = new Audio(randomAudioFile);
  audioElement.volume = 1;
  audioElement.play();

  const flashInterval = setInterval(() => {
    createFlash();
  }, 85);

  audioElement.addEventListener("ended", () => {
    clearInterval(flashInterval);
    document.body.removeChild(flashElement);
    startThirdEffect();
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

function createFlash() {
  const flash = document.createElement("div");
  flash.className = "flash";

  const size = 40;
  const rows = Math.ceil(window.innerHeight / size);
  const cols = Math.ceil(window.innerWidth / size);

  const canvasFlash = document.createElement("canvas");
  canvasFlash.width = window.innerWidth;
  canvasFlash.height = window.innerHeight;

  const ctxFlash = canvasFlash.getContext("2d");

  const colors = ["#00ff00", "#800080"];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * size;
      const y = row * size;
      const color = colors[Math.floor(Math.random() * colors.length)];
      ctxFlash.fillStyle = color;
      ctxFlash.fillRect(x, y, size, size);
    }
  }

  flash.style.backgroundImage = `url(${canvasFlash.toDataURL()})`;
  flash.style.animation = "flashAnimation 0.2s linear";

  document.body.appendChild(flash);

  addRandomText();

  flash.addEventListener("animationend", () => {
    document.body.removeChild(flash);
  });
}

function addRandomText() {
  const textElement = document.createElement("div");
  textElement.className = "flash-text";

  const randomPhrase =
    randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
  textElement.textContent = randomPhrase;

  textElement.style.position = "absolute";
  textElement.style.color = "white";
  textElement.style.fontFamily = "'Times New Roman', sans-serif";
  textElement.style.fontSize = "48px";
  textElement.style.fontWeight = "bold";
  textElement.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  textElement.style.padding = "10px 20px";
  textElement.style.borderRadius = "5px";
  textElement.style.pointerEvents = "none";

  const randomX = Math.random() * (window.innerWidth - 400);
  const randomY = Math.random() * (window.innerHeight - 100);
  textElement.style.top = `${randomY}px`;
  textElement.style.left = `${randomX}px`;

  document.body.appendChild(textElement);

  setTimeout(() => {
    document.body.removeChild(textElement);
  }, 300);
}

function startThirdEffect() {
  audio3
    .play()
    .then(() => {
      intervalId = setInterval(animate);

      audio3.addEventListener("timeupdate", setAnimationSpeed);
      audio3.addEventListener("ended", () => {
        clearInterval(intervalId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stopRainbowBackground();
      });

      changeBackground();
    })
    .catch((err) =>
      console.error("Ошибка воспроизведения третьего аудио:", err)
    );
}

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

function startFourthEffect() {
  const glitchBackground = document.createElement("div");
  glitchBackground.className = "glitch-background";
  document.body.appendChild(glitchBackground);

  const style = document.createElement("style");
  style.innerHTML = `
    .hollow-circle {
      position: absolute;
      border: 10px solid rgba(0, 255, 0, 0.9);
      border-radius: 50%;
      box-shadow: 0 0 30px 10px rgba(0, 255, 0, 0.8);
      pointer-events: none;
      opacity: 1;
      z-index: 1000;
      width: 150px;
      height: 150px;
      transition: width 1.5s, height 1.5s;
      transform-origin: center;
    }

    .hollow-circle.static {
      width: 750px;
      height: 750px;
    }
  `;
  document.head.appendChild(style);

  let activeCircles = 0;

  function createGrowingCircle() {
    if (activeCircles >= 2) return;
    activeCircles++;

    const circle = document.createElement("div");
    circle.className = "hollow-circle";

    const randomX = Math.random() * (window.innerWidth - 750);
    const randomY = Math.random() * (window.innerHeight - 750);

    circle.style.top = `${randomY}px`;
    circle.style.left = `${randomX}px`;

    document.body.appendChild(circle);

    setTimeout(() => {
      circle.classList.add("static");
    }, 10);

    setTimeout(() => {
      document.body.removeChild(circle);
      activeCircles--;
    }, 1500);
  }

  createGrowingCircle();
  setInterval(createGrowingCircle, 1000);

  const audio4 = new Audio("src/audio/4.mp3");
  audio4
    .play()
    .catch((err) =>
      console.error("Ошибка воспроизведения четвёртого аудио:", err)
    );

  audio4.addEventListener("ended", () => {
    document.body.removeChild(glitchBackground);
    document.head.removeChild(style);
    startFifthEffect();
  });
}

audio3.addEventListener("ended", () => {
  clearInterval(intervalId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stopRainbowBackground();
  startFourthEffect();
});

function startFifthEffect() {
  const audio5 = new Audio("src/audio/5.mp3");
  audio5
    .play()
    .catch((err) => console.error("Ошибка воспроизведения пятого аудио:", err));

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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  fifthEffectContainer.appendChild(renderer.domElement);

  renderer.setClearColor(0x000000, 0);

  const spheres = [];
  const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const borderGeometry = new THREE.SphereGeometry(0.055, 16, 16);
  const borderMaterial = new THREE.MeshBasicMaterial({
    color: 0x808080,
    opacity: 0.5,
    transparent: true,
  });

  const group = new THREE.Group();
  scene.add(group);

  for (let i = 0; i < 1000; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
    const border = new THREE.Mesh(borderGeometry, borderMaterial.clone());

    group.add(sphere);
    group.add(border);

    spheres.push({ sphere, border });
  }

  camera.position.z = 7;

  let colorShift = 0;
  let pulseTime = 0;
  const pulseFrequency = 50;
  const pulseSpeed = (pulseFrequency / 60) * Math.PI * 2;

  function updateBackground() {
    const colors = [
      new THREE.Color(0x550000),
      new THREE.Color(0x000000),
      new THREE.Color(0x333333),
      new THREE.Color(0x990000),
    ];

    const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    renderer.setClearColor(backgroundColor, 0.7);
  }

  const backgroundSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.9,
      transparent: true,
      side: THREE.BackSide,
    })
  );
  group.add(backgroundSphere);

  const rainbowColors = [
    new THREE.Color(0xff0000),
    new THREE.Color(0xff7f00),
    new THREE.Color(0xffff00),
    new THREE.Color(0x00ff00),
    new THREE.Color(0x0000ff),
    new THREE.Color(0x4b0082),
    new THREE.Color(0x8b00ff),
  ];

  let currentColorIndex = 0;
  let colorChangeTime = 0;

  let directionX = -1;
  let directionY = 1;

  group.position.x = 5;
  group.position.y = -3;

  function animate() {
    requestAnimationFrame(animate);

    colorShift += 0.01;
    pulseTime += pulseSpeed;
    colorChangeTime += 0.05;

    updateBackground();

    group.position.x += directionX * 0.01;
    group.position.y += directionY * 0.01;

    if (group.position.x < -5 || group.position.x > 5) {
      directionX *= -1;
    }
    if (group.position.y < -3 || group.position.y > 3) {
      directionY *= -1;
    }

    group.rotation.x += 0.01;
    group.rotation.y += 0.01;

    spheres.forEach(({ sphere, border }, index) => {
      const phi = Math.acos(-1 + (2 * index) / spheres.length);
      const theta = Math.sqrt(spheres.length * Math.PI) * phi;

      sphere.position.x = 1.5 * Math.sin(phi) * Math.cos(theta);
      sphere.position.y = 1.5 * Math.sin(phi) * Math.sin(theta);
      sphere.position.z = 1.5 * Math.cos(phi);

      border.position.x = sphere.position.x;
      border.position.y = sphere.position.y;
      border.position.z = sphere.position.z;

      const hue = (index / spheres.length + colorShift) % 1;
      sphere.material.color.setHSL(hue, 1, 0.5);

      const scale = 1 + 0.3 * Math.sin(pulseTime);
      sphere.scale.setScalar(scale);
      border.scale.setScalar(scale + 0.005);

      border.material.color.set(0x808080);
    });

    if (colorChangeTime > 0.8) {
      currentColorIndex = (currentColorIndex + 1) % rainbowColors.length;
      backgroundSphere.material.color.copy(rainbowColors[currentColorIndex]);
      colorChangeTime = 0;
    }

    renderer.render(scene, camera);
  }

  animate();

  audio5.addEventListener("ended", () => {
    document.body.removeChild(fifthEffectContainer);
  });
}

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
