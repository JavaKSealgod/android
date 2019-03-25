package com.example.EurekaClient2.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.EurekaClient2.model.UserModel;
 

@RestController
public class UserController {
	
	@RequestMapping("/user")
	public UserModel FindUser() {
		UserModel objUserModel = new UserModel();
		objUserModel.setCode("000001");
		objUserModel.setResult(false);;
		objUserModel.setUSERNAME("Client 2");
		return objUserModel;
	}

}
