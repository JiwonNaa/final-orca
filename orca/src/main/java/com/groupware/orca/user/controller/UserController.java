package com.groupware.orca.user.controller;

import com.groupware.orca.user.service.UserService;
import com.groupware.orca.user.vo.UserVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("orca/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping("login")
    public String login(){
        return "user/login";
    };

    @PostMapping("login")
    public String login(UserVo vo, HttpSession httpSession, Model model){
        UserVo loginUserVo = service.login(vo);
        if(loginUserVo == null){
            model.addAttribute("message", "아이디 또는 비밀번호를 다시 확인해주세요.");
            return "user/login";
        }
        httpSession.setAttribute("loginUserVo", loginUserVo);
        return "home";
    }
}