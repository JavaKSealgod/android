package com.example.springboot.Controller;

import javax.xml.namespace.QName;

import org.apache.cxf.endpoint.Client;
import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;
import org.apache.cxf.jaxws.endpoint.dynamic.JaxWsDynamicClientFactory;
import org.apache.cxf.transport.http.HTTPConduit;
import org.apache.cxf.transports.http.configuration.HTTPClientPolicy;
import org.springframework.stereotype.Service;

import com.example.springboot.webservice.demoWebservice;

/*
 * 功能说明： 通过代理访问webservice
 */
@Service
public class ClientFactoryWebServiece {
	
	/*
	 * FunName : 被呼叫的webservice 的function 名称
	 * objectParam : function 对应的参数
	 */
	public String ClientFactory(String FunName,String objectParam) {
		String objJson ="{}";
		 try{ 
//			JaxWsDynamicClientFactory dcf = JaxWsDynamicClientFactory.newInstance(); 
//        	org.apache.cxf.endpoint.Client client = 	dcf.createClient("http://localhost:8083/webService/api?wsdl"); // url为调用webService的wsdl地址 
//        	QName name = new QName("http://com.example.springboot.webservice.com", FunName);// namespace是命名空间，methodName是方法名

        
//        //创建动态客户端
//        JaxWsDynamicClientFactory factory = JaxWsDynamicClientFactory.newInstance();
//        Client client = factory.createClient("http://localhost:8083/webService/api?wsdl");
//        // 需要密码的情况需要加上用户名和密码
//        //client.getOutInterceptors().add(new ClientLoginInterceptor(USER_NAME,PASS_WORD));
//        HTTPConduit conduit = (HTTPConduit) client.getConduit();
//        HTTPClientPolicy httpClientPolicy = new HTTPClientPolicy();
//        httpClientPolicy.setConnectionTimeout(2000);  //连接超时
//        httpClientPolicy.setAllowChunking(false);    //取消块编码
//        httpClientPolicy.setReceiveTimeout(120000);     //响应超时
//        conduit.setClient(httpClientPolicy);
        //client.getOutInterceptors().addAll(interceptors);//设置拦截器
		
		
				String address= "http://localhost:8083/webService/api?wsdl";
				// 代理工厂
		        JaxWsProxyFactoryBean jaxWsProxyFactoryBean = new JaxWsProxyFactoryBean();
		        // 设置代理地址
		        jaxWsProxyFactoryBean.setAddress(address);
		        //添加用户名密码拦截器
		//        jaxWsProxyFactoryBean.getOutInterceptors().add(new LoginInterceptor("root","admin"));;
		        // 设置接口类型
		        jaxWsProxyFactoryBean.setServiceClass(demoWebservice.class);
		        // 创建一个代理接口实现
		        demoWebservice demo = (demoWebservice) jaxWsProxyFactoryBean.create(); 
		        
		        // 调用代理接口的方法调用并返回结果
		        objJson = demo.demo(objectParam);
		        System.out.println(objJson);
     
				
//				 // 创建动态客户端
//		        JaxWsDynamicClientFactory dcf = JaxWsDynamicClientFactory.newInstance();
//		        Client client = dcf.createClient("http://localhost:8083/webService/api?wsdl");
//		        Object[] objects = new Object[0]; 
//				
//    	  		objects = client.invoke("demo", "wait");
//            	objects = client.invoke(name,objectParam);// 第一个参数是上面的QName，第二个开始为参数，可变数组
//		        System.out.println(objects[0].toString());
        } catch (Exception e) {
        	 System.out.println(e.toString());
            e.printStackTrace();
        }
		return objJson; 
	}
	
}
