const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

module.exports = generateAuthToken;