package com.example.finance.dto;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * API响应DTO测试
 */
class ApiResponseTest {

    @Test
    void testSuccessResponse() {
        Map<String, Object> data = new HashMap<>();
        data.put("id", 1);
        data.put("name", "test");
        
        ApiResponse<Map<String, Object>> response = ApiResponse.success(data);
        
        assertEquals(200, response.getCode());
        assertEquals("操作成功", response.getMessage());
        assertNotNull(response.getData());
        assertEquals(1, response.getData().get("id"));
    }

    @Test
    void testSuccessResponseWithCustomMessage() {
        ApiResponse<String> response = ApiResponse.success("自定义成功消息", "test data");
        
        assertEquals(200, response.getCode());
        assertEquals("自定义成功消息", response.getMessage());
        assertEquals("test data", response.getData());
    }

    @Test
    void testErrorResponse() {
        ApiResponse<Void> response = ApiResponse.error(400, "参数错误");
        
        assertEquals(400, response.getCode());
        assertEquals("参数错误", response.getMessage());
        assertNull(response.getData());
    }

    @Test
    void testCreatedResponse() {
        Map<String, Object> data = new HashMap<>();
        data.put("id", 100);
        
        ApiResponse<Map<String, Object>> response = ApiResponse.created("创建成功", data);
        
        assertEquals(201, response.getCode());
        assertEquals("创建成功", response.getMessage());
        assertNotNull(response.getData());
    }

    @Test
    void testSettersAndGetters() {
        ApiResponse<String> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("测试消息");
        response.setData("测试数据");
        
        assertEquals(200, response.getCode());
        assertEquals("测试消息", response.getMessage());
        assertEquals("测试数据", response.getData());
    }

    @Test
    void testNullData() {
        ApiResponse<Object> response = ApiResponse.success(null);
        
        assertEquals(200, response.getCode());
        assertNull(response.getData());
    }
}
