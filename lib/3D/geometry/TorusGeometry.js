import React from 'react'
class TorusGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
TorusGeometry.defaultProps = {
	parameters:{radius:1,tube:0.4,radialSegments:8,tubularSegments:6,arc:2*Math.PI},
	type:'torusGeometry',
	type2:'geometry'
}
export default TorusGeometry