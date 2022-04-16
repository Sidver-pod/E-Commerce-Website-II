const path = require('path');

const rootDir = path.dirname(require.main.filename);

exports.getError = (req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, 'views', 'error', 'error.html'));
};
