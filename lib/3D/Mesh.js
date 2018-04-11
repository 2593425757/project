import React from 'react'
import PropTypes from 'prop-types'
// import * as THREE from 'three'
import * as MAKEOBJ from './makeObjFunctions.js'
class Mesh extends React.Component{
	constructor(props,context){
		super(props)
		this.state = {
			scene_i:context.scene_i
		}

	}
	componentWillMount(){
		var mesh
		var _this = this
		if (_this.props.importMesh!=null) {
			mesh = _this.props.importMesh
			mesh.position.x = this.props.position.x + this.props.position_offset.x
			mesh.position.y = this.props.position.y + this.props.position_offset.y
			mesh.position.z = this.props.position.z + this.props.position_offset.z
			mesh.rotation.set(mesh.rotation.x+_this.props.rotation.x,mesh.rotation.y+_this.props.rotation.y,mesh.rotation.z+_this.props.rotation.z)
			mesh.scale.set(mesh.scale.x*_this.props.scale.x,mesh.scale.y*_this.props.scale.y,mesh.scale.z*_this.props.scale.z)
			global['scene_'+_this.state.scene_i].scene.add(mesh)
			return
		}
		var geometry,material
		var geoData,matData
		for(var i=0;i<_this.props.children.length;i++){
			if (_this.props.children[i].props.type2=='material') {
				matData = _this.props.children[i].props
				material = MAKEOBJ[_this.props.children[i].props.type](_this.props.children[i].props)
			}
			if (_this.props.children[i].props.type2=='geometry') {
				geoData = _this.props.children[i].props
				geometry = MAKEOBJ[_this.props.children[i].props.type](_this.props.children[i].props)
			}
		}
		mesh = new THREE.Mesh(geometry,material)
		mesh.position.x = this.props.position.x + this.props.position_offset.x
		mesh.position.y = this.props.position.y + this.props.position_offset.y
		mesh.position.z = this.props.position.z + this.props.position_offset.z
		mesh.rotation.x = this.props.rotation.x
		mesh.rotation.y = this.props.rotation.y
		mesh.rotation.z = this.props.rotation.z
		mesh.scale.set(_this.props.scale.x,_this.props.scale.y,_this.props.scale.z)
		
		mesh.makeObjData = {
			type:'mesh',
			geometry:[{id:0,type:geoData.type,parameters:geoData.parameters,rotation:{x:0,y:0,z:0},translate:{x:0,y:0,z:0},scale:{x:1,y:1,z:1}}],
			material:{type:matData.type,parameters:matData.parameters},
			translate:{x:0,y:0,z:0},
			rotation:{x:0,y:0,z:0},
			scale:{x:1,y:1,z:1}
		}
		mesh.originMesh = {
			position:{x:0,y:0,z:0},
			rotation:{x:0,y:0,z:0},
			scale:{x:1,y:1,z:1}
		}
		mesh.animation = false
		global['scene_'+_this.state.scene_i].scene.add(mesh)
	}
	componentDidMount(){
	}
	render(){
		return <div></div>
	}
}
Mesh.defaultProps = {
	position:{x:0,y:0,z:0},
	rotation:{x:0,y:0,z:0},
	position_offset:{x:0,y:0,z:0},
	scale:{x:1,y:1,z:1},
	importMesh:null
}
Mesh.contextTypes = {
	scene_i:PropTypes.string
}
export default Mesh