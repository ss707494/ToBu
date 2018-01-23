(function($){
  var SSTool = {
    getModel: function() {
      return MODEL;
    },
    init: function (option) {
      var view = new MVVM.ViewModel(_.extend({
        el: '#viewModel',
        model: MODEL,
      }, option));
      return view;
    },
    initFooter: _initFooter,
    goTo: function (name, option) {
      if(_.isString(option)) {
        option = {urlQuery: option};
      }else {
        option = _.extend({}, option);
      }
      var urlQuery = option.urlQuery || '';
      appcan.window.open({
        name: name,
        dataType:0,
        aniId:2,
        data: name + ".html",
      });
    },
    ajax: function (data) {
      if (data && data.hasLoading){
        _loading();
      }
      var __suc;
      if (data && _.isFunction(data.success)) {
        __suc = data.success;
        delete data['success'];
      }
      var _com;
      if (data && _.isFunction(data.complete)) {
        _com = data.complete;
        delete data['complete'];
      }
      var _option = $.extend({}, {
        type: "post",
        contentType: "application/json",
        dataType: "text",
        timeout: 10000,
        success: function(res, state) {
          if (false && _.isString(res)) {
            var _res = JSON.parse(JSON.parse(res))
            if (_.has(_res, 'return') && _res['return'] == 0) {
              appcan.window.openToast(MODEL.get('d_server_net_err_message'), 1500);
              return
            }
          }
          __suc(res, state);
        },
        complete: function() {
          if (data && data.hasLoading) {
            _hideLoading();
          }
          if (data && _.isFunction(_com)) {
            return _com();
          }
        },
        error: function (err, msg, http) {
          appcan.window.openToast(MODEL.get('d_server_net_err_message'), 1500)
          debugger;
        }
      }, data)
      return appcan.ajax(_option);
    },
    checkData: function(data, option) {
      var _rules = {
        userName: {
          reg: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
          errMsg: 'name is error'
        }
      }
      $.map(option, function (e, i) {
        var _type = e.type;
        if (_rules[_type].reg.test(data[_type])) {

        };

      })
    },
    showLoading: _loading,
    hideLoading:_hideLoading,
    dealList: function (list, num) {
      var _res = {};
      if (list.length < num) _res.noMore = 1;
      _res.head = list.splice(0, num);
      _res.foot = list;
      return _res;
    },
    initScroll: _initScroll,
    setScrollToggle: function (flag) {
      scrollToggle = flag;
    },
    addChangeLan: function(event) {
      _changeLanArr[_changeLanArr.length] = event;
    },
    updateSelect: _updateSelect,
    formateDate: function(str) {
      if (!str) return '';
      var d = eval('new ' + str.substr(1, str.length - 2));

      var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
      var ar_time = [d.getHours(), d.getMinutes(), d.getSeconds()];
      function dFormat(i) {
        return i < 10 ? "0" + i.toString() : i;
      }
      for (var i = 0; i < ar_date.length; i++) {
        ar_date[i] = dFormat(ar_date[i]);
        ar_time[i] = dFormat(ar_time[i]);
      }

      var nDate = ar_date.join('-');
      var nTime = ar_time.join(':');
      return nDate + " " + nTime;
    },
    dict: {
      payType: {
        info: '3, 信用卡 2, 货到付款',
        3: 'd_card_pay',
        2: 'd_huodaofukuan',
      },
      orderState: {
        info: '"", "信用卡待付", "配货中", "已装船", "已收货", "货到付款已签收", "完成", "取消"',
        1: 'd_card_pending',
        2: 'd_assembly',
        3: 'd_had_shipment',
        4: 'd_received',
        5: 'd_had_sign',
        6: 'd_complete',
        7: 'd_cancle',

      }
    },
    dealImgUrl: function(str) {
      return str ? 'http://ensonbuy.com/Images/Commodity/' + str : '';
    },
    escapeSpecialChars: function(jsonString) {
      return jsonString.replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f");
    },
    getCurrentUID: function() {
      //__uID  87ac69d2-39be-476e-ab28-cc283cce6104
      //return '87ac69d2-39be-476e-ab28-cc283cce6104';
      return localStorage.getItem('CurrentUID');
    },
    initFontSmall: function() {
      if(__lan == 'eng') {
        $('.small-tag').addClass('font-small');
      }else {
        $('.small-tag').removeClass('font-small');
      }
    }
  }

  var Dict__ = {
    chi: {
      d_language: 'chi',
      d_language_option_0: '中文',
      d_language_option_1: '英文',
      d_language_option_2: '日文',
      d_regist: '注册',
      d_ok: '确定',
      d_loginout_msg: '是否注销',
      d_logTitle: 'ToBu移动电子商城',
      d_banben: '版本：ToBu2018 V1.1',
      d_server_net_err_message: '服务器请求错误',
      d_callMe: '联系我们',
      d_userName: '用户名',
      d_userName_login_pla: '请输入用户名/手机号/电子邮箱',
      d_login_err_message: '用户名或密码错误',
      d_password_pla: '请输入密码',
      d_userName_pla: '6-18位字母数字的组合用户名',
      d_phoneNum: '手机号',
      d_password: '密码',
      d_sure_password_re: '确认密码',
      d_default_address: '默认收货地址(选填项)',
      d_state: '州',
      d_you_chose: '请选择',
      d_input_yanzhen_pla: '请输入右侧图片验证码',
      d_registration: '注册提交',
      d_pla_address: '地址名称',
      d_pla_name: '收件人姓名',
      d_pla_street: '街道地址',
      d_detail_address: '详细地址',
      d_pla_unit: '小区,单元号,楼层,房间号',
      d_pla_city: '城市',
      d_pla_code: '邮政编码',
      d_pla_phone: '手机号',
      d_goto_home: '进入主页',
      d_suc_msg: '恭喜您注册成功',
      d_creditCard: '信用卡',
      d_cardNum: '卡号',
      d_usefulTime: '有效期',
      d_cardNum_pla: '请输入16位固定长度',
      d_yanzhengCode: '验证码',
      d_yanzhengCode_pla : '请输入5位固定长度',
      d_add: '保存',
      d_base_msg: '基本信息',
      d_old_password: '旧密码',
      d_new_password: '新密码',
      d_sure_password: '确认新密码',
      d_email: '电子邮箱',
      d_old_password_pla: '',
      d_new_password_pla: '',
      d_sure_password_pla: '',
      d_phoneNum_pla: '',
      d_email_pla: '',
      d_submit: '保存',
      d_address_mange: '地址管理',
      d_address_first: '第一个地址',
      d_address_two: '第二个地址',
      d_address_third: '第三个地址',
      d_save: '保存',
      d_about: '联系我们',
      d_address: '地址',
      d_address_msg0: '1534 Gondola Street',
      d_address_msg1: 'Sharonville OH 45241',
      d_link: '网址',
      d_email_about: 'E-mail',
      d_eamil_url: 'qz@tobucorp.com',
      d_telephone: '电话',
      d_telephone_ENG: 'ENG:',
      d_telephone_CHI: '中文:',
      d_fax: '传真',
      d_my_order: '我的订单',
      d_huodaofukuan: '货到付款',
      d_card_pay: '信用卡支付',
      d_need_pay: '待付款',
      d_yifahuoan: '已发货',
      d_yishouhuo: '已收货',
      d_huizhiqianshou: '已签收',
      d_yiwancheng: '已完成',
      d_weiwancheng: '未完成',
      d_user_center: '个人中心',
      d_product: '产品',
      d_bussiness_center: '购物车',
      d_about_foot: '关于',
      d_product_list: '商品列表',
      d_product_class: '商品类别',
      d_keyword: '关键词',
      d_stock: '库存',
      d_put_in_car: '加入购物车',
      d_hot: 'HOT',
      d_new: 'NEW',
      d_add_succes: '添加成功',
      d_add_fail: '添加失败, 请稍候再试',
      d_my_shop_car: '我的购物车',
      d_total_num: '总数',
      d_piece: '件',
      d_account_chose: '结算选择',
      d_total: '共',
      d_sum: '合计',
      d_account: '结算',
      d_product_total_num: '商品总数',
      d_price_sum: '总金额',
      d_pay_type: '支付方式',
      d_post_address: '送货地址',
      d_sure_submit: '确认提交',
      d_account_suc: '下单成功',
      d_account_fail: '下单失败, 请稍候再试',
      d_order_list: '订单列表',
      d_start_date: '开始时间',
      d_end_date: '结束时间',
      d_product_name: '商品名称',
      d_order_date: '订单日期',
      d_order_num: '订单编号',
      d_order_state: '订单状态',
      d_product_zongji: '商品总计',
      d_all: '全部',
      d_card_pending: '信用卡待付',
      d_assembly: '配货中',
      d_had_shipment: '已装船',
      d_received: '已收货',
      d_had_sign: '货到付款已签收',
      d_complete: '完成',
      d_cancle: '取消',
      d_product_str: '商品',
      d_ge: '个',
      d_back: '返回',
      d_order_num_hao: '订单号',
      d_date_str: '日期',
      d_order_detail: '订单详情',
      d_set_num_msg: '请先设置数量',
      d_card_info: '信用卡信息',
      d_product_detail: '商品详情',
      d_login_msg: '请先登录',
      d_no_address_msg: '请先输入地址信息',
      d_no_price_msg: '请先选择商品',
      d_welcome_back: '欢迎回来!',
      d_unit_price: '单价',
      d_company_name: '厂家',
      d_brand: '品牌',
      d_chose_num: '选择数量',
      d_product_remark: '商品描述',
      d_loginout: '注销',
      d_out_num: '缺货',
      d_stock_limited: '库存有限',
      d_user_msg_err: '获取当前用户信息失败!',
      d_require_first_address: '第一地址名称不能为空!',
      d_require_first_name: '第一收件人不能为空!',
      d_require_first_street: '第一街道 地址不能为空!',
      d_require_first_city: '第一地址城市不能为空!',
      d_require_first_statue: '第一地址州不能为空!',
      d_require_first_zipCode: '第一地址邮政编码不能为空!',
      d_require_first_addrePhone: '第一地址收件人电话不能为空!',
      d_require_second_name: '第二收件人不能为空!',
      d_require_second_street: '第二街道 地址不能为空!',
      d_require_second_city: '第二地址城市不能为空!',
      d_require_second_statue: '第二地址州不能为空!',
      d_require_second_zipCode: '第二地址邮政编码不能为空!',
      d_require_second_addrePhone: '第二地址收件人电话不能为空!',
      d_require_third_name: '第三收件人不能为空!',
      d_require_third_street: '第三街道 地址不能为空!',
      d_require_third_city: '第三地址城市不能为空!',
      d_require_third_statue: '第三地址州不能为空!',
      d_require_third_zipCode: '第三地址邮政编码不能为空!',
      d_require_third_addrePhone: '第三地址收件人电话不能为空!',
      d_require_old_password: '旧密码不能为空!',
      d_two_password: '两次密码输入不一至!',
      d_require_phone: '手机号不能为空!',
      d_creditCard_msg_err: '获取信用卡信息失败!',
      d_require_cardNum: '卡号不能为空!',
      d_cardNum_length: '卡号长度为16位固定长度!',
      d_require_valiate_code: '验证码不能为空!',
      d_valiate_length: '验证码长度为5位!',
      d_require_password: '密码不能为空!',
      d_require_name_while_address: '您在录入送货地址时，收件人不能为空!',
      d_require_username: '用户名不能为空!',
      d_year: '年',
      d_month: '月',
      d_number: '数量',
      d_save_login_state: '保存登录状态',
      d_sail_unit: '销售单位',
    },
    eng: {
      d_language: 'chi',
      d_language_option_0: '中文',
      d_language_option_1: '英文',
      d_language_option_2: '日文',
      d_regist: 'Sign Up',
      d_ok: 'OK',
      d_loginout_msg: 'Log Off?',
      d_logTitle: 'ToBu Mall',
      d_banben: 'Version：ToBu2018 V1.1',
      d_server_net_err_message: 'Server request error!',
      d_callMe: 'ContactUs',
      d_userName: 'UserName',
      d_userName_login_pla: 'YOUR ACCOUNT',
      d_login_err_message: 'User Name or Password error!',
      d_password_pla: 'Password',
      d_userName_pla: '6-18 letter or number',
      d_phoneNum: 'Phone',
      d_password: 'Password',
      d_sure_password_re: 'Confirm',
      d_default_address: 'Shipping Address(Optional)',
      d_state: 'State',
      d_you_chose: 'Select',
      d_input_yanzhen_pla: 'Verification code',
      d_registration: 'Submit',
      d_pla_address: 'AddressName',
      d_pla_name: 'Addressee',
      d_pla_street: 'StreetAddress',
      d_detail_address: 'DetailAddress',
      d_pla_unit: 'Apartment,suite,unit,building,floor,etc.',
      d_pla_city: 'City',
      d_pla_code: 'ZipCode',
      d_pla_phone: 'Phone',
      d_goto_home: 'HomePage',
      d_suc_msg: 'Congratulations!Registered Successfully!',
      d_creditCard: 'CreditCard',
      d_cardNum: 'CardNumber',
      d_usefulTime: 'ExpirationDate',
      d_cardNum_pla: 'The length of the card must be 16 bits',
      d_yanzhengCode: 'SecurityCode',
      d_yanzhengCode_pla : 'The length of the security code must be 5 bits',
      d_add: 'Save',
      d_base_msg: 'LoginInfo',
      d_old_password: 'OldPassword',
      d_new_password: 'NewPassword',
      d_sure_password: 'Confirm',
      d_email: 'Email',
      d_old_password_pla: '',
      d_new_password_pla: '',
      d_sure_password_pla: '',
      d_phoneNum_pla: '',
      d_email_pla: '',
      d_submit: 'Save',
      d_address_mange: 'ShippingAddress',
      d_address_first: 'FirstAddress',
      d_address_two: 'SecondAddress',
      d_address_third: 'ThirdAddress',
      d_save: 'Save',
      d_about: 'About',
      d_address: 'Address',
      d_address_msg0: '1534 Gondola Street',
      d_address_msg1: 'Sharonville OH 45241',
      d_link: 'Website',
      d_email_about: 'E-mail',
      d_eamil_url: 'qz@tobucorp.com',
      d_telephone: 'Telphone',
      d_telephone_ENG: 'ENG:',
      d_telephone_CHI: '中文:',
      d_fax: 'Fax',
      d_my_order: 'MyOrder',
      d_huodaofukuan: 'PayUponDelivery',
      d_card_pay: 'CreditCard',
      d_need_pay: 'PrePay',
      d_yifahuoan: 'Shipped',
      d_yishouhuo: 'Received',
      d_huizhiqianshou: 'Sign',
      d_yiwancheng: 'Completed',
      d_weiwancheng: 'Cancel',
      d_user_center: 'Profile',
      d_product: 'Product',
      d_bussiness_center: 'Cart',
      d_about_foot: 'About',
      d_product_list: 'ProductsList',
      d_product_class: 'Category',
      d_keyword: 'Keyword',
      d_stock: 'Stock',
      d_put_in_car: 'AddCart',
      d_hot: 'HOT',
      d_new: 'NEW',
      d_add_succes: 'Add successfully',
      d_add_fail: 'Add failed, please try again later',
      d_my_shop_car: 'MyCart',
      d_total_num: 'Total',
      d_piece: ' item',
      d_account_chose: 'Chosed',
      d_total: '',
      d_sum: 'Subtotal',
      d_account: 'ProceedToCheckout',
      d_product_total_num: 'Total',
      d_price_sum: 'Subtotal',
      d_pay_type: 'PayMethod',
      d_post_address: 'Address',
      d_sure_submit: 'Submit',
      d_account_suc: 'Successfully ordered',
      d_account_fail: 'Orders failed, please try again later',
      d_order_list: 'OrdersList',
      d_start_date: 'StartTime',
      d_end_date: 'EndTime',
      d_product_name: 'Name',
      d_order_date: 'OrderDate',
      d_order_num: 'OrderNumber',
      d_order_state: 'OrderState',
      d_product_zongji: 'ProductsTotal',
      d_all: 'All',
      d_card_pending: 'Credit Card Payment Pending',
      d_assembly: 'Preparing Shipment',
      d_had_shipment: 'Shipped',
      d_received: 'Delivered',
      d_had_sign: 'Pay Later Received',
      d_complete: 'Completed',
      d_cancle: 'Cancelled',
      d_product_str: 'product',
      d_ge: '',
      d_back: 'Back',
      d_order_num_hao: 'OrderNum',
      d_date_str: 'Date',
      d_order_detail: 'OrderDetail',
      d_set_num_msg: 'Please set the number first',
      d_card_info: 'Credit card information',
      d_product_detail: 'ProductDetail',
      d_login_msg: 'Please log in first',
      d_no_address_msg: 'Please enter the address information',
      d_no_price_msg: 'Please select the product',
      d_welcome_back: 'Welcome back!',
      d_unit_price: 'UnitPrice',
      d_company_name: 'Factory',
      d_brand: 'Brand',
      d_chose_num: 'Choose the quantity',
      d_product_remark: 'Product description',
      d_loginout: 'LogOut',
      d_out_num: 'OutOfStock',
      d_stock_limited: 'LimitedStock',
      d_user_msg_err: 'Failed to get user information!',
      d_require_first_address: 'The first address name is required!',
      d_require_first_name: 'The first recipients name is required!',
      d_require_first_street: 'The first street name is required!',
      d_require_first_city: 'The first city is required!',
      d_require_first_statue: 'The first statue is required!',
      d_require_first_zipCode: 'The first zipcode is required!',
      d_require_first_addrePhone: 'The first recipient\'s phone is required!',
      d_require_second_name: 'The second recipients name is required!',
      d_require_second_street: 'The second street name is required!',
      d_require_second_city: 'The second city is required!',
      d_require_second_statue: 'The second statue is required!',
      d_require_second_zipCode: 'The second zipcode is required!',
      d_require_second_addrePhone: 'The second recipient\'s phone is required!',
      d_require_third_name: 'The third recipients name is required!',
      d_require_third_street: 'The third street name is required!',
      d_require_third_city: 'The third city is required!',
      d_require_third_statue: 'The third statue is required!',
      d_require_third_zipCode: 'The third zipcode is required!',
      d_require_third_addrePhone: 'The third recipient\'s phone is required!',
      d_require_old_password: 'Old password is required!',
      d_two_password: 'The second password is inconsistent!',
      d_require_phone: 'Phone is required!',
      d_creditCard_msg_err: 'Failed to get credit card information!',
      d_require_cardNum: 'Card number is required!',
      d_cardNum_length: 'The length of the card must be 16 bits!',
      d_require_valiate_code: 'Security code is required!',
      d_valiate_length: 'The length of the security code must be 5 bits!',
      d_require_password: 'Password is required!',
      d_require_name_while_address: 'When you enter the shipping address, the recipient is required!',
      d_require_username: 'UserName is required!',
      d_year: '-',
      d_month: '',
      d_number: 'Number',
      d_save_login_state: 'SaveLoginState',
      d_sail_unit: 'SaleUnit',
    }
  }
  SSTool.lanDict = Dict__;

  // loading动画
  function _loading(option) {
    if ($('.loading').length) {
      $('.loading').show();
    }else {
      var _tpl ='<div class="loading"><div class="loading-box"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div></div> </div>';
      $('body').append(_tpl);
    }
  }
  function _hideLoading(option) {
    $('.loading').hide();
  }

  // footer
  function _initFooter(option) {
    $('#viewModel').append('<div class="footer"> <div id="index" class="iconItem"> <i class="iconfont icon-account"></i> <span data-bind="text: d_user_center"></span> </div> <div id="product" class="iconItem"> <i class="iconfont icon-all"></i> <span data-bind="text: d_product"></span> </div> <div id="shoppingCar" class="iconItem"> <i class="iconfont icon-cart"></i> <span data-bind="text: d_bussiness_center"></span> </div> <div id="about" class="iconItem"> <i class="iconfont icon-home"></i> <span data-bind="text: d_about"></span> </div> </div>');
    $('#index').on('tap', function(e) {
      SSTool.goTo('index');
    });
    $('#product').on('tap', function(e) {
      SSTool.goTo('product');
    });
    $('#shoppingCar').on('tap', function(e) {
      SSTool.goTo('shoppingCar');
    });
    $('#about').on('tap', function(e) {
      SSTool.goTo('about');
    });
    if(_.isString(option)) {
      $('#' + option).addClass('act');
    }else if(option && option.name) {
      $('#' + option.name).addClass('act');
    }

  }


  var __lan = localStorage.getItem('d_language') || 'chi';
  var MODEL = new MVVM.Model($.extend({}, Dict__[__lan]));
  var _changeLanArr = [];
  // 切换语言
  function _changeLan() {
    var _val = $('.top_lan .act').attr('data-value') || 'chi';
    __lan = localStorage.getItem('d_language') || 'chi';
    if (_val == __lan) return
    $('.top_lan img').removeClass('act');
    $('.top_lan img[data-value='+ __lan +']').addClass('act');
    MODEL.set(Dict__[__lan]);
    SSTool.updateSelect($('select'));
    _.map(_changeLanArr, function(e) {
      if (_.isFunction(e)) {
        e();
      }
    });
    SSTool.initFontSmall();
  }
  $(function () {
  })

  function _updateSelect(jqObj, option) {
    jqObj.map(function(i, e) {
      var _self = $(e);
      var _selct = _self.parents('.select');
      var selIndex = _self[0].selectedIndex;
      if (_self.val()) {
        _selct.find('.text').text(_self.find('option').eq(selIndex).text());
      }
    })
  }

  var scrollToggle = true;
  function _initScroll(callback, flag) {
    var stop = flag || 1;
    $(window).scroll(_.throttle(function(){
      if (!scrollToggle) return
      totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
      if($(document).height() <= totalheight){
        if(stop==true){
          stop=false;
          callback({
            call: function (option) {
              stop = true;
            }
          });
        }
      }
    }, 0));
    return stop;
  };

  function pageName() {
    var a = location.href;
    var b = a.split("/");
    var c = b.slice(b.length-1, b.length).toString(String).split(".");
    return c.slice(0, 1);
  }
  function checkLogin(option) {
    if (pageName() == 'login' || pageName == 'about'){
      var __uID = localStorage.getItem('CurrentUID');
      if (!__uID){
        appcan.window.confirm({
          title: '',
          content: SSTool.getModel().get('d_login_msg'),
          buttons:[MODEL.get('d_ok')],
          callback:function(err,data,dataType,optId){
            SSTool.goTo('login');
          }
        });
      }
    }
  }
  //appcan.window.on('resume', checkLogin);

  appcan.window.on('resume', _changeLan);

  appcan.ready(function() {
    if(0 && lib && lib.flexible) {
      var _dpr = lib.flexible.dpr || 1;
      if(_dpr != 1) {
        $('html').css('font-size', lib.flexible.rem * _dpr * 0.8 + 'px');
      }
    }

    // 添加语言选择按钮
    $('#viewModel').append('<div class="top_lan"><img class="act" src="images/ChinaL.png" alt="" data-value="chi"><img src="images/USAl.png" alt="" data-value="eng"></div>')
    _changeLan();
    $(document).on('tap', '.top_lan img', function (e) {
      var _val = $(this).attr('data-value');
      localStorage.setItem('d_language', _val);
      _changeLan();
    })
    $(document).on('tap', '.header .go_back', _.throttle(function (e) {
      if (pageName() == 'order_list') {
        SSTool.goTo('index');
      }else {
        appcan.window.windowBack();
      }
    }, 500));
    $(document).on('change', '.select select', function (e) {
      _updateSelect($(this));
    })
     if(uexWidgetOne.platformName=='iOS' && lib && lib.flexible){
       $('body').css('padding-top', lib.flexible.dpr * 20 + 'px');
       $('.top_lan').css('top', lib.flexible.dpr * 20 + 'px');
       //$('.header').css('top', lib.flexible.dpr * 20 + 'px');
     }
  })

  window.SSTool = SSTool;
})($)
