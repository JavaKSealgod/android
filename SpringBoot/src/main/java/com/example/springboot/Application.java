package com.example.springboot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;


//@ServletComponentScan
@SpringBootApplication 
//@ComponentScan("com.example.springboot.*")
@MapperScan("com.example.springboot.dao")//配置了mybatis，但没有指定扫描的包 ,表示扫描xx.xx.mapper包下的所有mapper。
@EnableCaching //开启缓存
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}

