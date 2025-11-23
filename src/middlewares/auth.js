module.exports = (req, res, next) => {
    const authEnabled = process.env.AUTH_ENABLED === 'true';
    if (authEnabled) {
        const apiKey = req.headers['x-api-key'];
        if (apiKey && apiKey === process.env.API_KEY) {
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized: Acesso inválido ou chave API ausente' });
        }
    } else {
        next();
    }
};