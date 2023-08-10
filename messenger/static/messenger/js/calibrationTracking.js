$(document).ready(function () {
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');

    function vector_len(x1, y1, x2, y2){
        return Math.sqrt((x1-x2)**2+(y1-y2)**2)
    }

    function onResults(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                let paramEvent = new CustomEvent('eyeParam', {
                    detail: {
                        'right': vector_len(landmarks[468].x, landmarks[468].y, landmarks[33].x, landmarks[33].y),
                        'left': vector_len(landmarks[468].x, landmarks[468].y, landmarks[133].x, landmarks[133].y),
                        'top': vector_len(landmarks[468].x, landmarks[468].y, landmarks[223].x, landmarks[223].y),
                        'bottom': vector_len(landmarks[468].x, landmarks[468].y, landmarks[230].x, landmarks[230].y),
                    }
                });
                document.getElementById("calibrationScreen").dispatchEvent(paramEvent);
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

});