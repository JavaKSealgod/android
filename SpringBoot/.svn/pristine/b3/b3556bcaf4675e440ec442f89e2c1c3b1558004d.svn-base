/**
 * 
 */
var basePath = $("#basePath").attr("href");
var action="init";
var objId = "#listGrid";

$(function(){   
	$("#butSave").click(function(){  
		Page.ajaxclick();
	});
	
	$("#a_search").click(function(){  
		Page.ajaxclickeasyui();
	});
})  

var Page = {
	ajaxclick:  function() {   
		var Parmdata ={"NAME":"123"};
		var Posturl = basePath+"/webPage/demo/ajaxList";
		Page.ajaxPost(Posturl,Parmdata,action);
    }

,ajaxclickeasyui:  function() {   
		var Parmdata ={"NAME":"123"};
		var Posturl = basePath+"/webPage/demo/easyui";
		action="GridList";
		Page.ajaxPost(Posturl,Parmdata,action);   
	}

,ajaxPost:function(Posturl,Parmdata,action){   
	 $.ajax(
		    {
		       url:Posturl,
		       data:Parmdata,
		       type:"post",
		       //contentType: "application/json;charset=utf-8",
		       dataType:"json",
		       success:function(data)
		        {  
		    	  Page.ajaxReturn(action,data); 
		        } ,
		        error:function(data){  
		            alert("fail");  
		        }
		    });
 		}
 
,ajaxReturn:function(action,data){
	 var ajaxRetrurn = $("#ajaxRetrurn");
	   $.each(data, function(index, element) { 
		   ajaxRetrurn.append("<div>"+element.NAME+"</div>");
       }); 
	   if(action=="GridList"){
		   $(objId).datagrid('loadData', data);
	   }
 	}

,bindGrid: function () {
    $(objId).datagrid({
        url: basePath+"/webPage/demo/easyui",
        width: 800,
        height: 50,
        autoScroll: true,
        nowrap: false, //折行
        rownumbers: true, //行号
        striped: true, //隔行变色
        idField: 'Id', //主键  
        singleSelect: true, //单选
        frozenColumns: [[]],//想要冻结列的时候，就可以写这里
        queryParams: {
            'action': 'loading' 
        },
        toolbar: '#toolbar',
        showFooter: true,
        pagination: true,
        pageSize: 20,
        pageList: [20, 40, 50],
        columns: [[
            { title: "用戶賬號", field: 'COLUMN1' ,width:"20%", align: 'center' },
            { title: "賬單編號", field: 'NAME' 	,width:"30%", align: 'center' } ,
            { title: "賬單編號", field: 'PWD' 		,width:"20%", align: 'center' } ,
            { title: "賬單編號", field: 'COMESITEID' , align: 'center' } 
        ]]
    });
},
getSelectedRow: function () {
    return $(objId).datagrid('getSelected');
},
 



}

