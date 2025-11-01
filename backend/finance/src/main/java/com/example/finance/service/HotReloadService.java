package com.example.finance.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
// import org.springframework.boot.devtools.restart.RestartScope;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 热更新监控服务
 * 监控文件变化并提供热更新状态信息
 */
@Service
@ConditionalOnProperty(name = "spring.devtools.restart.enabled", havingValue = "true")
public class HotReloadService implements ApplicationListener<ContextRefreshedEvent> {

    private static final Logger logger = LoggerFactory.getLogger(HotReloadService.class);
    
    private final ConcurrentHashMap<String, LocalDateTime> fileChangeLog = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private WatchService watchService;
    private volatile boolean monitoring = false;
    private LocalDateTime lastReloadTime;
    private int reloadCount = 0;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (!monitoring) {
            startFileWatcher();
            lastReloadTime = LocalDateTime.now();
            reloadCount++;
            logger.info("热更新服务已启动 - 第{}次重载 at {}", 
                reloadCount, lastReloadTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
    }

    /**
     * 启动文件监控
     */
    private void startFileWatcher() {
        try {
            watchService = FileSystems.getDefault().newWatchService();
            
            // 监控源代码目录
            Path srcPath = Paths.get("src/main/java");
            if (Files.exists(srcPath)) {
                registerDirectory(srcPath);
            }
            
            // 监控资源目录
            Path resourcesPath = Paths.get("src/main/resources");
            if (Files.exists(resourcesPath)) {
                registerDirectory(resourcesPath);
            }
            
            monitoring = true;
            
            // 启动监控线程
            scheduler.submit(this::watchForChanges);
            
        } catch (IOException e) {
            logger.error("启动文件监控失败", e);
        }
    }

    /**
     * 递归注册目录监控
     */
    private void registerDirectory(Path dir) throws IOException {
        Files.walk(dir)
            .filter(Files::isDirectory)
            .forEach(path -> {
                try {
                    path.register(watchService, 
                        StandardWatchEventKinds.ENTRY_CREATE,
                        StandardWatchEventKinds.ENTRY_DELETE,
                        StandardWatchEventKinds.ENTRY_MODIFY);
                } catch (IOException e) {
                    logger.warn("注册目录监控失败: {}", path, e);
                }
            });
    }

    /**
     * 监控文件变化
     */
    private void watchForChanges() {
        while (monitoring) {
            try {
                WatchKey key = watchService.poll(1, TimeUnit.SECONDS);
                if (key != null) {
                    for (WatchEvent<?> event : key.pollEvents()) {
                        WatchEvent.Kind<?> kind = event.kind();
                        Path fileName = (Path) event.context();
                        
                        if (isRelevantFile(fileName.toString())) {
                            String changeInfo = String.format("%s: %s", kind.name(), fileName);
                            fileChangeLog.put(changeInfo, LocalDateTime.now());
                            logger.debug("检测到文件变化: {}", changeInfo);
                        }
                    }
                    key.reset();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }

    /**
     * 判断是否为相关文件
     */
    private boolean isRelevantFile(String fileName) {
        return fileName.endsWith(".java") || 
               fileName.endsWith(".properties") || 
               fileName.endsWith(".yml") || 
               fileName.endsWith(".yaml") ||
               fileName.endsWith(".xml");
    }

    /**
     * 获取热更新状态信息
     */
    public HotReloadStatus getStatus() {
        return new HotReloadStatus(
            monitoring,
            lastReloadTime,
            reloadCount,
            fileChangeLog.size(),
            fileChangeLog
        );
    }

    /**
     * 手动触发重载
     */
    public void triggerReload() {
        try {
            File triggerFile = new File(".reloadtrigger");
            if (!triggerFile.exists()) {
                triggerFile.createNewFile();
            }
            triggerFile.setLastModified(System.currentTimeMillis());
            logger.info("手动触发热更新");
        } catch (IOException e) {
            logger.error("触发热更新失败", e);
        }
    }

    /**
     * 清理资源
     */
    public void shutdown() {
        monitoring = false;
        if (watchService != null) {
            try {
                watchService.close();
            } catch (IOException e) {
                logger.warn("关闭文件监控服务失败", e);
            }
        }
        scheduler.shutdown();
    }

    /**
     * 热更新状态信息
     */
    public static class HotReloadStatus {
        private final boolean monitoring;
        private final LocalDateTime lastReloadTime;
        private final int reloadCount;
        private final int fileChangesDetected;
        private final ConcurrentHashMap<String, LocalDateTime> recentChanges;

        public HotReloadStatus(boolean monitoring, LocalDateTime lastReloadTime, 
                             int reloadCount, int fileChangesDetected,
                             ConcurrentHashMap<String, LocalDateTime> recentChanges) {
            this.monitoring = monitoring;
            this.lastReloadTime = lastReloadTime;
            this.reloadCount = reloadCount;
            this.fileChangesDetected = fileChangesDetected;
            this.recentChanges = new ConcurrentHashMap<>(recentChanges);
        }

        // Getters
        public boolean isMonitoring() { return monitoring; }
        public LocalDateTime getLastReloadTime() { return lastReloadTime; }
        public int getReloadCount() { return reloadCount; }
        public int getFileChangesDetected() { return fileChangesDetected; }
        public ConcurrentHashMap<String, LocalDateTime> getRecentChanges() { return recentChanges; }
    }
}