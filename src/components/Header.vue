<template>
	<el-menu class="navbar left-slidbar unvisible" :default-active="activeIndex2" :router="true" :ellipsis="false"  mode="vertical"  active-text-color="#ffd04b" @select="handleSelect">
	<el-menu-item v-for="items in datas.navbar" :key="items" :index="items.type">{{items.text}}</el-menu-item>
	</el-menu>
	<el-header :class="[datas.isHome ? 'indexPage' : 'header-white']">
		<div class="pageWidth">
			
		<el-button text  bg class="header-menu-icon lg-hidden xs-show" @click="[datas.showNav ? closeNavbar() : showNavbar()]"><el-icon size="1.3rem"><Close v-if="datas.showNav" /><Menu v-else /></el-icon></el-button>
		<el-button text bg class="header-search-icon lg-hidden xs-show"><el-icon size="1.3rem"><Search /></el-icon></el-button>
		
		<el-menu class="xs-hidden" :default-active="activeIndex2" :router="true" :ellipsis="false"  mode="horizontal"  active-text-color="#ffd04b" @select="handleSelect">
		<el-menu-item v-for="items in datas.navbar" :key="items" :index="items.type">{{items.text}}</el-menu-item>
		</el-menu>
		<el-form  class="xs-hidden"  @keyup.enter="seachEnter" @submit.prevent>
		<el-input v-model="datas.searchDefault" placeholder="请输入搜索内容" :class="[datas.isHome ? 'videoSearch-transt' : 'videoSearch']">
			<template #append>
				<el-button round @click="search">搜全网</el-button>
			</template>
		</el-input>
		</el-form>
		<el-dropdown  trigger="click" placement="bottom-start">
			<el-button type="primary" class="xs-hidden">历史记录<el-icon><Arrow-down-bold /></el-icon></el-button>
			<el-button text bg class="header-his-icon lg-hidden xs-show"><el-icon size="1.3rem"><Clock /></el-icon></el-button>
			<template #dropdown>
				<el-dropdown-menu>
					<template v-if="datas.historyView.length>0">
					<el-dropdown-item v-for="his in datas.historyView" :key="his">	
					<router-link :to="{
						name: 'player', 
						query:{
							mtype:his.types,
							id:his.id,
						}
					}" class="hisLink">
						<span>{{his.title}}</span>
						<span v-if="his.types == 'tv' || his.types == 'c'">观看到：第{{his.episode}}集</span>
						<span v-if="his.types == 'v'">{{his.episode}}</span>
						<span v-if="his.types == 'm'">电影</span>
					</router-link>
					</el-dropdown-item>
					</template>
					<template v-else>
						<el-dropdown-item>暂时还没有历史纪录，赶紧去观看视频吧！</el-dropdown-item>
					</template>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		</div>
	</el-header>
	<template v-if="swiper">
	<swiper class="swiper-nav" @swiper="onSwiper" @slideChange="onSlideChange" :modules="modules"  direction="vertical"  :loop="true" :autoplay="datas.autoplay" :pagination="datas.pagination"  effect="fade" :fadeEffect="{crossFade: true,}" :style="{width:'100%',height:'480px',background:'rgba(0,0,0,.3)'}">
		<template v-for="(item,num) in swiper" :key="item">
		<swiper-slide v-if="num < swiper.length - 1" :style="{backgroundImage: 'url('+item.pic+')'}">
		</swiper-slide>
		<router-link v-if="num == datas.realindex" :style="{width:'100%',height:'480px',display:'block',position:'absolute',top:'0',left:'0',zIndex:'3'}" :to="{ name: 'player', query:{mtype:item.cat,id:item.id}}"></router-link>
		</template>
		<div class="swiper-pagination" id="pagin">
		<div class="pagination-title"><span></span>重磅推荐</div>
		<template v-for="(item,index) in swiper" :key="item">	
		<router-link v-if="index < swiper.length -1" :to="{ name: 'player', query:{mtype:item.cat,id:item.id}}" >
			<div :class="'swiper-pagination-bullet'+ [ index == datas.realindex ? ' current-active ' : '']"  @mousemove="mouseOver(index)"><span>{{item.title}}</span><i>| {{item.comment}}</i></div>
		</router-link>
		</template>
		</div>
	</swiper>
	
	</template>
</template>

