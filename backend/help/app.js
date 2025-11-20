const express = require('express');
const knowledgeRoutes = require('./routes/knowledge');
const consultRoutes = require('./routes/consult');
const csRoutes = require('./routes/cs');

const app = express();
app.use(express.json());

app.use('/api/knowledge', knowledgeRoutes);
app.use('/api', consultRoutes);
app.use('/api', csRoutes); // Add cs routes

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Help service running on port ${PORT}`);
});

module.exports = app;