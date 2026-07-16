package com.pingnpay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PingNPayApplication {

    public static void main(String[] args) {
        SpringApplication.run(PingNPayApplication.class, args);
    }
}
