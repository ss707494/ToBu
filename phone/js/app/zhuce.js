
var g_MsgID = "";
function GetValiateImg()
{
  appcan.ajax({
    //url : "http://ensonbuy.com/api/app/GetValiateImg?MsgID="+g_MsgID,
    url : "http://ensonbuy.com/api/app/GetValiateImg?MsgID="+g_MsgID,
    //url : "http://localhost:55153/api/app/GetValiateImg",

    type : "POST",
    data : {
      MsgID:g_MsgID
    },
    contentType: "application/json",
    dataType : "json",
    timeout : 30000,
    offline : true,
    crypto : true,
    password : "pwd",
    success : function(data, status, requestCode, response, xhr) {
      var imgObj = JSON.parse(data);
      document.getElementById("ValiateCodeImg").src = "data:image/jpeg;base64,"+ imgObj.Base64String;
      g_MsgID = imgObj.ID;
    },
    error : function(xhr, erroType, error, msg) {
    }
  });
}

appcan.ready(function() {
  GetValiateImg();
  // 初始化
  var MODEL = SSTool.getModel()
  MODEL.set({
    userName: '',
    phone: '',
    valiateCode: '',
    password: '',
    surePassword: '',
    addrName: '',
    adder: '',
    street: '',
    unitNumber: '',
    city: '',
    statue: '',
    zipCode: '',
    adderPhone: '',
  });
  SSTool.init();

  $('#viewModel').on('tap', '#sub', function(e){
    // 获取数据
    var _model = MODEL.toJSON();

    var parObj = {
      userName: _model.userName,
      password: _model.password,
      phone:_model.phone,
      valiateCode:_model.valiateCode,
      addrName:_model.addrName,
      adder:_model.adder,
      street:_model.street,
      unitNumber:_model.unitNumber,
      city:_model.city,
      statue:_model.statue,
      zipCode:_model.zipCode,
      adderPhone:_model.adderPhone,
      msgID:g_MsgID
    };

    if(_model.userName == "")
    {
      appcan.window.openToast(MODEL.get('d_require_username'), 1500);
      return;
    }
    if(_model.phone == "")
    {
      appcan.window.openToast(MODEL.get('d_require_phone'), 1500);
      return;
    }

    if(_model.valiateCode == "")
    {
      appcan.window.openToast(MODEL.get('d_require_valiate_code'), 1500);
      return;
    }

    if(_model.password == "")
    {
      appcan.window.openToast(MODEL.get('d_require_password'), 1500);
      return;
    }

    if(_model.password !=_model.surePassword)
    {
      appcan.window.openToast(MODEL.get('d_two_password'), 1500);
      return;
    }
    if(_model.addrName != "")
    {
      if(_model.adder=="")
      {
        appcan.window.openToast(MODEL.get('d_require_name_while_address'), 1500);
        return;
      }

      if(_model.street=="")
      {
        appcan.window.openToast(MODEL.get('d_require_name_while_address'), 1500);
        return;
      }

    }
    var parString = "?";
    parString += "userName="+_model.userName+"&";
    parString += "password="+_model.password+"&";
    parString += "phone="+_model.phone+"&";
    parString += "valiateCode="+_model.valiateCode+"&";
    parString += "adder="+_model.adder+"&";
    parString += "street="+_model.street+"&";
    parString += "unitNumber="+_model.unitNumber+"&";
    parString += "city="+_model.city+"&";
    parString += "statue="+_model.statue+"&";
    parString += "zipCode="+_model.zipCode+"&";
    parString += "adderPhone="+_model.adderPhone+"&";
    parString += "msgID="+g_MsgID;

    appcan.ajax({
      url: "http://ensonbuy.com/api/app/UserRegister",
      type: "post",
      contentType: "application/json",
      dataType: "text",
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result))
        if(_res.return == 1) {
          //console.log(_res.msg);
          appcan.locStorage.setVal("CurrentUID", _res.UID);//存储clare这个字符串，key值是
          localStorage.setItem('userName_forSuc', MODEL.get('userName'));
          SSTool.goTo('index');
        }else {
          appcan.window.openToast(_res.errmsg, 1500);
        }
      },
      error: function (error) {
        alert(error);
      }
    });

  })
})
