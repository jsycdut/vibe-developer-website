package com.jsy.site.bootstrap.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // 所有非 /api、/files、/ws-connect 开头的请求都返回 index.html，交给前端路由处理
    @RequestMapping(value = {
        "/",
        "/notes",
        "/notes/**",
        "/portfolio",
        "/about",
        "/chat",
        "/admin",
        "/admin/**"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
