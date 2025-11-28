const DEFAULT_ROLE = 'user';

const mockIdentities = {
    expert: { role: 'expert', expert_id: 1 },
    user: { role: 'user', user_id: 1001 },
    admin: { role: 'admin', admin_id: 9001 },
    seller: { role: 'seller', seller_id: 2001 },
    cs: { role: 'cs', cs_id: 101 }
};

const resolveIdentity = (roleHint) => {
    const normalized = roleHint?.toLowerCase();
    return mockIdentities[normalized] || mockIdentities[DEFAULT_ROLE];
};

const auth = (role = DEFAULT_ROLE) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ code: 401, message: '未登录' });

    // Allow overriding mock role for integration tests via header
    const requestedRole = req.headers['x-mock-role'] || role || DEFAULT_ROLE;

    if (role === 'any') {
        req.user = resolveIdentity(requestedRole);
        return next();
    }

    req.user = resolveIdentity(role);
    next();
};

module.exports = auth;