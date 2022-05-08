<template>
<div class="videosPage">
	<el-container direction="vertical">
		<Header :swiper = "false" positions = "initial" />
		<MoviePage :moviedata = "datas.moviepage" :catlist="datas.catlist" :isnull="datas.isNull" :loading="datas.isLoading"/>
		<Footer />
	</el-container>
</div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import MoviePage from '@/components/MoviePage.vue'
import Footer from '@/components/Footer.vue'
import { defineComponent , getCurrentInstance , onMounted , reactive} from 'vue'
export default defineComponent({
	name: 'movie',
	components: {
		Header,
		MoviePage,
		Footer,
	},
	setup() {
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			moviepage : [], 
			catlist:[],
			isNull:false,
			isLoading:true,
		});
		onMounted(()=>{
			if(JSON.stringify(proxy.$route.query) == "{}"){
				getData();
			}
			getCatData();
		});
		const getCatData = () => {
			const movieCatList = proxy.$readData('movieCatList');
			if(movieCatList){
				datas.catlist = movieCatList;
			}else{
				proxy.axios.get('/core/?source=movie&types=CatList').then((response) => {
					if(response.data){
						proxy.$saveData('movieCatList',response.data);
						datas.catlist = response.data;
					}
				})
			}
		}
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
			proxy.axios.get('/core/?source=movie'+str).then((response) => {
				if(response.data.Movielist === null){
					datas.isNull = true;
				}else{
					datas.moviepage = response.data;
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