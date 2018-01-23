
var g_CurrentID = "";

appcan.ready(function() {
  appcan.window.on('resume', function() {
    g_CurrentID = SSTool.getCurrentUID();
  });
  g_CurrentID = SSTool.getCurrentUID();
  // 初始化
  var MODEL = SSTool.getModel()
  MODEL.set({
    uID:g_CurrentID,
    address: '',
    name: '',
    street: '',
    detail: '',
    city: '',
    statue: '',
    zipCode: '',
    adderPhone: '',
    address_1: '',
    name_1: '',
    street_1: '',
    detail_1: '',
    city_1: '',
    statue_1: '',
    zipCode_1: '',
    adderPhone_1: '',
    address_2: '',
    name_2: '',
    street_2: '',
    detail_2: '',
    city_2: '',
    statue_2: '',
    zipCode_2: '',
    adderPhone_2: '',
  });
  SSTool.init();

 SSTool.ajax({
    hasLoading : 1,
    //url : "http://ensonbuy.com/api/app/GetRecipientsInfoByUserID?uID="+g_MsgID,
    url : "http://ensonbuy.com/api/app/GetRecipientsInfoByUserID?uID="+g_CurrentID,
    //url : "http://localhost:55153/api/app/GetValiateImg",

    type : "GET",
    data : {
    },
    //contentType: "application/json",
    //dataType : "json",
    //timeout : 30000,
    //offline : true,
    //crypto : true,
    //password : "pwd",
    success : function(data, status, requestCode, response, xhr) {
        var reInfoArray = JSON.parse(data);
        reInfoArray = JSON.parse(reInfoArray);
        if(reInfoArray.F_UID == "-1")
        {
           appcan.window.openToast(MODEL.get('d_user_msg_err'), 1500);
        }
        else
        {
            var values = new Array();
            for(var i=0;i<3;i++)
            {
                if(i >= reInfoArray.length)
                {
                    for(var j=0;j<8;j++)
                    {
                       values.push("");
                    }
                }
                else
                {

                    values.push(reInfoArray[i].F_RAlias);
                    values.push(reInfoArray[i].F_RName);
                    values.push(reInfoArray[i].F_RUnitNumber);
                    values.push(reInfoArray[i].F_RDetailedAddress);
                    values.push(reInfoArray[i].F_RCity);
                    values.push(reInfoArray[i].F_RArea);
                    values.push(reInfoArray[i].F_RZipCode);
                    values.push(reInfoArray[i].F_RPhone);

                }
            }

            document.getElementById("statueDisplay1").innerText = values[5];
            document.getElementById("statueDisplay2").innerText = values[13];
            document.getElementById("statueDisplay3").innerText = values[21];
              MODEL.set({
                uID:g_CurrentID,
                address: values[0],
                name: values[1],
                street: values[2],
                detail: values[3],
                city: values[4],
                statue: values[5],
                zipCode: values[6],
                adderPhone: values[7],
                address_1: values[8],
                name_1: values[9],
                street_1: values[10],
                detail_1: values[11],
                city_1: values[12],
                statue_1: values[13],
                zipCode_1: values[14],
                adderPhone_1: values[15],
                address_2: values[16],
                name_2: values[17],
                street_2: values[18],
                detail_2: values[19],
                city_2: values[20],
                statue_2: values[21],
                zipCode_2: values[22],
                adderPhone_2: values[23]
              });
        }
    },
    error : function(xhr, erroType, error, msg) {
    }
    });

  function moveTab(num) {
    var _box = $('#sli_box');
    var _left = parseInt(_box.css('left'));
    _box.css('left', (_left + num) + 'rem');
  }
  $(document).on('tap', '.next_btn', _.throttle(function (e) {
    moveTab(-10);
  }), 1000);
  $(document).on('tap', '.pre_btn', _.throttle(function (e) {
    moveTab(10);
  }), 1000);

  $('#viewModel').on('tap', '#sub', function(e){
    // 获取数据
    var _model = MODEL.toJSON();

    if(_model.address == "")
    {
        appcan.window.openToast(MODEL.get('d_require_first_address'), 1500);
        return;
    }
    if(_model.name == "")
    {
        appcan.window.openToast(MODEL.get('d_require_first_name'), 1500);
        return;
    }

    if(_model.street == "")
    {
        appcan.window.openToast(MODEL.get('d_require_first_street'), 1500);
        return;
    }

    if(_model.city == "")
    {
        appcan.window.openToast(MODEL.get('d_require_first_city'), 1500);
        return;
    }

    if(_model.statue == "")
    {
        appcan.window.openToast(MODEL.get('d_require_first_statue'), 1500);
        return;
    }

    if(_model.zipCode == "")
    {
        appcan.window.openToast(MODEL.get('d_require_first_zipCode'), 1500);
        return;
    }

    if(_model.adderPhone == "")
    {
        appcan.window.openToast(MODEL.get('d_require_first_addrePhone'), 1500);
        return;
    }

    if(_model.address_1 != "")
    {
        if(_model.name_1 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_second_name'), 1500);
          return;
        }

        if(_model.street_1== "")
        {
          appcan.window.openToast(MODEL.get('d_require_second_street'), 1500);
            return;
        }

        if(_model.city_1 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_second_city'), 1500);
            return;
        }

        if(_model.statue_1 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_second_statue'), 1500);
            return;
        }

        if(_model.zipCode_1 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_second_zipCode'), 1500);
            return;
        }

        if(_model.adderPhone_1 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_second_addrePhone'), 1500);
            return;
        }
    }

    if(_model.address_2 != "")
    {
        if(_model.name_2 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_third_name'), 1500);
            return;
        }

        if(_model.street_2== "")
        {
          appcan.window.openToast(MODEL.get('d_require_third_street'), 1500);
            return;
        }

        if(_model.city_2 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_third_city'), 1500);
            return;
        }

        if(_model.statue_2 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_third_statue'), 1500);
            return;
        }

        if(_model.zipCode_2 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_third_zipCode'), 1500);
            return;
        }

        if(_model.adderPhone_2 == "")
        {
          appcan.window.openToast(MODEL.get('d_require_third_addrePhone'), 1500);
            return;
        }
    }


    var subPar = {
      uID:g_CurrentID,
        address: _model.address,
        name: _model.name,
        street: _model.street,
        detail: _model.detail,
        city: _model.city,
        statue: _model.statue,
        zipCode: _model.zipCode,
        adderPhone: _model.adderPhone,
        address_1: _model.address_1,
        name_1: _model.name_1,
        street_1: _model.street_1,
        detail_1: _model.detail_1,
        city_1: _model.city_1,
        statue_1: _model.statue_1,
        zipCode_1: _model.zipCode_1,
        adderPhone_1: _model.adderPhone_1,
        address_2: _model.address_2,
        name_2: _model.name_2,
        street_2: _model.street_2,
        detail_2: _model.detail_2,
        city_2: _model.city_2,
        statue_2: _model.statue_2,
        zipCode_2: _model.zipCode_2,
        adderPhone_2: _model.adderPhone_2
       };

     SSTool.ajax({
                url: "http://ensonbuy.com/api/app/UpdateRecipientsInfo",
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
