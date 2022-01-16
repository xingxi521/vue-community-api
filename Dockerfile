# build stage
FROM node:14
# 创建一个工作目录
WORKDIR /app
COPY . .
RUN yarn install --registry=https://registry.npm.taobao.org
RUN npm run build
# 暴露一个容器端口出去
EXPOSE 12005
VOLUME [ "/app/public" ]
CMD ["node", "dist/server.bundle.js"]