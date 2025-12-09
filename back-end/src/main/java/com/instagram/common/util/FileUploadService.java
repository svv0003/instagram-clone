package com.instagram.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {

    @Value("${file.profile.upload.path}")
    private String profileUploadPath;
    @Value("${file.story.upload.path}")
    private String storyUploadPath;
    @Value("${file.post.upload.path}")
    private String postUploadPath;


    public String uploadProfileImage(MultipartFile file, int userId, String imageType) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("업로드할 파일이 없습니다.");
        }
        String profileFolder = profileUploadPath + "/" + userId;
        File uploadDir = new File(profileFolder);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            if (!created) {
                throw new IOException("업로드 디렉토리 생성에 실패했습니다. : " + profileFolder);
            }
            log.info("업로드 디렉토리 생성 : {}", profileFolder);
        }
        String fileNameWithExtension = imageType + '_' + file.getOriginalFilename();
        Path savePath = Paths.get(profileFolder, fileNameWithExtension);
        try {
            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("프로필 이미지 업로드 성공 : {} -> {}", file.getOriginalFilename(), fileNameWithExtension);
        } catch (IOException e) {
            log.error("파일 저장 중 오류 발생: {}", e.getMessage());
        }
        return "/profile_images/" + userId + "/" + fileNameWithExtension;
    }

    public String uploadStoryImage(MultipartFile file, int storyId, String imageType) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("업로드할 파일이 없습니다.");
        }
        String storyFolder = storyUploadPath + "/" + storyId;
        File uploadDir = new File(storyFolder);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            if (!created) {
                throw new IOException("업로드 디렉토리 생성에 실패했습니다. : " + storyFolder);
            }
            log.info("업로드 디렉토리 생성 : {}", storyFolder);
        }
        String fileNameWithExtension = imageType + '_' + file.getOriginalFilename();
        Path savePath = Paths.get(storyFolder, fileNameWithExtension);
        try {
            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("스토리 이미지 업로드 성공 : {} -> {}", file.getOriginalFilename(), fileNameWithExtension);
        } catch (IOException e) {
            log.error("파일 저장 중 오류 발생: {}", e.getMessage());
        }
        return "/story_images/" + storyId + "/" + fileNameWithExtension;
    }

    public String uploadPostImage(MultipartFile file, int postId, String imageType) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("업로드할 파일이 없습니다.");
        }
        String postFolder = postUploadPath + "/" + postId;
        File uploadDir = new File(postFolder);
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            if (!created) {
                throw new IOException("업로드 디렉토리 생성에 실패했습니다. : " + postFolder);
            }
            log.info("업로드 디렉토리 생성 : {}", postFolder);
        }
        String fileNameWithExtension = imageType + '_' + file.getOriginalFilename();
        Path savePath = Paths.get(postFolder, fileNameWithExtension);
        try {
            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("게시물 이미지 업로드 성공 : {} -> {}", file.getOriginalFilename(), fileNameWithExtension);
        } catch (IOException e) {
            log.error("파일 저장 중 오류 발생: {}", e.getMessage());
        }
        return "/post_images/" + postId + "/" + fileNameWithExtension;
    }

    private String getExtension(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        if(originalName == null || originalName.isEmpty()){
            return "";
        }
        String extension = "";
        int lastDot = originalName.lastIndexOf('.');
        if(lastDot > 0){
            return originalName.substring(lastDot);
        }
        return "";
    }

    public boolean deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            log.warn("삭제할 파일 경로가 존재하지 않습니다.");
            return false;
        }
        try {
            String absolutePath;
            if (filePath.startsWith("/profile_images/")) {
                String profilePath = filePath.replace("/profile_images/", "");
                absolutePath = profileUploadPath + "/" + profilePath;
            } else if (filePath.startsWith("/story_images/")) {
                String storyPath = filePath.replace("/story_images/", "");
                absolutePath = storyUploadPath + "/" + storyPath;
            } else if (filePath.startsWith("/post_images/")) {
                String postPath = filePath.replace("/post_images/", "");
                absolutePath = postUploadPath + "/" + postPath;
            } else {
                log.warn("지원하지 않는 파일 경로 형식입니다. {}", filePath);
                return false;
            }
            File file = new File(absolutePath);
            if (!file.exists()) {
                log.warn("삭제하려는 파일이 존재하지 않습니다. {}", absolutePath);
                return false;
            }
            boolean deleteFile = file.delete();
            if (deleteFile) {
                log.info("파일 삭제 성공 : {}", absolutePath);
                if (filePath.startsWith("/product_images/")) {
                }
            } else {
                log.error("파일 삭제 실패 : {}", absolutePath);
            }
            return deleteFile;

        } catch (Exception e) {
            log.error("파일 삭제 중 오류 발생 : {}", e.getMessage());
            return false;
        }
    }
}















