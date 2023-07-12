$(document).ready(function () {
  const videoElement = document.getElementsByClassName('input_video')[0];
  const canvasElement = document.getElementsByClassName('output_canvas')[0];
  const canvasCtx = canvasElement.getContext('2d');
  let centerCoord = undefined;
  let nowCoord = undefined;

  function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        let coordinates = [1-landmarks[468].x, landmarks[468].y]


        if (centerCoord === undefined){
          centerCoord = coordinates;
        }
        nowCoord = coordinates;
        let coordinatesEvent = new CustomEvent('coordinates', {
            detail: {
                'x': nowCoord[0]-centerCoord[0],
                'y': nowCoord[1]-centerCoord[1],
            }
        })
        document.getElementById("board").dispatchEvent(coordinatesEvent);
        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
      }
    }
    canvasCtx.restore();
  }

  const faceMesh = new FaceMesh({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  faceMesh.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({image: videoElement});
    },
    width: 1280,
    height: 720
  });
  camera.start();

  $('body').on('keyup', function (e) {
        if (e.keyCode === 32) {
            centerCoord = nowCoord;
        }
  });
});