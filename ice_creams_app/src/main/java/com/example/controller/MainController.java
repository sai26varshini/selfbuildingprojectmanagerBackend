package com.example.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, World!";
    }

    @GetMapping("/ice-creams")
    public String getIceCreams() {
        return "List of ice creams: Vanilla, Chocolate, Strawberry";
    }

    @GetMapping("/ice-cream/{flavor}")
    public String getIceCream(@PathVariable String flavor) {
        return "You have chosen: " + flavor;
    }
}
