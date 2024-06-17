#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

push_addr=`git remote get-url --push origin` # git提交地址，也可以手动设置，比如：push_addr=git@github.com:gvray/FE-interview.git
commit_info=`git describe --all --always --long`
dist_path=build # 打包生成的文件夹路径
push_branch=gh-pages # 推送的分支

# 生成静态文件
npm run build

# 进入生成的文件夹
cd $dist_path

git init
git add -A
git commit -m "deploy, $commit_info"

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:XXX/XXX.git master:gh-pages

git push -f $push_addr HEAD:$push_branch

cd -

rm -rf $dist_path