$(document).ready(function () {
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');
    let leftTimer = undefined;
    let rightTimer = undefined;
    let topTimer = undefined;
    let bottomTimer = undefined;

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
                let nowTime = new Date();
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[33].x, landmarks[33].y) <= 0.014){
                    if (rightTimer === undefined || nowTime.getTime() - rightTimer.getTime() > 1000) {

                        rightTimer = new Date();


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'right',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[133].x, landmarks[133].y) <= 0.019){
                    if (leftTimer === undefined || nowTime.getTime() - leftTimer.getTime() > 1000) {

                        leftTimer = new Date();


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'left',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[223].x, landmarks[223].y) <= 0.035){
                    if (topTimer === undefined || nowTime.getTime() - topTimer.getTime() > 1000) {

                        topTimer = new Date();


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'top',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[23].x, landmarks[23].y) <= 0.019){
                    if (bottomTimer === undefined || nowTime.getTime() - bottomTimer.getTime() > 1000) {

                        bottomTimer = new Date();


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'bottom',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                }
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