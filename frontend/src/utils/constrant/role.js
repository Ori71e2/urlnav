export const ROLE = {
  SUPER_ADMIN: 5, // 超级管理员
  ADMIN: 4, // 管理员
  DEVELOPER: 3, // 开发者（和测试、运营具有同一权限，若提升为 RBAC 1 以上，则可酌情分开）
  VIP: 2,
  REGISTER: 1,
  HUMAN: 0 // 普通用户
}
