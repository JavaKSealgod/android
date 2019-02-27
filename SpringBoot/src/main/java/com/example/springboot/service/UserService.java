package com.example.springboot.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.springboot.dao.UserDao;
import com.example.springboot.model.UserModel;
import com.example.springboot.service.interfaces.iUserService; 

@CacheConfig(cacheNames = {"myCache"})
@Service
public class UserService implements iUserService {
	@Resource
	private UserDao objUserDao;
	 
	 
	@Override
	//写缓存，cache是否生效，debug模式，看function是否一直被调用。
	@Cacheable(key = "targetClass + methodName +#objUserModel.USERNAME")
	public  List<UserModel> GetListUserModel(UserModel objUserModel) {  
		List<UserModel> list =objUserDao.GetListUserModel(objUserModel);
		return list;
	}
	
	@CachePut(key = "targetClass + methodName") //更新缓存
    public int updata(UserModel objUserModel) {
		int iReturnValue = objUserDao.updateUser(objUserModel); 
        return iReturnValue;
    }
 

//    @Cacheable(key = "targetClass + methodName +#p0")//清空缓存
    
    
}
