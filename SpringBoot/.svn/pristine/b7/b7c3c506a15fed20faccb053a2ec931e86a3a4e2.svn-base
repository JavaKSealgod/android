package com.example.springboot.webservice;
 

import java.util.HashMap;
import java.util.Map;

import org.apache.cxf.Bus;
import org.apache.cxf.bus.spring.SpringBus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.apache.cxf.transport.servlet.CXFServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet; 

//和controle 的port端口冲突，导致页面404
@Configuration
public class CxfConfig {
	@Bean
    public ServletRegistrationBean dispatcherServlet() {
        return new ServletRegistrationBean(new CXFServlet(),"/webService/*");
    }
	 
    /**
     * 原因是springboot默认注册的是 dispatcherServlet，
     * 当手动配置 ServletRegistrationBean后不会再去注册默认的   dispatcherServlet，
     * 所以需要手动去注册一个dispatcherServlet，
     */
    @Bean
    public ServletRegistrationBean dispatcherRestServlet(){
        //注解扫描上下文
        AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
        //base package
        applicationContext.scan("com.example.springboot");
        //通过构造函数指定dispatcherServlet的上下文
        DispatcherServlet rest_dispatcherServlet = new DispatcherServlet(applicationContext);

        //用ServletRegistrationBean包装servlet
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(rest_dispatcherServlet);
        registrationBean.setLoadOnStartup(1);
        //指定urlmapping
        registrationBean.addUrlMappings("/*");
        //指定name，如果不指定默认为dispatcherServlet
//        registrationBean.setName("map");
        return registrationBean;
    }
    
 
    @Bean(name = Bus.DEFAULT_BUS_ID)
    public SpringBus springBus() {
        return new SpringBus();
    }
 
    @Bean
    public demoWebservice demoService() {
        return new demoWebserviceImpl();
    } 
  
    
    @Bean
    public EndpointImpl endpoint() {  
    	EndpointImpl  endpoint = new EndpointImpl(springBus(), demoService());  
        endpoint.publish("/api");
        return endpoint;
    } 
} 