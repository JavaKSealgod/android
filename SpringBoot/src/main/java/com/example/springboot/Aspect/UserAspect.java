package com.example.springboot.Aspect;

import java.util.Map;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Aspect // FOR AOP
@Order(-99) // 控制多个Aspect的执行顺序，越小越先执行
@Component
public class UserAspect {

//	//两个..代表所有子目录，最后括号里的两个..代表所有参数
//    @Pointcut("execution(*com.example.springboot.Controller..*.*(..))")
//    private void pointCutMethod(){}
    
     
 // 拦截被UserAnnotation注解的方法；如果你需要拦截指定package指定规则名称的方法，可以使用表达式execution(...)
    @Before("@annotation(User)")
    public Boolean beforeUser(JoinPoint point, UserAnnotation User) throws Throwable {
        System.out.println("beforeUser:" + User.name());
        Boolean objReturn=false;
        //获取目标方法的参数信息
        Object[] obj = point.getArgs(); 
        for (Object argItem : obj) {  
        	Map<String, Object>  objMap= (Map<String, Object>) argItem;  
        	String username = (String) objMap.get("username");
        	
        	objMap.put("action", "false");//用来判断拦截器是否需要执行原方法
        	//参数为特定值的时候，不去执行function后面的操作
        	if(username.toUpperCase().equals("WAIT")) {
        		objReturn=true; 
        		objMap.put("action", "true");
        	}  
        }
        return objReturn;
    } 
    

//    //后置通知，包括异常
//    @After("pointCutMethod()")
//    public void doAfter(){
//        System.out.println("后置通知，包括异常");
//    }
//
//    //声明例外通知
//    @AfterThrowing(pointcut="pointCutMethod()",throwing = "e")
//    public void doAfterThrowing(Exception e){
//        System.out.println("例外通知(异常)");
//    }
//
//    //声明后置通知
//    @AfterReturning(pointcut="pointCutMethod()",returning="result")
//    public void daAfterReturning(String result){
//        System.out.println("后置通知，连接点完成，不包括异常： " + result);
//    }
//
//    //声明环绕通知  
//    @Around("pointCutMethod()")
//    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {  
//        System.out.println("进入方法---环绕通知");  
//        System.out.println(pjp.getTarget().getClass().getName());
//        Object o = pjp.proceed();  
//        System.out.println("退出方法---环绕通知");  
//        return o;  
//    }  
    
}
