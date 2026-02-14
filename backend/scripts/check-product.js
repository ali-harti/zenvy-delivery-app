const { sequelize } = require('../src/models');

async function checkProduct() {
    try {
        const [result] = await sequelize.query(`SELECT * FROM products WHERE id = 37`);
        console.log('Product 37:');
        console.log(result);

        const [all] = await sequelize.query(`SELECT id, name FROM products ORDER BY id DESC LIMIT 5`);
        console.log('\nLast 5 products:');
        console.table(all);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkProduct();
