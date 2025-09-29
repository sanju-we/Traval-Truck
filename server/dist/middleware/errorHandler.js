export function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error('Error from errorHandler:', message, status);
    res.status(status).json({
        success: false,
        message,
    });
}
