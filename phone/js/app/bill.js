// lskdjfsklfj
//
function ss(argument) {


}
appcan.ready(function() {
  var __uID = SSTool.getCurrentUID();
  appcan.window.on('resume', function() {
    __uID = SSTool.getCurrentUID();
  });
  // 初始化
  var MODEL = SSTool.getModel();
  MODEL.set({
    choseCheck: 0,
    choseNum: localStorage.getItem('choseNum') || 0,
    totalNum: 0,
    totalPrice: localStorage.getItem('totalPrice') || 0,
    addressOption: [],
    rID: '',
    payType: '3',
    creditCard : '',
    ad_name: '',
    ad_detail: '',
    ad_area: '',
    ad_city: '',
    ad_alias: '',
    ad_code: '',
    ad_phone: '',
    ad_street: '',
    payRight: '1',
    F_CCNumber: '',
    F_CCMonth: '',
    F_CCYear: '',
    F_CCValiateCode: '',
    F_CCZipCode: '',

  });
  MODEL.addComputed('showHuodaofukuan', function() {
    var _payRight = this.get('payRight');
    return _payRight == 2;
  })
  MODEL.addComputed('showCardBox', function() {
    var _payRight = this.get('payType');
    return _payRight == 3;
  })
  //SSTool.initFooter('shoppingCar');
  var VIEW = SSTool.init();

  SSTool.updateSelect($('.card-select .select select'));

  function getData(option) {
    MODEL.set('choseNum', localStorage.getItem('choseNum') || 0)
    MODEL.set('totalPrice', localStorage.getItem('totalPrice') || 0)
    var parObj = {
      uID: __uID,
    };
    SSTool.ajax({
      hasLoading: 1,
      url: "http://ensonbuy.com/api/app/GetSettlementInfo?uID=" + __uID,
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result))
        //console.log(_res);
        var _optionData = _.map(_res.RecipientsInfoArray, dealAddOption);
        MODEL.set('addressOption', _optionData);
        if (_optionData.length) {
          MODEL.set('rID', _optionData[0].value);
          MODEL.set(_optionData[0]);
          SSTool.updateSelect($('.chose-address select'));
        }

        MODEL.set(dealUserInfo(_res.UserInfo));
        MODEL.set(dealCard(_res.CardInfo));
        SSTool.updateSelect($('.useful select'));
      },
    });
  }

  function submit(option) {
    var _data = MODEL.toJSON();
    var parObj = {
      uID: __uID,
      rID: _data.rID,
      payType: _data.payType,
    };
    if(!_data.rID) {
      appcan.window.openToast(MODEL.get('d_no_address_msg'), 1500)
      return
    }
    if (_data.payType == 3) {
      var _model = _data;
      if(_model.F_CCNumber == "")
      {
        appcan.window.openToast(MODEL.get('d_require_cardNum'), 1500);
        return;
      }
      if(_model.F_CCNumber.length != 16)
      {
        appcan.window.openToast(MODEL.get('d_cardNum_length'), 1500);
        return;
      }
      if(_model.F_CCValiateCode == "")
      {
        appcan.window.openToast(MODEL.get('d_require_valiate_code'), 1500);
        return;
      }

      if(_model.F_CCValiateCode.length !=5)
      {
        appcan.window.openToast(MODEL.get('d_valiate_length'), 1500);
        return;
      }
      parObj.creditCard = [_data.F_CCNumber, _data.F_CCMonth, _data.F_CCYear, _data.F_CCValiateCode, _data.F_CCZipCode].join(',');
    }

    SSTool.ajax({
      hasLoading: 1,
      url: "http://ensonbuy.com/api/app/BuilderOrder",
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result))
        var parObj1 = {
          strMsgID: _res.MsgID,
          msgType: 4
        };
        SSTool.ajax({
          hasLoading: 1,
          url: "http://ensonbuy.com/api/app/MessageQueueResultQuery",
          data: JSON.stringify(parObj1),
          success: function (result, status) {
            try {
              var _res = JSON.parse(SSTool.escapeSpecialChars(JSON.parse(SSTool.escapeSpecialChars(result))));
            } catch (e) {
              appcan.window.openToast(MODEL.get('d_server_net_err_message'), 1500);
              appcan.window.windowBack();
              return
            }
            console.log(_res);
            if(_res['return'] == 1){
              _res.msg = _res.msg.replace('#', '\n');
              appcan.window.confirm({
                title: '',
                //content: MODEL.get('d_account_suc'),
                content: _res.msg,
                buttons:[MODEL.get('d_ok')],
                callback:function(err,data,dataType,optId){
                  if(err){
                    return;
                  }
                  SSTool.goTo('order_list');
                  setTimeout(function() {
                    appcan.window.close();
                  }, 3000);
                }
              });
            }else {
              appcan.window.confirm({
                title: '',
                //content: MODEL.get('d_account_fail'),
                content: _res.errmsg,
                buttons:[MODEL.get('d_ok')],
                callback:function(err,data,dataType,optId){
                  if(err){
                    return;
                  }
                  //data 按照按钮的索引返回值
                }
              });
            }
          }
        });
      }

    });


  }

  // 列表切换语言
  SSTool.addChangeLan(function() {
    var _lan = localStorage.getItem('d_language') || 'chi';
  });

  function dealCard(data) {
    if (!data) return {};
    var res = _.extend({}, {
      F_CCNumber: data.F_CCNumber || '',
      F_CCMonth: data.F_CCMonth || 01,
      F_CCYear: data.F_CCYear || 2017,
      F_CCValiateCode: data.F_CCValiateCode || '',
      F_CCZipCode: data.F_CCZipCode || '',
    });

    return res;

  }

  function dealUserInfo(data) {
    var res = {};
    res.payRight = data.F_UPaymentRight;

    return res;
  }
  function dealData(data) {
    var _preStr = localStorage.getItem('d_language') == 'eng' ? 'English' : 'Chinese';
    var res = {};
    return res;
  }
  function dealAddOption(data) {
    var res = {};
    res.text = data.F_RAlias;
    res.value = data.F_RID;
    _.extend(res, {
      ad_name: data.F_RName,
      ad_detail: data.F_RUnitNumber + ',' + data.F_RDetailedAddress,
      ad_street: data.F_RUnitNumber,
      ad_area: data.F_RArea,
      ad_city: data.F_RCity,
      ad_alias: data.F_RAlias,
      ad_code: data.F_RZipCode,
      ad_phone: data.F_RPhone,
    });
    return res;
  }

  $(document).on('change', '.chose-address .select select', function(e) {
    _.map(MODEL.get('addressOption'), function(e) {
      if(e.value == MODEL.get('rID')) {
        MODEL.set(e);
      }
    })

  })

  $('#sub').on('tap', function(e) {
    submit();
  })

  appcan.window.on('resume', getData);
  getData();
})
  //var MODEL = SSTool.getModel()
  //MODEL.set({
  //});
  //SSTool.initFooter('about');
  //SSTool.init();
