exports.pageNotFound = (req,res,next)=>{
    res.render('404page',{isLoggedIn : req.isLoggedIn});
    
}