package com.example.finance.hotreload;

import com.example.finance.service.HotReloadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 热更新功能测试
 */
@SpringBootTest
@ActiveProfiles("dev")
class HotReloadTest {

    @Autowired(required = false)
    private HotReloadService hotReloadService;

    @Test
    void testHotReloadServiceExists() {
        // 在开发环境下，热更新服务应该存在
        assertNotNull(hotReloadService, "热更新服务应该在开发环境下可用");
    }

    @Test
    void testHotReloadStatus() {
        if (hotReloadService != null) {
            HotReloadService.HotReloadStatus status = hotReloadService.getStatus();
            assertNotNull(status, "热更新状态不应为空");
            assertTrue(status.getReloadCount() >= 0, "重载次数应该大于等于0");
        }
    }

    @Test
    void testTriggerReload() {
        if (hotReloadService != null) {
            // 测试手动触发重载（不会真正重载，只是创建触发文件）
            assertDoesNotThrow(() -> hotReloadService.triggerReload(), 
                "手动触发重载不应该抛出异常");
        }
    }
}