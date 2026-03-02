const { PrismaClient } = require('@prisma/client');

const p = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://sentinals:sentinals_secret@127.0.0.1:5432/sentinals_db?schema=public'
        }
    }
});

p.$connect()
    .then(() => {
        console.log('PRISMA CONNECTED SUCCESSFULLY!');
        return p.$queryRawUnsafe('SELECT count(*) as cnt FROM users');
    })
    .then((r) => {
        console.log('Users count:', r);
        p.$disconnect();
    })
    .catch((e) => {
        console.error('ERROR CODE:', e.code);
        console.error('ERROR MESSAGE:', e.message);
        p.$disconnect();
    });
