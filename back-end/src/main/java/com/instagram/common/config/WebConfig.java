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

    @Value("${file.profile.upload.path}")
    private String profileUploadPath;
    @Value("${file.story.upload.path}")
    private String storyUploadPath;
    @Value("${file.post.upload.path}")
    private String postUploadPath;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // REST API CORS 설정
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3001",
                                "http://localhost:3000",
                                "https://instagram-clone-iota-liard.vercel.app")
                        .allowCredentials(true)
                        .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                        .allowedHeaders("*");
                // WebSocket CORS 설정 추가
                registry.addMapping("/ws/**")
                        .allowedOrigins("http://localhost:3001",
                                "http://localhost:3000",
                                "https://instagram-clone-iota-liard.vercel.app")
                        .allowCredentials(true)
                        .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
         registry.addResourceHandler("/profile_images/**")
                 .addResourceLocations("file:"+profileUploadPath + "/");
        registry.addResourceHandler("/story_images/**")
                .addResourceLocations("file:"+storyUploadPath+"/");
        registry.addResourceHandler("/post_images/**")
                .addResourceLocations("file:"+postUploadPath+"/");
    }
}

