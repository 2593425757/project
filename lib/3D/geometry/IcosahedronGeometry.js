import React from 'react'
class IcosahedronGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
IcosahedronGeometry.defaultProps = {
	parameters:{radius:1,detail:0},
	type:'icosahedronGeometry',
	type2:'geometry'
}
export default IcosahedronGeometry