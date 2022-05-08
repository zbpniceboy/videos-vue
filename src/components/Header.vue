<template>
	<el-header :class="[datas.isHome ? '' : 'header-white']" :style="[positions ? 'position:'+positions : '']">
		<div class="pageWidth">
		<el-menu :default-active="activeIndex2" :router="true"  mode="horizontal"  text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
		<el-menu-item index="/">首页</el-menu-item>
		<el-menu-item index="/tv">电视剧</el-menu-item>
		<el-menu-item index="/movie">电影</el-menu-item>
		<el-menu-item index="/variety">综艺</el-menu-item>
		<el-menu-item index="/comic">动漫</el-menu-item>
		</el-menu>
		<el-form @keyup.enter="seachEnter" @submit.prevent>
		<el-input v-model="datas.searchDefault" placeholder="请输入搜索内容" :class="[datas.isHome ? 'videoSearch-transt' : 'videoSearch']">
			<template #append>
				<el-button round @click="search">搜全网</el-button>
			</template>
		</el-input>
		</el-form>
		<el-dropdown  trigger="click" placement="bottom-start">
			<el-button type="primary" size="small">历史记录<el-icon><Arrow-down-bold /></el-icon></el-button>
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
				if(proxy.$route.name == 'search' && proxy.$route.query.kw != datas.searchDefault){
					proxy.$router.push({
						name:'search',
						query:{
							kw:datas.searchDefault
						}
					})
					proxy.$parent.$parent.datas.isLoading = true;
					proxy.$parent.$parent.getData(datas.searchDefault); 
					return false;
				}
				proxy.$router.push({
					name:'search',
					query:{
						kw:datas.searchDefault
					}
				})
			}else{
				proxy.$message({
					showClose: true,
					message: "搜索词不能为空，请输入搜索词搜索",
				})
			}
		}
		
		onMounted(()=>{
			datas.isHome = (proxy.$route.name == 'Home') ? true : false;
			if(props.swiper){
				datas.realindex = datas.swiper.realIndex;
			}
			datas.historyView = proxy.$readData('playhist') || [];
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
			datas
		}
  },

})

</script>

<style scoped>
	.el-header{
		position: absolute;
		top: 0;
		z-index: 2;
		width: 100%;
		background:transparent;
		background-image: linear-gradient(
		180deg, rgba(0,0,0,.45), transparent);
	}
	.el-menu , .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
		background: transparent!important;
	}
	.el-menu--horizontal{
		border: none!important;
	}
	.el-input-group{
		width: 380px;
		position: absolute;
		top: 10px;
		right: 250px;
		border: none;
		border-radius: 35px;
		background: #f0f0f0;
		background-image: linear-gradient(
		180deg,#ECECEC 0,#F6F6F6 100%);
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
</style>
