<template>
	<el-main class="pageWidth detail">
		<el-row :gutter="10">
			<iframe :src="datas.defaultapi + datas.playurl" id="player" width="100%" allowtransparency="true" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"  scrolling="No" ></iframe>
		
		</el-row>
		<el-row  :gutter="10" class="videodetail">
			<el-tabs type="border-card">
				<el-tab-pane label="简介">
					<div>{{detailData.desc}}</div>
					<el-divider class="splithr" content-position="center" border-style="dashed">如遇播放问题，请尝试切换：</el-divider>
					<div class="player-api-change">
						<template  v-for="(papi,isname) in datas.apiurl" :key="papi.id">
						<el-button :type="[datas.defaultapi == papi ? 'warning' : 'default']" size="small" @click="changeDefaultApi(papi,isname)">
						{{isname}}</el-button>	
						</template>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-row>
		<el-row :gutter="10" v-if="(datas.types != 'movie')" class="videodetail">
			<el-tabs v-model="datas.site" type="border-card" @tab-click="changesite">
			<el-tab-pane v-for="(site,s) in detailData.playlink_sites" :key="site+s" :label="site" :name="s">
				<template v-if="(datas.types == 'variety')">
				<el-tabs v-model="datas.tabsindex"  type="border-card" class="yearTab" @tab-click="splitDate">
					<el-tab-pane style="padding: 0;">
					<template #label>
					<el-select v-model="datas.selectVal" :placeholder="datas.tag[0]" @change="yearChange">
						<el-option
							v-for="item in datas.tag"
							:key="item.value"
							:label="item"
							:value="item"
						>
						</el-option>
					</el-select>
					</template>
					</el-tab-pane>
					<el-tab-pane v-if="datas.newshow" label="最新" name="firstNew"></el-tab-pane>
					<el-tab-pane v-for="yeardate in datas.maxmonth" :key="yeardate.value" :label="yeardate+'月'" :name="yeardate" ></el-tab-pane>
				</el-tabs>
				<el-row :gutter="10">
					<template v-for="(escode,id) in detailData.episode" :key="escode.value+'C'">
					<el-col :class="[(datas.playurl == detailData.episode[id].url) ? 'btn-cur' : '']" :span="4" @click = "clickPlay(detailData.episode[id].url,detailData.episode[id].period)">
					<el-card class="box-card" shadow="never">
						<el-image :src="escode.v_cover"></el-image>
						<div>
							<div>{{escode.period}}</div>
							<div>{{escode.name}}</div>
						</div>
					</el-card>
					</el-col>
					</template>
				</el-row>
				</template>
				<template v-else>
					<template v-if="compute.arr && datas.isopen">
						<el-link :underline="false" v-for="catejuji in compute.arr" :key="catejuji" @click="getcatjuji(catejuji)">
							{{catejuji}}
						</el-link>
					</template>
					<div class="episode-btn-box">
						<template v-for="juj in compute.tempJuji" :key="juj">
							<el-button  :type="datas.playjuji == juj.playlink_num ? 'primary' : 'default'" class="episode-btn" size="small" @click="[juj.ellipsis ? openJuji(detailData.allupinfo[datas.site]) : clickPlay(juj.url,juj.playlink_num)]">{{juj.playlink_num}}</el-button>
						</template>
						<template v-if="detailData.allupinfo[datas.site] >= datas.maxjuji">
						<el-button v-if="!datas.isopen" class="episode-btn" @click="openJuji(detailData.allupinfo[datas.site])" size="small">展开</el-button>
						<el-button v-if="datas.isopen" class="episode-btn" @click="closeJuji" size="small">收起</el-button>
						</template>
					</div>
				</template>
			</el-tab-pane>
			</el-tabs>
		</el-row>
		<el-row v-if="datas.types == 'movie'" :gutter="10" class="videodetail">
			<el-tabs type="border-card">
				<el-tab-pane label="播放源">
					<template v-for="(site,s) in detailData.playlink_sites" :key="site+s">
						<el-button :type="[datas.playjuji == s ? 'primary' : 'default']" size="small"  @click = "clickPlay(detailData.playlinksdetail[s].default_url,s)">{{site}}</el-button>
					</template>
				</el-tab-pane>
			</el-tabs>
		</el-row>
	</el-main>

	<el-aside>
	</el-aside>
</template>

