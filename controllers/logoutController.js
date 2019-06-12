module.exports = (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        res.clearCookie('authCookie');
        res.redirect('/');
    } else {
        res.redirect('login')
    }
}