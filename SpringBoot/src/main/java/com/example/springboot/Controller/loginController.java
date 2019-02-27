package com.example.springboot.Controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping("/pages")
public class loginController {
	
	@RequestMapping("login")
	public ModelAndView loginInit(HttpServletRequest request) {
		ModelAndView objModelAndView = new ModelAndView();
		objModelAndView.setViewName("/pages/login");
		return objModelAndView;
	}

}
