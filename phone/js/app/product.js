appcan.ready(function() {
  var __uID = SSTool.getCurrentUID();
  appcan.window.on('resume', function() {
    __uID = SSTool.getCurrentUID();
  });
  // 初始化
  var MODEL = SSTool.getModel()
  var LIST = new MVVM.Collection();
  MODEL.set({
    TypeID: '1',
    KeyText: '',
    dataList: [],
    classList: [],

  });
  SSTool.initFooter('product');
  var VIEW = SSTool.init({
    collection: LIST,
  });


  var _totalData = [];
  var _oneList = 6;
  function getData(option) {
    var _model = MODEL.toJSON();
    var parObj = {
      uID: __uID,
      TypeID: _model.TypeID,
      KeyText: _model.KeyText,
    };
    SSTool.ajax({
      hasLoading: 1,
      url: "http://ensonbuy.com/api/app/GetCommodityInfoByFilter",
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result))
        _totalData = _.map(_res.CommodityArray, function(e) {
          return new MVVM.Model(_dealData(e));
        });
        getMoreData({isNew: 1});
        console.log(_res);
      },
    });
  }
  function getMoreData(option) {
    var dealData = SSTool.dealList(_totalData, _oneList);
    _totalData = dealData.foot;
    if (option && option.isNew) {
      SSTool.setScrollToggle(1);
      MODEL.set("dataList", dealData.head)
      VIEW.collection.set(dealData.head);
    }else {
      VIEW.collection.add(dealData.head);
    }
    if (option && _.isFunction(option.call)) {
      option.call();
    }
    if (dealData.noMore) SSTool.setScrollToggle(0);
  }
  SSTool.initScroll(getMoreData);

  function getCommodityInfoType(option) {
    var parObj = {
      uID: __uID
    }
    SSTool.ajax({
      hasLoading: 1,
      url: "http://ensonbuy.com/api/app/GetCommodityInfoType?uID=" + parObj.uID,
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result));
        var _list = _.map(_res, dealClassInfo);
        MODEL.set('TypeID', _list[0].value);
        MODEL.set('classList', _list);
        $('.select select').change();
        //console.log(_res);
        getData();
      }
    });
  }

  function addShoppingCart(option) {
    var parObj = {
      uID: __uID,
      cID: option.cID || '',
      Count: option.count,
    }
    if (option.count == 0) {
      appcan.window.openToast(MODEL.get('d_set_num_msg'), 1500)
      return
    }
    SSTool.ajax({
      hasLoading: 1,
      url: "http://ensonbuy.com/api/app/AddShoppingCart",
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result));
        if (_res['return'] == 1) {
          appcan.window.openToast(MODEL.get('d_add_succes'), 1500)
        }else {
          appcan.window.openToast(MODEL.get('d_add_fail'), 1500)
        }
      }
    });
  }

  function updateCommodityBaseByID(option) {
    var parObj = {
      uID: __uID,
      cID: option.cID,
    }
    if (!option.cID) {
      return
    }
    SSTool.ajax({
      url: "http://ensonbuy.com/api/app/UpdateCommodityBaseByID",
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result));
      }
    });
  }

  SSTool.addChangeLan(function() {
    function changeOneData(e) {
      e.set('name', e.get('name_' + _lan));
      e.set('weight', e.get('weight_' + _lan));
      e.set('d_stock', MODEL.get('d_stock'));
      e.set('stockStr', ( parseInt(e.get('stockNum')) == 0 ) ?MODEL.get('d_out_num') : MODEL.get('d_stock_limited'))
      e.set('d_put_in_car', MODEL.get('d_put_in_car'));
    }
    var _lan = localStorage.getItem('d_language') || 'chi';
    LIST.map(changeOneData);
    _totalData.map(changeOneData);
  });
  SSTool.addChangeLan(function() {
    var _lan = localStorage.getItem('d_language') || 'chi';
    var _list = _.map(MODEL.get('classList'), function(e) {
      return _.extend({}, e, {text: e['text_' + _lan]});
    });
    MODEL.set('classList', _list);
    SSTool.updateSelect($('.select select'))
  });
  // 处理返回结果
  function _dealData(data) {
    var _preStr = localStorage.getItem('d_language') == 'eng' ? 'English' : 'Chinese';
    var res = {};
    res.name = data[_preStr + 'Name'];
    res.name_eng = data['English' + 'Name'];
    res.name_chi = data['Chinese' + 'Name'];
    res.name_jpa = data['Japanese' + 'Name'];
    res.remark = data[_preStr + 'Name'];
    res.remark_eng = data['English' + 'Remark'];
    res.remark_chi = data['Chinese' + 'Remark'];
    res.remark_jpa = data['Japanese' + 'Remark'];
    res.brand = data['Brand'];
    var _display = data['DisplayCompany'];
    var _wei = _display.split('(')[0]

    res.weight = _wei.split('/')[0];
    res.weight_chi = _wei.split('/')[0];
    res.weight_eng = _wei.split('/')[1];
    res.weightNum = data.OutPriceArray[0]['F_CSPWeight'];
    res.unit = data.OutPriceArray[0]['F_CSPCompany'];
    res.unitStr = (_display.split('(')[1] ? '(' + _display.split('(')[1]: '');
    res.imgPath = SSTool.dealImgUrl(data.ImagePath);
    res.isHot = data.BIsHot;
    res.isNew = data.BIsNew;
    res.price = '￥' + data.OutPriceArray[0].F_CSPUnitPrice;
    res.id = data.ID;
    res.d_put_in_car = MODEL.get('d_put_in_car');
    res.choNum = data.Amount == 0 ? 0 : 1;
    res.d_stock = MODEL.get('d_stock');
    res.stockNum = data.Amount;
    res.showStock = parseInt(data.Amount) < 10
    res.stockStr = ( parseInt(data.Amount) == 0 ) ?MODEL.get('d_out_num') : MODEL.get('d_stock_limited');
    res.hasAmount =  parseInt(data.Amount) == 0;

    return res;
  }
  function dealClassInfo(data) {
    var _preStr = localStorage.getItem('d_language') == 'eng' ? 'English' : 'Chinese';
    var _endStr = localStorage.getItem('d_language') == 'eng' ? 'E' : 'C';
    var _res = {};
    _res.value = data.F_CTID;
    _res.text = data['F_CTName' + _endStr];
    _res.text_chi = data['F_CTName' + 'C'];
    _res.text_eng = data['F_CTName' + 'E'];
    _res.text_jpa = data['F_CTName' + 'J'];
    return _res;
  }

  $(document).on('click', '.list .item .img', function(e) {
    var _self = $(this);
    var _id = _self.parents('.item').data('id');
    updateCommodityBaseByID({cID: _id});
    LIST.each(function(e) {
      if (e.get('id') == _id) {
        localStorage.setItem('productDetailData', JSON.stringify(e.toJSON()))
        SSTool.goTo('product_detail');
      }
    })


  })

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
    return
  })
  //
  $(document).on('click', '.joinCar', _.throttle(function(e) {
    var _self = $(this);
    var _count = _self.parents('.item').find('.second .number').val();
    var _id = _self.data('id');
    addShoppingCart({cID: _id, count: _count});
  }, 1500));

  $('#searchAct').on('submit', getData);
  $('#search').on('click', function (e) {
    getData();
  });
  $('.productClass .select select').on('change', function (e) {
    getData();
  });
  appcan.window.on('resume', getData);
  getCommodityInfoType();
})

