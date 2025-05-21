
const pool = require('../config/db'); // Importuj databázový pool

/**
 * Vytvorí nového používateľa v databáze.
 * @param {string} username - Prezývka používateľa.
 * @param {string} email - Email používateľa.
 * @param {string} hashedPassword - Hashované heslo používateľa.
 * @returns {Promise<object>} Objekt novovytvoreného používateľa (bez hesla).
 * @throws {Error} Ak nastane chyba pri vkladaní alebo ak používateľ už existuje.
 */
const createUser = async (username, email, hashedPassword) => {
    const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at;
    `;
    const values = [username, email, hashedPassword];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        // Kontrola konkrétnych chýb PostgreSQL pre unikátne obmedzenia
        if (error.code === '23505') { // Unique violation
            if (error.constraint && error.constraint.includes('email')) {
                const err = new Error('Email address is already in use.');
                err.status = 409; // Conflict
                throw err;
            }
            if (error.constraint && error.constraint.includes('username')) {
                const err = new Error('Nickname is already taken.');
                err.status = 409; // Conflict
                throw err;
            }
        }
        console.error('Database error creating user:', error);
        const err = new Error('Could not create user. Please try again later.');
        err.status = 500;
        throw err;
    }
};

/**
 * Nájde používateľa podľa emailu.
 * @param {string} email - Email používateľa.
 * @returns {Promise<object|null>} Objekt používateľa alebo null, ak neexistuje.
 */
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1;';
    try {
        const result = await pool.query(query, [email]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Database error finding user by email:', error);
        throw new Error('Error checking email existence.');
    }
};

/**
 * Nájde používateľa podľa prezývky.
 * @param {string} nickname - Prezývka používateľa.
 * @returns {Promise<object|null>} Objekt používateľa alebo null, ak neexistuje.
 */
const findUserByNickname = async (nickname) => {
    const query = 'SELECT * FROM users WHERE nickname = $1;';
    try {
        const result = await pool.query(query, [nickname]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Database error finding user by nickname:', error);
        throw new Error('Error checking nickname existence.');
    }
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserByNickname,
};