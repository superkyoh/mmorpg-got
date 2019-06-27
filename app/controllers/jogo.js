module.exports.jogo = function(application, req, res){
    if(req.session.autorizado !== true){
        var erro = [{msg: 'Faça o login para acessar o jogo'}];
        res.render('index', {validacao: erro})
        return;
    }else{
        var msg = '';
        if(req.query.msg !== ''){
            msg = req.query.msg;
        }

        var connection = application.config.dbConnection;
        var JogoDAO = new application.app.models.JogoDAO(connection);
        var usuario = req.session.usuario;
        var casa = req.session.casa;
        JogoDAO.iniciaJogo(res, usuario, casa, msg);
        
    }
   
}

module.exports.sair = function(application, req, res){
    req.session.destroy( function(err){
        res.render('index', {validacao:{}});
    });
}

module.exports.suditos = function(application, req, res){
    if(req.session.autorizado !== true){
        var erro = [{msg: 'Faça o login para acessar o jogo'}];
        res.render('index', {validacao: erro})
        return;
    }
    res.render('aldeoes');
}

module.exports.pergaminhos = function(application, req, res){
    if(req.session.autorizado !== true){
        var erro = [{msg: 'Faça o login para acessar o jogo'}];
        res.render('index', {validacao: erro})
        return;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);
    var usuario = req.session.usuario;
    JogoDAO.getAcoes(usuario, res);
}

module.exports.ordenar_acao_sudito = function(application, req, res){
    if(req.session.autorizado !== true){
        var erro = [{msg: 'Faça o login para acessar o jogo'}];
        res.render('index', {validacao: erro})
        return;
    }
    var dadosForm = req.body;

    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.redirect('jogo?msg=Erro');
        return;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=Sucesso');
}

module.exports.revogar_acao = function(application, req, res){
    var url_query = req.query;

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.JogoDAO(connection);

    var _id = url_query.id_acao;
    JogoDAO.revogarAcao(_id, res);
}
    