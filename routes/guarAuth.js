

exports.isAuth = function (req, res, next) {
    if (req.session.userId) {
        next()
    }
    else {
        res.redirect('/login')
    }
}

exports.notAuth = function (req, res, next) {
    if (req.session.userId) {
        res.redirect('/')
    }
    else{
        next()
    }
    
}