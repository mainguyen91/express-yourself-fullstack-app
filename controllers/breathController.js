module.exports = (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        res.render('breath')
    } else {
        res.redirect('/login')
    }
}