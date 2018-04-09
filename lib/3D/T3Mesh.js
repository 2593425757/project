import React from 'react'
import PropTypes from 'prop-types'
// import * as THREE from 'three'
import * as MAKEOBJ from './makeObjFunctions.js'
class LoadMesh extends React.Component{
	constructor(props,context){
		super(props)
		var _this = this
		if (context.meshGroup) {
			this.state={
				scene_i:context.scene_i,
				uuid:null,
				position:{x:context.meshGroup.position.x+_this.props.position.x,y:context.meshGroup.position.y+_this.props.position.y,z:context.meshGroup.position.z+_this.props.position.z},
				rotation:{x:context.meshGroup.rotation.x+_this.props.rotation.x,y:context.meshGroup.rotation.y+_this.props.rotation.y,z:context.meshGroup.rotation.z+_this.props.rotation.z},
				scale:{x:context.meshGroup.scale.x+_this.props.scale.x,y:context.meshGroup.scale.y+_this.props.scale.y,z:context.meshGroup.scale.z+_this.props.scale.z},
			}
		}else{
			this.state = {
				scene_i:context.scene_i,
				uuid:null,
				position:_this.props.position,
				rotation:_this.props.rotation,
				scale:_this.props.scale
			}
		}
		
		this.addBindFunc = this.addBindFunc.bind(this)
	}
	addBindFunc(data){//data: {func:...,type:'click,mousedown,mouseover,null'}
		var _this = this
		var thisMesh = global['scene_'+_this.state.scene_i].scene.children.find((item)=>{
			return item.uuid==_this.state.uuid
		})
		var func = data.func
		func.uuid = _this.state.uuid
		func.getMesh = function(){
			var _mesh = global['scene_'+_this.state.scene_i].scene.children.find((item)=>{
				return item.uuid==_this.state.uuid
			})
			if (!_mesh) {
				console.log('未获取mesh,组件state.uuid未更新')
			}
			return _mesh
		}
		func.alter = function(nextId){
			var thisMesh = global['scene_'+_this.state.scene_i].scene.children.find((item)=>{
				return item.uuid==_this.state.uuid
			})
			if (!thisMesh) {
				console.log('未获取mesh,组件state.uuid未更新')
			}
			MAKEOBJ.changeState(thisMesh)
		}
		if (!thisMesh.loadedFunc) {
			thisMesh.loadedFunc = []
		}
		var type = data.type?data.type:null
		thisMesh.loadedFunc.push({func:func,type:type})
		global['scene_'+_this.state.scene_i].scene.add(thisMesh)
	}
	componentWillMount(){
		var _this = this
		$.ajax({  
            type:'get',  
            url:_this.props.url,  
            dataType:'json',
            success:function(data){
            	var getPromise = MAKEOBJ.makeMesh(data)
            	var geometry,material
            	getPromise.then((value)=>{
            		geometry = value.geometry
            		material = value.material
            		var mesh = new THREE.Mesh(geometry,material)
	                mesh.makeObjData = Object.assign({},data)
	                mesh.position.x = _this.state.position.x + data.translate.x
					mesh.position.y = _this.state.position.y + data.translate.y
					mesh.position.z = _this.state.position.z + data.translate.z
					mesh.rotation.x = _this.state.rotation.x + data.rotation.x
					mesh.rotation.y = _this.state.rotation.y + data.rotation.y
					mesh.rotation.z = _this.state.rotation.z + data.rotation.z
					if (data.scale) {
						mesh.scale.set(_this.state.scale.x*data.scale.x,_this.state.scale.y*data.scale.y,_this.state.scale.z*data.scale.z)
					}else{
						mesh.scale.set(_this.state.scale.x,_this.state.scale.y,_this.state.scale.z)
					}
					mesh.animation = _this.props.animation
					MAKEOBJ.setOrigin(mesh)
					global['scene_'+_this.state.scene_i].scene.add(mesh)
					_this.setState({uuid:mesh.uuid},function(){
						_this.props.bind.forEach((item)=>{
							_this.addBindFunc(item)
						})
					})
            	})
            }  
        }) 
	}
	render(){
		return <div></div>
	}
}
LoadMesh.defaultProps = {
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	translate:{x:0,y:0,z:0},
	scale:{x:1,y:1,z:1},
	url:null,
	animation:true,
	bind:[]
}
LoadMesh.contextTypes = {
	scene_i:PropTypes.string,
	meshGroup:PropTypes.object
}
export default LoadMesh