package com.example.springboot.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.support.RequestContext;

import com.example.springboot.Aspect.UserAnnotation;
import com.example.springboot.common.ReturnEnum;
import com.example.springboot.model.UserModel;
import com.example.springboot.service.ClientFactoryWebServiece;
import com.example.springboot.service.interfaces.iUserService;
import com.example.springboot.webservice.demoWebservice;


@RestController
//@Controller
@EnableAutoConfiguration
@RequestMapping("/pages") 
public class indexController extends baseController { 
	@Autowired
	private com.example.springboot.common.AppConfig AppConfig; //设定读配置档信息
	
	@Resource
	private iUserService objiUserService;
	  
	@Autowired
	private ClientFactoryWebServiece objClientFactoryWebServiece;//webservice 访问
	
	private  UserModel objUserModel ;
	private  List<UserModel> objlistUser;
	
	@RequestMapping("/index")
	public ModelAndView login(HttpServletRequest request) { 
        ModelAndView mav = new ModelAndView();
        
        mav.addObject("titleController", AppConfig.titleController); //从appconfig.properties 读取内容
        mav.addObject("Name", "springboot Init"); 
        mav.setViewName("/pages/index");
        
        //语系设定 设定为中文
//        Locale locale = new Locale("zh","CN");
//        request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, locale);
//        request.getSession().setAttribute("lang", "zh_CN"); 
        
//        Locale locale = new Locale("en","US");
//        request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, locale);
//        request.getSession().setAttribute("lang", "en_US");
        
        
        return mav;
    }  
	
	//切换语系
	@RequestMapping(value="/lang",method={RequestMethod.GET,RequestMethod.POST})
	public List<UserModel> langMap(HttpServletRequest request,Model model,@RequestParam Map<String, Object> param){
		String username = (String) param.get("username"); 
		objUserModel = new UserModel();
		objUserModel.setUSERNAME(username==""?"%":username+"%");
		objlistUser = objiUserService.GetListUserModel(objUserModel);
		
		 //语系设定 设定为中文
		 Locale locale = new Locale("en","US");
        request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, locale);
        request.getSession().setAttribute("lan", "en_US");
        
        //从后台代码获取国际化信息
        RequestContext requestContext = new RequestContext(request);
        model.addAttribute("lang.zh", requestContext.getMessage("lang.zh"));
        model.addAttribute("lang.en", requestContext.getMessage("lang.en"));
        
        
		return objlistUser;
	}
	
	
	//呼叫webservice
	@UserAnnotation(name="测试拦截器")
	@RequestMapping(value="/webservice",method={RequestMethod.GET,RequestMethod.POST})
	public List<UserModel> getwebservice(@RequestParam Map<String, Object> param){ 
		 
		//用拦截器返回值判断，是否需要继续执行。
		 if(param.get("action").toString().equals(AppConfig.Returnfalse))
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
		 System.out.println("list:----" ); 
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
