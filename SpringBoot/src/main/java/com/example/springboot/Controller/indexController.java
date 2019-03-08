package com.example.springboot.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.example.springboot.Aspect.UserAnnotation;
import com.example.springboot.model.UserModel;
import com.example.springboot.service.interfaces.iUserService;
import com.example.springboot.webservice.demoWebservice;


@RestController
//@Controller
@EnableAutoConfiguration
@RequestMapping("/pages")
public class indexController {
	
	@Resource
	private iUserService objiUserService;
	  
	@Autowired
	private ClientFactoryWebServiece objClientFactoryWebServiece;
	
	private  UserModel objUserModel ;
	private  List<UserModel> objlistUser;
	
	@RequestMapping("/index")
	public ModelAndView login(HttpServletRequest request) { 
        ModelAndView mav = new ModelAndView();
        mav.addObject("Name", "springboot Init"); 
        mav.setViewName("/pages/index");
        return mav;
    }  
	
	//呼叫webservice
	@UserAnnotation(name="测试拦截器")
	@RequestMapping(value="/webservice",method={RequestMethod.GET,RequestMethod.POST})
	public List<UserModel> getwebservice(@RequestParam Map<String, Object> param){ 
		//用拦截器返回值判断，是否需要继续执行。
		 if((String) param.get("action")=="false")
		 {
		    objlistUser = new ArrayList<UserModel>();
			UserModel objUserModel = new UserModel();
			objUserModel.setUSERNAME("aop 拦截器验证【用户失败】，未呼叫webservice！");
			objlistUser.add(objUserModel);
		 }else
		    {
			 System.out.println("AOP后看是否有执行  getwebservice:" ); 
			//获取参数 
			String username = (String) param.get("username");
			Object[] objectParam = new Object[1];
			objectParam[0] = username;  
			String strVALUE = objClientFactoryWebServiece.ClientFactory("demo", username);
			
		//		 		Map<String ,Object> objMap = new HashMap<String,Object>();
		//		 		objMap.put("Return", true);
		//		 		objMap.put("data", objlistUser);   
			objlistUser = new ArrayList<UserModel>();
			UserModel objUserModel = new UserModel();
			objUserModel.setUSERNAME(strVALUE);
			objlistUser.add(objUserModel);
		} 
		return objlistUser;
	}
	
	
	//获取用户列表
	@RequestMapping(value="/list",method={RequestMethod.GET,RequestMethod.POST})
	public List<UserModel> listMap(@RequestParam Map<String, Object> param){
		String username = (String) param.get("username"); 
		objUserModel = new UserModel();
		objUserModel.setUSERNAME(username==""?"%":username+"%");
		objlistUser = objiUserService.GetListUserModel(objUserModel);
		return objlistUser;
	}
	
	//获取用户列表
	@RequestMapping(value="/addUser",method={RequestMethod.GET,RequestMethod.POST})
	public List<UserModel> addUser(@RequestParam Map<String, Object> param){
		String username = (String) param.get("username"); 
		objUserModel = new UserModel();
		objUserModel.setUSERNAME(username);
		int BoolValue =  objiUserService.AddUserInfo(objUserModel);
		objlistUser = objiUserService.GetListUserModel(objUserModel);
		objlistUser.get(0).setResult(true);
		objlistUser.get(0).setCode("000000");
		objlistUser.get(0).setMessage("新增成功！");
		return objlistUser;
	}
	 
	//map
	@RequestMapping(value="/map")
	public Map<String ,String> jsonMap(){
		Map<String ,String> objMap = new HashMap<String,String>(); 
		objMap.put("Name", "Wait Fang");
		objMap.put("data", "");
		return objMap;
	}

}
