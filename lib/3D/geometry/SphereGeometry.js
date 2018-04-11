import React from 'react'
class SphereGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
SphereGeometry.defaultProps = {
	parameters:{radius:1, widthSegments:8, heightSegments:6, phiStart:0, phiLength:Math.PI*2, thetaStart:0, thetaLength:Math.PI},
	type:'sphereGeometry',
	type2:'geometry'
}
export default SphereGeometry