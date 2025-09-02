exports.about = (req, res) => {
    res.render('host/about', { 
      errorMessage: null, 
      values: {} 
    });
  };