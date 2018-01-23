appcan.ready(function() {
  var __uID = localStorage.getItem('CurrentUID');
  appcan.window.on('resume', function() {
    __uID = SSTool.getCurrentUID();
  });

  // 初始化
  var MODEL = SSTool.getModel()
  var LIST = new MVVM.Collection();
  MODEL.set({
    Order: {},
    OrderItemArray: [],
    Recipents: {},
    lan: localStorage.getItem('d_language') || 'chi',
  });
  dealData();
  var cardInfo = new MVVM.Collection();
  var VIEW = SSTool.init({
    collection: LIST,
    bindingSources: {
      cardInfo: function() {return cardInfo;}
    }
  });

  function getData(option) {
    var _lan = localStorage.getItem('d_language') || 'chi';
    MODEL.set('lan', _lan);
    var data = JSON.parse(localStorage.getItem('orderDetailData')) || {};
    //console.log(data);
    MODEL.set(data);
    cardInfo.set([dealCard(data)])

  }

  function dealCard(data) {
    var res = SSTool.lanDict[MODEL.get('lan')];
    // "卡号","月份","年份","验证码","邮政编码"
    var _str = data['Order']['F_OCreditCard'] || '';
    var _infoArr = _str.split(',');
    if (_infoArr.length === 5) {
      var __num = _infoArr[0];
      res.cardNum = __num.substr(0,4) + '*********' + __num.substr(-4);
      res.year = _infoArr[2];
      res.month = _infoArr[1];
      //res.yzCode = _infoArr[3].substr(0,2) + '*****';
      res.yzCode = '*****';
      res.code = _infoArr[4];
    }
    return new MVVM.Model(res);
  }

  function dealData(){
    MODEL.addComputed('productList', function() {
      var orderItemArray = this.get('OrderItemArray');
      var lan = this.get('lan');
      var _dict = {
        eng: 'E',
        chi: 'C',
        jap: 'J',
      }
      var list = _.map(orderItemArray, function(e) {
        var res = {
          imgUrl: SSTool.dealImgUrl(e.CommodityInfo['F_CImagePath'])
        }
        res.name = e.CommodityInfo['F_CName' + _dict[lan]];
        res.num = ~~e.OrderItem['F_OIIAmount'];
        res.unit = e.SellingPrice['F_CSPCompany'];
        res.weight = res.num * e.SellingPrice['F_CSPWeight'];
        res.price = res.num * e.SellingPrice['F_CSPUnitPrice'];
        res.weightUnit = res.weight + res.unit;
        res.d_number = MODEL.get('d_number');
        return res;
      })

      return list;
    });

    MODEL.addComputed('order_num', function() {
      return this.get('Order')['F_ONumber'];
    });
    MODEL.addComputed('order_date', function() {
      return SSTool.formateDate( this.get('Order')['F_ODateTime'] );
    });
    MODEL.addComputed('order_payType', function() {
      var lan = this.get('lan');
      return SSTool.lanDict[lan][SSTool.dict.payType[this.get('Order')['F_OPaymentType']]];
    });
    MODEL.addComputed('order_state', function() {
      var lan = this.get('lan');
      return SSTool.lanDict[lan][SSTool.dict.orderState[this.get('Order')['F_OState']]];
    });
    MODEL.addComputed('pro_num', function() {
      return this.get('OrderItemArray').length;
    });
    MODEL.addComputed('order_price', function() {
      return this.get('Order')['F_OAmountOfMoney'];
    });
    MODEL.addComputed('ad_name', function() {
      return this.get('Recipents')['F_RName'];
    });
    MODEL.addComputed('ad_detail', function() {
      return this.get('Recipents')['F_RUnitNumber'] + ',' + this.get('Recipents')['F_RDetailedAddress'];
    });
    MODEL.addComputed('ad_street', function() {
      return this.get('Recipents')['F_RUnitNumber'];
    });
    MODEL.addComputed('ad_area', function() {
      return this.get('Recipents')['F_RArea'];
    });
    MODEL.addComputed('ad_city', function() {
      return this.get('Recipents')['F_RCity'];
    });
    MODEL.addComputed('ad_alias', function() {
      return this.get('Recipents')['F_RAlias'];
    });
    MODEL.addComputed('ad_code', function() {
      return this.get('Recipents')['F_RZipCode'];
    });
    MODEL.addComputed('ad_phone', function() {
      return this.get('Recipents')['F_RPhone'];
    });
  }

  SSTool.addChangeLan(function() {
    var _lan = localStorage.getItem('d_language') || 'chi';
    MODEL.set('lan', _lan);
  })
  SSTool.addChangeLan(function() {
    var _lan = localStorage.getItem('d_language') || 'chi';
    cardInfo.map(function(e) {
      e.set(SSTool.lanDict[_lan]);
    })
  })

  $(document).on('tap', '#back', function(e) {
    appcan.window.windowBack();
  })

  //appcan.window.on('pause', saveShoppingCartSate);
  appcan.window.on('resume', getData);
  getData();
})
