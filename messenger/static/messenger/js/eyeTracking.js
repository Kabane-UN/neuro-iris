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
                    leftTimer = undefined;
                    bottomTimer = undefined;
                    topTimer = undefined;
                    if(rightTimer === undefined){
                        rightTimer = new Date();
                    } else if (nowTime.getTime() - rightTimer.getTime() > 1000) {

                        rightTimer = undefined;


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'right',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[133].x, landmarks[133].y) <= 0.019){
                    rightTimer = undefined;
                    bottomTimer = undefined;
                    topTimer = undefined;
                    if (leftTimer === undefined){
                        leftTimer = new Date();
                    } else if ( nowTime.getTime() - leftTimer.getTime() > 1000) {

                        leftTimer = undefined;


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'left',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[223].x, landmarks[223].y) <= 0.035){
                    rightTimer = undefined;
                    bottomTimer = undefined;
                    leftTimer = undefined;
                    if(topTimer === undefined){
                        topTimer = new Date();
                    } else if ( nowTime.getTime() - topTimer.getTime() > 1000) {

                        topTimer = undefined;


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'top',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[23].x, landmarks[23].y) <= 0.019){
                    rightTimer = undefined;
                    leftTimer = undefined;
                    topTimer = undefined;
                    if (bottomTimer === undefined){
                        bottomTimer = new Date();
                    } else if ( nowTime.getTime() - bottomTimer.getTime() > 1000) {
                        bottomTimer = undefined;



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