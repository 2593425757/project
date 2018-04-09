import React from 'react'
import PropTypes from 'prop-types'
// import * as THREE from 'three'
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
            MAKEOBJ.changeState(mesh)
        }
    }
	componentWillMount(){
		var _this = this
        var allMesh = new THREE.Object3D()
		var exportMeshByData = function(data,meshParam,groupParam,mesh_id,targetGroup){//meshParam==mesh_parameters中的一个,groupParam为该网格所在网格组的对应的groupParam
            var getPromise = MAKEOBJ.makeMesh(data)
            getPromise.then((value)=>{
                var geometry = value.geometry
                var material = value.material
                var mesh = new THREE.Mesh(geometry,material)
                mesh.makeObjData = Object.assign({},data)
                mesh.position.set(meshParam.translate.x+groupParam.translate.x,meshParam.translate.y+groupParam.translate.y,meshParam.translate.z+groupParam.translate.z)
                mesh.rotation.set(meshParam.rotation.x+groupParam.rotation.x,meshParam.rotation.y+groupParam.rotation.y,meshParam.rotation.z+groupParam.rotation.z)
                mesh.animation = _this.props.animation
                MAKEOBJ.setOrigin(mesh)
                global['scene_'+_this.state.scene_i].scene.add(mesh)
                var _meshList = _this.state.meshList
                if(mesh_id){_meshList[mesh_id] = mesh.uuid}
                _this.setState({meshList:_meshList})
                if (targetGroup) {
                    targetGroup.add(mesh)    
                }
            })
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