import React from 'react'
class TetrahedronGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
TetrahedronGeometry.defaultProps = {
	parameters:{radius:1,detail:0},
	type:'tetrahedronGeometry',
	type2:'geometry'
}
export default TetrahedronGeometry