coinpunk.router = Path;

coinpunk.router.render = function(id, name, data) {
  $('#header').html(new EJS({url: 'views/header.ejs'}).render(data));
  $('#'+id).html(new EJS({url: 'views/'+name+'.ejs'}).render(data));
};

coinpunk.router.route = function(path) {
  window.location.href = '#/'+path;
};

coinpunk.router.initWallet = function() {
  if(coinpunk.wallet) {
    return coinpunk.wallet;
  } else {
    coinpunk.wallet = new coinpunk.Wallet(coinpunk.database.getWalletKey());
    var serverKey = coinpunk.wallet.createServerKey(coinpunk.database.getWalletId());

    $.get('/wallet', {serverKey: serverKey}, function(response) {
      coinpunk.wallet.loadPayload(response.wallet);
    });
  }
};

coinpunk.router.map("#/signup").to(function() {
  coinpunk.router.render('view', 'signup');
});

coinpunk.router.map("#/signin").to(function() {
  if(coinpunk.database.loggedIn())
    coinpunk.router.route('dashboard');
  else
    coinpunk.router.render('view', 'signin');
});

coinpunk.router.map("#/signout").to(function() {
  coinpunk.wallet = null;
  coinpunk.database.reset();
  coinpunk.router.route('signin');
});

coinpunk.router.map("#/dashboard").to(function() {
  if(!coinpunk.database.loggedIn()) {
    coinpunk.router.route('signin');
  } else {
    coinpunk.router.render('view', 'dashboard');
    coinpunk.router.initWallet();
    coinpunk.controllers.dashboard.index();
  }
});

coinpunk.router.map('#/').to(function() {
  coinpunk.router.route('dashboard');
});

coinpunk.router.root("#/");
coinpunk.router.listen();