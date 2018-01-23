appcan.ready(function() {
  // 初始化
  var MODEL = SSTool.getModel()
  MODEL.set({
    userName: '',
    password: '',
    //userName: 'zy',
    //password: '1',

    saveState: true,
  });
  SSTool.init();

  // 事件绑定
  $('#viewModel').on('tap', '#regist', function(e){
    localStorage.setItem('d__saveState', MODEL.get('saveState'))
    var _name = 'zhuce';
    // 页面跳转
    SSTool.goTo(_name);
  });
  $('#about').on('tap', function(e) {
    localStorage.setItem('d__saveState', MODEL.get('saveState'))
    SSTool.goTo('about');
  });
  //$('#viewModel').on('tap', '#sub', _login)
  $('#loginSub').on('submit', _login)
  function _login(e){
    localStorage.setItem('d__saveState', MODEL.get('saveState'))

          //SSTool.goTo('index');
          //appcan.window.close(-1);
     //return
    // 获取数据
    var _model = MODEL.toJSON();
    // 发送请求
    SSTool.ajax({
      hasLoading: 1,
      url : 'http://ensonbuy.com/api/App/UserLoginValiate',
      type: 'GET',
      data : {
        userName: _model.userName,
        password: _model.password,
      },
      success : function(data) {
        var _res = JSON.parse(JSON.parse(data))
        if(_res.F_UID && _res.F_UID != '-1') {
          appcan.locStorage.setVal("CurrentUID", _res.F_UID);//存储clare这个字符串，key值是name。
          SSTool.goTo('index');
          //appcan.window.close(-1);
        }else {
          appcan.window.openToast(MODEL.get('d_login_err_message'), 1500)
        }
      },
    })
  }

  function getData() {
    var parObj = {
      uID: ''
    }
    SSTool.ajax({
      //hasLoading: 1,
      url: "http://ensonbuy.com/api/app/GetCarouselFigure",
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result));
        var data= _.map(_res, function(e) {
          return {
            content: 'http://ensonbuy.com/Images/CarouselList/AppBanner/' + e.F_CFImagePath.replace('\\', '/')
          }
        });

        var islider = new iSlider(document.getElementById('iSlider_warp'), data,  {
          isAutoplay: 0,
          isLooping: 1,
          animateTime: 800,
          plugins: ['dot']
        });
      }
    });

  }

  appcan.window.on('resume', initState);

  var __backState;
  appcan.window.monitorKey(0, 1, function() {
    if ( new Date().getTime() - __backState < 1000 ) {
      uexWidgetOne.exit(1);
    }else {
      __backState = new Date().getTime();
    }
    return
  })

  getData();
  function initState() {
    var d__saveState = localStorage.getItem('d__saveState') == 'true';
    if (d__saveState && localStorage.getItem('CurrentUID')) {
      SSTool.goTo('index');
    }else {
      localStorage.clear();
    }
  }
  initState();
})
  //// 初始化
  //var MODEL = SSTool.getModel()
  //MODEL.set({
    //userName: 'zy',
    //password: '1',
  //});
  //SSTool.init();
