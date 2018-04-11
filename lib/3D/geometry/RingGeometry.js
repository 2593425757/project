import React from 'react'
class RingGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
RingGeometry.defaultProps = {
	parameters:{innerRadius:0.5, outerRadius:1, thetaSegments:8, phiSegments:8, thetaStart:0, thetaLength:Math.PI*2},
	type:'ringGeometry',
	type2:'geometry'
}
export default RingGeometry