package com.example.notesapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Forward all non-API routes to React's index.html
    @GetMapping(value = {"/"})
    public String index() {
        return "forward:/index.html";
    }
}
