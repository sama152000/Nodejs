function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  }
  if (err.message && err.message.includes('only images in type')) {
    return res.status(400).json({ message: 'Only images with specific formats are allowed' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred on the server',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
module.exports = errorHandler;