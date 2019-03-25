package com.example.springboot.common;

import java.util.Locale;

import org.apache.tomcat.util.descriptor.LocalResolver;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.SessionLocaleResolver; 


@Configuration
@EnableAutoConfiguration
@ComponentScan
public class LanguageConfig extends WebMvcConfigurerAdapter {
	
	@Bean
	public SessionLocaleResolver LocaleResolver() {
		
//		Locale locale = new Locale("zh","CN");
		
		SessionLocaleResolver slr = new SessionLocaleResolver();
		
		slr.setDefaultLocale(Locale.US);
		
		return slr;
	}

}
