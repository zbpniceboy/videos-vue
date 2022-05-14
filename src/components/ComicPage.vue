<template>
	<Slotmainlist :slotdata="comicdata.Comiclist" :isnull="isnull" :loading ="loading">
		<template #catlistType = "cList">
			<template v-for="item in cList.cList.type" :key="item">
			<ul :id="item.name">
				<li class="label">{{item.label}}</li>
				<template v-for="items in item.data" :key="'A'+items">
				<router-link :to="{
					name: 'comic', 
					query:{
						rank:[item.name == 'rank' ? items.id : datas.rank],
						cat:[item.name == 'cat' ? items.id : datas.cat],
						area:[item.name == 'area' ? items.id : datas.area],
						year:[item.name == 'year' ? items.id : datas.year],
					}
				}">
				<li :class="[ datas.types[item.name] == items.id ? 'act' : '' ]" @click="addcur(item.name,items.id)">{{items.title}}</li>
				</router-link>
				</template>
			</ul>
			</template>
		</template>
	</Slotmainlist>
	
	<el-pagination v-if="comicdata.Comiclist && !isnull"
		background 
		:pager-count="5"
		:current-page="datas.curpage"
		layout="prev, pager, next" 
		:total="compute.pagebar"
		@current-change="curSizeChange">
	</el-pagination>
</template>

<script>
import Slotmainlist from './Slotmainlist/Slotmainlist.vue'
import { defineComponent , getCurrentInstance ,watchEffect, reactive,computed} from 'vue'
export default defineComponent({
	name: 'ComicPage',
	components:{
		Slotmainlist
	},
	props: {
		comicdata: Object,
		catlist:Object,
		isnull:Boolean,
		loading:Boolean
	},
	setup(props){
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			rank : '',
			cat:'',
			area: '',
			year: '',
			curpage : Number,
			types: {
				rank:'rankhot',
				cat:'',
				area:'',
				year:'',
			},
			
		});
		
		const compute = computed(() => {
			var pagebar = '';
			if(props.comicdata.length != 0){
				pagebar = Math.ceil(props.comicdata.Comiclist['total'] / props.comicdata.Comiclist['curlist'])  * 10 || '200';
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
				datas.year = useRouter.year || '';
				datas.curpage =+ useRouter.page || 1;
				if(JSON.stringify(useRouter) != "{}" && proxy.$route.name == 'comic'){
					datas.types = {
						rank:datas.rank,
						cat:datas.cat,
						area:datas.area,
						year:datas.year,
					}
					proxy.$parent.getData(useRouter);
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
						year:datas.year,
						page:val
					}
				});
			}else{
				proxy.$router.push({query: {page:val}})
			}
			window.scrollTo({
				top:0,
				behavior:'smooth'
			});
		})
		const addcur = ((name,val)=>{
			datas.types[name] = val;
		})
		return { datas ,curSizeChange,compute ,addcur}
	}
})
</script>

<style scoped>
	
</style>
