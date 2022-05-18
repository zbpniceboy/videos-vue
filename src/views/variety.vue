<template>
	<Header :swiper = "false"/>
	<div class="pusher">
	<Slotmainlist :slotdata="datas.varietydata.Varietylist" :isnull="datas.isNull" :loading ="datas.isLoading">
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
	<Footer />
	</div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Slotmainlist from '@/components/Slotmainlist.vue'
import Footer from '@/components/Footer.vue'
import { defineComponent , getCurrentInstance , onMounted , reactive,computed,watchEffect} from 'vue'
export default defineComponent({
	name: 'variety',
	components: {
		Header,
		Slotmainlist,
		Footer,
	},
	setup() {
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			varietydata : [], 
			isNull:false,
			isLoading:true,
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
		onMounted(()=>{
			if(JSON.stringify(proxy.$route.query) == "{}"){
				getData();
			}
		});
		const getData = (d) => {
			let str = '';
			if(d){
				if(d.rank != undefined) {
					d.page = (d.page == undefined) ? 1 : d.page
					str = '&rank='+d.rank+'&cat='+d.cat+'&area='+d.area+'&act='+d.act+'&page='+d.page
				}else{
					str = '&page='+d.page
				}
				
			}
			proxy.axios.get('/core/?source=variety'+str).then((response) => {
				if(response.data.Varietylist == null){
					datas.isNull = true;
				}else{
					datas.varietydata = response.data;
					datas.isNull = false;
					datas.isLoading = false;
				}
			})
		}
		
		const compute = computed(() => {
			var pagebar = '';
			if(datas.varietydata.length != 0){
				pagebar = Math.ceil(datas.varietydata.Varietylist['total'] / datas.varietydata.Varietylist['curlist'])  * 10 || '200';
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
					getData(useRouter);
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
	},
})
</script>