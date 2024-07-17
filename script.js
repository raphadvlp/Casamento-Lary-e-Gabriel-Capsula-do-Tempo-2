let recorder;
let stream;

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
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleStream(stream);
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

function handleStream(stream) {
    videoElement.srcObject = stream;
    recorder = RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/mp4', // Define o formato de saída para MP4
        bitsPerSecond: 128000 // Ajuste a qualidade conforme necessário
    });
}

startRecordButton.addEventListener('click', () => {
    recorder.startRecording();
    startRecordButton.disabled = true;
    stopRecordButton.disabled = false;
});

stopRecordButton.addEventListener('click', () => {
    recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const url = URL.createObjectURL(blob);
        recordedVideoElement.src = url;
        recordedVideoElement.style.display = 'block';
        downloadLink.href = url;
        downloadLink.download = 'video.mp4';
        downloadLink.style.display = 'block';

        // Para salvar localmente no iOS, convertemos para Data URL e abrimos em uma nova janela/tab
        const reader = new FileReader();
        reader.onload = function(event) {
            const dataUrl = event.target.result;
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'video.mp4';
            link.click();
        };
        reader.readAsDataURL(blob);
    });
    startRecordButton.disabled = false;
    stopRecordButton.disabled = true;
});

document.addEventListener('DOMContentLoaded', (event) => {
    startCamera();
});


function enviarToDrive() {
    alert("Teste de envio!");
}