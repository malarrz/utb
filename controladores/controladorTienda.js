exports.homePage = (req, res) => {
    res.render('index');
}

exports.agregarTienda = (req, res) => {
    res.render('editarTienda', { title: 'Agregar Tienda' });
}

exports.crearTienda = (req, res) => {
    res.json(req.body)
}