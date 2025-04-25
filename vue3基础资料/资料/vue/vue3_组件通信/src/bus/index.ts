//引入mitt插件:mitt一个方法,方法执行会返回bus对象
// 最主要的方法有两个on和emit,on用来监听事件（接收事件）,emit用来触发事件(发送事件)

import mitt from 'mitt';
const $bus = mitt();
export default $bus;
