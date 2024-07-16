let mediaRecorder;
let recordedChunks = [];

const videoElement = document.getElementById('video');
const recordedVideoElement = document.getElementById('recordedVideo');
const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const downloadLink = document.getElementById('downloadLink');

async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: 'user', // Use 'environment' for the back camera
            },
            audio: true
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleStream(stream);
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

function handleStream(stream) {
    videoElement.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        recordedChunks = [];
        const url = URL.createObjectURL(blob);
        recordedVideoElement.src = url;
        recordedVideoElement.style.display = 'block';
        downloadLink.href = url;
        downloadLink.download = 'video.webm';
        downloadLink.style.display = 'block';
    };
}

startRecordButton.addEventListener('click', () => {
    mediaRecorder.start();
    startRecordButton.disabled = true;
    stopRecordButton.disabled = false;
});

stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordButton.disabled = false;
    stopRecordButton.disabled = true;
});

document.addEventListener('DOMContentLoaded', (event) => {
    startCamera();
});
