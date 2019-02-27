package com.example.springboot.dao;

import java.util.List; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository; 
import com.example.springboot.model.UserModel; 

/*
功能说明：登录者url对应的DB操作
时间：2019/1/28
作者：Wait
*/


//spring管理(在spring中有开启对@repository注解的扫描),当哪些地方需要用到这个实现类作为依赖时,就可以注入了
@Repository
public interface UserDao {
	
	@Autowired
	public List<UserModel> GetListUserModel(UserModel objUserModel);

	
	@Autowired
	public int updateUser(UserModel objUserModel);

	
}
