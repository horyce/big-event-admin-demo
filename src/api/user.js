import request from '@/utils/request'

export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('api/reg', {
    username,
    password,
    repassword
  })
}

export const userLoginService = ({ username, password }) => {
  return request.post('api/login', {
    username,
    password
  })
}

export const userGetInfoService = () => {
  return request.get('/my/userinfo')
}

export const userUpdateInfoService = (data) => {
  return request.put('/my/userinfo', data)
}

export const userUploadAvatarService = (avatar) => {
  return request.patch('/my/update/avatar', { avatar })
}

export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) => {
  return request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
}
  
