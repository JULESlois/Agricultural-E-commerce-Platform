package com.example.finance.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
// import org.springframework.boot.devtools.restart.RestartScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * 热更新配置类
 * 提供开发环境下的热重载功能配置
 */
@Configuration
@Profile({"dev", "local"})
@ConditionalOnProperty(name = "spring.devtools.restart.enabled", havingValue = "true", matchIfMissing = true)
public class DevToolsConfig {

    /**
     * 热更新配置属性
     */
    @ConfigurationProperties(prefix = "app.hotreload")
    public static class HotReloadProperties {
        private boolean enabled = true;
        private String[] includePaths = {"src/main/java", "src/main/resources"};
        private String[] excludePaths = {"**/*Test.class", "**/*Tests.class"};
        private int pollInterval = 1000;
        private int quietPeriod = 400;

        // Getters and Setters
        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String[] getIncludePaths() {
            return includePaths;
        }

        public void setIncludePaths(String[] includePaths) {
            this.includePaths = includePaths;
        }

        public String[] getExcludePaths() {
            return excludePaths;
        }

        public void setExcludePaths(String[] excludePaths) {
            this.excludePaths = excludePaths;
        }

        public int getPollInterval() {
            return pollInterval;
        }

        public void setPollInterval(int pollInterval) {
            this.pollInterval = pollInterval;
        }

        public int getQuietPeriod() {
            return quietPeriod;
        }

        public void setQuietPeriod(int quietPeriod) {
            this.quietPeriod = quietPeriod;
        }
    }

    @Bean
    public HotReloadProperties hotReloadProperties() {
        return new HotReloadProperties();
    }
}