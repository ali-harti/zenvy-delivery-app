require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Démarrer le serveur
const server = app.listen(PORT, () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 ZENYY API Server démarré`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV}`);
    console.log(`⏰ Heure: ${new Date().toLocaleString('fr-FR')}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
    console.log('SIGTERM reçu. Fermeture du serveur...');
    server.close(() => {
        console.log('Serveur fermé');
        pool.end();
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT reçu. Fermeture du serveur...');
    server.close(() => {
        console.log('Serveur fermé');
        pool.end();
        process.exit(0);
    });
});
