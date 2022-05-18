<template>
	<Header :swiper = "false"/>
	<div class="pusher">
	<Slotmainlist :slotdata="datas.tvdata.tvlist" :isnull="datas.isNull" :loading ="datas.isLoading">
		<template #catlistType = "cList">
			<template v-for="item in cList.cList.type" :key="item">
			<ul :id="item.name">
				<li class="label">{{item.label}}</li>
				<template v-for="(items,i) in item.data" :key="items+i">
				<router-link :to="{ 
					name: 'tv', 
					query:{
						rank:[item.name == 'rank' ? items.id : datas.rank],
						cat:[item.name == 'cat' ? items.id : datas.cat],
						area:[item.name == 'area' ? items.id : datas.area],
						year:[item.name == 'year' ? items.id : datas.year],
						act:[item.name == 'act' ? items.id : datas.act],
					}
				}">
				<li :class="[ datas.types[item.name] == items.id ? 'act' : '' ]" @click="addcur(item.name,items.id)">{{items.title}}</li>
				</router-link>
				<template v-for="(ite,index) in cList.cList.area" :key="'A'+index" >
					<template v-for="(val,s) in ite" :key="val+s">
						<router-link :to="{
							name: 'tv', 
							query:{
								rank:[item.name == 'rank' ? val : datas.rank],
								cat:[item.name == 'cat' ? val : datas.cat],
								area:[item.name == 'area' ? val : datas.area],
								year:[item.name == 'year' ? val : datas.year],
								act:[item.name == 'act' ? val : datas.act],
							}
						}" v-if="datas.area == index && item.name == 'act' ">
						<li :class="[ datas.types[item.name] == val ? 'act' : '' ]" @click="addcur(item.name,val)">{{val}}</li>
						</router-link>
						<template v-else></template>
					</template>
				</template>
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
	name: 'tv',
	components: {
		Header,
		Slotmainlist,
		Footer,
	},
	setup() {
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			tvdata : [], 
			isNull:false,
			isLoading:true,
			rank : '',
			cat: '',
			area:'',
			year:'',
			act:'',
			curpage : Number,
			types: {
				rank:'rankhot',
				cat:'',
				area:'',
				year:'',
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
					str = '&rank='+d.rank+'&cat='+d.cat+'&area='+d.area+'&year='+d.year+'&act='+d.act+'&page='+d.page
				}else{
					str = '&page='+d.page
				}
				
			}
			proxy.axios.get('/core/?source=tv'+str).then((response) => {
				if(response.data.tvlist == null){
					datas.isNull = true;
				}else{
					datas.tvdata = response.data;
					datas.isNull = false;
					datas.isLoading = false;
				}
			})
		}
		
		
		const compute = computed(() => {
			var pagebar = '';
			if(datas.tvdata.length != 0){
				pagebar = Math.ceil(datas.tvdata.tvlist['total'] / datas.tvdata.tvlist['curlist'])  * 10 || '200';
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
				datas.act = useRouter.act || '';
				datas.curpage =+ useRouter.page || 1;
				if(JSON.stringify(useRouter) != "{}" && proxy.$route.name == 'tv'){
					datas.types = {
						rank:datas.rank,
						cat:datas.cat,
						area:datas.area,
						year:datas.year,
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
						year:datas.year,
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
		return {
			datas , curSizeChange,compute,addcur
		}
	},
})
</script>