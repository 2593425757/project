import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
// import * as THREE from 'three'
import * as MAKEOBJ from './makeObjFunctions.js'
import {takeObjectAsElement,if_dragging,pickObjectAsMesh} from './dragObjFunctions.js'
class Scene extends React.Component{
	constructor(props){
		super(props)
		var _this = this
		var _scene = new THREE.Scene()//创建 场景和渲染器
		var renderer = new THREE.WebGLRenderer()
		renderer.setClearColor(_this.props.renderer_clearColor)
		var scene_i = 0
		while(global['scene_'+scene_i]){
			scene_i++
		}
		global['scene_'+scene_i] = new Object
		global['scene_'+scene_i].scene = _scene
		global['scene_'+scene_i].scenePlane = {
			plane_width:this.props.plane_width,
			plane_height:this.props.plane_height,
			plane_position:this.props.plane_position,
			plane_rotation:this.props.plane_rotation,
			plane_color:this.props.plane_color,
			plane_materialUrl:this.props.plane_materialUrl
		}
		this.state = {
			renderer:renderer,
			scene_i:scene_i,
			keyboardCtrl:{x:0,y:0,z:0,x_rotate:0,y_rotate:0,z_rotate:0},
			editMode:false,
			selectedVerticeData:{}
		}
		this.zoomIn = this.zoomIn.bind(this)
		this.zoomOut = this.zoomOut.bind(this)
		this.setCamera = this.setCamera.bind(this)
		this.getMeshObject = this.getMeshObject.bind(this)
	}
	getChildContext(){//设置上下文
		return {scene_i:this.state.scene_i.toString()}
	}
	getMeshObject(){//获取global里面的meshList
		return global['scene_'+this.state.scene_i].scene.children
	}
	setCamera(camera,x,y,z,lookAt){
		var _this = this
		camera.position.x = x
		camera.position.y = y
		camera.position.z = z
		if (lookAt) {
			camera.lookAt(lookAt)
		}else{
			camera.lookAt(global['scene_'+_this.state.scene_i].scene.position)
		}
		return camera
	}
	zoomIn(scene,camera,lookAt){
		// var point1 = this.state.camera.position
		var point1 = this.zoomIn.camera.position
		var radius = Math.sqrt(Math.pow(point1.x,2)+Math.pow(point1.y,2)+Math.pow(point1.z,2))
		var radius2 = radius-2
		var x2 = (radius2/radius)*point1.x
		var y2 = (radius2/radius)*point1.y
		var z2 = (radius2/radius)*point1.z
		camera=this.setCamera(camera,x2,y2,z2,lookAt)
	}
	zoomOut(scene,camera,lookAt){
		// var point1 = this.state.camera.position
		var point1 = this.zoomOut.camera.position
		var radius = Math.sqrt(Math.pow(point1.x,2)+Math.pow(point1.y,2)+Math.pow(point1.z,2))
		var radius2 = radius+2
		var x2 = (radius2/radius)*point1.x
		var y2 = (radius2/radius)*point1.y
		var z2 = (radius2/radius)*point1.z
		camera=this.setCamera(camera,x2,y2,z2,lookAt)
	}
	componentDidMount(){
		var _this = this
		var stats
		var _camera
		var camera_center = new Proxy(new THREE.Vector3(0,0,0),{
				set:function(target,key,value,receiver){
					Reflect.set(target,key,value)
					_camera.lookAt(target)
					return true
				}
			})
		global.drag_flag = 0,global.temp_flag=0
		var init = function(){
			if (_this.props.stats) {
				if (Stats) {
					var initStats=function(){
						var stats = new Stats()
						stats.setMode(0)
						stats.domElement.style.left='0px'
						stats.domElement.style.top='0px'
						document.getElementById(_this.props.stats).appendChild(stats.domElement)
						return stats
					}
					stats = initStats()
				}
			}
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
					plane.groundFlag = true
					global['scene_'+_this.state.scene_i].scene.add(plane)
				})
			}else{
				var plane = new THREE.Mesh(new THREE.PlaneGeometry(_this.props.plane_width,_this.props.plane_height),new THREE.MeshBasicMaterial({color:_this.props.plane_color}))
				plane.position.set(_this.props.plane_position.x,_this.props.plane_position.y,_this.props.plane_position.z)
				plane.rotation.set(_this.props.plane_rotation.x,_this.props.plane_rotation.y,_this.props.plane_rotation.z)
					plane.groundFlag = true
				global['scene_'+_this.state.scene_i].scene.add(plane)
			}
			var mouseMove_listener_func = function(event){
				if (event.movementX!=0) {
					var point_camera_1 = _camera.position
					var vector = new THREE.Vector2(point_camera_1.x,point_camera_1.z)
					if (event.movementX<0) {
						vector.rotateAround(camera_center,-Math.PI/120)
					}else{
						vector.rotateAround(camera_center,Math.PI/120)
					}
					_camera=_this.setCamera(_camera,vector.x,point_camera_1.y,vector.y,camera_center)

				}if (event.movementY!=0) {
					var point_camera_1 = _camera.position.clone()
					point_camera_1.sub(camera_center)
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
					_camera=_this.setCamera(_camera,vector.x+camera_center.x,new_y,vector.y+camera_center.z,camera_center)
				}
			}
			var getSelectedObject = function( event , all = false ) {
			  var vector = new THREE.Vector3();//三维坐标对象
			  vector.set(
			    ( (event.offsetX) / _this.canvasDOM.clientWidth ) * 2 - 1,
			    - ( (event.offsetY) / _this.canvasDOM.clientHeight ) * 2 + 1,
			    0.5 );
			  vector.unproject( _camera );
			  var raycaster = new THREE.Raycaster(_camera.position, vector.sub(_camera.position).normalize());
			  var intersects = raycaster.intersectObjects(global['scene_'+_this.state.scene_i].scene.children,true);
			  if (all==true) {
			  	return intersects
			  }
			  if (intersects.length > 0) {
			    var selected = intersects[0];//取第一个物体
			    // console.log("x坐标:"+selected.point.x);
			    // console.log("y坐标:"+selected.point.y);
			    // console.log("z坐标:"+selected.point.z);
			  }
			  return selected
			}
			var removeSelectedObject = function( selected ) {
				global['scene_'+_this.state.scene_i].scene.remove(selected.object)
			}
			var addDragObject = function(event){
				if (!global.dragObject) {
					return
				}
				if (global.dragObject.parent) {
					var parent = global.dragObject.parent
				}
				global['scene_'+_this.state.scene_i].scene.remove(global.dragObject)
				var selected_all = getSelectedObject(event,true)
				if (selected_all.length==1) {
					var selected = selected_all[0]
				}else{
					var selected = selected_all[1]
				}
				if (selected) {
					var translation = global.dragObject.makeObjData?global.dragObject.makeObjData.translate:{x:0,y:0,z:0}
					global.dragObject.position.set(selected.point.x+_this.state.keyboardCtrl.x+translation.x,selected.point.y+_this.state.keyboardCtrl.y+translation.y,selected.point.z+_this.state.keyboardCtrl.z+translation.z)
					if (!global.dragObject.originMesh) {
						global.dragObject.originMesh = global.dragObject
					}
					global['scene_'+_this.state.scene_i].scene.add(global.dragObject)
					if (parent) {
						var obj = global.dragObject
						obj.position.x-=parent.position.x
						obj.position.y-=parent.position.y
						obj.position.z-=parent.position.z
						parent.add(obj)
						return
					}
				}else{
					global['scene_'+_this.state.scene_i].scene.remove(global.dragObject)
				}
			}
			var moveObj_drag_func = function(param,plus){
				var keyboardCtrl = _this.state.keyboardCtrl
				keyboardCtrl[param]=keyboardCtrl[param]+plus
				_this.setState({keyboardCtrl:keyboardCtrl},function(){
					global.dragObject.position[param] += plus
				})
			}
			var centerMove_listener_func = function(event){
				var vector = new THREE.Vector3(_camera.position.x,_camera.position.y,_camera.position.z)
				vector.sub(camera_center)
				vector.negate()
				if (event.movementY!=0) {
					vector.setLength(vector.length()+event.movementY/3)
					var newPosition = new THREE.Vector3(_camera.position.x+vector.x,_camera.position.y+vector.y,_camera.position.z+vector.z)
					camera_center.x = newPosition.x
					camera_center.z = newPosition.z
				}
				if (event.movementX!=0) {
					var vector2 = new THREE.Vector2(vector.x,vector.z)
					vector2.rotateAround(_camera.position,-event.movementX*0.0005)
					var newPosition = new THREE.Vector3(_camera.position.x+vector2.x,_camera.position.y+vector.y,_camera.position.z+vector2.y)
					camera_center.x = newPosition.x
					camera_center.z = newPosition.z
				}
			}
			var rotateObj_drag_func = function(param,plus){
				if (global.dragObject) {
					if (param=='x') {
						global.dragObject.rotation.set(global.dragObject.rotation._x+plus,global.dragObject.rotation._y,global.dragObject.rotation._z)
					}else if (param=='y') {
						global.dragObject.rotation.set(global.dragObject.rotation._x,global.dragObject.rotation._y+plus,global.dragObject.rotation._z)
					}else if (param=='z') {
						global.dragObject.rotation.set(global.dragObject.rotation._x,global.dragObject.rotation._y,global.dragObject.rotation._z+plus)
					}
					global['scene_'+_this.state.scene_i].scene.add(global.dragObject)
				}
			}
			var scale_drag_func = function(plus){
					global.dragObject.scale.set(global.dragObject.scale.x+plus,global.dragObject.scale.y+plus,global.dragObject.scale.z+plus)
					global['scene_'+_this.state.scene_i].scene.add(global.dragObject)
			}
			var removeObj = function(){
				var lines = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('type','LineSegments')
				if (lines) {
					lines.parent.remove(lines)
				}
			}
			var keyboardCtrl = function(event){
				if (global.dragObject) {
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
					else if (event.key=='=') {scale_drag_func(0.1)}
					else if (event.key=='-') {scale_drag_func(0.1)}
				}
				if (event.key=='u') {camera_center.x+=2}
				else if (event.key=='j') {camera_center.x-=2}
				else if (event.key=='i') {camera_center.z+=2}
				else if (event.key=='k') {camera_center.z-=2}
				// 编辑模式
				if (event.key=='`') {
					if (_this.state.editMode==false) {
						_this.setState({editMode:true})
					}else{
						_this.setState({editMode:false})
						var lines = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('type','LineSegments')
						if (lines) {
							lines.parent.remove(lines)
						}
					}
				}
				if (event.key=='1') {
					removeObj()
				}
			}
			var clickObj = function(event){
				if (_this.state.editMode==true) {
					return
				}
				if (!getSelectedObject(event)) {
					return
				}
				var clickedObject = getSelectedObject(event).object
				if (clickedObject.groundFlag) {
					return
				}
				if (clickedObject.onClick) {
					clickedObject.onClick(clickedObject)
				}
				if (clickedObject.animation===false) {
					return
				}
				if (clickedObject.makeObjData) {
					if (clickedObject.makeObjData.alternative) {
						MAKEOBJ.changeState(clickedObject)
					}
				}
			}
			_this.canvasDOM.addEventListener('mousemove',addDragObject)//鼠标拖拽
			_this.canvasDOM.addEventListener('mousedown',function(event){//鼠标按键按下
				event.preventDefault()
				event.stopPropagation()
				clickObj(event)
				if (_this.state.editMode==false&&event.button==0) {//非编辑模式下，转动视角，鼠标移动
					_this.canvasDOM.addEventListener('mousemove',mouseMove_listener_func)
				}else if (_this.state.editMode==false&&event.button==2) {
					_this.canvasDOM.addEventListener('mousemove',centerMove_listener_func)
				}else if (_this.state.editMode==true&&event.button==0) {
					var removeEdges = function(){//把所有的已添加的轮廓移除
						var lines = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('type','LineSegments')
						if (lines) {
							lines.parent.remove(lines)
						}
					}
					var addEdges = function(event){//添加轮廓线
						if (getSelectedObject(event)) {
							var selectedObject = getSelectedObject(event).object
							var geometry = selectedObject.geometry
							var edges = new THREE.EdgesGeometry( geometry )
							var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) )
							var position = new THREE.Vector3(selectedObject.position.x,selectedObject.position.y,selectedObject.position.z)
							var rotation = new THREE.Euler(selectedObject.rotation.x,selectedObject.rotation.y,selectedObject.rotation.z)
							var scale = new THREE.Vector3(selectedObject.scale.x,selectedObject.scale.y,selectedObject.scale.z)
							line.position.set(position.x,position.y,position.z)
							line.rotation.set(rotation._x,rotation._y,rotation._z)
							line.scale.set(selectedObject.scale.x,selectedObject.scale.y,selectedObject.scale.z)
							selectedObject.parent.add(line)
						}
					}
					removeEdges()
					addEdges(event)
				}else if (_this.state.editMode==true&&event.button==2) {
					if (!getSelectedObject(event)) {return}
					var lines = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('type','LineSegments')
					if (lines) {
						lines.parent.remove(lines)
					}
					var mesh = getSelectedObject(event).object
					if (mesh.uuid==_this.state.plane_uuid) {
						return
					}
					global.dragObject = mesh
					return
				}
				if (global.dragObject) {
					MAKEOBJ.setOrigin(global.dragObject)
				}
				global.dragObject = undefined
				_this.setState({keyboardCtrl:{x:0,y:0,z:0,x_rotate:0,y_rotate:0,z_rotate:0}})
			})

			_this.canvasDOM.addEventListener('mouseup',function(event){//鼠标按键抬起
				event.preventDefault()
				if (_this.state.editMode==false&&event.button==0) {//非编辑模式下，转动视角，鼠标移动
					_this.canvasDOM.removeEventListener('mousemove',mouseMove_listener_func)
				}else if (_this.state.editMode==false&&event.button==2) {
					_this.canvasDOM.removeEventListener('mousemove',centerMove_listener_func)
				}
				
			})

			_this.canvasDOM.addEventListener('mouseout',function(event){//拖拽时鼠标移到框外面
				if (global.dragObject) {
					global['scene_'+_this.state.scene_i].scene.remove(global.dragObject)
				}
			})
			// 转动鼠标滑轮
			_this.canvasDOM.addEventListener('mousewheel',function(event){
				event.preventDefault()
				if (event.wheelDeltaY>0) {//鼠标轮滑向下
					_this.zoomIn(global['scene_'+_this.state.scene_i].scene,_camera,camera_center)
				}else{//鼠标轮滑向上
					_this.zoomOut(global['scene_'+_this.state.scene_i].scene,_camera,camera_center)
				}
			})

			_this.canvasDOM.addEventListener('mouseover',(event)=>{//鼠标移到框里面
				document.addEventListener('keypress',keyboardCtrl)
			})

			_this.canvasDOM.addEventListener('mouseout',(event)=>{//鼠标移到框外面
				document.removeEventListener('keypress',keyboardCtrl)
			})
		}
		var _render = function() {
			if (stats) {
				stats.update()
			}
			// ddd.ani(percent);
            requestAnimationFrame(_render)
            _this.state.renderer.render(global['scene_'+_this.state.scene_i].scene,_camera)
            _this.zoomIn.camera = _camera
            _this.zoomOut.camera = _camera
        }
		init()
		_render()
	}
	render(){
		return <div id={this.state.scene_i} ref={div=>{this.divDOM = div}} style={{width:'100%',height:'100%'}}>{this.props.children}
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
	plane_color:0xffffff,
	plane_materialUrl:null,
	stats:null
}
Scene.childContextTypes={
	scene_i:PropTypes.string
}
export default Scene