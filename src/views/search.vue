<template>
	<el-container direction="vertical">
		<Header :swiper = "false" positions = "initial" />
		<Search :search-Data = "datas.searchData" :isLoading="datas.isLoading" :isnull = "datas.isNull"/>
		<Footer />
	</el-container>
</template>

<script>
import Header from '@/components/Header.vue'
import Search from '@/components/Search.vue'
import Footer from '@/components/Footer.vue'
import { defineComponent , getCurrentInstance , onMounted , reactive} from 'vue'
export default defineComponent({
	name: 'search',
	components: {
		Header,
		Search,
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