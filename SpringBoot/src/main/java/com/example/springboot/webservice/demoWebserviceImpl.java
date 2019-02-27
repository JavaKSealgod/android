package com.example.springboot.webservice;

import java.util.Date;

import javax.jws.WebService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@WebService(targetNamespace="http://com.example.springboot.webservice.com",
endpointInterface = "com.example.springboot.webservice.demoWebservice")
//endpointInterface 服务接口全路径, 指定做SEI（Service EndPoint Interface）服务端点接口
@Component
public class demoWebserviceImpl implements demoWebservice {
	
	@Override
	public String demo(String user) { 
		return user +"(webserice )";
	}
	
	
	@Override
	public String indexdemo(String user,String value) { 
		return user +"(indexservice )";
	}
}
