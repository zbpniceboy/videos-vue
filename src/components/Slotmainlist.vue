<template>
	<el-main class="pageWidth main-single-box">
		<el-skeleton :loading="loading" animated >
			<template #template>
				<div class="tvpage-type">
					<div class="type-skeleton" v-for="(it,ind) in datas.skeletonType" :key="it">
						<el-skeleton-item :style="[ind == 0 ? 'width:30%;flex:0 0 auto!important;' : ind == datas.skeletonType -1 ? 'width:60%;flex:0 0 auto!important;' : '']" />
					</div>
				</div>
				<div class="main-list">
					<el-row :gutter="10">
						<el-col :xs="8" :sm="6" :md="4" :lg="5" :xl="5" v-for="item in datas.skeletonCount" :key="item">
							<div class="grid-content bg-purple">
							<el-card :body-style="{ padding: '0px'}" shadow="hover">
								<el-skeleton-item variant="image" />
								<div style="padding: 14px">
									<el-skeleton-item variant="h3" style="width: 50%" />
									<div style=" display: flex;align-items: center;justify-items: space-between;margin-top: 16px;height: 16px;">
										<el-skeleton-item variant="text" style="margin-right: 16px" />
										<el-skeleton-item variant="text" style="width: 30%" />
									</div>
								</div>
							</el-card>
							</div>
						</el-col>
					</el-row>
				</div>
			</template>
		<template #default>
		<div class="tvpage-type">
			
			<slot name="catlistType" :cList = "datas.catlist"></slot>
			
		</div>
		<div class="main-list">
		<el-row :gutter="10" v-if="slotdata && !isnull">
			<template v-for="(list,index) in slotdata" :key="list+index">
			<el-col :xs="8" :sm="6" :md="4" :lg="5" :xl="5" v-if="!isNaN(index)">
				<router-link :to="{ name: 'player', query:{mtype:datas.playType,id:list.id}}" >
				<div class="grid-content bg-purple">
				<el-card :body-style="{ padding: '0px'}" shadow="hover">
					<el-image fit="cover" :lazy="true" :src="list.pic">
						<template #placeholder>
							<div class="image-slot">
								<el-icon><Picture /></el-icon>
								<span>Loading...</span>
							</div>
						</template>
						<template #error>
							<div class="image-slot">
								<el-icon><Picture /></el-icon>
								<span>糟糕，图片加载失败</span>
							</div>
						</template>
					</el-image>
					<div class="card-text-box">
						<div class="card-title"><h2>{{list.title}}</h2></div>
						<div class="card-desc" v-if="list.comment">{{list.comment}}</div>
						<div class="card-desc" v-else>主演：{{list.actor}}</div>
					</div>
				</el-card>
				</div>
				</router-link>
			</el-col>
			</template>
		</el-row>
		<el-empty v-else-if="isnull" style="background-color: white;" description="没有找到相关影片，请尝试其他分类！"></el-empty>		
		</div>
		
		</template>
		</el-skeleton>
	</el-main>
	
	<el-pagination v-if="slotdata && !isnull"
		background 
		:pager-count="5"
		:current-page="this.$parent.datas.curpage"
		layout="prev, pager, next" 
		:total="this.$parent.compute.pagebar"
		@current-change="this.$parent.curSizeChange">
	</el-pagination>
</template>

<script>
	import { defineComponent,getCurrentInstance ,onMounted,reactive} from 'vue'
	export default defineComponent({
		name:'Slotmainlist',
		props:{
			slotdata:Object,
			isnull:Boolean,
			loading:Boolean,
		},
		setup() {
			let { proxy } = getCurrentInstance();
			const datas = reactive({
				catlist:[],
				playType:'',
				catlistStroage:'',
				//骨架屏类别数
				skeletonType:5,
				//骨架屏图文列表数
				skeletonCount: 35,
			});
			
			onMounted(() => {
				let cType = '',playType = '';
				switch(proxy.$route.name){
					case 'tv':
						cType = 'tvCatList';
						playType = 'tv';
						break;
					case 'movie':
						cType = 'movieCatList';
						playType = 'm';
						break;	
					case 'variety':
						cType = 'varietyCatList';
						playType = 'v';
						break;
					case 'comic':
						cType = 'comicCatList';
						playType = 'c';
						break;
					
				}
				datas.catlistStroage = cType;
				datas.playType = playType;
				getCatData();
			});
			const getCatData = () => {
				const comicCatList = proxy.$readData(datas.catlistStroage);
				if(comicCatList){
					datas.catlist = comicCatList;
				}else{
					proxy.axios.get('/core/?source=comic&types=CatList').then((response) => {
						if(response.data){
							proxy.$saveData(datas.catlistStroage,response.data);
							datas.catlist = response.data;
						}
					})
				}
			}
			
			return {
				datas
			}
		}
	});
</script>