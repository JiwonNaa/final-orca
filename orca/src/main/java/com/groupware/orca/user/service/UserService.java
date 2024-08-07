package com.groupware.orca.user.service;

import com.groupware.orca.common.vo.DepartmentVo;
import com.groupware.orca.user.dao.UserDao;
import com.groupware.orca.user.vo.UserVo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserDao dao;
    private final BCryptPasswordEncoder encoder;

    public UserVo login(UserVo vo) {
        UserVo userVo = dao.login(vo);
        boolean isMatch = encoder.matches(vo.getPassword(), userVo.getPassword());

        return isMatch ? userVo : null;
    }

    public UserVo getUserVo(int userNo) {
        return dao.getUserVo(userNo);
    }

    public UserVo TestLogin(int empNo) {
        return dao.TestLogin(empNo);
    }

    public int changePassword(String currentPassword, String newPassword, UserVo userVo) {
        UserVo userVoData = dao.login(userVo);

        boolean isMatch = encoder.matches(currentPassword, userVoData.getPassword());

        if(!isMatch){
            return -1;
        }
        String encPassword = encoder.encode(newPassword);

        return dao.changePassword(encPassword, userVo);
    }

    public DepartmentVo departmentLogin(DepartmentVo departmentVo) {
        return dao.departmentLogin(departmentVo);
    }
}