<script>
import { defineComponent,getCurrentInstance, ref,onMounted,reactive} from 'vue'
import { EffectFade, Pagination,Autoplay} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue.js'; 
// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/modules/pagination/pagination.min.css';
import 'swiper/modules/autoplay/autoplay.min.css';
export default defineComponent({
	name:'Header',
	props: {
		swiper: null,
		positions:String,
	},
	components: {
		Swiper,
		SwiperSlide,
	},
	setup(props) {
		let { proxy } = getCurrentInstance();
		const activeIndex2 = ref('1')
		const handleSelect = (key, keyPath) => {
			return { key , keyPath}
		}
		const datas = reactive({
			navbar:[
				{ type: '/', text: '首页' },
				{ type: '/tv', text: '电视剧' },
				{ type: '/movie', text: '电影' },
				{ type: '/variety', text: '综艺' },
				{ type: '/comic', text: '动漫' },
			],
			showNav:false,
			swiper:null,
			realindex:1,
			autoplay:{ 
				delay: 3000,
				stopOnLastSlide: false,
				disableOnInteraction: false ,
			},
			pagination:{ 
				el:'.swiper-pagination',
				clickable :true,
				type:'custom',
			},
			isHome:true,
			searchDefault:'',
			historyView:[],
		})
		const onSwiper = (swip) => {
			datas.swiper = swip;
		};
		const onSlideChange = (index) => {
			datas.realindex = index.realIndex;
		};
		const mouseOver = (that) => {
			datas.realindex = that;
			datas.swiper.slideToLoop(that);
		}
		
		const seachEnter = (e) => {
			var keyCode = window.event ? e.keyCode : e.which;
				if (keyCode == 13) {
					search(); //搜索按钮的回调
				}
			}
		
		const search = () =>{
			if(datas.searchDefault){
				proxy.$router.push({
					name:'search',
					query:{
						kw:datas.searchDefault
					}
				})
				if(proxy.$route.name == 'search' && proxy.$route.query.kw != datas.searchDefault){
					proxy.$parent.getData(datas.searchDefault); 
					return false;
				}
			}else{
				proxy.$message({
					showClose: true,
					message: "搜索词不能为空，请输入搜索词搜索",
				})
			}
		}
		
		const showNavbar = () =>{
			datas.showNav = true;
			const navbar = document.getElementsByClassName('navbar')[0];
			navbar.classList.add('show-navbar');
			navbar.classList.remove('unvisible');
		}
		
		const closeNavbar = () =>{
			datas.showNav = false;
			const navbar = document.getElementsByClassName('navbar')[0];
			navbar.classList.add('unvisible');
			navbar.classList.remove('show-navbar');
		}
		
		onMounted(()=>{
			datas.isHome = (proxy.$route.name == 'Home') ? true : false;
			if(props.swiper){
				datas.realindex = datas.swiper.realIndex;
			}
			datas.historyView = proxy.$readData('playhist') || [];
			window.onscroll = function(){
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				let hasIndexPage = document.getElementsByClassName('el-header')[0];
				let searchHas = document.getElementsByClassName('el-input-group')[0];
				if(hasIndexPage.classList.contains('indexPage') || searchHas.classList.contains('videoSearch-transt')){
					if(scrollTop >= 200){
						hasIndexPage.classList.add('header-white','nav-color');
						searchHas.classList.remove('videoSearch-transt');
						searchHas.classList.add('videoSearch');
					}else{
						hasIndexPage.classList.remove('header-white','nav-color');
						searchHas.classList.add('videoSearch-transt');
						searchHas.classList.remove('videoSearch');
					}
				}
			}
		})

		return {
			onSwiper,
			onSlideChange,
			activeIndex2,
			handleSelect,
			mouseOver,
			modules: [Pagination, EffectFade,Autoplay],
			seachEnter,
			search,
			showNavbar,
			closeNavbar,
			datas
		}
  },

})

</script>

