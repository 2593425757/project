import React from 'react'
class CylinderGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
CylinderGeometry.defaultProps = {
	parameters:{radiusTop:1,radiusBottom:1,height:1,radialSegments:8,heightSegments:1,openEnded:false,thetaStart:0,thetaLength:2*Math.PI},
	type:'cylinderGeometry',
	type2:'geometry'
}
export default CylinderGeometry