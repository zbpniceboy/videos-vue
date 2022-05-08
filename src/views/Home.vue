<template>
  <div class="videosPage">
	<el-container direction="vertical">
		<Header :swiper = "datas.swiper" />
		<IndexPage :indexData="datas"/>
		<Footer />
	</el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import IndexPage from '@/components/IndexPage.vue'
import Footer from '@/components/Footer.vue'
import { defineComponent , getCurrentInstance , onMounted , reactive} from 'vue'
export default defineComponent({
	name: 'Home',
	components: {
		Header,
		IndexPage,
		Footer,
	},
	setup() {
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			swiper : [], 
			hotTv : [],
			VarietyShow : [],
			hotMovie : [],
			comiCity : [],
			VarietyRank:[],
			comicRank:[],
			movieRank:[],
			tvRank:[]
		});
		onMounted(()=>{
			getData();
		});
		const getData = () => {
			const hompage = proxy.$readData('homePage');
			const hompageRank = proxy.$readData('homepageRank');
			
			if(hompageRank != null){
				datas.comicRank = hompageRank['comicRank'];
				datas.tvRank = hompageRank['newPlayRank'];
				datas.VarietyRank = hompageRank['VarietyRank'];
				datas.movieRank = hompageRank['movieRank'];
			}else{
				proxy.axios.get('/core/?source=indexRank').then((response) => {
					if(response.data){
						datas.comicRank = response.data['comicRank'];
						datas.tvRank = response.data['newPlayRank'];
						datas.VarietyRank = response.data['VarietyRank'];
						datas.movieRank = response.data['movieRank'];
						proxy.$saveData('homepageRank',response.data);
					}
				})
			}
	
			if(hompage != null){

				datas.swiper = hompage['swiper'];
				datas.hotTv = hompage['newPlay'];
				datas.VarietyShow = hompage['VarietyShow'];
				datas.hotMovie = hompage['hotMovie'];
				datas.comiCity = hompage['comicCity'];
			}else{
				proxy.axios.get('/core/').then((response) => {
					if(response.data){
						datas.swiper = response.data['swiper'];
						datas.hotTv = response.data['newPlay'];
						datas.VarietyShow = response.data['VarietyShow'];
						datas.hotMovie = response.data['hotMovie'];
						datas.comiCity = response.data['comicCity'];
						proxy.$saveData('homePage',response.data);
					}
				})
			}
			
			
		}
		return {
			datas
		}
	},
})
</script>

<style>

</style>