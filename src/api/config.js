module.exports = {
  password: process.env.PASSWORD || 'test',
  port: process.env.PORT || 3000,
  https: {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
    passphrase: process.env.SSL_PASS,
  },
};
