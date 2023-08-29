$(document).ready(function () {
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');
    let leftTimer = undefined;
    let rightTimer = undefined;
    let topTimer = undefined;
    let bottomTimer = undefined;
    let trackingReady = false;

    function vector_len(x1, y1, x2, y2){
        return Math.sqrt((x1-x2)**2+(y1-y2)**2)
    }

    function onResults(results) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiFaceLandmarks) {
            if (!trackingReady){
                let readyEvent = new CustomEvent('trackingReady');
                document.getElementById("board").dispatchEvent(readyEvent);
                document.getElementById("arrowBoard").dispatchEvent(readyEvent);
                document.getElementById("timer").dispatchEvent(readyEvent);
                trackingReady = true;
            }
            for (const landmarks of results.multiFaceLandmarks) {
                let dataEvent = new CustomEvent('data', {
                    detail: {
                        'rightIdeal': rightDist,
                        'rightNow': vector_len(landmarks[468].x, landmarks[468].y, landmarks[33].x, landmarks[33].y),
                        'leftIdeal': leftDist,
                        'leftNow': vector_len(landmarks[468].x, landmarks[468].y, landmarks[133].x, landmarks[133].y),
                        'topIdeal': topDist,
                        'topNow': vector_len(landmarks[468].x, landmarks[468].y, landmarks[223].x, landmarks[223].y),
                        'bottomIdeal': bottomDist,
                        'bottomNow': vector_len(landmarks[468].x, landmarks[468].y, landmarks[230].x, landmarks[230].y),

                    }
                });
                document.getElementById("coordTable").dispatchEvent(dataEvent);

                let nowTime = new Date();
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[33].x, landmarks[33].y) <= rightDist){
                    leftTimer = undefined;
                    bottomTimer = undefined;
                    topTimer = undefined;
                    if(rightTimer === undefined){
                        rightTimer = new Date();
                    } else if (nowTime.getTime() - rightTimer.getTime() > 500) {

                        rightTimer = undefined;


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'right',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                    let arrowEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'right',
                            }
                        });
                    document.getElementById("arrowBoard").dispatchEvent(arrowEvent);
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[133].x, landmarks[133].y) <= leftDist){
                    rightTimer = undefined;
                    bottomTimer = undefined;
                    topTimer = undefined;
                    if (leftTimer === undefined){
                        leftTimer = new Date();
                    } else if ( nowTime.getTime() - leftTimer.getTime() > 500) {

                        leftTimer = undefined;


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'left',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                    let arrowEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'left',
                            }
                        });
                    document.getElementById("arrowBoard").dispatchEvent(arrowEvent);
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[223].x, landmarks[223].y) <= topDist){
                    rightTimer = undefined;
                    bottomTimer = undefined;
                    leftTimer = undefined;
                    if(topTimer === undefined){
                        topTimer = new Date();
                    } else if ( nowTime.getTime() - topTimer.getTime() > 500) {

                        topTimer = undefined;


                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'top',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                    let arrowEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'top',
                            }
                        });
                    document.getElementById("arrowBoard").dispatchEvent(arrowEvent);
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[230].x, landmarks[230].y) <= bottomDist){
                    rightTimer = undefined;
                    leftTimer = undefined;
                    topTimer = undefined;
                    if (bottomTimer === undefined){
                        bottomTimer = new Date();
                    } else if ( nowTime.getTime() - bottomTimer.getTime() > 500) {
                        bottomTimer = undefined;



                        let coordinatesEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'bottom',
                            }
                        });
                        document.getElementById("board").dispatchEvent(coordinatesEvent);
                    }
                    let arrowEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'bottom',
                            }
                        });
                    document.getElementById("arrowBoard").dispatchEvent(arrowEvent);
                }
                if(vector_len(landmarks[468].x, landmarks[468].y, landmarks[33].x, landmarks[33].y) > rightDist &&
                vector_len(landmarks[468].x, landmarks[468].y, landmarks[133].x, landmarks[133].y) > leftDist &&
                vector_len(landmarks[468].x, landmarks[468].y, landmarks[223].x, landmarks[223].y) > topDist &&
                vector_len(landmarks[468].x, landmarks[468].y, landmarks[230].x, landmarks[230].y) > bottomDist){
                    let arrowEvent = new CustomEvent('eyeGesture', {
                            detail: {
                                'kind': 'center',
                            }
                        });
                    document.getElementById("arrowBoard").dispatchEvent(arrowEvent);
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