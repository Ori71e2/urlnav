### 版本说明
>  当前版本vue2.6 

### 前端介绍
>  

### 前端安装
>  1. 安装依赖
~~~
npm install
~~~
>  2. 配置域名接口  
开发环境下的后端域名配置 ：  
.env.development文件下
的VUE_APP_BASE_API参数  
开发环境下的文件上传域名配置：  
src目录下的config下的_import_development.js下的site参数  
生产环境下的后端域名配置 ：  
.env.production文件下
的VUE_APP_BASE_API参数  
生产环境下的文件上传域名配置：  
src目录下的config下的_import_production.js下的site参数    
>  3. 前端开发  
~~~
npm run dev
~~~
>  4. 前端编译
~~~
npm run build
~~~
> 代码编译后直接放置于dist目录下，dist目录被配置了可以直接提交到git代码托管网站，如不需要请自行添加到.gitignore文件。
