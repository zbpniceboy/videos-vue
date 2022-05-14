<template>
  <el-main class="pageWidth">
	<el-container class="container tvshow" id="tvshow">
		<el-main class="main-box">
			<div class="header-main"><h2>热播新剧</h2></div>
			<el-row :gutter="10" class="row-single-left">
			<template v-for="(item,index) in indexData.hotTv" :key="item">
				<el-col :span="12"  v-if="index == 0" >
					<router-link :to="{ name: 'player', query:{mtype:'tv',id:item.id}}" >
					<div class="grid-content bg-purple">
					<el-card :body-style="{ padding: '0px'}" shadow="hover">
						<div class="img-box">
							<el-image fit="cover" :lazy="true" :src="item.pic" :style="{height:'286.94px'}">
								<template #placeholder>
									<div class="image-slot">
										<el-icon><Picture /></el-icon>
										<div>Loading...</div>
									</div>
								</template>
								<template #error>
									<div class="image-slot">
										<el-icon><Picture /></el-icon>
										<div>糟糕，图片加载失败</div>
									</div>
								</template>
							</el-image>
							<span>更新至第{{ item.upinfo }}集</span>
						</div>
						<div class="card-text-box">
							<div class="card-title"><h2>{{item.title}}</h2></div>
							<div class="card-desc">{{item.comment}}</div>
						</div>
					</el-card>
					</div>
					</router-link>
				</el-col>
				<template v-else></template>
				</template>
				<el-col :span="12" :style="{ padding: '0px'}" class="row-single-right">
				<template v-for="(item,index) in indexData.hotTv" :key="item">
					<el-col :span="12"  v-if="index > 0 && index < indexData.hotTv.length-1">
					<router-link :to="{ name: 'player', query:{mtype:'tv',id:item.id}}" >
						<div class="grid-content bg-purple">
							<el-card :body-style="{ padding: '0px'}" shadow="hover">
							<div class="img-box">
								<el-image fit="cover" :lazy="true" :src="item.pic">
									<template #placeholder>
										<div class="image-slot">
											<el-icon><Picture /></el-icon>
											<div>Loading...</div>
										</div>
									</template>
									<template #error>
										<div class="image-slot">
											<el-icon><Picture /></el-icon>
											<div>糟糕，图片加载失败</div>
										</div>
									</template>
								</el-image>
								<span>更新至第{{ item.upinfo }}集</span>
							</div>
							<div class="card-text-box">
								<div class="card-title"><h2>{{item.title}}</h2></div>
								<div class="card-desc">{{item.comment}}</div>
							</div>
							</el-card>
						</div>
					</router-link>
					</el-col>
				</template>
				</el-col>
			</el-row>
		</el-main>
		<el-aside width="23%" :style="{padding:'20px 20px 20px 0'}">
			<div class="header-main"><h2>电视剧排行榜</h2></div>
			<ul>
				<template v-for="(item,index) in indexData.tvRank" :key="item">
					<router-link :to="{ name: 'player', query:{mtype:'tv',id:item.id}}" >
					<li v-if="index < 8"><span :class="[index < 3 ? 'top'+index : '']">{{index+1}}</span>{{item.title}}</li>
					</router-link>
				</template>
			</ul>
		</el-aside>
	</el-container>
	
	<el-container class="container variety">
		<el-main class="main-box">
			<div class="header-main"><h2>百变综艺</h2></div>
			<el-row :gutter="10" class="row-single-left">
			<template v-for="(item,index) in indexData.VarietyShow" :key="item">
				<el-col :span="12"  v-if="index == 0" >
					<router-link :to="{ name: 'player', query:{mtype:'v',id:item.id}}" >
					<div class="grid-content bg-purple">
					<el-card :body-style="{ padding: '0px'}" shadow="hover">
						<div class="img-box">
							<el-image :lazy="true" :src="item.pic"  :style="{height:'286.94px'}">
								<template #placeholder>
									<div class="image-slot">
										<el-icon><Picture /></el-icon>
										<div>Loading...</div>
									</div>
								</template>
								<template #error>
									<div class="image-slot">
										<el-icon><Picture /></el-icon>
										<div>糟糕，图片加载失败</div>
									</div>
								</template>
							</el-image>
							<span>{{ item.dateTime }}期</span>
						</div>
						<div class="card-text-box">
							<div class="card-title"><h2>{{item.title}}</h2></div>
							<div class="card-desc">{{item.comment}}</div>
						</div>
					</el-card>
					</div>
					</router-link>
				</el-col>
				</template>
				<el-col :span="12" :style="{ padding: '0px'}" class="row-single-right">
				<template v-for="(item,index) in indexData.VarietyShow" :key="item">
					<el-col :span="12"  v-if="index > 0 && index < 5">
					<router-link :to="{ name: 'player', query:{mtype:'v',id:item.id}}" >
						<div class="grid-content bg-purple">
							<el-card :body-style="{ padding: '0px'}" shadow="hover">
							<div class="img-box">
								<el-image :lazy="true" :src="item.pic">
									<template #placeholder>
										<div class="image-slot">
											<el-icon><Picture /></el-icon>
											<div>Loading...</div>
										</div>
									</template>
									<template #error>
										<div class="image-slot">
											<el-icon><Picture /></el-icon>
											<div>糟糕，图片加载失败</div>
										</div>
									</template>
								</el-image>
								<span>{{ item.dateTime }}期</span>
							</div>
							<div class="card-text-box">
								<div class="card-title"><h2>{{item.title}}</h2></div>
								<div class="card-desc">{{item.comment}}</div>
							</div>
							</el-card>
						</div>
					</router-link>
					</el-col>
				</template>
				</el-col>
			</el-row>
		</el-main>
		<el-aside width="23%" :style="{padding:'20px 20px 20px 0'}">
			<div class="header-main"><h2>综艺排行榜</h2></div>
			<ul>
				<template v-for="(item,index) in indexData.VarietyRank" :key="item">
					<router-link :to="{ name: 'player', query:{mtype:'v',id:item.id}}" >
					<li v-if="index < 8"><span :class="[index < 3 ? 'top'+index : '']">{{index+1}}</span>{{item.title}}</li>
					</router-link>
				</template>
			</ul>
		</el-aside>
	</el-container>
	
	<el-container class="container movie">
		<el-main class="main-box" id="main-box">
			<div class="header-main"><h2>热门电影</h2></div>
			<el-row :gutter="10">
				<template v-for="(item , index) in indexData.hotMovie" :key="item">
				<el-col :span="6" v-if="index < 8">
					<router-link :to="{ name: 'player', query:{mtype:'m',id:item.id}}" >
					<div class="grid-content bg-purple">
					<el-card :body-style="{ padding: '0px'}" shadow="hover">
						<el-image fit="cover" :lazy="true" :src="item.pic">
							<template #placeholder>
								<div class="image-slot">
									<el-icon><Picture /></el-icon>
									<div>Loading...</div>
								</div>
							</template>
							<template #error>
								<div class="image-slot">
									<el-icon><Picture /></el-icon>
									<div>糟糕，图片加载失败</div>
								</div>
							</template>
						</el-image>
						<div class="card-text-box">
							<div class="card-title"><h2>{{item.title}}</h2></div>
							<div class="card-desc">{{item.comment}}</div>
						</div>
					</el-card>
					</div>
					</router-link>
				</el-col>
				</template>
			</el-row>
		</el-main>
		<el-aside width="23%" :style="{padding:'20px 20px 20px 0'}">
			<div class="header-main"><h2>电影排行榜</h2></div>
			<ul>
				<template v-for="(item,index) in indexData.movieRank" :key="item">
					<router-link :to="{ name: 'player', query:{mtype:'m',id:item.id}}" >
					<li>
						<span :class="[index < 3 ? 'movietop'+index : '']">{{index+1}}</span>
						<div class="movie-aside-title"><h2>{{item.title}}</h2><i>{{item.comment}}</i></div>
					</li>
					</router-link>
				</template>
			</ul>
		</el-aside>
	</el-container>
	
	<el-container class="container comic">
		<el-main class="main-box" id="main-box">
			<div class="header-main"><h2>动漫世界</h2></div>
			<el-row :gutter="10">
				<template v-for="(item,index) in indexData.comiCity" :key="item">
				<el-col :span="6" v-if="index < 8">
					<router-link :to="{ name: 'player', query:{mtype:'c',id:item.id}}" >
					<div class="grid-content bg-purple">
					<el-card :body-style="{ padding: '0px'}" shadow="hover">
						<div class="img-box">
							<el-image fit="cover" :lazy="true" :src="item.pic">
								<template #placeholder>
									<div class="image-slot">
										<el-icon><Picture /></el-icon>
										<div>Loading...</div>
									</div>
								</template>
								<template #error>
									<div class="image-slot">
										<el-icon><Picture /></el-icon>
										<div>糟糕，图片加载失败</div>
									</div>
								</template>
							</el-image>
							<span v-if="item.total == item.upinfo">全{{ item.total }}集</span>
							<span v-else>更新至第{{ item.upinfo }}集</span>
						</div>
						<div class="card-text-box">
							<div class="card-title"><h2>{{item.title}}</h2></div>
							<div class="card-desc">{{item.comment}}</div>
						</div>
					</el-card>
					</div>
					</router-link>
				</el-col>
				</template>
			</el-row>
		</el-main>
		<el-aside width="23%" :style="{padding:'20px 20px 20px 0'}">
			<div class="header-main"><h2>动漫排行榜</h2></div>
			<ul>
				<template v-for="(item,index) in indexData.comicRank" :key="item">
					<router-link :to="{ name: 'player', query:{mtype:'c',id:item.id}}" >
					<li v-if="index < 8"><span :class="[index < 3 ? 'top'+index : '']">{{index+1}}</span>{{item.title}}</li>
					</router-link>
				</template>
			</ul>
		</el-aside>
	</el-container>
	
  </el-main>
