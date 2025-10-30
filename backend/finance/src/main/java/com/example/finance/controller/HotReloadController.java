package com.example.finance.controller;

import com.example.finance.service.HotReloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 热更新管理控制器
 * 提供热更新状态查询和控制接口
 */
@RestController
@RequestMapping("/api/dev/hotreload")
@Profile({"dev", "local"})
@ConditionalOnProperty(name = "spring.devtools.restart.enabled", havingValue = "true")
public class HotReloadController {

    @Autowired
    private HotReloadService hotReloadService;

    /**
     * 获取热更新状态
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        HotReloadService.HotReloadStatus status = hotReloadService.getStatus();
        
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "热更新状态查询成功");
        response.put("data", Map.of(
            "monitoring", status.isMonitoring(),
            "lastReloadTime", status.getLastReloadTime(),
            "reloadCount", status.getReloadCount(),
            "fileChangesDetected", status.getFileChangesDetected(),
            "recentChanges", status.getRecentChanges()
        ));
        
        return ResponseEntity.ok(response);
    }

    /**
     * 手动触发热更新
     */
    @PostMapping("/trigger")
    public ResponseEntity<Map<String, Object>> triggerReload() {
        hotReloadService.triggerReload();
        
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "热更新已触发，应用将在几秒内重启");
        
        return ResponseEntity.ok(response);
    }

    /**
     * 获取热更新配置信息
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("devtoolsEnabled", true);
        config.put("liveReloadEnabled", true);
        config.put("liveReloadPort", 35729);
        config.put("triggerFile", ".reloadtrigger");
        config.put("includePaths", new String[]{"src/main/java", "src/main/resources"});
        config.put("excludePaths", new String[]{"**/*Test.class", "**/*Tests.class"});
        
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "热更新配置查询成功");
        response.put("data", config);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("hotReload", "ENABLED");
        health.put("environment", "DEVELOPMENT");
        
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "热更新服务运行正常");
        response.put("data", health);
        
        return ResponseEntity.ok(response);
    }
}