<script>
import { defineComponent , getCurrentInstance , onMounted, reactive,watch,computed} from 'vue'
export default defineComponent({
	name: 'Player',
	props: {
		detailData:{
			type:Object
		}
	},
	setup(props){
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			//页面是否刷新，或者是从其他页面路由进入
			refresh:true,
			//播放类型，movie，tv,comic.....
			types:'',
			//视频的名字
			title:'',
			//综艺类型时选择的年份
			selectVal:'',
			//综艺最新
			tabsindex:'firstNew',
			//显示最新
			newshow:true,
			//所有综艺剧集
			allepisode:[],
			//tv，c等类型视频，获取剧集从开始到结束，start,end
			NewDetailData:[],
			start:1,
			end:50,
			maxjuji:34,
			//展开收缩
			isopen:false,
			//缓存刷新页面或初次进入页面时默认显示的最新综艺
			zongyinew:[],
			//综艺的月份标签
			tag:[],
			//播放来源
			site:'',
			//是否手动更改播放来源
			handleChangeSite:false,
			//所有api接口
			apiurl:[],
			//默认接口
			defaultapi:'',
			//进入页面时播放的集数
			playjuji:'',
			//进入页面时播放的链接
			playurl:'',
			//播放历史
			playhist :{}
		});
		onMounted(()=>{
			changeTypes();
			const playerUrl = proxy.$readData('playerUrl');
			if(playerUrl){
				datas.apiurl = playerUrl;
				datas.defaultapi = datas.apiurl['接口一']
			}else{
				proxy.axios.get('/core/?source=player&types=apiurl').then((response) => {
					if(response.data){
						proxy.$saveData('playerUrl',response.data);
						datas.apiurl = response.data;
						datas.defaultapi = datas.apiurl['接口一']
					}
				});	
			}
		})
		
		const changeTypes = () => {
			switch(proxy.$route.query.mtype){
				case'm':
					datas.types = 'movie'
				break;
				case'tv':
					datas.types = 'tv'
				break;
				case'c':
					datas.types = 'comic'
				break;
				case'v':
					datas.types = 'variety'
				break;
			}
		}
		const compute = computed(() => {
			var tempJuji = '' ,arr = [];
			//展开收缩的计算
			if(props.detailData.juji){
				tempJuji = props.detailData.juji[datas.site] || [];
				if(tempJuji.length > 0){
					//根据api接口分析，判断剧集大于或等于34集的时候添加省略号
					if(props.detailData.allupinfo[datas.site] >= datas.maxjuji && datas.isopen == false){
						let reCompute = true;
						//此处遍历查找是否已经添加了省略号，添加了则不进行第二次添加
						for(let i in tempJuji){
							if(tempJuji[i].ellipsis) reCompute = false;
						}
						if(reCompute){
							//要插入的位置
							let insNum = parseInt(tempJuji.length) / 2;
							let arr = {
								playlink_num:'...',
								ellipsis : true,
							}
							tempJuji.splice(insNum,0,arr);
						}
					}else{
						tempJuji = datas.NewDetailDataJuji[datas.site];
					}
				}
				
				let limit = 50;
				if(props.detailData.allupinfo[datas.site] > limit){
					let len = Math.ceil(props.detailData.allupinfo[datas.site] / limit),
						tempArr = 0;
					for(let i = 0; i<len; i++){
						if(tempArr < props.detailData.allupinfo[datas.site]){
							
							let allconact = parseInt(limit + tempArr);
							
							let end =  (allconact > props.detailData.allupinfo[datas.site]) ? props.detailData.allupinfo[datas.site] : allconact;
							if(i == 0) tempArr = 1;
							
							let newlimit = tempArr +'-'+ end;
							
							arr.push(newlimit)
							
						}
						tempArr = limit * (i+1) + 1;
					}
				}
			}
			return {
				tempJuji,
				arr
			}
		});
		
		
		watch(
			[
				() => props.detailData,
			],
			() => {
				changeTypes();
				//监听tv，c 的数据变化并重新赋值给datas.NewDetailDataJuji保存,相当于中间件
				datas.NewDetailDataJuji = props.detailData.juji;
				//监听综艺按月份排序
				if(props.detailData.tagdate){
					let k = 0;
					for(let i in props.detailData.tagdate){
						datas.tag[k] = i;
						k++;
					}
					datas.tag.reverse();
					datas.maxmonth = props.detailData.tagdate[datas.tag[0]];
					datas.maxmonth.sort((a,b)=>{
						return b - a;
					})
					datas.zongyinew = props.detailData.episode
				}
				//监听页面数据变化时判断是否是手动更新site来源如果是就释放缓存的site来源
				if(!datas.handleChangeSite){
					datas.site = '';
				}
				//如果是首次加载或者已经释放过site来源，就重新赋值默认的site来源
				if(!datas.site){
					datas.site = props.detailData.playsite[0];
				}
				datas.title = props.detailData.title;	
				
				//添加历史纪录
				const history = proxy.$readData('playhist') || [];
				var typ = proxy.$route.query.mtype;
				if(typ == 'tv' || typ == 'c'){
					datas.playurl = props.detailData.juji[datas.site][0].url;
					
					datas.playjuji = props.detailData.juji[datas.site][0].playlink_num;
				}
				if(typ == 'm'){
					datas.playurl = props.detailData.playlinksdetail[datas.site].default_url;
					datas.playjuji = datas.site;
				}
				if(typ == 'v'){
					datas.playurl = props.detailData.episode[0].url;
					datas.playjuji = props.detailData.episode[0].period;
				}
				if(history.length != 0){
					var hasjuji = false;
					for(var i=0;i<history.length;i++){
						if((typ.indexOf(history[i].types) != -1)&& history[i].id == proxy.$route.query.id){						
							if(datas.refresh){
								proxy.$message({
									showClose: true,
									message: "继续为你播放《"+history[i].title+"》",
								})
							}
							datas.playurl = history[i].url;
							datas.playjuji = history[i].episode;
							datas.defaultapi = history[i].api;
							hasjuji = true;
							break;/*跳出循环*/
						}
					}
					if(hasjuji == false)saveStorage(history);
				}else{
					saveStorage(history);
				}
				//手动操作后，还原handleChangeSite为false
				datas.handleChangeSite = false;
				datas.refresh = false;
			}
		)
		
		//获取剧集
		const getvariety = (val) => {
			let years = '';
			if(proxy.$route.query.mtype == 'v' && val){
				years = '&year=' + val;
			}else{
				if(proxy.$route.query.mtype != 'm'){
					years = '&start=' + datas.start + '&end=' + datas.end;
				}
			}
			
			proxy.axios.get('/core/?source=player&type='+proxy.$route.query.mtype+'&id='+proxy.$route.query.id +'&site='+datas.site + years).then((response) => {
				if(response.data){
					if(proxy.$route.query.mtype == 'v'){
						datas.allepisode = response.data.episode;
						if(datas.allepisode){
							splitDate(datas.maxmonth[0]);
						}
					}else{
						//将展开获取的剧集数据赋值给datas.NewDetailDataJuji，计算属性的计算
						datas.NewDetailDataJuji = response.data.juji;
						datas.isopen = true;
					}
				}
			});
		}
		
		//综艺按月份将数据分割
		const splitDate = (mon) => {
			if(mon.paneName == 'firstNew' || mon.paneName == 0){
				proxy.detailData.episode = datas.zongyinew
				return false
			}
			let monthdata = datas.allepisode;
			if(monthdata.length == 0){
				getvariety(datas.tag[0]);
				return false;
			}
			let spliceData = [];
			for(let i = 0; i < monthdata.length ; i++){
				let d = monthdata[i].pubdate.slice(5,-3);
				if(d == mon.paneName || d == mon){
					spliceData.push(monthdata[i])
				}
			}
			proxy.detailData.episode = spliceData
		}
		
		//综艺获取年份
		const yearChange = (val) => {
			getvariety(val);
			datas.maxmonth = proxy.detailData.tagdate[val];
			//按月份排序
			datas.maxmonth.sort((a,b)=>{
				return b-a;
			})
			datas.tabsindex = (val == datas.tag[0]) ? 'firstNew' : datas.maxmonth[0]
			datas.newshow = (val == datas.tag[0]) ? true : false	
		}
		//剧集分类点击
		const getcatjuji = (val) =>{
			let valArr = val.split('-');
			datas.start = valArr[0];
			datas.end = valArr[1];
			getvariety();
		}
		
		//点击展开
		const openJuji = (val) => {
			let limit = 50;
			if(val < limit){
				datas.end = val;
			}
			datas.isopen = true;
			getvariety();
		}
		//点击收缩
		const closeJuji = () => {
			datas.isopen = false;
		}
		//更改播放来源
		const changesite = (val) => {
			datas.isopen = false;
			datas.handleChangeSite = true;
			datas.start = 1;
			datas.end = 50;
			datas.site = val.paneName;
			proxy.$parent.$parent.getData(datas.site);
		}
		
		const changeDefaultApi = (val,name) => {
			datas.defaultapi = val;
			proxy.$message({
				showClose: true,
				message: "正在切换到《"+name+"》",
			})
		}
		
		
		//点击播放
		const clickPlay = (value,juji) =>{
			datas.playurl = value;
			datas.playjuji = juji;
			const history = proxy.$readData('playhist') || [];
			saveStorage(history);
			let str = '' , typ = proxy.$route.query.mtype;
			str = (typ == 'tv' || typ == 'c') ? '第'+datas.playjuji+'集' : (typ == 'v') ? '第'+datas.playjuji :''
			proxy.$message({
				showClose: true,
				message: "当前为你播放《"+datas.title+"》" + str,
			})
		}
		
		const saveStorage = (history) =>{
			//定义历史数据的属性
			datas.playhist = {
				api:datas.defaultapi,           /*当前视频历史接口*/
				types:proxy.$route.query.mtype,          /*当前视频历史类型*/
				id:proxy.$route.query.id,                /*当前视频历史id*/
				url:datas.playurl,              /*当前视频历史地址*/
				title:datas.title,          /*当前视频名字*/
				episode:datas.playjuji,					/*当前播放历史集数*/          
				source:datas.site         	/*当前视频历史播放源*/
			}
			
			if(history.length!=0){
				var typ = proxy.$route.query.mtype,islike = false;
				for(var i=0;i<history.length;i++){
					if((typ.indexOf(history[i].types)>-1)&& history[i].id==proxy.$route.query.id){
						history.splice(i,1);/*删除数组中第一个元素*/
						islike = true;
						break;/*跳出循环*/
					}
				}
				if(history.length == 10 && !islike) history.pop();
			}
			if(history.length < 10){
				history.unshift(datas.playhist);/*将当前his数据存储并添加到最开始*/
				proxy.$saveData('playhist',history);/*存储当前播放记录*/
			}
		}
		
		return {
			datas,
			compute,
			changesite,
			yearChange,
			splitDate,
			clickPlay,
			getcatjuji,
			openJuji,
			closeJuji,
			changeDefaultApi
		}
	}
})
</script>

