import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
var _this
class SpotLight extends React.Component{
	constructor(props,context){
		super(props)
		_this = this
		this.state = {
			scene_i:context.scene_i
		}
		
	}
	componentWillMount(){
		var spotLight = new THREE.SpotLight(_this.props.color)
		spotLight.position.set(_this.props.position.x,_this.props.position.y,_this.props.position.z)
		spotLight.castShadow = _this.props.castShadow
		if (_this.props.target) {
			spotLight.target = _this.props.target
		}
		window['scene_'+_this.state.scene_i].lightList.push(spotLight)
	}
	render(){
		return <div style={{display:'none'}}></div>
	}
}
SpotLight.defaultProps = {
	color:'#ffffff',
	position:{x:0,y:0,z:0},
	castShadow:true,
}
SpotLight.contextTypes = {
	scene_i:PropTypes.string
}
export default SpotLight