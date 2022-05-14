<template>
	<Slotmainlist :slotdata="varietydata.Varietylist" :isnull="isnull" :loading ="loading">
		<template #catlistType = "cList">
			<template v-for="item in cList.cList.type" :key="item">
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
		</template>
	</Slotmainlist>
	
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
import Slotmainlist from './Slotmainlist/Slotmainlist.vue'
import { defineComponent , getCurrentInstance ,watchEffect, reactive,computed} from 'vue'
export default defineComponent({
	name: 'VarietyPage',
	components:{
		Slotmainlist
	},
	props: {
		varietydata: Object,
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
						act:datas.act,
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
		return { datas, curSizeChange,compute,addcur}
	}
})
</script>

<style scoped>
	
</style>
