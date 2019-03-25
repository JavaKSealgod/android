package com.example.springboot.Aspect;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.google.gson.Gson;

@Aspect // FOR AOP
@Order(1) // 控制多个Aspect的执行顺序，越小越先执行
@Component
public class LogAspect {

	private Logger log = Logger.getLogger(getClass());

	private Gson gson = new Gson();
	
	
	//两个..代表所有子目录，最后括号里的两个..代表所有参数
	  @Pointcut("execution(* com.example.springboot.Controller..*(..))")
//			  + "&& !execution(public *com.example.springboot.Controller.ClientFactoryWebServiece.*(..))")
	  private void pointCutMethod(){}
  
	
	//请求method前打印内容
	   @Before(value = "pointCutMethod()")
	   public void methodBefore(JoinPoint joinPoint){
	      ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
	      HttpServletRequest request = requestAttributes.getRequest();
	 
	      //打印请求内容
	      log.info("===============请求内容===============");
	      log.info("请求地址:"+request.getRequestURL().toString());
	      log.info("请求方式:"+request.getMethod());
	      log.info("请求类方法:"+joinPoint.getSignature());
	      log.info("请求类方法参数:"+ Arrays.toString(joinPoint.getArgs()));
	      log.info("===============请求内容===============");
	   }
	 
	 
	   //在方法执行完结后打印返回内容
	   @AfterReturning(returning = "o",pointcut = "pointCutMethod()")
	   public void methodAfterReturing(Object o ){
	      log.info("--------------返回内容----------------");
	      log.info("Response内容:"+gson.toJson(o));
	      log.info("--------------返回内容----------------");
	   }
	   
	   
	   @AfterThrowing(throwing="ex",pointcut = "execution(* com.example.springboot.service..*(..))")
	   public void doAfterThrowing(Throwable ex) {
		   
		   log.info("==============抛出异常=============");
		   log.info(ex);
		   log.info("==============END==================");
	   }
	
}
