# base image
# FROM
FROM node

# 复制文件到容器
ADD . /home/www

# 进入工作目录
WORKDIR /home/www

# 安装项目依赖包
RUN npm install --registry=https://registry.npm.taobao.org

# 暴露 端口
EXPOSE 3000

# 开始命令
CMD ["node", "./index.js"]