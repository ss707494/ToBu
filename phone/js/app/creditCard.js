var g_CurrentID = "";
appcan.ready(function() {
  appcan.window.on('resume', function() {
    g_CurrentID = SSTool.getCurrentUID();
  });
  // 初始化
  g_CurrentID = SSTool.getCurrentUID();
  var MODEL = SSTool.getModel()
  MODEL.set({
    cardID: '',
    month: '',
    year: '',
    valiateCode: '',
    zipCode: '',
  });
  SSTool.init();

  SSTool.ajax({
    hasLoading : 1,
    //url : "http://ensonbuy.com/api/app/GetRecipientsInfoByUserID?uID="+g_MsgID,
    url : "http://ensonbuy.com/api/app/GetCreditCardByUserID?uID="+g_CurrentID,
    //url : "http://localhost:55153/api/app/GetValiateImg",

    type : "GET",
    data : {
    },
    success : function(data, status, requestCode, response, xhr) {
      var cardInfo = JSON.parse(data);
      cardInfo = JSON.parse(cardInfo);
      if(cardInfo.F_UID == "-1")
      {
        appcan.window.openToast(MODEL.get('d_creditCard_msg_err'), 1500);
      }
      else
      {
        if(cardInfo.F_UID == 0)
        {
        }
        else
        {
          MODEL.set({
            cardID: cardInfo.F_CCNumber,
            month: cardInfo.F_CCMonth,
            year: cardInfo.F_CCYear,
            valiateCode: cardInfo.F_CCValiateCode,
            zipCode: cardInfo.F_CCZipCode,
          });
          document.getElementById("monthDisplayDiv").innerText = cardInfo.F_CCMonth;
          document.getElementById("yearDisplayDiv").innerText = cardInfo.F_CCYear;
        }
      }
    },
  });

  $('#viewModel').on('tap', '#sub', function(e){
    // 获取数据
    var _model = MODEL.toJSON();

    if(_model.cardID == "")
    {
      appcan.window.openToast(MODEL.get('d_require_cardNum'), 1500);
      return;
    }
    if(_model.cardID.length != 16)
    {
      appcan.window.openToast(MODEL.get('d_cardNum_length'), 1500);
      return;
    }
    if(_model.valiateCode == "")
    {
      appcan.window.openToast(MODEL.get('d_require_valiate_code'), 1500);
      return;
    }

    if(_model.valiateCode.length !=5)
    {
      appcan.window.openToast(MODEL.get('d_valiate_length'), 1500);
      return;
    }

    var subPar = {
      uID:g_CurrentID,
      cardID: _model.cardID,
      month: _model.month,
      year: _model.year,
      valiateCode: _model.valiateCode,
      zipCode: _model.zipCode
    };

    SSTool.ajax({
      url: "http://ensonbuy.com/api/app/UpdateCreditCardByUserID",
      hasLoading : 1,
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
      error: function (error) {
        alert(error);
      }
    });

  })
});
