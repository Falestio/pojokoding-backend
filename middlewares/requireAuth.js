export const requireAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.send({
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
};