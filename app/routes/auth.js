import jwt from("jsonwebtoken")

app.post('/auth/face-login', async (req, res) => {
    try {
        const { imageBase64, userId } = req.body;
        
        // 1. Buscar descritor salvo no banco (previamente salvo como JSON)
        const user = await db.users.findById(userId);
        const savedDescriptor = new Float32Array(user.faceDescriptor);

        // 2. Processar imagem enviada
        const img = await canvas.loadImage(imageBase64);
        const detection = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            return res.status(400).send("Face não detectada.");
        }

        // 3. Comparar descritores (Distância Euclidiana)
        const distance = faceapi.euclideanDistance(detection.descriptor, savedDescriptor);
        const THRESHOLD = 0.6; // Quanto menor, mais rigoroso

        if (distance < THRESHOLD) {
            // 4. Gerar Token de Acesso
            const token = jwt.sign(
                { id: user.id, email: user.email }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );
            return res.json({ auth: true, token });
        } else {
            return res.status(401).send("Falha na verificação facial.");
        }
    } catch (error) {
        res.status(500).send("Erro interno.");
    }
});