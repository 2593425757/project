import React from 'react'
class CircleGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
CircleGeometry.defaultProps = {
	parameters:{radius:1,segments:8,thetaStart:0,thetaLength:2*Math.PI},
	type:'circleGeometry',
	type2:'geometry'
}
export default CircleGeometry