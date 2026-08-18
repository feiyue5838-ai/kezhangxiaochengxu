/**
 * 用户资料字段兼容层。
 * 小程序展示使用 nickName/avatarUrl，后端接口使用 nickname/avatar。
 */
function normalizeUserInfo(userInfo) {
  const source = userInfo && typeof userInfo === 'object' ? userInfo : {};
  const nickName = source.nickName !== undefined && source.nickName !== null
    ? source.nickName
    : (source.nickname || '');
  const avatarUrl = source.avatarUrl !== undefined && source.avatarUrl !== null
    ? source.avatarUrl
    : (source.avatar || '');

  return {
    ...source,
    nickName,
    avatarUrl,
    nickname: source.nickname !== undefined ? source.nickname : nickName,
    avatar: source.avatar !== undefined ? source.avatar : avatarUrl,
    phone: source.phone || '',
  };
}

/**
 * 将服务端资料合并到本地资料，并始终让服务端同名字段覆盖旧值。
 */
function mergeUserInfo(current, incoming) {
  const local = normalizeUserInfo(current);
  const remote = incoming && typeof incoming === 'object' ? incoming : {};
  const merged = { ...local, ...remote };

  if (remote.nickname !== undefined) merged.nickName = remote.nickname || '';
  else if (remote.nickName !== undefined) merged.nickName = remote.nickName || '';

  if (remote.avatar !== undefined) merged.avatarUrl = remote.avatar || '';
  else if (remote.avatarUrl !== undefined) merged.avatarUrl = remote.avatarUrl || '';

  return normalizeUserInfo(merged);
}

module.exports = {
  normalizeUserInfo,
  mergeUserInfo,
};
