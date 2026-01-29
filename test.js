const video = document.getElementById('video');

// 1. Iniciar Webcam
async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
}

// 2. Carregar modelos no navegador
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startVideo);

// 3. Capturar e Enviar
document.getElementById('btn-auth').addEventListener('click', async () => {
    // Detecta o rosto no frame atual do vídeo
    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());

    if (detection) {
        // Criamos um canvas temporário para extrair a imagem exata do rosto
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        const imageBase64 = canvas.toDataURL('image/jpeg');

        // Enviar para o servidor Node.js (conforme o código anterior)
        const response = await fetch('/auth/face-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                imageBase64, 
                userId: 'ID_DO_USUARIO_AQUI' 
            })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('access_token', data.token);
            alert('Login realizado com sucesso!');
        }
    } else {
        alert('Rosto não detectado. Tente novamente.');
    }
});