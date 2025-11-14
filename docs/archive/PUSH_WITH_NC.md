# 使用 nc 代理推送 GitHub

## 当前状态

✅ **配置已修复并提交**
- 提交哈希：`859c372`
- 修改内容：修复 GitHub Actions 工作流配置
  - 添加 master 分支支持
  - 禁用 frontend 部署任务

❌ **推送失败**：网络或 SSH 连接问题

## 使用 nc 代理推送

如果之前使用 nc 成功推送过，可以再次使用：

### 方法 1: 使用 nc 作为 SSH 代理

```bash
# 1. 在一个终端启动 nc 代理（假设代理服务器地址和端口）
# 例如：nc -l -p 8080 作为本地代理

# 2. 配置 Git 使用代理
export GIT_SSH_COMMAND="ssh -o ProxyCommand='nc -X 5 -x proxy_host:proxy_port %h %p'"

# 3. 推送
cd /home/judytimer/cloudflare
git push origin master
```

### 方法 2: 使用 SSH 配置

编辑 `~/.ssh/config`：

```
Host github.com
    ProxyCommand nc -X 5 -x proxy_host:proxy_port %h %p
    User git
```

然后推送：

```bash
cd /home/judytimer/cloudflare
git push origin master
```

### 方法 3: 使用 HTTPS 方式（如果 SSH 有问题）

```bash
cd /home/judytimer/cloudflare

# 切换到 HTTPS URL
git remote set-url origin https://github.com/Judytimer/yanxuecloudflareworker.git

# 推送（会提示输入用户名和密码或 token）
git push origin master
```

## 已提交的更改

### 提交 1: Worker 更新
- 提交哈希：`833503b`
- 内容：Worker 配置和测试功能更新

### 提交 2: GitHub Actions 修复
- 提交哈希：`859c372`
- 内容：修复工作流配置
  - 添加 master 分支支持
  - 禁用 frontend 部署任务

## 推送后验证

推送成功后，检查：

1. **GitHub 上的文件**：
   - 确认 `.github/workflows/deploy.yml` 已更新
   - 确认 worker 文件夹的所有更改已上传

2. **GitHub Actions**：
   - 访问：https://github.com/Judytimer/yanxuecloudflareworker/actions
   - 确认工作流已触发（如果推送到 master 分支）
   - 确认部署成功

3. **Worker 功能**：
   - 测试 API 端点是否正常
   - 确认功能未受影响

## 注意事项

⚠️ **重要**：推送后 GitHub Actions 会自动触发部署
- 确保 GitHub Secrets 已配置（CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID）
- 确保 Worker 的 DEEPSEEK_API_KEY secret 已在 Cloudflare 中配置
- 部署可能需要几分钟时间

## 如果推送后 Worker 出现问题

1. **检查 GitHub Actions 日志**：
   - 查看部署日志，确认是否有错误

2. **检查 Cloudflare Dashboard**：
   - 确认 Worker 是否正常部署
   - 查看 Worker 日志

3. **回滚**：
   - 如果需要，可以回滚到之前的版本
   - 或者手动重新部署：`cd worker && npm run deploy`

