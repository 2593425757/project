import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import * as MAKEOBJ from './makeObjFunctions.js'
class LoadMeshGroup extends React.Component{
	constructor(props,context){
		super(props)
        var _this = this
        if (context.meshCollection&&context.meshGroup) {
            this.state={
                scene_i:context.scene_i,
                position:{x:context.meshCollection.position.x+context.meshGroup.position.x+_this.props.position.x,y:context.meshCollection.position.y+context.meshGroup.position.y+_this.props.position.y,z:context.meshCollection.position.z+context.meshGroup.position.z+_this.props.position.z},
                rotation:{x:context.meshCollection.rotation.x+context.meshGroup.rotation.x+_this.props.rotation.x,y:context.meshCollection.rotation.y+context.meshGroup.rotation.y+_this.props.rotation.y,z:context.meshCollection.rotation.z+context.meshGroup.rotation.z+_this.props.rotation.z},
                scale:{x:context.meshCollection.scale.x+context.meshGroup.scale.x+_this.props.scale.x,y:context.meshCollection.scale.y+context.meshGroup.scale.y+_this.props.scale.y,z:context.meshCollection.scale.z+context.meshGroup.scale.z+_this.props.scale.z},
            }
        }else if (context.meshCollection) {
            this.state={
                scene_i:context.scene_i,
                uuid:null,
                position:{x:context.meshCollection.position.x+_this.props.position.x,y:context.meshCollection.position.y+_this.props.position.y,z:context.meshCollection.position.z+_this.props.position.z},
                rotation:{x:context.meshCollection.rotation.x+_this.props.rotation.x,y:context.meshCollection.rotation.y+_this.props.rotation.y,z:context.meshCollection.rotation.z+_this.props.rotation.z},
                scale:{x:context.meshCollection.scale.x+_this.props.scale.x,y:context.meshCollection.scale.y+_this.props.scale.y,z:context.meshCollection.scale.z+_this.props.scale.z},
                meshList:{}
            }
        }else{
            this.state = {
                scene_i:context.scene_i,
                position:_this.props.position,
                rotation:_this.props.rotation,
                scale:_this.props.scale,
                meshList:{}
            }
        }
	}
    getChildContext(){//设置上下文
        var _this = this
        return {meshGroup:{position:_this.state.position,rotation:_this.state.rotation,scale:_this.state.scale}}
    }
    addBindFunc(data){
        var _this = this
        var targetId = data.id?data.id:'all'

        var thisMesh = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('uuid',_this.state.meshList[targetId])
        var func = data.func
        func.uuid = _this.state.meshList[targetId]
        func.getMesh = function(){
            var _mesh = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('uuid',_this.state.meshList[targetId])
            if (!_mesh) {
                console.log('未获取mesh',targetId,_this.state.meshList,global['scene_'+_this.state.scene_i].scene.children)
            }
            return _mesh
        }
        func.alter = function(){
            var mesh = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('uuid',_this.state.meshList[targetId])
            if (!mesh) {
                console.log('未获取mesh')
                return
            }
            if (mesh.makeObjData.alterId==undefined) {
                return
            }
            if (mesh.makeObjData.alterId==mesh.makeObjData.alternative.length) {
                mesh.makeObjData.alternative.forEach((item)=>{
                    if (item.rotation) {
                        mesh.rotation.set(mesh.rotation.x-item.rotation.x,mesh.rotation.y-item.rotation.y,mesh.rotation.z-item.rotation.z)
                    }
                    if (item.scale) {
                        mesh.scale.set(mesh.scale.x-item.scale.x,mesh.scale.y-item.scale.y,mesh.scale.z-item.scale.z)
                    }
                    if (item.translate) {
                        mesh.position.set(mesh.position.x-item.translate.x,mesh.position.y-item.translate.y,mesh.position.z-item.translate.z)
                    }
                    mesh.makeObjData.alterId = 0
                })
            }else{
                var data = mesh.makeObjData
                var nextState = data.alternative[data.alterId]
                if (nextState.rotation) {
                    mesh.rotation.set(mesh.rotation.x+nextState.rotation.x,mesh.rotation.y+nextState.rotation.y,mesh.rotation.z+nextState.rotation.z)
                }
                if (nextState.scale) {
                    mesh.scale.set(mesh.scale.x+nextState.scale.x,mesh.scale.y+nextState.scale.y,mesh.scale.z+nextState.scale.z)
                }
                if (nextState.translate) {
                    mesh.position.set(mesh.position.x+nextState.translate.x,mesh.position.y+nextState.translate.y,mesh.position.z+nextState.translate.z)
                }
                mesh.makeObjData.alterId = mesh.makeObjData.alterId+1
            }
        }
    }
	componentWillMount(){
		var _this = this
        var allMesh = new THREE.Object3D()
		var exportMeshByData = function(data,meshParam,groupParam,mesh_id,targetGroup){//meshParam==mesh_parameters中的一个,groupParam为该网格所在网格组的对应的groupParam
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
	                mesh.position.set(meshParam.translate.x+groupParam.translate.x,meshParam.translate.y+groupParam.translate.y,meshParam.translate.z+groupParam.translate.z)
	                mesh.rotation.set(meshParam.rotation.x+groupParam.rotation.x,meshParam.rotation.y+groupParam.rotation.y,meshParam.rotation.z+groupParam.rotation.z)
                    mesh.animation = _this.props.animation
                    mesh.originMesh = mesh
					global['scene_'+_this.state.scene_i].scene.add(mesh)
                    var _meshList = _this.state.meshList
                    if(mesh_id){_meshList[mesh_id] = mesh.uuid}
                    _this.setState({meshList:_meshList})
                    if (targetGroup) {
                        targetGroup.add(mesh)    
                    }
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
                mesh.position.set(meshParam.translate.x+groupParam.translate.x,meshParam.translate.y+groupParam.translate.y,meshParam.translate.z+groupParam.translate.z)
                mesh.rotation.set(meshParam.rotation.x+groupParam.rotation.x,meshParam.rotation.y+groupParam.rotation.y,meshParam.rotation.z+groupParam.rotation.z)
                mesh.animation = _this.props.animation
                mesh.originMesh = mesh
				global['scene_'+_this.state.scene_i].scene.add(mesh)
                var _meshList = _this.state.meshList
                if(mesh_id){_meshList[mesh_id] = mesh.uuid}
                _this.setState({meshList:_meshList})
                if (targetGroup) {
                    targetGroup.add(mesh)    
                }
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
                mesh.position.set(meshParam.translate.x+groupParam.translate.x,meshParam.translate.y+groupParam.translate.y,meshParam.translate.z+groupParam.translate.z)
                mesh.rotation.set(meshParam.rotation.x+groupParam.rotation.x,meshParam.rotation.y+groupParam.rotation.y,meshParam.rotation.z+groupParam.rotation.z)
                mesh.animation = _this.props.animation
                mesh.originMesh = mesh
				global['scene_'+_this.state.scene_i].scene.add(mesh)
                var _meshList = _this.state.meshList
                if(mesh_id){_meshList[mesh_id] = mesh.uuid}
                _this.setState({meshList:_meshList})
                if (targetGroup) {
                    targetGroup.add(mesh)    
                }
            }
		}
        var exportMeshGroup = function(url,param,group_id,targetGroup){//param == 给网格组的基本属性,调用props中的url，应该为{{"translate":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":0,"y":0,"z":0},"animation":this.props.animation}}
            $.ajax({
                type:'get',
                url:url,
                dataType:'json',
                success:function(data){
                    if (group_id=='all') {
                        var group = targetGroup
                    }else{
                        var group = new THREE.Object3D()
                    }
                    if (data.type=='meshGroup') {
                        data.mesh.forEach((item)=>{
                            $.ajax({
                                type:'get',
                                url:item.url,
                                dataType:'json',
                                success:function(_data){
                                    data.mesh_parameters.forEach((_item)=>{
                                        if (_item.name==item.name) {
                                            var mesh_id
                                            if (_item.id) {mesh_id = _item.id}
                                            exportMeshByData(_data,_item,param,mesh_id,group)
                                        }
                                    })
                                }
                            })
                        })
                        if (data.meshGroup_parameters) {
                            data.meshGroup_parameters.forEach((_item)=>{
                                data.meshGroup.forEach((__item)=>{
                                    if (_item.name==__item.name) {
                                        var group_id
                                        if (_item.id) {group_id = _item.id}
                                        exportMeshGroup(__item.url,_item,group_id,group)
                                    }
                                })
                            })
                        }
                    }
                    if (targetGroup&&group_id!='all') {
                        targetGroup.add(group)
                    }
                    var _meshList = _this.state.meshList
                    if (group_id) {_meshList[group_id] = group.uuid} 
                    _this.setState({meshList:_meshList})
                }
            })
        }
		exportMeshGroup(this.props.url,{translate:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},scale:{x:0,y:0,z:0},animation:this.props.animation},'all',allMesh)

        allMesh.position.set(_this.state.position.x,_this.state.position.y,_this.state.position.z)
        allMesh.rotation.set(_this.state.rotation.x,_this.state.rotation.y,_this.state.rotation.z)
        global['scene_'+_this.state.scene_i].scene.add(allMesh)
        var _meshList = _this.state.meshList
        _meshList.all = allMesh.uuid
        _this.setState({meshList:_meshList},function(){
            setTimeout(function(){
                _this.props.bind.forEach((item)=>{
                    _this.addBindFunc(item)
                })
            },1000)
            
        })
	}
	componentDidMount(){
	}
	render(){
		return <div>{this.props.children}</div>
	}
}
LoadMeshGroup.defaultProps = {
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
    scale:{x:0,y:0,z:0},
	url:null,
	animation:true,
    bind:[]
}
LoadMeshGroup.contextTypes = {
    scene_i:PropTypes.string,
    meshCollection:PropTypes.object,
    meshGroup:PropTypes.object
}
LoadMeshGroup.childContextTypes = {
    meshGroup:PropTypes.object
}
export default LoadMeshGroup