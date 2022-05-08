<template>
	<el-main class="pageWidth">
		<el-skeleton animated :loading="loading">
			<template #template>
				<div class="tvpage-type">
					<div class="type-skeleton" v-for="(it,ind) in datas.skeletonType" :key="it">
						<el-skeleton-item :style="[ind == 0 ? 'width:30%;flex:0 0 auto!important;' : ind == datas.skeletonType -1 ? 'width:60%;flex:0 0 auto!important;' : '']" />
					</div>
				</div>
				<div class="main-list">
					<el-row :gutter="10">
						<el-col :span="5" v-for="item in datas.skeletonCount" :key="item">
							<div class="grid-content bg-purple">
							<el-card :body-style="{ padding: '0px'}" shadow="hover">
								<el-skeleton-item variant="image" style="width: 240px; height: 240px" />
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
			<template v-for="item in catlist.type" :key="item">
			<ul :id="item.name">
				<li class="label">{{item.label}}</li>
				<template v-for="items in item.data" :key="'A'+items">
				<router-link :to="{
					name: 'variety', 
					query:{
						rank:[item.name == 'rank' ? items.id : datas.rank],
						cat:[item.name == 'cat' ? items.id : datas.cat],
						area:[item.name == 'area' ? items.id : datas.area],
						act:[item.name == 'act' ? items.id : datas.act],
					}
				}">
				<li :class="[ datas.types[item.name] == items.id ? 'act' : '' ]" @click="addcur(item.name,items.id)">{{items.title}}</li>
				</router-link>
				</template>
			</ul>
			</template>
		</div>
		<div class="main-list">
		<el-row :gutter="10" v-if="varietydata.Varietylist && !isnull">
			<template v-for="(list,index) in varietydata.Varietylist" :key="list+index">
			<el-col :span="5"  v-if="!isNaN(index)">
				<router-link :to="{ name: 'player', query:{mtype:'v',id:list.id}}" >
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
	
	<el-pagination v-if="varietydata.Varietylist && !isnull"
		background 
		:current-page="datas.curpage"
		:pager-count="5"
		layout="prev, pager, next" 
		:total="compute.pagebar"
		@current-change="curSizeChange">
	</el-pagination>
</template>

<script>
import { defineComponent , getCurrentInstance ,watchEffect, reactive,computed} from 'vue'
export default defineComponent({
	name: 'MoviePage',
	props: {
		varietydata: Object,
		catlist: Object,
		isnull:Boolean,
		loading:Boolean
	},
	setup(props){
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			rank : '',
			cat: '',
			area:'',
			act: '',
			curpage:Number,
			types: {
				rank:'rankhot',
				cat:'',
				area:'',
				act:'',
			},
			//骨架屏类别数
			skeletonType:5,
			//骨架屏图文列表数
			skeletonCount: 35,
		});
		
		const compute = computed(() => {
			var pagebar = '';
			if(props.varietydata.length != 0){
				pagebar = Math.ceil(props.varietydata.Varietylist['total'] / props.varietydata.Varietylist['curlist'])  * 10 || '200';
				if(pagebar > 200){
					pagebar = 200
				}
			}
			return {
				pagebar
			}
		});
		
		watchEffect(() => {
				const useRouter = proxy.$route.query;
				datas.rank = useRouter.rank || 'rankhot';
				datas.cat = useRouter.cat || '';
				datas.area = useRouter.area || '';
				datas.act = useRouter.act || '';
				datas.curpage =+ useRouter.page || 1;
				if(JSON.stringify(useRouter) != "{}" && proxy.$route.name == 'variety'){
					datas.types = {
						rank:datas.rank,
						cat:datas.cat,
						area:datas.area,
						act:datas.act,
					}
					proxy.$parent.$parent.getData(useRouter);
				}
		});
		
		const curSizeChange = ((val) => {
			const querys = proxy.$route.query;
			
			if(JSON.stringify(querys) != "{}" && querys.rank != undefined){
				proxy.$router.push({
					query:{
						rank:datas.rank,
						cat:datas.cat,
						area:datas.area,
						act:datas.act,
						page:val
					}
				});
			}else{
				proxy.$router.push({query: {page:val}})
			}
		})
		
		const addcur = ((name,val)=>{
			datas.types[name] = val;
		})
		return { datas, curSizeChange,compute,addcur}
	}
})
</script>

<style scoped>
	.image-slot {
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		width: 100%;
		height: 100%;
		background: #eae5e5;
		color: var(--el-text-color-secondary);
		flex-wrap: wrap;
	}
	.image-slot .el-icon {
		font-size: 5rem;
		flex: 0 0 100%;
	}
	.image-slot span{
		font-size: 0.9rem;
		display: inline-block;
		margin-top: 10px;
	}
	.tvpage-type{
		overflow: hidden;
		padding: 20px;
		background: white;
		border-radius: 5px;
	}
	.tvpage-type ul,.type-skeleton{
		list-style: none;
		display: flex;
		flex-wrap:wrap;
		font-size: 0.9rem;
	}
	.tvpage-type ul .label{
		font-weight: 600;
		padding-left: 0;
		padding-right: 14px;
		color: #444444;
	}
	.tvpage-type  ul li,.type-skeleton .el-skeleton__item{
		padding: 2px 10px;
		flex: 0 0 auto;
		height: 25px;
		line-height: 25px;
		color:#a7a3a3;
		margin: 4px;
	}
	.type-skeleton .el-skeleton__item{
		flex:1!important;
		margin: 10px 0;
	}
	.tvpage-type  ul li.act{
		background-color: coral;
		color: white;
		border-radius: 5px;
	}
	.main-list{
		margin-top: 30px;
	}
	.main-list .el-col{
		margin-bottom: 10px;
	}
	.main-list .el-col-5 {
		max-width: 20%;
		flex: 0 0 20%;
	}
	.main-list .el-image{
		width: 100%;
		height: 240px;
	}
	.main-list .card-text-box{
		overflow: hidden;
		text-align: left;
		padding: 5px 10px;
		font-size: 0.9rem;
	}
	.main-list .card-text-box .card-title h2{
		font-size: 1rem;
	}
	.main-list .card-text-box .card-desc{
		height: 20px;
		margin-top:5px;
		color: #a7a3a3;
		font-size: 0.8rem;
	}
	.main-list .card-text-box .card-title h2,.main-list .card-text-box .card-desc{
		width: auto;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
