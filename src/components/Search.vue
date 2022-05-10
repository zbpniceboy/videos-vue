<template>
	<div class="pageWidth">
	<el-main>
		<div v-show="isLoading" class="main-container"></div>
		<template v-if="!isLoading && isnull == false">
		<el-row v-for="sear in compute.alldata" :key="sear" class="header-white" :style="{marginBottom:'10px',padding:'20px'}">
			<el-col :span="4">
				<router-link :to="{
					name: 'player', 
					query:{
						mtype:sear.cat_id,
						id:sear.id,
					}
				}">
				<el-image :src="sear.pic" :style="{width:'100%'}"></el-image>
				</router-link>
			</el-col>
			<el-col :span="20">
			<el-descriptions :column="2" :extra="sear.cat_name" :style="{marginLeft:'20px',cursor:'pointer'}">
				<template #title>
					<div class="el-descriptions__title">
						<router-link :to="{
							name: 'player', 
							query:{
								mtype:sear.cat_id,
								id:sear.id,
							}
						}">
						{{sear.title}}
						</router-link>
					</div>
				</template>
				<el-descriptions-item label="地  区 :" width="150px" >{{sear.area}}</el-descriptions-item>
				<el-descriptions-item label="主  演 :"  width="auto" label-class-name="my-label" class-name="my-content">
				<template v-for="(act,i) in sear.actor" :key="act">
				<a href="javascript:;">{{act}}</a><i v-if="i != sear.actor.length-1">&nbsp;&nbsp;/&nbsp;&nbsp;</i> 
				</template>
				</el-descriptions-item>
				<el-descriptions-item label="简  介 :" span="2">{{sear.desc}}
				</el-descriptions-item>
				<el-descriptions-item v-if="sear.cat_id == 'v'" label-class-name="hidden-btn" class-name="episode-btn-box">
					<ul class="variety-search" >
						<template v-for="(vart,va) in sear.playlinks[sear.site]" :key="vart.id">
					<router-link :to="{
						name: 'player', 
						query:{
							mtype:sear.cat_id,
							id:sear.id,
						}
					}">
					<li @click="SearchPlay(sear,va)"><span>{{vart.period}}</span><span>{{vart.name}}</span></li>
					</router-link>
					</template>
					</ul>
				</el-descriptions-item>
				<el-descriptions-item v-else-if="sear.cat_id == 'm'" label-class-name="hidden-btn" class-name="episode-btn-box">
				<router-link :to="{
						name: 'player', 
						query:{
							mtype:sear.cat_id,
							id:sear.id,
						}
					}">
					<el-button class="movie-btn" size="large" @click="SearchPlay(sear,'')">
						<el-icon size="1.8rem" color="#fff" :style="{fontWeight:'600'}">
							<Video-play />
						</el-icon>&nbsp;立即观看
					</el-button>
				</router-link>
				</el-descriptions-item>
				<el-descriptions-item v-else label-class-name="hidden-btn" class-name="episode-btn-box">				
					<template v-for="(juj,e) in sear.playlinksdetail" :key="juj+e">
						<router-link :to="{
							name: 'player', 
							query:{
								mtype:sear.cat_id,
								id:sear.id,
							}
						}">
						<el-button v-if="juj.ellipsis" class="episode-btn" size="small">{{juj.playNum}}</el-button>
						<el-button v-else class="episode-btn" size="small" @click="SearchPlay(sear,e)">{{juj.playNum}}</el-button>
						</router-link>
					</template>
				</el-descriptions-item>
			</el-descriptions>
			</el-col>
		</el-row>
		</template>
		<template v-if="isnull">
			<el-empty class="empty-search" :description="'没有搜索到与《'+this.$route.query.kw+'》相关影片，请尝试其他关键词！'"></el-empty>
		</template>
	</el-main>
	</div>
