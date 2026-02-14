const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
    // Connexion à la base postgres (base par défaut)
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log('Connexion à PostgreSQL établie');

        // Vérifier si la base existe
        const checkDb = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'zenyy_db'"
        );

        if (checkDb.rows.length === 0) {
            // Créer la base de données
            await client.query('CREATE DATABASE zenyy_db');
            console.log('✓ Base de données zenyy_db créée avec succès');
        } else {
            console.log('ℹ Base de données zenyy_db existe déjà');
        }

        await client.end();
    } catch (error) {
        console.error('Erreur lors de la création de la base:', error.message);
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 INSTRUCTIONS DE CONFIGURATION MANUELLE:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n1. Assurez-vous que PostgreSQL est installé et en cours d\'exécution');
        console.log('2. Ouvrez pgAdmin ou votre client PostgreSQL');
        console.log('3. Créez une nouvelle base de données nommée: zenyy_db');
        console.log('4. Ou utilisez psql:\n');
        console.log('   psql -U postgres');
        console.log('   CREATE DATABASE zenyy_db;');
        console.log('   \\q\n');
        console.log('5. Ensuite, exécutez: npm run migrate\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        process.exit(1);
    }
}

createDatabase();
