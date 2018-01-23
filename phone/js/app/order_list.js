appcan.ready(function() {
  // init date fun
  Date.prototype.toDateInputValue = (function() {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
  })

  var __uID = SSTool.getCurrentUID();
  appcan.window.on('resume', function() {
    __uID = SSTool.getCurrentUID();
  });
  // 初始化
  var MODEL = SSTool.getModel()
  var LIST = new MVVM.Collection();
  MODEL.set({
    startDate: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).toDateInputValue(),
    endDate: new Date().toDateInputValue(),
    state: '0',
    payType: '0',
    commodityName: '',

  });
  var VIEW = SSTool.init({
    collection: LIST,
  });



  var __listDataOri = [];
  // startDate : 开始日期 (页面加载时默认为一周前）
  // endDate : 结束日期  （页面加载时默认为当天）
  // state : 订单状态     （页面加载时默认为全部）
  // payType : 支付方式   （页面加载时默认为全部）
  // commodityName : 商品名称 （页面加载时默认为空)
  function getData(option) {
    var state = localStorage.getItem('orderListState') || '0';
    MODEL.set('state', state);
    SSTool.updateSelect($('.search-box .select select'));
    var _data = MODEL.toJSON();
    var parObj = {
      uID: __uID,
      startDate: _data.startDate,
      endDate: _data.endDate,
      state: _data.state || '0',
      payType: _data.payType || '0',
      commodityName: _data.commodityName,
    };
    SSTool.ajax({
      hasLoading: 1,
      url: "http://ensonbuy.com/api/app/GetOrderInfoByFilter",
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result));
        if (_res['return'] == 0) {
          appcan.window.openToast(MODEL.get('d_server_net_err_message'), 1500);
          return
        }
        __listDataOri = _res;
        var _list = _.map(_res, dealData);
        LIST.set(_list);
      },
    });
  }

  // 列表切换语言
  SSTool.addChangeLan(function() {
    var _lan = localStorage.getItem('d_language') || 'chi';
    LIST.map(function(e, i) {
      e.set(SSTool.lanDict[_lan]);
      e.set('s_language', _lan);
    })
  });

  var __dealModel = MVVM.Model.extend({
    computeds: {
      lan: function() {
        return this.get('s_language') == 'eng' ? 'E' : 'C';
      },
      productNames: function(){
        var _lan = this.get('lan');
        var OrderItemArray = this.get('OrderItemArray');
        var res = [];
        _.map(OrderItemArray, function(e) {
          var _name = e['CommodityInfo']['F_CName' + _lan];
          var num = ~~e['SellingPrice']['F_CSPWeight'] * ~~e['OrderItem']['F_OIIAmount'];
          var unit = e['SellingPrice']['F_CSPCompany'];
          res.push(_name + '*' + num + unit);
        })
        return res.join(',');
      },
      datetime: function() {
        var _data = SSTool.formateDate(this.get('Order')['F_ODateTime']);
        _data = this.get('OrderDateTime');
        return _data;
      },
      orderNum: function() {
        return this.get('Order')['F_ONumber'];
      },
      payTypeStr: function() {
        var type = this.get('Order')['F_OPaymentType'];
        var s_language = this.get('s_language');
        var _par = SSTool.dict.payType[type];
        return this.get(_par);
      },
      stateStr: function() {
        var type = this.get('Order')['F_OState'];
        var s_language = this.get('s_language');
        var _par = SSTool.dict.orderState[type];
        return this.get(_par);
      },
      product_zongji: function() {
        var _money = this.get('Order')['F_OAmountOfMoney'] || 0;
        var leng = this.get('OrderItemArray').length;
        var _ge = this.get('d_ge');
        var _proStr = this.get('d_product_str')
        return '￥' + _money + '('+leng + _ge + _proStr +')';
      },
      id: function() {
        return this.get('Order')['F_OID'];
      }
    }
  });
  function dealData(data) {
    var lan = localStorage.getItem('d_language') || 'chi';
    var res = new __dealModel(_.extend(data, SSTool.lanDict[lan]));
    res.set('s_language', lan);

    return res;
  }

  $(document).on('click', '.list .item', function(e) {
    var _id = $(this).data('id');
    _.map(LIST.toJSON(), function(e) {
      if(e['Order']['F_OID'] === _id) {
        localStorage.setItem('orderDetailData', JSON.stringify(e));
        SSTool.goTo('order_detail');
      }
    })
  })
  $(document).on('click', '#back', function(e) {
    SSTool.goTo('index');
  })
  $(document).on('change', '.search-box form input', function(e) {
    getData();
  })
  $(document).on('change', '.search-box form select', function(e) {
    localStorage.setItem('orderListState', MODEL.get('state'))
    getData();
  })

  //appcan.window.on('pause', saveShoppingCartSate);
  appcan.window.on('resume', getData);
  getData();
})
