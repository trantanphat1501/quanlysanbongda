package hutechso1vn.backend.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import hutechso1vn.backend.dto.SanBongRequest;
import hutechso1vn.backend.entity.SanBong;
import hutechso1vn.backend.repo.SanBongRepository;

@SpringBootTest
@AutoConfigureMockMvc
class SanBongControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private SanBongRepository sanBongRepository;

        @BeforeEach
        void setup() {
                sanBongRepository.deleteAll();
        }

        @Test
        @WithMockUser(authorities = "ROLE_Quan_tri")
        void createAndGetSanBong() throws Exception {
                SanBongRequest request = new SanBongRequest();
                request.setSoNguoi(10);
                request.setBaoTri(false);

                String json = objectMapper.writeValueAsString(request);

                mockMvc.perform(post("/api/san-bong")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.soNguoi", is(10)))
                                .andExpect(jsonPath("$.baoTri", is(false)));

                mockMvc.perform(get("/api/san-bong"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(1)));
        }

        @Test
        @WithMockUser(authorities = "ROLE_Quan_tri")
        void updateSanBong() throws Exception {
                SanBong sanBong = SanBong.builder()
                                .soNguoi(8)
                                .baoTri(false)
                                .build();
                sanBong = sanBongRepository.save(sanBong);

                SanBongRequest request = new SanBongRequest();
                request.setSoNguoi(12);
                request.setBaoTri(true);

                String json = objectMapper.writeValueAsString(request);

                mockMvc.perform(put("/api/san-bong/{id}", sanBong.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.soNguoi", is(12)))
                                .andExpect(jsonPath("$.baoTri", is(true)));
        }

        @Test
        @WithMockUser(authorities = "ROLE_Quan_tri")
        void deleteSanBong() throws Exception {
                SanBong sanBong = SanBong.builder()
                                .soNguoi(8)
                                .baoTri(false)
                                .build();
                sanBong = sanBongRepository.save(sanBong);

                mockMvc.perform(delete("/api/san-bong/{id}", sanBong.getId()))
                                .andExpect(status().isNoContent());
        }

        @Test
        @WithMockUser(authorities = "ROLE_Quan_tri")
        void uploadAnh() throws Exception {
                SanBong sanBong = SanBong.builder()
                                .soNguoi(8)
                                .baoTri(false)
                                .build();
                sanBong = sanBongRepository.save(sanBong);

                MockMultipartFile file = new MockMultipartFile(
                                "file",
                                "test-image.jpg",
                                MediaType.IMAGE_JPEG_VALUE,
                                "fake-image-content".getBytes(StandardCharsets.UTF_8));

                mockMvc.perform(multipart("/api/san-bong/{id}/upload-anh", sanBong.getId())
                                .file(file)
                                .param("thuTu", "1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.thuTu", is(1)))
                                .andExpect(jsonPath("$.url").isNotEmpty());
        }
}
