package hutechso1vn.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hutechso1vn.backend.dto.LoginRequest;
import hutechso1vn.backend.dto.LoginResponse;
import hutechso1vn.backend.dto.NguoiDungRegisterRequest;
import hutechso1vn.backend.entity.NguoiDung;
import hutechso1vn.backend.entity.VaiTro;
import hutechso1vn.backend.repo.NguoiDungRepository;
import hutechso1vn.backend.repo.VaiTroRepository;
import hutechso1vn.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final NguoiDungRepository nguoiDungRepository;
    private final VaiTroRepository vaiTroRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Đăng nhập đơn giản bằng số điện thoại + password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getSoDienThoai(),
                        request.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse(null);

        String token = jwtUtil.generateToken(userDetails.getUsername(), role);

        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/dang-ky")
    public ResponseEntity<NguoiDung> dangKy(@RequestBody NguoiDungRegisterRequest request) {
        VaiTro vaiTroNguoiDung = vaiTroRepository.findByName("Nguoi_dung")
                .orElseThrow(() -> new IllegalStateException("Vai tro 'Nguoi_dung' khong ton tai"));

        NguoiDung nguoiDung = NguoiDung.builder()
                .name(request.getName())
                .soDienThoai(request.getSoDienThoai())
                .password(passwordEncoder.encode(request.getPassword()))
                .vaiTro(vaiTroNguoiDung)
                .build();

        return ResponseEntity.ok(nguoiDungRepository.save(nguoiDung));
    }

    @GetMapping("/me")
    public ResponseEntity<NguoiDung> me(Authentication authentication) {
        String username = authentication.getName();

        return nguoiDungRepository.findBySoDienThoai(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
