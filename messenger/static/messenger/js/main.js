$(document).ready(function() {
  const canvas = $('#training-board');
  const video = $('#webcam')[0];
  const ctrack = new clm.tracker();
  ctrack.init();
  const overlay = $('#overlay')[0];
  const overlayCC = overlay.getContext('2d');
  const mirrorSelector = $('#mirror');
  const mirror = mirrorSelector[0];
  const mirrorCC = mirror.getContext('2d');

  let positionHistory = undefined;
  let faceRectHistory = [];
  let trainFaceRect = undefined;
  let train = true;

  function trackingLoop(stream) {
    // Проверим, обнаружено ли в видеопотоке лицо,
    // и если это так - начнём его отслеживать.
    requestAnimationFrame(trackingLoop);

    let currentPosition = ctrack.getCurrentPosition();
    overlayCC.clearRect(0, 0, 400, 300);
    mirrorCC.clearRect(0, 0, 400, 300);
    mirrorCC.drawImage(
        video,
        0, 0, 400, 300
      );

    if (currentPosition) {
      positionHistory = currentPosition;
      // Выведем линии, проведённые между контрольными точками
      // на элементе <canvas>, наложенном на элемент <video>
      ctrack.draw(overlay);



      // Получим прямоугольник, ограничивающий глаза, и обведём его
      // красными линиями
      const eyesRect = getEyesRectangle(currentPosition);
      overlayCC.strokeStyle = 'red';
      overlayCC.strokeRect(eyesRect[0], eyesRect[1], eyesRect[2], eyesRect[3]);
      const faceRect = getFaceRectangle(currentPosition);
      mirrorCC.strokeStyle = 'red';
      mirrorCC.strokeRect(faceRect[0], faceRect[1], faceRect[2], faceRect[3]);
      if (!train){
        mirrorCC.strokeStyle = 'green';
        mirrorCC.strokeRect(trainFaceRect[0], trainFaceRect[1], trainFaceRect[2], trainFaceRect[3]);
      }

      // Видеопоток может иметь особые внутренние параметры,
      // поэтому нам нужны эти константы для перемасштабирования
      // прямоугольника с глазами перед обрезкой
      const resizeFactorX = video.videoWidth / video.width;
      const resizeFactorY = video.videoHeight / video.height;

      // Вырезаем прямоугольник с глазами из видео и выводим его
      // в соответствующем элементе <canvas>
      const eyesCanvas = $('#eyes')[0];
      const eyesCC = eyesCanvas.getContext('2d');

      eyesCC.drawImage(
        video,
        eyesRect[0] * resizeFactorX, eyesRect[1] * resizeFactorY,
        eyesRect[2] * resizeFactorX, eyesRect[3] * resizeFactorY,
        0, 0, eyesCanvas.width, eyesCanvas.height
      );
    }
  }

  function onStreaming(stream) {
    video.srcObject = stream;
    ctrack.start(video);
    trackingLoop();
  }

  function getEyesRectangle(positions) {
    const minX = positions[23][0] - 5;
    const maxX = positions[28][0] + 5;
    const minY = positions[24][1] - 5;
    const maxY = positions[26][1] + 5;

    const width = maxX - minX;
    const height = maxY - minY;

    return [minX, minY, width, height];
  }
  function getFaceRectangle(positions) {
    const minX = positions[1][0] - 5;
    const maxX = positions[13][0] + 5;
    const minY = positions[7][1] - 5;
    const maxY = positions[20][1] + 5;
    const width = maxX - minX;
    const height = maxY - minY;
    return [minX, minY, width, height];
  }

  navigator.mediaDevices.getUserMedia({ video: true }).then(onStreaming);

  function getImage() {
    // Захват текущего изображения в виде тензора
    return tf.tidy(function() {
      const image = tf.browser.fromPixels($('#eyes')[0]);
      // Добавление <i><font color="#999999">измерения</font></i>:
      const batchedImage = image.expandDims(0);
      // Нормализация и возврат данных:
      return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    });
  }
  const dataset = {
    train: {
      n: 0,
      x: null,
      y: null,
    },
    val: {
      n: 0,
      x: null,
      y: null,
    },
  }

  function captureExample(coordinates) {
    // Возьмём самое свежее изображение глаз и добавим его в набор данных
    tf.tidy(function() {
      const image = getImage();
      const mousePos = tf.tensor1d([coordinates.x, coordinates.y]).expandDims(0);

      // Решим, в какую выборку (обучающую или контрольную) его добавлять
      const subset = dataset['train'];

      if (subset.x == null) {
        // Создадим новые тензоры
        subset.x = tf.keep(image);
        subset.y = tf.keep(mousePos);
      } else {
        // Конкатенируем их с существующими тензорами
        const oldX = subset.x;
        const oldY = subset.y;

        subset.x = tf.keep(oldX.concat(image, 0));
        subset.y = tf.keep(oldY.concat(mousePos, 0));
      }

      // Увеличим счётчик
      subset.n += 1;
    });
  }
  function pointCoordNormal (x, y){
    const pointCoord = {x:0, y:0};
    // Получим позицию указателя и нормализуем её, приведя к диапазону [-1, 1]
    pointCoord.x = (x / $(window).width()) * 2 - 1;
    pointCoord.y = (y / $(window).height()) * 2 - 1;
    return pointCoord;
  }

  function captureRectCoord(){
    let faceRec = getFaceRectangle(positionHistory);
    faceRectHistory.push(faceRec);
  }


  canvas.on('saveData', function (e){
    const coordinates = e.detail;
    const coordNormal = pointCoordNormal(coordinates.x, coordinates.y)
    captureExample(coordNormal);
    captureRectCoord();
  });
  let currentModel;

  function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 20,
      strides: 1,
      activation: 'relu',
      inputShape: [$('#eyes').height(), $('#eyes').width(), 3],
    }));

    model.add(tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2],
    }));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dropout(0.2));

    // Два выходных значения x и y
    model.add(tf.layers.dense({
      units: 2,
      activation: 'tanh',
    }));

    // Используем оптимизатор Adam с коэффициентом скорости обучения 0.0005 и с функцией потерь MSE
    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mae'],
    });

    return model;
  }

  function fitModel() {
    let batchSize = Math.floor(dataset.train.n * 0.1);
    if (batchSize < 4) {
      batchSize = 4;
    } else if (batchSize > 64) {
      batchSize = 64;
    }

    if (currentModel == null) {
      currentModel = createModel();
    }

    function onBatchEnd(batch, logs){
      console.log('Mae', logs.mae);
    }

    currentModel.fit(dataset.train.x, dataset.train.y, {
      batchSize: batchSize,
      epochs: 50,
      shuffle: true,
      callbacks: {onBatchEnd},
    }).then(info => {
      console.log('Final mae', info.history.mae)
    });
  }

  function createFaceRectCoord(){
    let minXSum = 0;
    let minYSum = 0;
    let widthSum = 0;
    let heightSum = 0;
    let n = faceRectHistory.length;
    for (let i=0; i < faceRectHistory.length; i++){
      minXSum+=faceRectHistory[i][0];
      minYSum+=faceRectHistory[i][1];
      widthSum+=faceRectHistory[i][2];
      heightSum+=faceRectHistory[i][3];
    }
    trainFaceRect = [minXSum/n,minYSum/n, widthSum/n, heightSum/n]
  }

  canvas.on('train', function (){
    createFaceRectCoord();
    fitModel();
    train = false
    setInterval(CursorPred, 100);
  });

  $('body').on('keyup', function (e) {
        if (e.keyCode === 32) {
            console.log(mirrorSelector.css('display'));
            if (mirrorSelector.css('display') === 'block'){
              mirrorSelector.css('display', 'none');
            } else {
              mirrorSelector.css('display', 'block');
            }
        }

  });
  function CursorPred(){
    const image = getImage();
    const prediction = currentModel.predict(image);
    const x = (prediction.dataSync()[0] + 1) / 2 * ($(window).width());
    const y = (prediction.dataSync()[1] + 1) / 2 * ($(window).height());
    let cursorPredEvent = new CustomEvent('cursorPredEvent', {detail:{x:x, y:y}})
    const canvas = document.getElementById('training-board');
    canvas.dispatchEvent(cursorPredEvent);
  }
});