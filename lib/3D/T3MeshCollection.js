import React from 'react'
import PropTypes from 'prop-types'
// import * as THREE from 'three'
import * as MAKEOBJ from './makeObjFunctions.js'
class LoadMeshCollection extends React.Component{
	constructor(props,context){
		super(props)
		this.state = {
			scene_i:context.scene_i,
            uuid:null
		}
        this.addBindFunc = this.addBindFunc.bind(this)
	}
    getChildContext(){//设置上下文
        var _this = this
        return {meshCollection:{position:_this.props.position,rotation:_this.props.rotation,scale:_this.props.scale}}
    }
    addBindFunc(data){
        var _this = this
        var thisMesh = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('uuid',_this.state.uuid)
        var func = data.func
        func.uuid = _this.state.uuid
        func.getMesh = function(){
            var _mesh = global['scene_'+_this.state.scene_i].scene.getObjectByProperty('uuid',_this.state.uuid)
            if (!_mesh) {
                console.log('未获取mesh,组件state.uuid未更新')
            }
            return _mesh
        }
        
    }
	componentWillMount(){
		var _this = this
        var collection = new THREE.Object3D()
		var exportMeshByData = function(data,meshParam,groupParam){//meshParam==mesh_parameters中的一个,groupParam为该网格所在网格组的对应的groupParam
            var getPromise = MAKEOBJ.makeMesh(data)
            getPromise.then((value)=>{
                var geometry = value.geometry
                var material = value.material
                var mesh = new THREE.Mesh(geometry,material)
                mesh.makeObjData = Object.assign({},data)
                mesh.position.set(meshParam.translate.x+groupParam.translate.x,meshParam.translate.y+groupParam.translate.y,meshParam.translate.z+groupParam.translate.z)
                mesh.rotation.set(meshParam.rotation.x+groupParam.rotation.x,meshParam.rotation.y+groupParam.rotation.y,meshParam.rotation.z+groupParam.rotation.z)
                global['scene_'+_this.state.scene_i].scene.add(mesh)
                mesh.animation = _this.props.animation
                MAKEOBJ.setOrigin(mesh)
                collection.add(mesh)
            })
		}
        var exportMeshGroup = function(url,param){//param == 给网格组的基本属性,调用props中的url，应该为{{"translate":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"scale":{"x":0,"y":0,"z":0},
                                                    //"animation":this.props.animation}}
            $.ajax({
                type:'get',
                url:url,
                dataType:'json',
                success:function(data){
                    if (data.type=='meshGroup') {
                        data.mesh.forEach((item)=>{
                            $.ajax({
                                type:'get',
                                url:item.url,
                                dataType:'json',
                                success:function(_data){
                                    data.mesh_parameters.forEach((_item)=>{
                                        if (_item.name==item.name) {
                                            exportMeshByData(_data,_item,param)
                                        }
                                    })
                                }
                            })
                        })
                        if (data.meshGroup) {
                            data.meshGroup.forEach((_item)=>{
                                data.meshGroup_parameters.forEach((__item)=>{
                                    if (_item.name==__item.name) {
                                        exportMeshGroup(_item.url,__item)
                                    }
                                })
                            })
                        }
                    }
                }
            })
        }
        var exportMeshCollection = function(url){
            $.ajax({
                type:'get',
                url:url,
                dataType:'json',
                success:function(data){
                    data.meshGroup.forEach((item)=>{
                        data.meshGroup_parameters.forEach((_item)=>{
                            if (_item.name==item.name) {
                                exportMeshGroup(item.url,_item)
                            }
                        })
                    })
                }
            })
        }
		exportMeshCollection(_this.props.url)
        collection.position.set(_this.props.position.x,_this.props.position.y,_this.props.position.z)
        collection.rotation.set(_this.props.rotation.x,_this.props.rotation.y,_this.props.rotation.z)
        global['scene_'+_this.state.scene_i].scene.add(collection)
        _this.setState({uuid:collection.uuid},function(){
            _this.props.bind.forEach((item)=>{
                _this.addBindFunc(item)
            })
        })
	}
	render(){
		return <div>{this.props.children}</div>
	}
}
LoadMeshCollection.defaultProps = {
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
    scale:{x:0,y:0,z:0},
	url:null,
	animation:true,
    bind:[]
}
LoadMeshCollection.contextTypes = {
	scene_i:PropTypes.string
}
LoadMeshCollection.childContextTypes = {
    meshCollection:PropTypes.object
}
export default LoadMeshCollection