import bcrypt from 'bcryptjs';

const plainPassword = 'password'; // The password you try to log in with
const hashedPassword =
    '$2a$10$DgRNXaWakJejkji.vHm7QOsMMie5Q4TaZUq4iogbna6WDmFXzVPhe'; // The stored hashed password from the database

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
    if (err) {
        console.error('Error comparing passwords:', err);
    } else {
        console.log('Password match result:', result); // This should print 'true' if they match
    }
});
