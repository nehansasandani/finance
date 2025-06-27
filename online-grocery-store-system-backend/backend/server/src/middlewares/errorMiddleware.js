// Error handler
const errprHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if statusCode is 200
    res.status(statusCode);
    res.json({
        msg: err.message, // No need for optional chaining, err is guaranteed to have a message
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Show stack trace only in development
    });
};
// Not found handler
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`); // Corrected property name
    res.status(404);
    next(error);
};
module.exports={errprHandler, notFound};