<style scoped>
	#player{background-color: black;}
	.videodetail{
		margin: 20px 0 0 0;
	}
	.el-select{width: 80px;border: none;}
	:deep(.el-input__inner){
		border: none;
	}
	.videodetail .el-tabs--border-card{
		border: none;
		box-shadow: none;
		width: 100%;
	}
	.videodetail :deep(.el-tabs__content){
		text-align: left;
		font-size: 0.9rem;
		line-height: 25px	;
	}
	.videodetail .el-tabs__content .el-tabs__content{
		padding: 0;
	}
	.videodetail .el-tabs__content .el-tabs--border-card{margin-bottom: 8px;}
	.videodetail .yearTab :deep(.el-tabs__content){padding: 0;}
	.videodetail .el-tabs--border-card :deep(.el-tabs__header .el-tabs__item),.videodetail .el-tabs--border-card :deep(.el-tabs__header){
		border: none;
	}
	.videodetail .el-tabs__content .el-tabs--border-card :deep(.el-tabs__header){
		background:transparent
	}
	#player{
		height: 600px;
		border: none;
	}
	.splithr{
		background-color: coral;
		
	}
	.splithr :deep(div){
		color: coral;
		font-size: 1.1rem;
		font-weight: 700;
	}
	.player-api-change{
		text-align: center;
	}
	.el-link.el-link--default{
		margin: 0 8px 10px 0;
		padding: 3px 5px;
/* 		background-color: var(--el-color-success); */
		border-radius: 5px;
		/* color: white; */
	}
	.btn-cur{
		border:2px solid darkcyan;
	}
	.episode-btn-box{
		display: grid;
		margin:0 -5px;
		grid-template-columns: repeat(auto-fill,minmax(60px, 1fr));
		grid-template-rows: repeat(auto,100px);
	}
	.episode-btn{
		text-align: center;
		width: 53px;
		margin: 5px;
	}
</style>
