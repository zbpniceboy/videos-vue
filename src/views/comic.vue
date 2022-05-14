<template>
	<Header :swiper = "false"/>
	<div class="pusher">
	<ComicPage :comicdata = "datas.comicpage"  :isnull="datas.isNull" :loading="datas.isLoading"/>
	<Footer />
	</div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import ComicPage from '@/components/ComicPage.vue'
import Footer from '@/components/Footer.vue'
import { defineComponent , getCurrentInstance , onMounted , reactive} from 'vue'
export default defineComponent({
	name: 'comic',
	components: {
		Header,
		ComicPage,
		Footer,
	},
	setup() {
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			comicpage : [], 
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
					str = '&rank='+d.rank+'&cat='+d.cat+'&area='+d.area+'&year='+d.year+'&page='+d.page
				}else{
					str = '&page='+d.page
				}
				
			}
			proxy.axios.get('/core/?source=comic'+str).then((response) => {
				if(response.data.Comiclist == null){
					datas.isNull = true;
				}else{
					datas.comicpage = response.data;
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