package com.example.springboot.webservice;

import javax.jws.WebMethod;
import javax.jws.WebService;

/*
 * 功能说明：webservice 
 */


@WebService(targetNamespace="http://com.example.springboot.webservice.com")
//@WebService()
public interface demoWebservice {

	@WebMethod //标注该方法为webservice暴露的方法,用于向外公布，它修饰的方法是webservice方法，去掉也没影响的，类似一个注释信息。
	public String demo(String user);
	
	@WebMethod
	public String indexdemo(String user,String value);
	
}
