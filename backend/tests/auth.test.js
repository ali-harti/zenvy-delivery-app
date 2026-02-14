const request = require('supertest');
const app = require('../src/app');

describe('Authentication API Tests', () => {
    let authToken;
    let userId;

    // Test d'inscription
    test('POST /api/auth/register - Inscription réussie', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@zenyy.com',
                password: 'password123',
                first_name: 'Test',
                last_name: 'User',
                phone: '+33612345678',
                role: 'customer'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data.user.email).toBe('test@zenyy.com');

        authToken = response.body.data.token;
        userId = response.body.data.user.id;
    });

    // Test de connexion
    test('POST /api/auth/login - Connexion réussie', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'customer@test.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data.user.role).toBe('customer');
    });

    // Test connexion - mauvais mot de passe
    test('POST /api/auth/login - Échec avec mauvais mot de passe', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'customer@test.com',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    // Test récupération profil
    test('GET /api/auth/me - Récupérer le profil', async () => {
        // D'abord se connecter pour obtenir un token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'customer@test.com',
                password: 'password123'
            });

        const token = loginResponse.body.data.token;

        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user).toHaveProperty('email');
        expect(response.body.data.user).toHaveProperty('role');
    });

    // Test sans token
    test('GET /api/auth/me - Échec sans token', async () => {
        const response = await request(app).get('/api/auth/me');

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });
});
