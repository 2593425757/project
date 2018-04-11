import React from 'react'
class OctahedronGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
OctahedronGeometry.defaultProps = {
	parameters:{radius:1,detail:0},
	type:'octahedronGeometry',
	type2:'geometry'
}
export default OctahedronGeometry