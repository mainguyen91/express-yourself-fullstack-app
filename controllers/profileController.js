module.exports = (req, res) => {
    if (req.session.group && req.cookies.authCookie) {
        res.render("profile");
    } else {
        res.redirect("/login");
    }
};