</template>

<script>
import { defineComponent , reactive} from 'vue'
export default defineComponent({
	name: 'IndexPage',
	props: {
		indexData: Object
	},
	setup() {
		const datas = reactive({});

		
		return {
			datas,
		}
	}
})
</script>

<style scoped>
	
.image-slot {
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		width: 100%;
		height: 100%;
		background: #eae5e5;
		color: var(--el-text-color-secondary);
		flex-wrap: wrap;
	}
	.image-slot .el-icon {
		font-size: 5rem;
		flex: 0 0 100%;
	}
	.image-slot span{
		font-size: 0.9rem;
		display: inline-block;
		margin-top: 10px;
	}
.container{
	font-size: .8rem;
	text-align: left;
	overflow: hidden;
}
.main-box{
	overflow: hidden;
	height: 100%;
	/* max-height: 469px; */
}
.header-main{
	padding: 0 0 20px 0;
	font-size: 1.1rem;
}

.row-single-right .el-col,.movie .el-col,.comic .el-col{
	width: 100%;
	padding-bottom: 11px;
}
.card-text-box{
	padding: 6px 10px 6px 10px;
	overflow: hidden;
}
.card-text-box .card-title h2{
	font-size: 1rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.card-text-box .card-desc{
	margin-top: 5px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color:#a7a3a3;
}
.el-card{
	border:none;
}
.img-box{position: relative;}
.img-box span{
	position: absolute;
	bottom: 0px;
	padding: 3px 5px 3px 0px;
	text-align: right;
	right: 0;
	left: 0;
	color: #fff;
	display: block;
	background: rgba(0,0,0,0.4);
	font-size: 0.6rem;
}
.el-image{border-radius: 5px;display: block;}

.tvshow ,.variety{
	height:427px;
}


.tvshow .row-single-right .el-image,.variety .row-single-right .el-image{
	width: 100%;
	height: 111px;
}

.movie .el-image{
	height: 304px;
	overflow: hidden;
}
.comic .el-image{
	height: 112px;
	overflow: hidden;
}
.el-aside{overflow: hidden;}
.el-aside ul{
	margin-top: -12px;
}
.movie .el-aside li{
	line-height: unset;
	height: 50px;
	padding: 15px 0 10px 0;
	display: flex;
	flex: 1;
}
.movie .el-aside li span{
	font-weight: 700;
	font-size: 1.4rem;
	position: relative;
	top: 10px;
	width: 25px;
	height: 25px;
}
.el-aside .movie-aside-title{
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.el-aside .movie-aside-title h2{
	font-weight: 700;
	font-size: .9rem;
	overflow: hidden;
}
.el-aside .movie-aside-title i{
	font-style: normal;
	font-weight: 400;
	color: #a7a3a3;
	overflow: hidden;
}
.el-aside li{
	height: 45px;
	line-height: 45px;
	font-size: .9rem;
	border-bottom: 1px dashed var(--el-border-color-base);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.el-aside li:last-child{
	border-bottom:none;
}
.el-aside li span{
	width: 20px;
	height: 20px;
	display: inline-block;
	text-align: center;
	margin-right: 10px;
	line-height: 20px;
	background-color: transparent;
	border-radius: 3px;
}
.el-aside li span.top0{
	background-color: #D48A1B;
}
.el-aside li span.top1{
	background-color: #0D84FF;
}
.el-aside li span.top2{
	background-color: #42B983;
}
.el-aside li span.movietop0{
	color: #D48A1B;
}
.el-aside li span.movietop1{
	color: #0D84FF;
}
.el-aside li span.movietop2{
	color: #42B983;
}
</style>
