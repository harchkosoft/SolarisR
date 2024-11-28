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

      // Первый эффект: Размытие
      function startBlurEffect() {
        blurElement = document.createElement("div");
        blurElement.className = "blur-effect";
        document.body.appendChild(blurElement);

        const blurInterval = setInterval(() => {
          const randomBlur = 1;
          blurElement.style.filter = `blur(${randomBlur}px)`;

          if (Math.random() < 0.1) {
            const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.4)`;
            blurElement.style.backgroundColor = randomColor;
          }
        }, 50);

        setTimeout(() => {
          clearInterval(blurInterval);
          document.body.removeChild(blurElement);
          startSecondEffect();
        }, 80000); // Продолжительность первого эффекта
      }

      // Второй эффект: Вспышки
      function startSecondEffect() {
        flashElement = document.createElement("div");
        flashElement.className = "flash";
        document.body.appendChild(flashElement);

        const flashInterval = setInterval(() => {
          createFlash();
        }, 100);

        audio2
          .play()
          .then(() => {
            audio2.addEventListener("ended", () => {
              clearInterval(flashInterval);
              document.body.removeChild(flashElement);
              startThirdEffect();
            });
          })
          .catch((err) => console.error("Ошибка воспроизведения второго аудио:", err));
      }

      function createFlash() {
        const flash = document.createElement("div");
        flash.className = "flash";

        const size = 50;
        const rows = Math.ceil(window.innerHeight / size);
        const cols = Math.ceil(window.innerWidth / size);

        const canvasFlash = document.createElement("canvas");
        canvasFlash.width = window.innerWidth;
        canvasFlash.height = window.innerHeight;

        const ctxFlash = canvasFlash.getContext("2d");

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = col * size;
            const y = row * size;
            const colors = ["rgba(0, 255, 0, 0.8)", "rgba(128, 0, 128, 0.8)"];
            const color = colors[Math.floor(Math.random() * colors.length)];
            ctxFlash.fillStyle = color;
            ctxFlash.fillRect(x, y, size, size);
          }
        }

        flash.style.backgroundImage = `url(${canvasFlash.toDataURL()})`;
        document.body.appendChild(flash);

        flash.addEventListener("animationend", () => {
          document.body.removeChild(flash);
        });
      }

      // Третий эффект: Геометрические фигуры
      function startThirdEffect() {
        audio3
          .play()
          .then(() => {
            intervalId = setInterval(animate, 100); // Уменьшена задержка для более плавной анимации

            audio3.addEventListener("timeupdate", setAnimationSpeed);
            audio3.addEventListener("ended", () => {
              clearInterval(intervalId);
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              stopRainbowBackground(); // Останавливаем радужный фон, когда 3-й эффект завершен
            });

            // Начинаем радужный фон только после начала третьего эффекта
            changeBackground();
          })
          .catch((err) => console.error("Ошибка воспроизведения третьего аудио:", err));
      }

      // Генерация случайных данных для фигур
      function getRandomPosition(size) {
        return { x: Math.random() * (canvas.width - size), y: Math.random() * (canvas.height - size) };
      }

      function getRandomColor() {
        return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      }

      function getRandomSize() {
        // Размер фигур теперь от 150 до 375
        return 150 + Math.random() * 225;
      }

      function getRandomAngle() {
        return Math.random() * 360;
      }

      function drawShapes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const shapes = [
          { type: "square", size: getRandomSize(), color: getRandomColor(), angle: getRandomAngle() },
          { type: "circle", size: getRandomSize(), color: getRandomColor(), angle: getRandomAngle() },
          { type: "triangle", size: getRandomSize(), color: getRandomColor(), angle: getRandomAngle() },
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

      // Запуск первого эффекта
      document.body.addEventListener("click", () => {
        if (audio1.paused && audio2.paused && audio3.paused) {
          audio1
            .play()
            .then(() => startBlurEffect())
            .catch((err) => console.error("Ошибка воспроизведения первого аудио:", err));
        }
      });