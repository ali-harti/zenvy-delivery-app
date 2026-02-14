try {
    const db = require('../src/models');
    console.log('✅ Models loaded successfully');
    console.log('Keys:', Object.keys(db));
    process.exit(0);
} catch (error) {
    console.error('❌ Failed to load models:', error);
    process.exit(1);
}
