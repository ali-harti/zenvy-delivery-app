const pool = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Modèle utilisateur pour les opérations de base de données
 */
const User = {
    /**
     * Créer un nouvel utilisateur
     */
    async create({ email, password, first_name, last_name, phone, role }) {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, phone, role, is_active, created_at
    `;

        const values = [email, password_hash, first_name, last_name, phone, role];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Trouver un utilisateur par email
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    /**
     * Trouver un utilisateur par ID
     */
    async findById(id) {
        const query = `
      SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
      FROM users 
      WHERE id = $1
    `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    /**
     * Mettre à jour un utilisateur
     */
    async update(id, updates) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined && key !== 'id' && key !== 'password') {
                fields.push(`${key} = $${paramCount}`);
                values.push(updates[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            return await this.findById(id);
        }

        values.push(id);
        const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
    `;

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    /**
     * Changer le mot de passe
     */
    async updatePassword(id, newPassword) {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        const query = `
      UPDATE users 
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;

        await pool.query(query, [password_hash, id]);
    },

    /**
     * Vérifier le mot de passe
     */
    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    /**
     * Désactiver un utilisateur
     */
    async deactivate(id) {
        const query = 'UPDATE users SET is_active = false WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    /**
     * Obtenir tous les coursiers actifs
     */
    async getAllCouriers() {
        const query = `
      SELECT id, email, first_name, last_name, phone, created_at
      FROM users 
      WHERE role = 'courier' AND is_active = true
      ORDER BY created_at DESC
    `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = User;
