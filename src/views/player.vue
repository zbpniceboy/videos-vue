<template>
	<Header :swiper = "false" positions = "initial" />
	<div class="pusher">
	<Player :detail-Data = "datas.playerpage"/>
	<Footer />
	</div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Player from '@/components/Player.vue'
import Footer from '@/components/Footer.vue'
import { defineComponent , getCurrentInstance , onMounted , reactive,watch} from 'vue'
export default defineComponent({
	name: 'player',
	components: {
		Header,
		Player,
		Footer,
	},
	setup() {
		let { proxy } = getCurrentInstance();
		const datas = reactive({
			playerpage : [], 
		});
		onMounted(()=>{
			getData();
		});
		const getData = (site) => {
			let str = '';
			if(site){
				str = '&site=' + site;
			}
			proxy.axios.get('/core/?source=player&type='+proxy.$route.query.mtype+'&id='+proxy.$route.query.id + str).then((response) => {
				if(response.data){
					datas.playerpage = response.data;
				}
			})
		}
		
		watch(
			() => proxy.$route.query.id,
			() =>{
				getData();
			}
		)
		
		return {
			datas,
			getData
		}
	},
})
</script>
