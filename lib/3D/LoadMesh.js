import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
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
		var changeObjState = function(targetObject,nextId){
			var data = targetObject.makeObjData
			if (data.alterId == data.alternative.length&&nextId==undefined) {
				var id = 0
				var mesh = targetObject.originMesh
				mesh.makeObjData.alterId = id
				global['scene_'+_this.state.scene_i].scene.remove(targetObject)
				mesh.uuid = targetObject.uuid
		        global['scene_'+_this.state.scene_i].scene.add(mesh)
			}else{
				var id = data.alterId+1
				if (nextId) {
					if (nextId==data.alterId) {
						return
					}else{
						id = nextId
					}
				}
				var data_geometry = data.geometry
				if (data.alternative[id-1].geometry) {
					data.alternative[id-1].geometry.forEach((item)=>{
						var geo_id = item.id
						data_geometry = data_geometry.map((_item)=>{
							if (_item.id==geo_id) {
								return Object.assign(_item,item)
							}else{
								return _item
							}
						})
					})
				}
                var geometry = new THREE.Geometry()
                data_geometry.forEach((item)=>{
                	var temp = MAKEOBJ[item.type](item)
                	temp.rotateX(item.rotation.x)
                	temp.rotateY(item.rotation.y)
                	temp.rotateZ(item.rotation.z)
                	temp.translate(item.translate.x,item.translate.y,item.translate.z)
                	geometry.merge(temp)
                })
                if (data.alternative[id-1].material) {
                	if (data.alternative[id-1].material.type=='loadTexture') {
	                	var material = new THREE.MeshBasicMaterial()
                		MAKEOBJ.loadTexture(data.alternative[id-1].material.url,function(texture){
                			material.map = texture
                			var mesh = new THREE.Mesh(geometry,material)
                			if (data.alternative[id-1].translate) {
                				mesh.position.set(targetObject.position.x+data.alternative[id-1].translate.x,targetObject.position.y+data.alternative[id-1].translate.y,targetObject.position.z+data.alternative[id-1].translate.z)
                			}
                			if (data.alternative[id-1].rotation) {
                				mesh.rotation.set(targetObject.rotation.x+data.alternative[id-1].rotation.x,targetObject.rotation.y+data.alternative[id-1].rotation.y,targetObject.rotation.z+data.alternative[id-1].rotation.z)
                			}
			                data.alterId = id
			                mesh.makeObjData = data
		                	mesh.animation = targetObject.animation
			                mesh.originMesh = targetObject.originMesh
			                global['scene_'+_this.state.scene_i].scene.remove(targetObject)
			                mesh.loadedFunc = targetObject.loadedFunc
							mesh.uuid = targetObject.uuid
			                global['scene_'+_this.state.scene_i].scene.add(mesh)
                		})
	                }else if(data.alternative[id-1].material.type == 'meshBasicMaterial'){
	                	if (data.alternative[id-1].material.parameters.color) {
		                	if ((typeof data.alternative[id-1].material.parameters.color)=='string') {
		                		data.alternative[id-1].material.parameters.color = eval(data.alternative[id-1].material.parameters.color)
		                	}
		                }
		                var material = MAKEOBJ[data.alternative[id-1].material.type](data.alternative[id-1].material)
		                var mesh = new THREE.Mesh(geometry,material)
		                if (data.alternative[id-1].translate) {
            				mesh.position.set(targetObject.position.x+data.alternative[id-1].translate.x,targetObject.position.y+data.alternative[id-1].translate.y,targetObject.position.z+data.alternative[id-1].translate.z)
            			}
            			if (data.alternative[id-1].rotation) {
            				mesh.rotation.set(targetObject.rotation.x+data.alternative[id-1].rotation.x,targetObject.rotation.y+data.alternative[id-1].rotation.y,targetObject.rotation.z+data.alternative[id-1].rotation.z)
            			}
		                data.alterId = id
		                mesh.makeObjData = data
	                	mesh.animation = targetObject.animation
		                mesh.originMesh = targetObject.originMesh
			            global['scene_'+_this.state.scene_i].scene.remove(targetObject)
			            mesh.loadedFunc = targetObject.loadedFunc
						mesh.uuid = targetObject.uuid
		                global['scene_'+_this.state.scene_i].scene.add(mesh)
	                }else if (data.alternative[id-1].material.type == 'meshFaceMaterial') {
	                	var material = []
	                	if (data.alternative[id-1].material.basicMaterial) {
	                		if (data.alternative[id-1].material.basicMaterial.color) {
	                			data.alternative[id-1].material.basicMaterial.color = eval(data.alternative[id-1].material.basicMaterial.color)
	                		}
	                		for(var i = 0;i<geometry.faces.length/2;i++){
		                		material[i] = new THREE.MeshBasicMaterial({color:data.alternative[id-1].material.basicMaterial.color})
		                	}
	                	}
	                	if (data.alternative[id-1].material.textureData) {
	                		data.alternative[id-1].material.textureData.forEach((item)=>{
	                			if (item.type == 'loadTexture') {
	                				MAKEOBJ.loadTexture(item.url,function(texture){
	                					var temp = new THREE.MeshBasicMaterial()
	                					temp.map = texture
			                			material[item.index] = temp
			                		})
	                			}else if (item.type != 'loadTexture') {
	                				var mat = MAKEOBJ[item.type](item.parameters)
	                				material[item.index] = mat
	                			}
	                		})
	                	}
	                	var mesh = new THREE.Mesh(geometry,material)
		                if (data.alternative[id-1].translate) {
            				mesh.position.set(targetObject.position.x+data.alternative[id-1].translate.x,targetObject.position.y+data.alternative[id-1].translate.y,targetObject.position.z+data.alternative[id-1].translate.z)
            			}
            			if (data.alternative[id-1].rotation) {
            				mesh.rotation.set(targetObject.rotation.x+data.alternative[id-1].rotation.x,targetObject.rotation.y+data.alternative[id-1].rotation.y,targetObject.rotation.z+data.alternative[id-1].rotation.z)
            			}
		                data.alterId = id
		                mesh.makeObjData = data
	                	mesh.animation = targetObject.animation
		                mesh.originMesh = targetObject.originMesh
			            global['scene_'+_this.state.scene_i].scene.remove(targetObject)
			            mesh.loadedFunc = targetObject.loadedFunc
						mesh.uuid = targetObject.uuid
		                global['scene_'+_this.state.scene_i].scene.add(mesh)
	                }
                }else{
                	var material = targetObject.material
                	var mesh = new THREE.Mesh(geometry,material)
	                if (data.alternative[id-1].translate) {
        				mesh.position.set(targetObject.position.x+data.alternative[id-1].translate.x,targetObject.position.y+data.alternative[id-1].translate.y,targetObject.position.z+data.alternative[id-1].translate.z)
        			}
        			if (data.alternative[id-1].rotation) {
        				mesh.rotation.set(targetObject.rotation.x+data.alternative[id-1].rotation.x,targetObject.rotation.y+data.alternative[id-1].rotation.y,targetObject.rotation.z+data.alternative[id-1].rotation.z)
        			}
	                data.alterId = id
	                mesh.makeObjData = data
                	mesh.animation = targetObject.animation
	                mesh.originMesh = targetObject.originMesh
			        global['scene_'+_this.state.scene_i].scene.remove(targetObject)
			        mesh.loadedFunc = targetObject.loadedFunc
					mesh.uuid = targetObject.uuid
	                global['scene_'+_this.state.scene_i].scene.add(mesh)
                }
            }
		}
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
			if (nextId) {
				changeObjState(thisMesh,nextId)
			}else{
				changeObjState(thisMesh)
			}
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
                var geometryList = data.geometry
                var geometry = new THREE.Geometry()
                
                geometryList.forEach((item)=>{
                	var temp = MAKEOBJ[item.type](item)
                	temp.rotateX(item.rotation.x)
                	temp.rotateY(item.rotation.y)
                	temp.rotateZ(item.rotation.z)
                	temp.translate(item.translate.x,item.translate.y,item.translate.z)
                	geometry.merge(temp)
                })
                if (data.material.type=='loadTexture') {
                	var material = new THREE.MeshBasicMaterial()
            		MAKEOBJ.loadTexture(data.material.url,function(texture){
            			material.map = texture
            			var mesh = new THREE.Mesh(geometry,material)
		                mesh.makeObjData = data
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
						mesh.originMesh = mesh
						global['scene_'+_this.state.scene_i].scene.add(mesh)
						_this.setState({uuid:mesh.uuid},function(){
							_this.props.bind.forEach((item)=>{
								_this.addBindFunc(item)
							})
						})
						
            		})
                	
                }else if(data.material.type == 'meshBasicMaterial'){
                	if (data.material.parameters.color) {
	                	if ((typeof data.material.parameters.color)=='string') {
	                		data.material.parameters.color = eval(data.material.parameters.color)
	                	}
	                }
	                var material = MAKEOBJ[data.material.type](data.material)
	                var mesh = new THREE.Mesh(geometry,material)
	                mesh.makeObjData = data
	                mesh.position.x = _this.state.position.x + data.translate.x
					mesh.position.y = _this.state.position.y + data.translate.y
					mesh.position.z = _this.state.position.z + data.translate.z
					mesh.rotation.x = _this.state.rotation.x + data.rotation.x
					mesh.rotation.y = _this.state.rotation.y + data.rotation.y
					mesh.rotation.z = _this.state.rotation.z + data.rotation.z
					mesh.translation = data.translate
					if (data.scale) {
						mesh.scale.set(_this.state.scale.x*data.scale.x,_this.state.scale.y*data.scale.y,_this.state.scale.z*data.scale.z)
					}else{
						mesh.scale.set(_this.state.scale.x,_this.state.scale.y,_this.state.scale.z)
					}
					mesh.animation = _this.props.animation
					mesh.originMesh = mesh
					global['scene_'+_this.state.scene_i].scene.add(mesh)
					_this.setState({uuid:mesh.uuid},function(){
						_this.props.bind.forEach((item)=>{
							_this.addBindFunc(item)
						})
					})
					
					
                }else if (data.material.type == 'meshFaceMaterial') {
                	var material = []
                	if (data.material.basicMaterial) {
                		if (data.material.basicMaterial.color) {
                			data.material.basicMaterial.color = eval(data.material.basicMaterial.color)
                		}
                		for(var i = 0;i<geometry.faces.length/2;i++){
	                		material[i] = new THREE.MeshBasicMaterial({color:data.material.basicMaterial.color})
	                	}
                	}
                	if (data.material.textureData) {
                		data.material.textureData.forEach((item)=>{
                			if (item.type == 'loadTexture') {
                				MAKEOBJ.loadTexture(item.url,function(texture){
                					var temp = new THREE.MeshBasicMaterial()
                					temp.map = texture
		                			material[item.index] = temp
		                		})
                			}else if (item.type != 'loadTexture') {
                				var mat = MAKEOBJ[item.type](item.parameters)
                				material[item.index] = mat
                			}
                		})
                	}
                	var mesh = new THREE.Mesh(geometry,material)
	                mesh.makeObjData = data
	                mesh.position.x = _this.state.position.x + data.translate.x
					mesh.position.y = _this.state.position.y + data.translate.y
					mesh.position.z = _this.state.position.z + data.translate.z
					mesh.rotation.x = _this.state.rotation.x + data.rotation.x
					mesh.rotation.y = _this.state.rotation.y + data.rotation.y
					mesh.rotation.z = _this.state.rotation.z + data.rotation.z
					mesh.translation = data.translate
					if (data.scale) {
						mesh.scale.set(_this.state.scale.x*data.scale.x,_this.state.scale.y*data.scale.y,_this.state.scale.z*data.scale.z)
					}else{
						mesh.scale.set(_this.state.scale.x,_this.state.scale.y,_this.state.scale.z)
					}
					mesh.animation = _this.props.animation
					mesh.originMesh = mesh
					global['scene_'+_this.state.scene_i].scene.add(mesh)
					_this.setState({uuid:mesh.uuid},function(){
						_this.props.bind.forEach((item)=>{
							_this.addBindFunc(item)
						})
					})
					
					
                }
            }  
        }) 
	}
	componentDidMount(){
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