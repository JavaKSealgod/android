package com.example.springboot.service.interfaces;

import java.util.List;

import com.example.springboot.model.UserModel;

public interface iUserService {
	
	public  List<UserModel> GetListUserModel(UserModel objUserModel);

}
