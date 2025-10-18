export function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error('Error from errorHandler:');
    console.error('Message:', message);
    console.error('Status:', status);
    if (err.stack) {
        console.error('Stack trace:', err.stack);
    }
    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
