package com.example.springboot.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;


@Component
@PropertySource(value = {"classpath:/static/messages/messages.properties"},encoding="utf-8")
public class AppConfig {
	@Value("${Return.false}")
    public String Returnfalse;
	
	
	@Value("${Action.add}")
    public String Actionadd;
	
	
	@Value("${title.Controller}")
    public String titleController;
	
	
}
