// Update middleware/auth.js (add more roles)

const auth = (role) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ code: 401, message: '未登录' });

    // Simulate more roles
    if (role === 'expert') req.user = { role: 'expert', expert_id: 1 };
    else if (role === 'user') req.user = { role: 'user', user_id: 1001 };
    else if (role === 'admin') req.user = { role: 'admin' };
    else if (role === 'seller') req.user = { role: 'seller', seller_id: 2001 };
    else if (role === 'cs') req.user = { role: 'cs', cs_id: 101 };
    else req.user = { role: 'any' };

    next();
};

module.exports = auth;