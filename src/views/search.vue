<template>
	<Header :swiper = "false" positions = "initial" />
	<div class="pusher">
	<SearchPage :search-Data = "datas.searchData" :isLoading="datas.isLoading" :isnull = "datas.isNull"/>
	<Footer />
	</div>
</template>

<script>
import Header from '@/components/Header.vue'
import SearchPage from '@/components/SearchPage.vue'
import Footer from '@/components/Footer.vue'
import { defineComponent , getCurrentInstance , onMounted , reactive} from 'vue'
export default defineComponent({
	name: 'search',
	components: {
		Header,
		SearchPage,
		Footer,
	},
	setup() {
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			searchData : [], 
			isLoading : '',
			isNull :false,
		});
		onMounted(()=>{
			getData(proxy.$route.query.kw);
		});
		const getData = (kw) => {
			datas.isLoading = true;
			proxy.axios.get('/core/?source=search&types=s&key='+kw).then((response) => {
				if(response.data.length > 0){
					datas.searchData = response.data;
					datas.isNull = false;
				}else{
					datas.isNull = true;
				}
				datas.isLoading = false;
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
</style>