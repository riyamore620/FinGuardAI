const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;
const mongoose = require('mongoose');

// कॉम्प्युटरवरील लोकल मोंगोडीबी किंवा क्लाउड मोंगोडीबीशी कनेक्ट करा
mongoose.connect('mongodb://localhost:24017/finguard_db')
  .then(() => console.log('📁 मोंगोडीबी डेटाबेस यशस्वीरित्या कनेक्ट झाला!'))
  .catch(err => console.error('डेटाबेस एरर:', err));


// फ्रंटएंडकडून येणारा JSON डेटा वाचण्यासाठी एक्सप्रेसला परवानगी देणे
app.use(express.json());

// 'public' फोल्डरमधील फ्रंटएंड फाईल्स लोड करणे
app.use(express.static(path.join(__dirname, 'public')));

// तात्पुरता डेटाबेस (डेटा स्टोअर करण्यासाठी अ‍ॅरे)
let registeredUsers = [];

// होम रूट (Home Route)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// मुख्य बॅकएंड API: युझरचा ईमेल सुरक्षित करणे
app.post('/api/activate-shield', (req, res) => {
    const userEmail = req.body.email;
    
    console.log(`📡 बॅकएंडला डेटा मिळाला: ${userEmail}`);

    // युझरसाठी एक युनिक आयडी तयार करणे
    const newUserId = "FG-" + Math.floor(100000 + Math.random() * 900000);

    // डेटा तात्取りता सेव्ह करणे
    const userData = {
        userId: newUserId,
        email: userEmail,
        status: "Protected",
        activatedAt: new Date()
    };
    
    registeredUsers.push(userData);
    
    // कॉम्प्युटर टर्मिनलवर एकूण युझर्सची लिस्ट पाहणे
    console.log("👥 Current Protected Users:", registeredUsers);

    // फ्रंटएंडला (फोन किंवा ब्राउझरला) सक्सेस रिस्पॉन्स पाठवणे
    res.json({
        success: true,
        message: `FinGuard AI Shield तुमच्या ${userEmail} वर अ‍ॅक्टिव्हेट झाला आहे!`,
        userId: newUserId
    });
});

// सर्व्हर सुरू करणे
app.listen(PORT, () => {
    console.log(`🚀 FinGuard AI बॅकएंड सर्व्हर http://localhost:${PORT} वर धावत आहे!`);
});
