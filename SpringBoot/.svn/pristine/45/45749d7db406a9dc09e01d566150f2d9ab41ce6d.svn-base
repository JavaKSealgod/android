/**
 * 功能说明：Tmpl模板查询和翻页功能
 */
var basePath = $("#basePath").attr("href");
var action="init"; //初始状态
var listGrid = "#listGrid";//grid ID
var Template ="#Template";//模板ID
var butSearch="#butSearch";// 查询按钮
var footContainerId="#footContainerId";// 分页容器

$(function(){
	
	//查询功能
	$(butSearch).click(function(){ 
		Pagajax.Post(butSearch);
	});
	
	
})
  
//ajax Post
var Pagajax = {
  Post: function (action) {//一键更新 
      var ParamsData = Params.Data(action); 
      $.ajax({
          url: basePath+"/html/Page/jqueryTmpl",
          dataType: "json",//返回json格式的数据
          type: 'post',
          async: false,//同步，有返回值再执行后面的js
          data: ParamsData,
          datadataType: 'json',
          success: function (objList) {  
              ReturnValue.Data(action, objList);
          }
      });
  }
}

//POST需要的参数
var Params = {
  Data: function (action) {  
      return { 'action': action};
  }
}

//ajax回传值显示信息
var ReturnValue = {
  Data: function (action, objList) {
      var objData = objList;//比赛资料
      $(listGrid).empty();
      $(Template).tmpl(objData).appendTo(listGrid);//向比赛资料模板塞资料   
      
      //footContainerId : 分页容器
      //objList ： 查询资料
      //pagination ： 翻页参数
      //Pagajax.Post：回调函数名称
      //pagination.pageSize = 2;  //分页笔数
      
      pagination. pageInit(footContainerId,objList,pagination,Pagajax.Post);//分页
  } 
}
 