</template>
<script>
	import { defineComponent , getCurrentInstance , onMounted, reactive,computed,watch} from 'vue'
	import 'element-plus/es/components/loading/style/css'
	import { ElLoading  } from 'element-plus'
	export default defineComponent({
		name: 'Search',
		props: {
			searchData: Object,
			isLoading :Boolean,
			isnull : Boolean
		},
		setup(props){
			let { proxy } = getCurrentInstance();
			const datas = reactive({
				history:[],
				playerUrl:[],
			});

			onMounted(()=>{
				datas.history = proxy.$readData('playhist') || [];
				datas.playerUrl = proxy.$readData('playerUrl') || [];
				loading();
			})
			const compute = computed(() => {
				let alldata = props.searchData || [], desc = '', len = 118,jujiTotal = 32;
				if(alldata){
					for(let j in alldata){
						let str = alldata[j].desc.replace(/\s*/g,"");
						if (str.length * 2 <= len) { //length属性读出来的汉字长度为1
							desc = str;
						}
						var strlen = 0;
						var s = "";
						for (var i = 0; i < str.length; i++) {
							if (str.charCodeAt(i) > 128) {  
								strlen += 2;  
							} else {  
								strlen +=1;  
							}  
							s += str.charAt(i);  
							if (strlen >= len) {  
								desc = s.substring(0, s.length - (s.length - len)) + "...";
							}
						}
						alldata[j].desc = desc;
						
						if(alldata[j].actor.length > 8){
							alldata[j].actor.splice(8);
						}
						let playliks = alldata[j].playlinksdetail ? alldata[j].playlinksdetail : [];
						if(typeof playliks !== 'undefined' && playliks.length > 0){
							let allNum = '';
							if(playliks.length <= jujiTotal / 2){
								allNum = playliks;
							}else{
								let arr = {playNum:'...',ellipsis : true}
								let startNum = alldata[j].playlinksdetail.splice(0,jujiTotal/2);
								let endNum = alldata[j].playlinksdetail.splice(-jujiTotal / 2);
								let ConcatNum = startNum.concat(arr);
								allNum = ConcatNum.concat(endNum);
							}
							alldata[j].playlinksdetail = allNum;
						}
					}
				}
				return {
					alldata
				}
			})
			
			watch(
				() => props.isLoading,
				() =>{
					loading();
				}
			)
			
			const loading = () =>{
				const loading = ElLoading.service({
					lock: true,
					fullscreen:false,
					text: '努力加载中...',
					background: 'rgba(255,255,255,.4)',
					target: document.querySelector('.main-container') // 设置加载动画区域
				})
				if(props.isLoading == false){
					loading && loading.close();
				}
			}
			
			const SearchPlay = (hisdata,i) => {
				let catUrl = '',episod = '';
				if(hisdata.cat_id == 'v' && i != null){
					catUrl = hisdata.playlinks[hisdata.site][i].url;
					episod = hisdata.playlinks[hisdata.site][i].period
				}
				if(hisdata.cat_id == 'm'){
					catUrl = hisdata.playlinks[hisdata.site];
					episod = hisdata.site
				}
				
				if((hisdata.cat_id == 'tv' || hisdata.cat_id == 'c') && i != null){
					catUrl = hisdata.playlinksdetail[i].url;
					episod = hisdata.playlinksdetail[i].playNum;
				}
				let varietyhist = {
					api:datas.playerUrl['接口一'],           
					types:hisdata.cat_id,          
					id:hisdata.id,               
					url:catUrl, 
					title:hisdata.title, 
					episode:episod,         
					source:hisdata.site
				}
				saveStorage(datas.history,varietyhist)
			}
			
			const saveStorage = (history,hisdata) =>{
				//定义历史数据的属性
				let playhist = {
					api:hisdata.api,           /*当前视频历史接口*/
					types:hisdata.types,          /*当前视频历史类型*/
					id:hisdata.id,                /*当前视频历史id*/
					url:hisdata.url,              /*当前视频历史地址*/
					title:hisdata.title,          /*当前视频名字*/
					episode:hisdata.episode,					/*当前播放历史集数*/          
					source:hisdata.source         	/*当前视频历史播放源*/
				}
				
				if(history.length!=0){
					var typ = hisdata.types,islike = false;
					for(var i=0;i<history.length;i++){
						if((typ.indexOf(history[i].types)>-1)&& history[i].id==hisdata.id){
							history.splice(i,1);/*删除数组中第一个元素*/
							islike = true;
							break;/*跳出循环*/
						}
					}
					if(history.length == 10 && !islike) history.pop();
				}
				if(history.length < 10){
					history.unshift(playhist);/*将当前his数据存储并添加到最开始*/
					proxy.$saveData('playhist',history);/*存储当前播放记录*/
				}
			}

			return {
				datas,
				compute,
				SearchPlay,
			}
		}
	})
</script>

<style scoped>
	.main-container,.empty-search{
		width: 100%;
		height: 600px;
	}
	.header-white :deep(.el-descriptions__title){
		font-size: 1.4rem;
		color: crimson;
	}
	.header-white :deep(.my-content){
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.variety-search{
		list-style: none;
		display: flex;
		flex-wrap: wrap;
	}
	.variety-search a{
		flex: 0 0 50%;
	}
	.variety-search a:hover li{
		background-color: coral;
		color: #fff;
	}
	.variety-search li{
		padding: 6px;
		background: #f5f5f5;
		margin: 0 5px 5px 0;
		border-radius: 5px;
	}
	.variety-search li>span:nth-child(1){
		margin-left: 30px;
	}
	.variety-search li>span:nth-child(2){
		margin-left: 20px;
	}
	.header-white :deep(.hidden-btn){display: none;}
	.episode-btn-box{
		display: grid;
		margin:0 -5px;
		grid-template-columns: repeat(auto-fill,minmax(60px, 1fr));
		grid-template-rows: repeat(auto,100px);
	}
	.movie-btn{
		position: absolute;
		bottom: 28px;
		width: 150px;
		height: 49px;
		font-weight: 700;
		color: #fff;
		background-color: coral;
	}
	.movie-btn :deep(span){
		font-size: 1.2rem;
	}
	.episode-btn{
		text-align: center;
		width: 53px;
		margin: 5px;
	}
	.empty-search{
		background-color: white;
	}
</style>