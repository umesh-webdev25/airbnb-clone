exports.submit = (req, res) => {
    res.render('host/submit',{ isLoggedIn : req.isLoggedIn});
}