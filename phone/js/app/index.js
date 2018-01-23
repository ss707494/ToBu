var g_CurrentID = "";

appcan.ready(function() {
  appcan.window.on('resume', function() {
    g_CurrentID = SSTool.getCurrentUID();
  });

  g_CurrentID = SSTool.getCurrentUID();
  // 初始化
  var MODEL = SSTool.getModel()
  MODEL.set({
      name : '',
      phone : ''
  });
  SSTool.initFooter('index');
  SSTool.init();
  $('#base_msg').on('tap', function(e) {
    SSTool.goTo('base_msg');
  });
  $('#address').on('tap', function(e) {
    SSTool.goTo('address');
  });
  $('#creditCard').on('tap', function(e) {
    SSTool.goTo('creditCard');
  });

  $('#toMyOrder').on('tap', function(e) {
    localStorage.setItem('orderListState', '0');
    SSTool.goTo('order_list');
  });
  $('.content .orderMenu .menuItem').on('tap', function(e) {
    var state = $(this).data('state') || '0';
    localStorage.setItem('orderListState', state);
    SSTool.goTo('order_list');
  })

  function getData(option) {
    SSTool.ajax({
      hasLoading: 1,
      //url : "http://ensonbuy.com/api/app/GetValiateImg?MsgID="+g_MsgID,
      url : "http://ensonbuy.com/api/app/GetUserInfoByID?uID="+g_CurrentID,
      //url : "http://ensonbuy.com/api/app/GetUserInfoByID?uID="+'73d12d2e-3238-496f-8256-0def9be48a48',
      //url : "http://localhost:55153/api/app/GetValiateImg",

      type : "GET",
      data : {
      },
      contentType: "application/json",
      dataType : "json",
      success : function(data, status, requestCode, response, xhr) {
        var userInfo = {};
        if (_.isString(data)) {
          userInfo = JSON.parse(data);
        }else {
          userInfo = data;
        }
        if(userInfo.F_UID == "-1")
        {
          appcan.window.openToast(MODEL.get('d_user_msg_err'), 1500);
        }
        else
        {
          MODEL.set({
            name : userInfo.F_UName,
            phone : userInfo.F_UPhone.substr(0,3)+ "****"+userInfo.F_UPhone.substr(7)
          });
        }
      },
    });

  }

  $('#loginout').on('click', function(e) {
    appcan.window.confirm({
      title: '',
      content: MODEL.get('d_loginout_msg'),
      //content: _res.msg,
      buttons:[MODEL.get('d_ok'), MODEL.get('d_cancle')],
      callback:function(err,data,dataType,optId){
        if(err){
          return;
        }
        if (data == 0) {
          localStorage.clear();
          SSTool.goTo('login');
        }else {

        }
        //setTimeout(function() {
          //appcan.window.close();
        //}, 3000);
      }
    });
  })

  var __backState;
  appcan.window.monitorKey(0, 1, function() {
    if ( new Date().getTime() - __backState < 1000 ) {
      uexWidgetOne.exit(1);
    }else {
      __backState = new Date().getTime();
    }
    return
  })

  appcan.window.on('resume', getData);
  getData();
})
