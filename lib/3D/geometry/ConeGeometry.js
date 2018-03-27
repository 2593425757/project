import React from 'react'
class ConeGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
ConeGeometry.defaultProps = {
	parameters:{radius:20,height:100,radialSegments:8,heightSegments:1,openEnded:false,thetaStart:0,thetaLength:2*Math.PI},
	type:'coneGeometry',
	type2:'geometry'
}
export default ConeGeometry