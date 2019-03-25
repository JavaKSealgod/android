/**
 * 功能说明：分页
 */
var pagination = new Object();
pagination.pageIndex = 1;
pagination.pageSize = 5;  //分页笔数

var  pagination ={
		pageInit:function(ContainerId,dataSource,pagination,Fncallback){
			$(ContainerId).html("");
			$(ContainerId).pagination({
			    dataSource: dataSource, //data
			    pageSize: pagination.pageSize,//总页数
			    showGoInput: true,
			    showGoButton: true, 
			    callback: function(data,pagination) {
			        // alert("回调函数"); pagination.pageNumber 当前页数   
			    	//Fncallback(pagination);
			    	//pagination.el[0].baseURI = basePath+"/html/Page/jqueryTmpl";
			    	//不用去再查DB，直接查询总数据，实现分页，适用数据不是经常变动的查询。
					$(listGrid).empty();
					$(Template).tmpl(data).appendTo(listGrid);//向比赛资料模板塞资料   
					return false; 
			    }
			})
		}
		
}
