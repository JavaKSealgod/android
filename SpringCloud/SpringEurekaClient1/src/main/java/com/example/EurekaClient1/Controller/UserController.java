package com.example.EurekaClient1.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EurekaClient1.model.UserModel;
 

@RestController
public class UserController {
	
	@RequestMapping("/user")
	public UserModel FindUser() {
		UserModel objUserModel = new UserModel();
		objUserModel.setCode("000000");
		objUserModel.setResult(true);;
		objUserModel.setUSERNAME("Client 1");
		return objUserModel;
	}

}
