package com.example.SpringEurekaServer2;

import java.util.Scanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
 

@SpringBootApplication
@EnableEurekaServer
public class SpringEurekaServer2Application {

	public static void main(String[] args) {
//		SpringApplication.run(SpringEurekaServer2Application.class, args);
		@SuppressWarnings("resource")
		Scanner scan = new Scanner(System.in);
		String profiles = scan.nextLine();
		new SpringApplicationBuilder(SpringEurekaServer2Application.class).profiles(profiles).run(args);
	}

}
