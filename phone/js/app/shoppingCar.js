appcan.ready(function() {
  var __uID = SSTool.getCurrentUID();
  appcan.window.on('resume', function() {
    __uID = SSTool.getCurrentUID();
  });
  // 初始化
  var MODEL = SSTool.getModel()
  var LIST = new MVVM.Collection();
  MODEL.set({
    totalNum: 0,
    choseCheck: 0,
    choseNum: 0,
    totalPrice: 0,
    checkAll: 0,
  });
  SSTool.initFooter('shoppingCar');
  var VIEW = SSTool.init({
    collection: LIST,
  });

  function sunPrice(option) {
    setTimeout(function() {
      var res = {
        totalNum: LIST.length,
        totalPrice: 0,
        choseNum: 0,
        choseCheck: 0,
      };
      LIST.each(function(e, i) {
        if(e.get('isCheck')) {
          var choNum = ~~e.get('choNum');
          res.choseCheck += 1;
          res.choseNum += 1;
          res.totalPrice += choNum*(~~e.get('priceNum'));
        }
      });
      // 全选按钮
      MODEL.set('checkAll', res.choseCheck == res.totalNum);
      //console.log(res);
      MODEL.set(res);

    }, 500);
  };

  var saveFlag = false;
  function saveShoppingCartSate(option) {
    if (saveFlag) return;
    var _isNotSilent = (option && option.isNotSilent) ? 1 : 0;
    // 点击结算按钮
    if (_isNotSilent) {
      saveFlag = true;
    }
    var parObj = {
      uID: __uID,
      cIDs: [],
      cCounts: [],
      cChecks: [],
    };
    LIST.each(function(e,i) {
      parObj.cIDs[i] = e.get('carId');
      parObj.cCounts[i] = e.get('choNum');
      parObj.cChecks[i] = e.get('isCheck') ? 1 : 0;
    })
    parObj.cIDs = parObj.cIDs.join(',');
    parObj.cCounts = parObj.cCounts.join(',');
    parObj.cChecks = parObj.cChecks.join(',');
    if (_isNotSilent && (MODEL.get('totalNum') == 0 || MODEL.get('totalPrice') == 0)) {
      saveFlag = false;
      appcan.window.openToast(MODEL.get('d_no_price_msg'), 1500);
      return
    }
    SSTool.ajax({
      hasLoading: _isNotSilent,
      url: "http://ensonbuy.com/api/app/SaveShoppingCartSate",
      data: JSON.stringify(parObj),
      success: function (result, status) {
        if(_isNotSilent) {
          localStorage.setItem('choseNum', MODEL.get('choseNum'));
          localStorage.setItem('totalPrice', MODEL.get('totalPrice'));
          SSTool.goTo('bill');
        }
        if (result['return'] == 1) {
        }else {
        }
      },
      complete: function() {
        saveFlag = false;
      },
    });
  }
  function getData(option) {
    saveFlag = false;
    var parObj = {
      uID: __uID,
    };
    SSTool.ajax({
      hasLoading: 1,
      url: "http://ensonbuy.com/api/app/GetShoppingCartByUserID?uID=" + __uID,
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result))
        var _list = _.map(_res, function(e) {
          var _data = dealData(e);
          //return _data;
          return new MVVM.Model(_data);
        });

        VIEW.collection.set(_list);
        MODEL.set('totalNum', _res.length);
        sunPrice();
      }
    });
  }

  // 列表切换语言
  SSTool.addChangeLan(function() {
    var _lan = localStorage.getItem('d_language') || 'chi';
    LIST.map(function(e, i) {
      e.set('name', e.get('name_' + _lan));
      e.set('weight', e.get('weight_' + _lan));
      e.set('d_stock', MODEL.get('d_stock'));
      e.set('stockStr', ( parseInt(e.get('stockNum')) == 0 ) ?MODEL.get('d_out_num') : MODEL.get('d_stock_limited'))
    })
  });

  function dealData(data) {
    var _preStr = localStorage.getItem('d_language') == 'eng' ? 'English' : 'Chinese';
    var res = {};
    data = _.extend({}, data.Commodity, data.ShoppingCart);
    res.id = data.ID;
    res.name = data[_preStr + 'Name'];
    res.name_eng = data['English' + 'Name'];
    res.name_chi = data['Chinese' + 'Name'];
    res.name_jpa = data['Japanese' + 'Name'];
    //res.weight = data.OutPriceArray[0]['F_CSPWeight'] + data.OutPriceArray[0]['F_CSPCompany'];
    var _display = data['DisplayCompany'];
    var _wei = _display.split('(')[0]

    res.weight_chi = _wei.split('/')[0];
    res.weight_eng = _wei.split('/')[1];
    res.weight = res['weight_' + (localStorage.getItem('d_language') || 'chi')];
    res.weightNum = data.OutPriceArray[0]['F_CSPWeight'];
    res.unit = data.OutPriceArray[0]['F_CSPCompany'];
    res.unitStr = (_display.split('(')[1] ? '(' + _display.split('(')[1]: '');
    res.unit = data.OutPriceArray[0]['F_CSPCompany'];

    res.imgPath = 'http://ensonbuy.com/Images/Commodity/' + data.ImagePath;
    res.isHot = data.BIsHot;
    res.isNew = data.BIsNew;
    res.price = '￥' + data.OutPriceArray[0].F_CSPUnitPrice;
    res.priceNum = ~~data.OutPriceArray[0].F_CSPUnitPrice;
    res.choNum = data.F_SCCount;
    res.isCheck = data.F_SCCheck;
    res.carId = data.F_SCID;
    res.d_stock = MODEL.get('d_stock');
    res.stockNum = data.Amount;
    res.showStock = parseInt(data.Amount) < 10
    res.stockStr = ( parseInt(data.Amount) == 0 ) ?MODEL.get('d_out_num') : MODEL.get('d_stock_limited')

    return res;
  }

  $(document).on('click', '.count-box .delete', function(e) {
    var _self = $(this);
    var sID = _self.parents('.item').attr('data-carId');
    if (sID && __uID) {
      appcan.window.confirm({
        title: '',
        content: MODEL.get('d_sure_delete'),
        buttons:[MODEL.get('d_ok'), MODEL.get('d_cancle')],
        callback:function(err,data,dataType,optId){
          if(err){
            return;
          }
          if (data == 0) {
            var parObj = {
              uID: __uID,
              sID: sID
            }
            SSTool.ajax({
              hasLoading: 1,
              url: "http://ensonbuy.com/api/app/DeleteShoppingCart",
              data: JSON.stringify(parObj),
              success: function (result, status) {
                var _res = JSON.parse(JSON.parse(result))
                if (_res['return'] == 1) {
                  appcan.window.openToast(MODEL.get('d_operate_suc'), 1500);
                  getData();
                }else {
                  appcan.window.openToast(MODEL.get('d_operate_fail'), 1500);
                }
              },

            });
          }
        }
      });
    }
    //sunPrice();
    //setTimeout(saveShoppingCartSate , 500);
  });
  $(document).on('tap', '.endbtn .btn input', function(e) {
    saveShoppingCartSate({isNotSilent: 1});
  })
  $(document).on('change', '.count-box input.number', function(e) {
    sunPrice();
    //saveShoppingCartSate();
  });
  $(document).on('click', '.count-box .checkbox input', function(e) {
    sunPrice();
    //setTimeout(saveShoppingCartSate , 500);
  });

  $(document).on('click', '.count-num .btn', function(e) {
    var _self = $(this);
    var flag = (_self.val() == '+') ? 1 : -1;
    var _id = _self.parents('.count-num').data('id');
    LIST.each(function(e,i) {
      if (e.get('id') === _id) {
        var __n = ~~e.get('choNum') + flag;
        if ( __n < 0 || __n > ~~e.get('stockNum')) return
        e.set('choNum', __n);
      }
    });
    sunPrice();
    //saveShoppingCartSate();
    return
  })
  $(document).on('click', '.top-tip .checkbox input', function(e) {
    var _self = $(this);
    LIST.each(function(e) {
      e.set('isCheck',  _self.attr('checked'));
    });
    sunPrice();
  })

  appcan.window.on('pause', saveShoppingCartSate);
  appcan.window.on('resume', getData);
  getData();
})
  //var MODEL = SSTool.getModel()
  //MODEL.set({
  //});
  //SSTool.initFooter('about');
  //SSTool.init();
