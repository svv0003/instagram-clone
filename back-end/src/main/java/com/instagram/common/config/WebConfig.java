package com.instagram.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
BackEnd 와 FrontEnd 가 나누어 작업할 때 사용
corsConfigurer 설정은
WebConfig 이름을 사용하거나 CorsConfig 라는 명칭을 사용하기도 함
회사에서 지정한 명명규칙을 따를 것
*/

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // profile.upload.path
    @Value("${file.upload.path}")
    private String fileUploadPath;
    @Value("${file.product.upload.path}")
    private String productUploadPath;
    @Value("${file.board.upload.path}")
    private String boardUploadPath;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // REST API CORS 설정
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3001","http://localhost:3000")
                        .allowCredentials(true)
                        .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                        .allowedHeaders("*");
                // WebSocket CORS 설정 추가
                registry.addMapping("/ws/**")
                        .allowedOrigins("http://localhost:3001","http://localhost:3000")
                        .allowCredentials(true)
                        .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    // 프로필 이미지 정적 리소스 매핑 추가
    // ctrl + o -> override

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
         registry.addResourceHandler("/profile_images/**")
                 .addResourceLocations("file:"+fileUploadPath + "/");
        registry.addResourceHandler("/product_images/**")
                .addResourceLocations("file:"+productUploadPath+"/");
        registry.addResourceHandler("/board_images/**")
                .addResourceLocations("file:"+boardUploadPath+"/");
    }
}

