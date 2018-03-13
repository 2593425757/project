import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import * as MAKEOBJ from './makeObjFunctions.js'
import {takeObjectAsElement,if_dragging,pickObjectAsMesh} from './dragObjFunctions.js'
class Scene extends React.Component{
	constructor(props){
		super(props)
		var _this = this
		var _scene = new THREE.Scene()//创建 场景和渲染器
		var renderer = new THREE.WebGLRenderer({antialias:true})
		renderer.setClearColor(_this.props.renderer_clearColor)
		var scene_i = 0
		while(window['scene_'+scene_i]){
			scene_i++
		}
		window['scene_'+scene_i] = new Object
		window['scene_'+scene_i].meshList = []
		window['scene_'+scene_i].lightList = []
		window['scene_'+scene_i].scenePlane = {
			plane_width:this.props.plane_width,
			plane_height:this.props.plane_height,
			plane_position:this.props.plane_position,
			plane_rotation:this.props.plane_rotation,
			plane_color:this.props.plane_color
		}
		this.state = {
			scene:_scene,
			renderer:renderer,
			scene_i:scene_i,
			dragElement:[],
			keyboardCtrl:{x:0,y:0,z:0,x_rotate:0,y_rotate:0,z_rotate:0},
			editMode:false,
			selectedVerticeData:{}
		}
		this.renderer_render = this.renderer_render.bind(this)
		this.zoomIn = this.zoomIn.bind(this)
		this.zoomOut = this.zoomOut.bind(this)
		this.setCamera = this.setCamera.bind(this)
		this.getMeshObject = this.getMeshObject.bind(this)
		this.getLightList = this.getLightList.bind(this)
	}
	getChildContext(){//设置上下文
		return {scene_i:this.state.scene_i.toString()}
	}
	getMeshObject(){//获取window里面的meshList
		return window['scene_'+this.state.scene_i].meshList
	}
	getLightList(){//获取window里面lightList
		return window['scene_'+this.state.scene_i].lightList
	}
	renderer_render(scene,camera){//更新state中的scene和camera，渲染器渲染
		this.setState({scene:scene,camera:camera},()=>{
			this.state.renderer.render(this.state.scene,this.state.camera)
		})
	}
	setCamera(camera,x,y,z,lookAt){
		camera.position.x = x
		camera.position.y = y
		camera.position.z = z
		if (lookAt) {
			camera.lookAt(lookAt)
		}else{
			camera.lookAt(this.state.scene.position)
		}
		return camera
	}
	zoomIn(scene,camera){
		var point1 = this.state.camera.position
		var radius = Math.sqrt(Math.pow(point1.x,2)+Math.pow(point1.y,2)+Math.pow(point1.z,2))
		var radius2 = radius-1
		var x2 = (radius2/radius)*point1.x
		var y2 = (radius2/radius)*point1.y
		var z2 = (radius2/radius)*point1.z
		camera=this.setCamera(camera,x2,y2,z2)
		// this.renderer_render(scene,camera)
	}
	zoomOut(scene,camera){
		var point1 = this.state.camera.position
		var radius = Math.sqrt(Math.pow(point1.x,2)+Math.pow(point1.y,2)+Math.pow(point1.z,2))
		var radius2 = radius+1
		var x2 = (radius2/radius)*point1.x
		var y2 = (radius2/radius)*point1.y
		var z2 = (radius2/radius)*point1.z
		camera=this.setCamera(camera,x2,y2,z2)
		// this.renderer_render(scene,camera)
	}
	componentWillMount(){
		
	}
	componentDidMount(){
		var _this = this
		var _scene = this.state.scene
		var _camera
		window.drag_flag = 0,window.temp_flag=0
		var controls
		// var render = function() {
	 //        _this.renderer_render(_scene,_camera)
	 //    }
	 //    var initControls = function() {//插件控制视角
	 //        controls = new THREE.TrackballControls( _camera );
	 //        //旋转速度
	 //        controls.rotateSpeed = 5;
	 //        //禁止旋转
	 //        // controls.noRotate = true
	 //        //变焦速度
	 //        controls.zoomSpeed = 3;
	 //        //平移速度
	 //        controls.panSpeed = 0.8;
	 //        //是否不变焦
	 //        controls.noZoom = false;
	 //        //是否不平移
	 //        controls.noPan = false;
	 //        //是否开启移动惯性
	 //        controls.staticMoving = false;
	 //        //动态阻尼系数 就是灵敏度
	 //        controls.dynamicDampingFactor = 0.3;
	 //        controls.addEventListener( 'change', render );
	 //    }
		// var animate = function() {
	 //        //更新控制器
	 //        controls.update();
	 //        _this.renderer_render(_scene,_camera)
	 //        requestAnimationFrame(animate);
	 //    }
		
		var init = function(){

			if (_this.props.size) {//设置渲染器的size，默认设置成填满父元素
				_this.state.renderer.setSize(_this.props.size[0],_this.props.size[1])
			}else{
				_this.state.renderer.setSize(_this.canvasDOM.clientWidth,_this.canvasDOM.clientHeight)
			}
			_this.canvasDOM.appendChild(_this.state.renderer.domElement)
			_this.canvasDOM.oncontextmenu = function(){
				　return false;
			}
			if (_this.props.camera) {//设置相机，默认设置成透视相机
				_camera = _this.props.camera
			}else{
				_camera = new THREE.PerspectiveCamera(75,_this.canvasDOM.clientWidth/_this.canvasDOM.clientHeight,0.1,1000)
			}
			if (_this.props.camera_position) {
				_camera=_this.setCamera(_camera,_this.props.camera_position.x,_this.props.camera_position.y,_this.props.camera_position.z,_this.props.camera_position.lookAt)
			}
			if (_this.props.plane_materialUrl) {
				var loader = new THREE.TextureLoader()
				loader.load(_this.props.plane_materialUrl,function(texture){
					var material = new THREE.MeshBasicMaterial()
					material.map = texture
					var plane = new THREE.Mesh(new THREE.PlaneGeometry(_this.props.plane_width,_this.props.plane_height),material)
					plane.position.set(_this.props.plane_position.x,_this.props.plane_position.y,_this.props.plane_position.z)
					plane.rotation.set(_this.props.plane_rotation.x,_this.props.plane_rotation.y,_this.props.plane_rotation.z)
					_this.setState({plane_uuid:plane.uuid})
					_scene.add(plane)
				})
			}else{
				var plane = new THREE.Mesh(new THREE.PlaneGeometry(_this.props.plane_width,_this.props.plane_height),new THREE.MeshBasicMaterial({color:_this.props.plane_color}))
				plane.position.set(_this.props.plane_position.x,_this.props.plane_position.y,_this.props.plane_position.z)
				plane.rotation.set(_this.props.plane_rotation.x,_this.props.plane_rotation.y,_this.props.plane_rotation.z)
				_this.setState({plane_uuid:plane.uuid})
				_scene.add(plane)
			}
			//启用插件控制视角
			// initControls()
			// animate()
			var mouseMove_listener_func = function(event){
				if (event.movementX!=0) {
					var point_camera_1 = _this.state.camera.position
					var vector = new THREE.Vector2(point_camera_1.x,point_camera_1.z)
					if (event.movementX<0) {
						vector.rotateAround(new THREE.Vector3(0,0,0),-Math.PI/120)
					}else{
						vector.rotateAround(new THREE.Vector3(0,0,0),Math.PI/120)
					}
					_camera=_this.setCamera(_camera,vector.x,point_camera_1.y,vector.y)
					// _this.renderer_render(_scene,_camera)

				}if (event.movementY!=0) {
					var point_camera_1 = _this.state.camera.position
					var radius = point_camera_1.length()
					var vector = new THREE.Vector2(point_camera_1.x,point_camera_1.z)
					var angle = point_camera_1.angleTo(new THREE.Vector3(point_camera_1.x,0,point_camera_1.z))
					if (point_camera_1.y<0) {
						angle = -angle
					}
					var bottomLine = radius*Math.cos(angle)
					if (event.movementY<0) {
						angle-=Math.PI/120
					}else{
						angle+=Math.PI/120
					}
					var bottomLine2 = radius*Math.cos(angle)
					vector.normalize().multiplyScalar(bottomLine2)
					var new_y = radius*Math.sin(angle)
					_camera=_this.setCamera(_camera,vector.x,new_y,vector.y)
					// _this.renderer_render(_scene,_camera)
				}
			}
			var getSelectedObject = function( event , i = 0 ) {
			  var vector = new THREE.Vector3();//三维坐标对象
			  vector.set(
			    ( (event.offsetX) / _this.canvasDOM.clientWidth ) * 2 - 1,
			    - ( (event.offsetY) / _this.canvasDOM.clientHeight ) * 2 + 1,
			    0.5 );
			  vector.unproject( _camera );
			  var raycaster = new THREE.Raycaster(_camera.position, vector.sub(_camera.position).normalize());
			  var intersects = raycaster.intersectObjects(_scene.children);
			  if (intersects.length > 0) {
			    var selected = intersects[i];//取第一个物体
			    // console.log("x坐标:"+selected.point.x);
			    // console.log("y坐标:"+selected.point.y);
			    // console.log("z坐标:"+selected.point.z);
			  }
			  return selected
			}
			var removeSelectedObject = function( selected ) {
				_scene.remove(selected.object)
				// _this.renderer_render(_scene,_camera)
			}
			var addDragObject = function(event){
				if (!window.dragObject) {
					return
				}
				var selected = getSelectedObject(event)
				if (!selected) {
					window.temp_flag = 1
					return
				}else{
					window.temp_flag = 0
				}
				var position = selected.point
				var ele = takeObjectAsElement(position)
				var _dragElement = _this.state.dragElement
				_dragElement.push(ele)
				_this.setState({dragElement:_dragElement},
								function(){
									var meshAry = _this.getMeshObject()
									var addObj = meshAry[meshAry.length-1]
									addObj.position.setX(addObj.position.x+_this.state.keyboardCtrl.x)
									addObj.position.setY(addObj.position.y+_this.state.keyboardCtrl.y)
									addObj.position.setZ(addObj.position.z+_this.state.keyboardCtrl.z)
									addObj.rotation.x=addObj.rotation.x+_this.state.keyboardCtrl.x_rotate
									addObj.rotation.y=addObj.rotation.y+_this.state.keyboardCtrl.y_rotate
									addObj.rotation.z=addObj.rotation.z+_this.state.keyboardCtrl.z_rotate
									_scene.add(addObj)
									window.drag_flag = 1
									// _this.renderer_render(_scene,_camera)
								})
			}
			var removeDragObject = function(event){
				if (window.temp_flag==1) {
					return
				}
				var meshAry = _this.getMeshObject()
				var obj = meshAry[meshAry.length-1]
				_scene.remove(obj)
				meshAry.pop()
				window['scene_'+_this.state.scene_i].meshList = meshAry
				var _dragElement = _this.state.dragElement
				_dragElement.pop()
				_this.setState({dragElement:_dragElement},function(){
					// _this.renderer_render(_scene,_camera)
				})
			}
			var mousemove_drag_func = function(event){
				if (window.drag_flag==0) {
					addDragObject(event)
				}else{
					removeDragObject(event)
					addDragObject(event)
				}
			}
			var moveObj_drag_func = function(param,plus){
				var meshAry = _this.getMeshObject()
				var obj = meshAry[meshAry.length-1]
				_scene.remove(obj)
				var keyboardCtrl = _this.state.keyboardCtrl
				keyboardCtrl[param]=keyboardCtrl[param]+plus
				_this.setState({keyboardCtrl:keyboardCtrl},function(){
					obj.position[param] += plus
					_scene.add(obj)
					// _this.renderer_render(_scene,_camera)
				})
			}
			var rotateObj_drag_func = function(param,plus){
				var meshAry = _this.getMeshObject()
				var obj = meshAry[meshAry.length-1]
				_scene.remove(obj)
				var keyboardCtrl = _this.state.keyboardCtrl
				keyboardCtrl[param+'_rotate']=keyboardCtrl[param+'_rotate']+plus
				_this.setState({keyboardCtrl:keyboardCtrl},function(){
					obj.rotation[param] += plus
					_scene.add(obj)
					// _this.renderer_render(_scene,_camera)
				})
			}
			var removeObj = function(){
				var LineSegments = _scene.children.filter((item)=>{
					if (item.geometry.type=='EdgesGeometry') {
						return true
					}
				})
				LineSegments.forEach((item)=>{
					var obj = _scene.children.find((_item)=>{
						if (_item.position.distanceTo(item.position)==0) {
							return _item
						}
					})
					_scene.remove(obj)
					_scene.remove(item)
				})
						
			}
			var keyboardCtrl = function(event){
				if (window.drag_flag==1) {
					if (event.key=='q') {moveObj_drag_func('x',1)}
					else if (event.key=='a') {moveObj_drag_func('x',-1)}
					else if (event.key=='w') {moveObj_drag_func('y',1)}
					else if (event.key=='s') {moveObj_drag_func('y',-1)}
					else if (event.key=='e') {moveObj_drag_func('z',1)}
					else if (event.key=='d') {moveObj_drag_func('z',-1)}
					else if (event.key=='r') {rotateObj_drag_func('x',Math.PI/36)}
					else if (event.key=='f') {rotateObj_drag_func('x',-Math.PI/36)}
					else if (event.key=='t') {rotateObj_drag_func('y',Math.PI/36)}
					else if (event.key=='g') {rotateObj_drag_func('y',-Math.PI/36)}
					else if (event.key=='y') {rotateObj_drag_func('z',Math.PI/36)}
					else if (event.key=='h') {rotateObj_drag_func('z',-Math.PI/36)}
				}
				// 编辑模式
				if (event.key=='`') {
					if (_this.state.editMode==false) {
						_this.setState({editMode:true})
					}else{
						_this.setState({editMode:false})
						_scene.children.forEach((item)=>{
							if (item.geometry.type=='EdgesGeometry') {
								_scene.remove(item)
							}
						})
						// _this.renderer_render(_scene,_camera)
					}
				}
				
				if (event.key=='1') {
					removeObj()
				}
				
			}
			var moveVertice = function(event){//改变物体的顶点
				var data = _this.state.selectedVerticeData
				
				if (data.selectedObject&&data.index) {
					var {selectedObject,index} = data
				}else{
					return
				}
				selectedObject.geometry.vertices[index].setX(selectedObject.geometry.vertices[index].x+1)
				selectedObject.geometry.verticesNeedUpdate = true
				_scene.children.forEach((item)=>{
					if (item.geometry.type=='EdgesGeometry') {
						_scene.remove(item)
					}
				})
				if (getSelectedObject(event)) {
					var selectedObject = getSelectedObject(event).object
					var geometry = selectedObject.geometry
					var edges = new THREE.EdgesGeometry( geometry )
					var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
					line.position.set(selectedObject.position.x,selectedObject.position.y,selectedObject.position.z)
					_scene.add(line)
					// _this.renderer_render(_scene,_camera)
				}
				// _this.renderer_render(_scene,_camera)
			}
			

			_this.canvasDOM.addEventListener('mousemove',mousemove_drag_func)//鼠标拖拽
			
			_this.canvasDOM.addEventListener('mousedown',function(event){//鼠标按键按下
				event.preventDefault()
				event.stopPropagation()
				if (_this.state.editMode==false&&event.button==0) {//非编辑模式下，转动视角，鼠标移动
					_this.canvasDOM.addEventListener('mousemove',mouseMove_listener_func)
				}else if (_this.state.editMode==true&&event.button==0) {
					var removeEdges = function(){//把所有的已添加的轮廓移除
						_scene.children.forEach((item)=>{
							if (item.geometry.type=='EdgesGeometry') {
								_scene.remove(item)
							}
						})
					}
					var addEdges = function(event){//添加轮廓线
						if (getSelectedObject(event)) {
							var selectedObject = getSelectedObject(event).object
							var geometry = selectedObject.geometry
							var edges = new THREE.EdgesGeometry( geometry )
							var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
							line.position.set(selectedObject.position.x,selectedObject.position.y,selectedObject.position.z)
							line.rotation.set(selectedObject.rotation._x,selectedObject.rotation._y,selectedObject.rotation._z)
							_scene.add(line)
							// _this.renderer_render(_scene,_camera)
						}
					}
					var getVertice = function(event){//获得顶点
						var selectedEvent = getSelectedObject(event)
						var i = 0
						while(selectedEvent.object.type=='LineSegments'){
							i++
							selectedEvent = getSelectedObject(event,i)
							if (!selectedEvent) {
								break
							}
						}
						if (selectedEvent) {
							if (selectedEvent.object.type=='Mesh') {
								var position = selectedEvent.object.position
								var _vertices = selectedEvent.object.geometry.vertices
								var vertices = _vertices.map((item)=>{
									var res = new THREE.Vector3(item.x+position.x,item.y+position.y,item.z+position.z)
									return res
								})
								var point = selectedEvent.point
								var distance = vertices.map((item)=>{
									return item.distanceTo(point)
								})
								var index = distance.indexOf(Math.min(...distance))
								return {index:index,vertices:vertices,selectedObject:selectedEvent.object}
							}
						}
					}
					// var data = getVertice(event)
					// _this.setState({selectedVerticeData:data})
					// _this.canvasDOM.addEventListener('mousemove',moveVertice)
					removeEdges()
					addEdges(event)
				}else if (_this.state.editMode==true&&event.button==2) {
					// console.log(event)
						_scene.children.forEach((item)=>{
							if (item.geometry.type=='EdgesGeometry') {
								_scene.remove(item)
							}
						})
						var mesh = getSelectedObject(event).object
						if (mesh.uuid==_this.state.plane_uuid) {
							return
						}
						pickObjectAsMesh(mesh,true)
						return
				}
				window.drag_flag = 0
				window.dragObject = undefined
				_this.setState({keyboardCtrl:{x:0,y:0,z:0,x_rotate:0,y_rotate:0,z_rotate:0}})
			})

			_this.canvasDOM.addEventListener('mouseup',function(event){//鼠标按键抬起
				event.preventDefault()
				if (_this.state.editMode==false) {//非编辑模式下，转动视角，鼠标移动
					_this.canvasDOM.removeEventListener('mousemove',mouseMove_listener_func)
				}else if (_this.state.editMode==true) {
					// _this.canvasDOM.removeEventListener('mousemove',moveVertice)
				}
				
			})

			_this.canvasDOM.addEventListener('mouseout',function(event){//拖拽时鼠标移到框外面
				if (window.dragObject&&window.temp_flag==0) {
					var meshAry = _this.getMeshObject()
					var obj = meshAry[meshAry.length-1]
					_scene.remove(obj)
					meshAry.pop()
					window['scene_'+_this.state.scene_i].meshList = meshAry
					var _dragElement = _this.state.dragElement
					_dragElement.pop()
					_this.setState({dragElement:_dragElement},function(){
						// _this.renderer_render(_scene,_camera)
					})
					window.drag_flag = 0
				}
			})
			// 转动鼠标滑轮
			_this.canvasDOM.addEventListener('mousewheel',function(event){
				event.preventDefault()
				if (event.wheelDeltaY>0) {//鼠标轮滑向下
					_this.zoomIn(_scene,_camera)
				}else{//鼠标轮滑向上
					_this.zoomOut(_scene,_camera)
				}
			})

			_this.canvasDOM.addEventListener('mouseover',(event)=>{//鼠标移到框里面
				document.addEventListener('keypress',keyboardCtrl)
			})

			_this.canvasDOM.addEventListener('mouseout',(event)=>{//鼠标移到框外面
				document.removeEventListener('keypress',keyboardCtrl)
			})
		}
		
		var addMeshObj = function(){//只修改scene全局变量,没修改state里面的scene
			var meshObjAry = _this.getMeshObject()
			meshObjAry.forEach((item)=>{
				_scene.add(item)
			})
		}
		var addLights = function(){//添加光源
			var LightAry = _this.getLightList()
			LightAry.forEach((item)=>{
				_scene.add(item)
			})
		}
		var _render = function() {
            requestAnimationFrame(_render)
            _this.renderer_render(_scene,_camera)
        }
        
		init()
		addMeshObj()
		addLights()
		_render()
	}
	render(){
		return <div id={this.state.scene_i} ref={div=>{this.divDOM = div}} style={{width:'100%',height:'100%'}}>{this.props.children}{this.state.dragElement}
			<div ref={div=>{this.canvasDOM=div}} style={{width:'100%',height:'100%'}}></div>
		</div>
	}
}
Scene.defaultProps = {
	renderer_clearColor:new THREE.Color(0x000000),
	plane_width:300,
	plane_height:300,
	plane_position:{x:0,y:-10,z:0},
	plane_rotation:{x:-Math.PI/2,y:0,z:0},
	plane_color:0xffffff
}
Scene.childContextTypes={
	scene_i:PropTypes.string
}
export default Scene