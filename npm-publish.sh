#!/usr/bin/env bash

echo "\033[0;32m?\033[0m \033[36m请输入你的新发布的版本号(ex:1.0.0)：\033[0m"

read version

# 处理 package.json
sed -i -e "s/\"version\": \(.*\)/\"version\": \"$version\",/g" 'package.json'
if [ -f "package.json-e" ];then
  rm 'package.json-e'
fi
echo '\033[36m版本号修改成功\033[0m'

npm config get registry # 检查仓库镜像库

npm config set registry=http://registry.npmjs.org # 设置仓库镜像库: 淘宝镜像https://registry.npm.taobao.org

echo '\033[36m请进行登录相关操作：\033[0m'

npm login # 登陆

echo "-------\033[36mpublishing\033[0m-------"

npm publish # 发布

echo "\033[36m 发布完成 \033[0m"

time=$(date "+%Y%m%d%H%M%S")
tag_name="$time-v$version"

echo "git add package.json"
git add package.json
echo "git commit -m Mod update version $version"
git commit -m "Mod update version $version"
echo "git push"
git push
echo "生成发布tag $tag_name"
git tag "$tag_name"
echo "推送tag $tag_name 到远程仓库"
git push origin $tag_name
exit