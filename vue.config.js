const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = {
	// publicPath: './videos/',
	// productionSourceMap: false,
	configureWebpack:{
		plugins: [
			AutoImport({
				resolvers: [ElementPlusResolver()],
			}),
			Components({
				resolvers: [ElementPlusResolver()],
			}),
		],
	},
	devServer: {
	// host: "localhost",
	// port: 8081, // 端口号
		https: false, // https:{type:Boolean}
		open: false, //配置自动启动浏览器
		proxy: {
			'/api': {
				target: 'http://localhost',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		},
	} 
};
