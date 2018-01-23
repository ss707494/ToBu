appcan.ready(function() {
  var __uID = SSTool.getCurrentUID();
  appcan.window.on('resume', function() {
    __uID = SSTool.getCurrentUID();
  });
  // 初始化
  var MODEL = SSTool.getModel()
  var COLLECTION = new MVVM.Collection();
  MODEL.set({
    lan: localStorage.getItem('d_language') || 'chi',
    name_eng: '',
    name_chi: '',
    name_jpa: '',
    remark: '',
    remark_eng: '',
    remark_chi: '',
    remark_jpa: '',
    brand: '',
    weight: '',
    imgPath: '',
    isHot: '',
    isNew: '',
    price: '',
    id: '',
    choNum: '',
    stockNum: '',
    showStock: '',
    unit: '',
    shopListNum: 0,
    hasAmount: false,

  });
  //SSTool.initFooter('product');
  dealModel();
  var VIEW = SSTool.init({
    collection: COLLECTION
  });

  function dealModel(option) {
    MODEL.addComputed('nameLan', function() {
      return this.get('name_' + this.get('lan'));
    });
    MODEL.addComputed('remarkLan', function() {
      return this.get('remark_' + this.get('lan'));
    });
    MODEL.addComputed('weightLan', function() {
      return this.get('weight_' + this.get('lan')) + this.get('unitStr');
    });

  }

  function getData(option) {
    var data = JSON.parse(localStorage.getItem('productDetailData')) || {};
    console.log(data);
    MODEL.set(data);
    getShopNum();
  }

  function getShopNum(option) {
    var parObj = {
      uID: __uID,
    };
    SSTool.ajax({
      hasLoading: 1,
      url: "http://ensonbuy.com/api/app/GetShoppingCountCartByUserID?uID=" + __uID,
      data: JSON.stringify(parObj),
      success: function (result, status) {
        var _res = JSON.parse(JSON.parse(result));
        console.log(_res);
        _res && _res.Count && MODEL.set('shopListNum', _res.Count);
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
        console.log(_res);
        if (_res['return'] == 1) {
          appcan.window.openToast(MODEL.get('d_add_succes'), 1500)
          getShopNum();
        }else {
          appcan.window.openToast(MODEL.get('d_add_fail'), 1500)
        }
      }
    });
  }

  SSTool.addChangeLan(function() {
    var _lan = localStorage.getItem('d_language') || 'chi';
    MODEL.set('lan', _lan);
  });

  $(document).on('click', '#shopCar', function(e) {
    SSTool.goTo('shoppingCar');
  });
  $(document).on('click', '#joinShopCar', function(e) {
    addShoppingCart({
      cID: MODEL.get('id'),
      Count: MODEL.get('choNum'),
    });
  });

  $(document).on('click', '.count-num .btn', function(e) {
    var _self = $(this);
    var flag = (_self.val() == '+') ? 1 : -1;
    var e = MODEL;
    var __n = ~~e.get('choNum') + flag;
    if ( __n < 0 || __n > ~~e.get('stockNum')) return
    e.set('choNum', __n);
    return
  })

  appcan.window.on('resume', getData);
  getData();

})

