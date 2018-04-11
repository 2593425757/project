import React from 'react'
class TorusKnotGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
TorusKnotGeometry.defaultProps = {
	parameters:{radius:1, tube:0.4, tubularSegments:64, radialSegments:8, p:2, q:3},
	type:'torusKnotGeometry',
	type2:'geometry'
}
export default TorusKnotGeometry