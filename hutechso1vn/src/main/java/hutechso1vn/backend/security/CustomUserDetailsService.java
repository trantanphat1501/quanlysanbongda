package hutechso1vn.backend.security;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import hutechso1vn.backend.entity.NguoiDung;
import hutechso1vn.backend.repo.NguoiDungRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final NguoiDungRepository nguoiDungRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Ở đây username chính là số điện thoại
        NguoiDung nguoiDung = nguoiDungRepository.findBySoDienThoai(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String roleName = nguoiDung.getVaiTro() != null ? nguoiDung.getVaiTro().getName() : "Nguoi_dung";

        return new User(
                nguoiDung.getSoDienThoai(),
                nguoiDung.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName)));
    }
}

