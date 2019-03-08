/**
 * 
 */
var basePath="";
var action="butSearch";
var username="#username";
var ActionURL="";
$(function(){ 
	//button Click 公用，注册一次就可以了
	$('.layui-btn').click(function(){ 
		Pagajax.Post(this.id);
	}); 
})



//ajax Post
var Pagajax = {
  Post: function (action,data) {//一键更新 
      var ParamsData = Params.Data(action,data);  
      $.ajax({
          url: Pagajax.GetURL(action),
          dataType: "json",//返回json格式的数据
          type: 'post',
          async: false,//同步，有返回值再执行后面的js
          data: ParamsData,
          datadataType:'json',
          success: function (objList) { 
        	  if(action=="WebService")
        		  alert(objList[0].username);
        	  else
        		  ReturnValue.Data(action,objList);
          }
      });
  }

   ,GetURL:function(action){   
		  if(action=="butSearch")//查询要返回list date
			  ActionURL = basePath+"/pages/list";
		  else if(action=="WebService")
			  ActionURL = basePath+"/pages/webservice";
		  else if(action=="butAdddate")
			  ActionURL = basePath+"/pages/addUser";
		  return ActionURL;
  }
}

//POST需要的参数
var n_id= "";
var Params = {
  Data: function (action,data) {   
      return { 'action': action,'username':$(username).val()};
  }

,cols:function(){//grid Rows单独提出来写
		return [[ 
			{type: 'checkbox', fixed: 'left'}
			,{field: 'userid', title: '用户序号'}
			,{field: 'username', title: '用户名称'}
			,{field: 'pwd', title: '密码'}  
			,{field: '操作', title: '操作',templet: function(row){
				  var CzRow = '  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</' + 'a>' +
					'  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</' + 'a>'  ;
			      return CzRow;
			}} 
		]];
	}
} 

//ajax回传值显示信息
var ReturnValue = {
  Data: function (action, objList) {
//	  alert(objList); 
      var objData = objList;//比赛资料
      $(listGrid).empty();  
      layui.use('table', function(){
    	  var table = layui.table;    	  
    	  //展示已知数据
    	  table.render({
    	    elem: listGrid
    	    ,cols: Params.cols()
    	    ,data: objData
//    	    ,skin: 'line' //表格风格
    	    ,even: true
    	    ,page: true //是否显示分页
    	    ,limits: [10, 50, 100]
    	    ,limit: 10 //每页默认显示的数量
    	  });    	  
    	  //=============监听Rows事件=====================================================
      	  table.on('tool(listGrid)', function (obj) {   //lay-filter="listGrid"  listGrid 是lay-filter的值
      	          var data = obj.data, //获得当前行数据
      	      		layEvent = obj.event; //获得 lay-event 对应的值 
      	          if (layEvent === 'del') {
      	              layer.confirm('真的删除行么', function (index) {
//      	                  obj.del(obj); //删除对应行（tr）的DOM结构
      	                  layer.close(index);
      	                  //向服务端发送删除指令 
      	                  buttonClick.deltes(layEvent,data);
      	              });
      	          } else if (layEvent === 'edit') {
      	        	  buttonClick.edit(layEvent,data);
      	          }
      	      });  
      	  //========================================END======================================;
    	}); 
      
  	} 
	,TimeToString:function(v){
		return new Date(parseInt(v)).toLocaleString();
	}
}
 
 