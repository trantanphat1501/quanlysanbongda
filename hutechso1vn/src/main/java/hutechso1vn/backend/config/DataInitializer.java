package hutechso1vn.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import hutechso1vn.backend.entity.NguoiDung;
import hutechso1vn.backend.entity.VaiTro;
import hutechso1vn.backend.repo.NguoiDungRepository;
import hutechso1vn.backend.repo.VaiTroRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(VaiTroRepository vaiTroRepository,
                               NguoiDungRepository nguoiDungRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            // Tạo 2 vai trò nếu chưa có
            VaiTro quanTri = vaiTroRepository.findByName("Quan_tri")
                    .orElseGet(() -> vaiTroRepository.save(
                            VaiTro.builder()
                                    .name("Quan_tri")
                                    .build()));

            VaiTro nguoiDungRole = vaiTroRepository.findByName("Nguoi_dung")
                    .orElseGet(() -> vaiTroRepository.save(
                            VaiTro.builder()
                                    .name("Nguoi_dung")
                                    .build()));

            // Tạo 2 người dùng tương ứng nếu chưa có
            nguoiDungRepository.findBySoDienThoai("0000000000")
                    .orElseGet(() -> nguoiDungRepository.save(
                            NguoiDung.builder()
                                    .name("Quan tri")
                                    .soDienThoai("0000000000")
                                    .password(passwordEncoder.encode("123456"))
                                    .vaiTro(quanTri)
                                    .build()));

            nguoiDungRepository.findBySoDienThoai("1111111111")
                    .orElseGet(() -> nguoiDungRepository.save(
                            NguoiDung.builder()
                                    .name("Nguoi dung")
                                    .soDienThoai("1111111111")
                                    .password(passwordEncoder.encode("123456"))
                                    .vaiTro(nguoiDungRole)
                                    .build()));
        };
    }
}

