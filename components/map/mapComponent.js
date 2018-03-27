import React,{Component} from 'react'
class MapComponent extends Component{
	constructor(props){
		super(props)
		this.init = this.init.bind(this)
	}
	init(){
		var map = new BMap.Map("map");    // 创建Map实例
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
		//添加地图类型控件
		map.addControl(new BMap.MapTypeControl({
			mapTypes:[
	            BMAP_NORMAL_MAP,
	            BMAP_HYBRID_MAP
	        ]}));	  
		map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
		var navigationControl = new BMap.NavigationControl({
		  // 靠左上角位置
		  anchor: BMAP_ANCHOR_TOP_LEFT,
		  // LARGE类型
		  type: BMAP_NAVIGATION_CONTROL_LARGE,
		  // 启用显示定位
		  enableGeolocation: true
		});
		map.addControl(navigationControl);
		var geolocationControl = new BMap.GeolocationControl();
		  geolocationControl.addEventListener("locationSuccess", function(e){
		    // 定位成功事件
		    var address = '';
		    address += e.addressComponent.province;
		    address += e.addressComponent.city;
		    address += e.addressComponent.district;
		    address += e.addressComponent.street;
		    address += e.addressComponent.streetNumber;
		    alert("当前定位地址为：" + address);
		  });
		  geolocationControl.addEventListener("locationError",function(e){
		    // 定位失败事件
		    alert(e.message);
		  });
		  map.addControl(geolocationControl);
		var size = new BMap.Size(10, 20);
		map.addControl(new BMap.CityListControl({
		    anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		    offset: size,
		    // 切换城市之间事件
		    // onChangeBefore: function(){
		    //    alert('before');
		    // },
		    // 切换城市之后事件
		    // onChangeAfter:function(){
		    //   alert('after');
		    // }
		}));
		var addMarkerByData = (data) => {//根据数据添加地图标注

		}
		addMarkerByData()
	}
	addMarker(){}
	deleteMarker(){}
	clickMarker(){}
	moveMarker(){}
	componentDidMount(){
		this.init()
	}
	render(){
		return (
			<div id='map' style={{height:'100%',...this.props.style}}>
			</div>
			)
	}
}
MapComponent.defaultProps = {
	style:{},//地图样式
	CityListControl:false,//城市列表
	GeolocationControl:true,//定位控件
	NavigationControl:true,//带有定位的导航控件
	MapTypeControl:true,//地图类型控件
}
export default MapComponent