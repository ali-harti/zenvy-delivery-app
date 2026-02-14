try {
    console.log('Require routes...');
    const routes = require('../src/routes/index');
    console.log('✅ Routes loaded successfully');
} catch (e) {
    console.error('❌ Failed:', e);
}