<style scoped>
	.el-header{
		position: fixed;
		top: 0;
		z-index: 5;
		width: 100%;
		background:transparent;
		background-image: linear-gradient(
		180deg, rgba(0,0,0,.7), transparent);
		z-index: 101;
		-webkit-box-shadow: 0 1px 2px 0 rgb(34 36 38 / 15%);
		box-shadow: 0 1px 2px 0 rgb(34 36 38 / 15%);
	}
	.lg-hidden{
		display: none;
	}
	.el-menu , .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
		background: transparent!important;
	}
	.el-menu--horizontal{
		border: none!important;
	}
	.indexPage .el-menu-item{
		color: #fff;
	}
	.indexPage .el-menu-item:hover{
		color: coral;
	}
	
	.nav-color .el-menu-item{
		color: var(--el-text-color-primary);
	}
	.el-menu.navbar{
		position: fixed; top: 0;left: 0;height: 100%;
		width: 70px;
		background-color: #FFFFFF!important;
		-webkit-transition: -webkit-transform .5s ease;
		transition: -webkit-transform .5s ease;
		transition: transform .5s ease;
		transition: transform .5s ease,-webkit-transform .5s ease;
	}
	.el-menu.navbar .el-menu-item{
		color:#909090;
		width: 100%;
		display: inline-block;
		padding-left: 0!important;
		padding-top: 13.5px;
		padding-bottom: 13.5px;
		padding-right: 0!important;
		text-align: center;
		height: auto;
		line-height: 1;
	}
	.el-menu.navbar .el-menu-item:before{
		position: absolute;
		content: '';
		top: auto;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: rgb(0 0 0 / 10%);
	}
	.el-menu.unvisible{
		-webkit-transform:translate3d(-100%,0,0);
		transform: translate3d(-100%,0,0);
	}
	.show-navbar.left-slidbar{
		-webkit-transform: translate3d(0,0,0);
		transform: translate3d(0,0,0);
	}
	.el-input-group{
		width: 380px;
		position: absolute;
		top: 13px;
		right: 250px;
		border: none;
		border-radius: 35px;
		background: #f0f0f0;
		background-image: linear-gradient(
		180deg,#ECECEC 0,#F6F6F6 100%);
	}
	.el-input-group :deep(.el-input__wrapper){
		background-color: transparent;
	}
	.el-input-group :deep(.el-input__wrapper),.el-input-group :deep(.el-input-group__append){
		box-shadow: none;
	}
	
	.el-dropdown{
		position: absolute;
		top: 13px;
		right: 110px;
	}
	.el-icon{
		margin: 0 -10px 0 10px;
	}
	.hisLink{
		display: flex;
		flex-wrap: nowrap;
		width: 100%;
		min-width:300px;
		align-items: center;
	}
	.hisLink span{
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.hisLink span:nth-child(2){
		font-size: .8rem;
		text-align: right;
	}
	.videoSearch-transt{
		background: rgba(255,255,255,.12);
	}
	.swiper-nav {
		width: 100%;
		height: 480px;
		color: #ffffff;
		cursor: pointer;
	}
	.swiper-nav .swiper-slide{
		background-position: center center;
		background-repeat: no-repeat;
		
		/* background-size: cover; */
	}
	.swiper-pagination{
		width: 310px;
		min-width: 310;
		top: 0;
		bottom: 0;
		left: unset;
		right: 0%;
		font-size: 0.9rem;
		background-color: rgba(0,0,0,0.2);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.swiper-pagination .swiper-pagination-bullet{
		height: 40px;
		margin-left: 30px;
		line-height: 40px;
		border-radius: unset;
		width: auto;
		display: flex!important;
		color: #e5dfdf;
		background: transparent;
		text-align: left;
		opacity: unset;
		overflow: hidden;
	}
	.swiper-pagination .pagination-title{
		font-size: 1.2rem;
		font-weight: 700;
		text-align: left;
		height: 40px;
		line-height: 40px;
		margin-top: 70px;
	}
	.swiper-pagination .pagination-title span{
		background-image: url(../assets/hot.png);
		background-repeat: no-repeat;
		background-position: right bottom;
		width: 14px;
		height: 15px;
		margin: 0 8px 0 8px;
		display: inline-block;
	}
	.swiper-pagination .swiper-pagination-bullet i{
		display: none;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-style: normal;
		margin-left: 4px;
	}
	.swiper-pagination .swiper-pagination-bullet span{
		flex: 0 0 auto;
	}
	.swiper-pagination .current-active{
		font-size: 1.2rem;
		font-weight: 700;
		color: #FFFFFF;
	}
	.swiper-pagination .current-active i{
		display: block;
		font-size: 1rem;
		font-weight: 400;
		color: #FFFFFF;
	}
	.swiper-fade .swiper-slide-active{
		pointer-events: auto;
	}
	.swiper-fade .swiper-slide {
		pointer-events: none;
		transition-property: opacity;
	}
	@media only screen and (min-width: 768px){
		.el-input-group{
			right: 150px;
			width: 200px
		}
		.el-dropdown{
			right: 20px;
		}
	}
	@media only screen and (min-width: 992px){
		.el-input-group{
			width: 380px
		}
	}
	
	@media only screen and (min-width: 1200px){
		.el-input-group{
			right: 250px;
		}
		.el-dropdown{
			right: 110px;
		}
	}
	@media only screen and (max-width: 600px){
		.xs-hidden{
			display: none;
		}
		.el-header{
			height:40px;
		}
		.el-header .header-menu-icon,.el-header .header-search-icon,.el-header .header-his-icon {
			width: 40px;
			height: 40px;
			padding: 0;
			margin: 0;
			display: inline-block;
			background-color:#ffffff!important;
		}
		.el-header .header-menu-icon{
			position: absolute;
			left: 10px;
		}
		.el-header .header-search-icon{
			position: absolute;
			right: 56px;
		}
		.xs-show .el-icon{
			margin: 0;
		}
		.el-dropdown{
			top: 0;
			right: 10px;
		}
	}
</style>
