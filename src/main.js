import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from '../node_modules/axios'
import VueAxios from '../node_modules/vue-axios'
import ElementPlus from '../node_modules/element-plus'
import * as ELIcons from '../node_modules/@element-plus/icons-vue'
import '../node_modules/element-plus/dist/index.css'
const app = createApp(App)

app.use(VueAxios, axios)
for(let iconName in ELIcons){
 app.component(iconName,ELIcons[iconName])
}
app.use(ElementPlus)

	/*
	 * 存储数据
	 * @key 键值
	 * @data 数据名字
	 */
	app.config.globalProperties.$saveData = function(key, data) { //存储数据
		key = 'Mw_' + key; //加个前缀，防止存储值冲突
		data = JSON.stringify(data);
		//IE7以下老古董不支持HTML5存储
		if (window.localStorage) {
			localStorage.setItem(key, data);
		} else {
			alert('您的浏览器版本太低或浏览器不支持本地存储！！！');
		}
	},
	
	/**
	 * 读取存储数据
	 * @key 键值
	 * @return 返回数据
	 */
	app.config.globalProperties.$readData = function(key) {
		if (!window.localStorage) return ''; //判断浏览器是否支持
		key = 'Mw_' + key;
		return JSON.parse(localStorage.getItem(key));
	},
	/**
	 * 清除指定存储数据
	 * @key 键值
	 * @return 返回数据
	 */
	app.config.globalProperties.$removeData = function(key) {
		if (!window.localStorage) return ''; //判断浏览器是否支持
		key = 'Mw_' + key;
		return localStorage.removeItem(key);
	}
app.use(router).mount('#app')
axios.defaults.baseURL = '/videos/'  //关键代码，这里填写你后端接口所在的文件夹名字，如：/videos/  接口.php