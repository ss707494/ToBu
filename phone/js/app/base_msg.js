//var MODEL = null;
var g_CurrentID = "";
appcan.ready(function() {

  appcan.window.on('resume', function() {
    g_CurrentID = SSTool.getCurrentUID();
  });
  // 初始化
  g_CurrentID = SSTool.getCurrentUID();

  var MODEL = SSTool.getModel()
  MODEL.set({
    uID :g_CurrentID,
    old_password: '',
    new_password: '',
    sure_password: '',
    phoneNum: '',
    email: '',
    name: '',
  });
  SSTool.init();

  function getData() {
    SSTool.ajax({
      hasLoading : 1,
      //url : "http://ensonbuy.com/api/app/GetValiateImg?MsgID="+g_MsgID,
      url : "http://ensonbuy.com/api/app/GetUserInfoByID?uID="+g_CurrentID,
      //url : "http://localhost:55153/api/app/GetValiateImg",

      type : "GET",
      data : {
      },
      contentType: "application/json",
      dataType : "json",
      //timeout : 30000,
      //offline : true,
      //crypto : true,
      //password : "pwd",
      success : function(data, status, requestCode, response, xhr) {
        var userInfo = JSON.parse(data);
        if(userInfo.F_UID == "-1")
        {
          appcan.window.openToast(MODEL.get('d_user_msg_err'), 1500);
        }
        else
        {
          MODEL.set({
            uID :g_CurrentID,
            old_password: userInfo.F_UPasswrod,
            new_password: '',
            sure_password: '',
            phoneNum: userInfo.F_UPhone,
            email: userInfo.F_UEmail,
            name: userInfo.F_UName,
          });
        }
      },
      error : function(xhr, erroType, error, msg) {

      }
    });
  }

  $('#viewModel').on('tap', '#regist', function(e){
    var _name = 'index';
    // 页面跳转
    SSTool.goTo(_name);
  });

  $('#viewModel').on('tap', '#sub', function(e){
    // 获取数据
    var _model = MODEL.toJSON();

    if(_model.old_password == "")
    {
      appcan.window.openToast(MODEL.get('d_user_msg_err'), 1500);
      return;
    }
    if(_model.new_password != "")
    {
      if(_model.new_password !=_model.sure_password)
      {
        appcan.window.openToast(MODEL.get('d_two_password'), 1500);
        return;
      }
    }

    if(_model.phoneNum == "")
    {
      appcan.window.openToast(MODEL.get('d_require_phone'), 1500);
      return;
    }

    var subPar = {
      uID:g_CurrentID,
      phoneNum:_model.phoneNum,
      new_password:_model.new_password,
      email:_model.email,
      old_password:_model.old_password
    };

    SSTool.ajax({
      hasLoading : 1,
      url: "http://ensonbuy.com/api/app/UpdateUserInfoByID",
      type: "post",
      contentType: "application/json",
      dataType: "text",
      data: JSON.stringify(subPar),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result))
        if(_res.return == 1) {
          //console.log(_res.msg);
          appcan.window.openToast(_res.msg, 1500);
          SSTool.goTo('index');
        }else {
          appcan.window.openToast(_res.errmsg, 1500);
        }
      },
    });

  })

  appcan.window.on('resume', getData);
  getData();
});
