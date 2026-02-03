import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.id; // Compatibility for routes using req.userId
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

export default auth;
