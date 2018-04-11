import React from 'react'
class DodecahedronGeometry extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return <div/>
	}
}
DodecahedronGeometry.defaultProps = {
	parameters:{radius:1,detail:0},
	type:'dodecahedronGeometry',
	type2:'geometry'
}
export default DodecahedronGeometry