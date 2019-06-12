const Diary = require('../database/models/Diary');

module.exports = {
    getResults: (req, res) => {
        if (req.session.group && req.cookies.authCookie) {
            Diary.findAll({
                where: {
                    groupId: req.session.group.id
                }
            }).then(allPost => {
                let allMessages = allPost.map(postElement => {
                    return {
                        body: postElement.dataValues.body,
                        createdAt: postElement.dataValues.createdAt
                    }
                })
                console.log("ALL POSTS", allMessages)
                res.render('results', {
                    newMessage: allMessages
                })
            }).catch(error => console.log("Something went wrong", error.stack))
        } else {
            res.redirect('/login')
        }
    },
    postResults: (req, res) => {
        Diary.create({
                body: req.body.body,
                groupId: req.session.group.id
            })
            .then(results => {
                Diary.findAll({
                    where: {
                        groupId: req.session.group.id
                    }
                }).then(allPost => {
                    let allMessages = allPost.map(postElement => {
                        return {
                            body: postElement.dataValues.body,
                            createdAt: postElement.dataValues.createdAt
                        }
                    })
                    console.log("ALL POSTS", allMessages)
                    res.render('results', {
                        newMessage: allMessages
                    })
                }).catch(error => console.log("Something went wrong", error.stack))

            })
            .catch(error => console.error(`Cannot create diaries ${error.stack}`))
    }
}