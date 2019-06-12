const Group = require("../database/models/Group");
const bcrypt = require("bcrypt");

module.exports = {
    getLoginPage: (req, res) => {
        res.render("login");
    },
    postGroupLogin: (req, res) => {
        Group.findOne({
                where: {
                    name: req.body.username
                }
            })
            .then(foundGroup => {
                bcrypt
                    .compare(req.body.password, foundGroup.dataValues.password)
                    .then(results => {
                        if (req.body.username !== null && results) {
                            req.session.group = foundGroup.dataValues;
                            res.redirect("/profile");
                        } else {
                            console.log("Something went wrong when logging in");
                            res.redirect("/login");
                        }
                    })
                    .catch(error =>
                        console.error(`Something went wrong when comparing passwords on login: ${error.stack}`)
                    );
            })
            .catch(error => console.error(`Couldn't login: ${error.stack}`));
    }
};