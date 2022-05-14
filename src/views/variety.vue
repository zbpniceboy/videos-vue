<template>
	<Header :swiper = "false"/>
	<div class="pusher">
	<VarietyPage :varietydata = "datas.varietypage" :isnull="datas.isNull" :loading="datas.isLoading" />
	<Footer />
	</div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import VarietyPage from '@/components/VarietyPage.vue'
import Footer from '@/components/Footer.vue'
import { defineComponent , getCurrentInstance , onMounted , reactive} from 'vue'
export default defineComponent({
	name: 'variety',
	components: {
		Header,
		VarietyPage,
		Footer,
	},
	setup() {
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			varietypage : [], 
			isNull:false,
			isLoading:true
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
					datas.varietypage = response.data;
					datas.isNull = false;
					datas.isLoading = false;
				}
			})
		}
		return {
			datas,
			getData
		}
	},
})
</script>

<style>
div{
	position: initial;
}
</style>