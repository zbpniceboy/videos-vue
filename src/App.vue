<template>
  <router-view />
</template>

<script>
	document.title = '柏平博客在线影院'
	var le = [
		{'name':'format-detection','content':'telephone=no'},
		{'name':'renderer','content':'webkit'},
		{'name':'referrer','content':'never'},
	]
	
	for(let i = 0; i<le.length;i++){
		var oMeta = document.createElement('meta');
		oMeta.name = le[i].name;
		oMeta.content = le[i].content;
		document.getElementsByTagName('head')[0].appendChild(oMeta);
	}
	

</script>
<style>
*{
	margin: 0;
	padding: 0;
}
body{
	background: #eeeeee;
}
a{text-decoration: none;color:unset}
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.pageWidth{
	width: 100%;
	max-width: 1168px;
	margin: 0 auto!important;
}

.tvshow,.variety,.movie,.comic{background: #fff;margin: 0 0 20px 0;}
.comic{margin:0;}
.el-card{border:none!important}
.header-white{background-image:unset!important; background-color: #fff!important;}
.header-white .el-menu--horizontal>.el-menu-item{ color:var(--el-text-color-primary);}
.header-white .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
	color: coral;
}
	/*搜索框全局样式*/
	.videoSearch-transt .el-input__inner,.videoSearch-transt .el-input-group__append{color: white;}
	.videoSearch .el-input__inner,.videoSearch .el-input-group__append{color: #333;}
	.videoSearch-transt .el-input__inner,.videoSearch-transt .el-input-group__append,.videoSearch .el-input__inner,.videoSearch .el-input-group__append{
		border: none;
		background: transparent;
	}
	.videoSearch-transt .el-input-group__append,.videoSearch .el-input-group__append{
		border-radius: 35px;
		background-color: coral;
		color: white;
	}
</style>
