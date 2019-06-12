module.exports = (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        res.render('write')
    } else {
        res.redirect('/login')
    }
}