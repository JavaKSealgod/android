package com.example.EurekaServer;

import java.util.Scanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication 
@EnableEurekaServer
public class SpringEurekaServerApplication {

	public static void main(String[] args) {
//		SpringApplication.run(SpringEurekaServerApplication.class, args);
		@SuppressWarnings("resource")
		Scanner scan = new Scanner(System.in);
		String profiles = scan.nextLine();
		new SpringApplicationBuilder(SpringEurekaServerApplication.class).profiles(profiles).run(args);
		
	}

}
