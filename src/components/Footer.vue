<template>
<!-- 	<el-tooltip content="返回顶部" placement="left">
		<el-backtop :bottom="120" class="backTop">
		<el-icon><Arrow-up-bold /></el-icon>
		</el-backtop>
	</el-tooltip>
	<el-tooltip content="刷新" placement="left" >
		<div class="refresh" @click="refresh">
			<el-icon><Refresh /></el-icon>
		</div>
	</el-tooltip> -->
	<footer class="zbp-footer">
		<p>由&nbsp;<a :href="link">{{blogName}}</a>&nbsp;提供技术支持 © Copyright {{year}}. &nbsp; &nbsp;Theme UI Element-UI.	&nbsp; &nbsp;<small>本站只提供在线查询，不提供任何资源存储服务</small>
		</p>
	</footer>
</template>

<script>
export default {
	name: 'Footer',
	data(){
		return{
			year:null,
			link:'https://www.zbpnice.cn',
			blogName:'柏平博客'
		}
	},
	created() {
		let date = new Date();
		this.year = date.getFullYear();
	},
	methods:{
		refresh(){
			const type = this.$route.name;
			switch(type){
				case 'Home':
					this.$removeData('homePage');
					this.$removeData('hompageRank');
					window.location.reload();
				break
				default:
					window.location.reload();
				break
			}
		}
	}
}
</script>

<style scoped>
	.backTop,.refresh{
		position: fixed;
		right: 40px;
		bottom: 70px;
		--el-backtop-background-color: var(--el-color-white);
		--el-backtop-font-color: var(--el-color-primary);
		--el-backtop-hover-background-color: var(--el-border-color-extra-light);
		background-color: var(--el-backtop-background-color);
		width: 40px;
		height: 40px;
		border-radius: 50%;
		color: var(--el-backtop-font-color);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		font-weight: 700;
		box-shadow: 0 0 6px rgb(0 0 0 / 12%);
		cursor: pointer;
		z-index: 5;
	}
	.zbp-footer{
		width: 100%;
		height: 50px;
		line-height: 50px;
		background: rgba(255,255,255,.8);
		color:#555;
		font-size: 0.9rem;
		margin-top: 20px;
		text-align: center;
	}
	@media only screen and (max-width: 768px){
		.zbp-footer{
			padding: 10px 0;
			height: auto;
			line-height: 25px;
		}
	}
	.zbp-footer a{
		text-decoration: none;
	}
</style>
