### 二次封装

- API的reqeust.js文件中

~~~js
import axios from 'axios'
const service = axios.create({
    baseUrl:'...',
    timeout: 30000 // 添加请求超时
})

service.interceptors.request.use(
	function (config){
	    // 发送请求前做什么
        // 判断不是登陆页面的时候把请求头传递过去
        if (config.url !== '/login'){
            config.header["Authorization"] = `Bearer ${localStorage.getItem('token')}`
        }
	    return config;
	},
    function (error){
        return Promise.reject(error);
    }
)

service.interceptors.response.use({
    // 对响应数据做点什么
    function (response){
        // token 过期或发生修改
        if (response.data.code === -1){
            // 清楚缓存记录
            localStorage.removeItem('token')
        }
        // 接口异常给用户提示
        if (response.data.code === -2){
            ElMessage.error(response.data.message)
        }
        
        if (response.data.code === 0){
            // 返回的时候做了统一处理，简化代码
            return response.data.data;
        }  else{
            // 具体响应需求
        }
    },
    function (error){
        return Promise.reject(error);
    }
   
})
export default service;
~~~

请求头部分参照

![](C:\Users\ttn\Desktop\vue笔记和资源\Data-and-source-code\vue3基础资料\资料\vue\images\Snipaste_2025-04-15_11-23-00.png)

- 在其他地方使用
  ~~~js
  import service from '../API/request.js'
  import {ref} from 'vue' 
  
  const tableData = ref([])
  const getTable = () => {
      service.get('url').then(res = > {
          // 由于做了处理，就不用.data
          tableData.value = res.content
      })
  } 
  ~~~

  

### 二次封装优化

- 改进后的request.js
  ~~~js
  // 多了一个方法,由于service是函数，最后都是用方法调用
  function request(option){
      // get传参是params，统一改成data,传了就直接用，没传就直接赋值成get
      option.method = option.method || 'get'
      // 传进来的get可能是Get或者是GET，统一改成小写
      if(option.method.toLowerCase() === 'get'){
          // 改变key值
          option.params = option.data
      }
      return service(option);
  }
  export default request;
  ~~~

  

- 对接口的统一管理，在API的api.js中
  ~~~js
  import request from './request.js'
  
  const getTable = () =>{
      return request({
          url:'',
          method:'get',
          data,
      })
  }
  ~~~

- 登录组件Login.vue中使用

  ~~~js
  import getTable from '../api/api.js'
  
  const loginForm = reactive({
      username:'',
      password:''
  })
  
  getTable(loginForm).then(res => {
      localStorage.setItem('token',res.token)
      router.push('/')
  })
  ~~~

  