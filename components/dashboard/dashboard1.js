import React from 'react'
import PropTypes from 'prop-types'
var dashboard
class Dashboard extends React.Component{
	constructor(props){
		super(props)
		dashboard = this
		this.state = {
			_n:0
		}
	}
	componentDidMount(){
		this.forceUpdate()
	}
	componentDidUpdate(){
		var changeN = (n)=>{//传入一个目标n值，输出state._n下一个变化到的值，如果state._n和目标n值相差不到0.1，则直接跳到n
			if (dashboard.state._n>n&&dashboard.state._n-n>0.005) {
				return dashboard.state._n-(dashboard.state._n-n)*0.1
			}
			if (dashboard.state._n<n&&n-dashboard.state._n>0.005) {
				return dashboard.state._n+(n-dashboard.state._n)*0.1
			}
			if (dashboard.state._n>n&&dashboard.state._n-n<0.005) {
				return n
			}
			if (dashboard.state._n<n&&n-dashboard.state._n<0.005) {
				return n
			}
			if (dashboard.state._n==n) {
				return n
			}
		}
		var n_next = changeN(dashboard.props.n)
		if (this.state._n!=this.props.n) {
			setTimeout(()=>{
				dashboard.setState({_n:n_next})
			},15)
		}
	}
	render(){
		var p1x = (23+(127-127*(Math.cos(this.state._n*Math.PI)))).toString()
		var p1y = (150-127*Math.sin(this.state._n*Math.PI)).toString()
		var p2x = (47+(103-103*(Math.cos(this.state._n*Math.PI)))).toString()
		var p2y = (150-103*Math.sin(this.state._n*Math.PI)).toString()
		return (
			<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{width:'300px',height:'250px'}}>
				<path d="M 20 150 A 130 130 0 0 1 280 150 l -30 0 A 100 100 0 0 0 50 150 z" fill='white' stroke='black' strokeWidth='1'/>
				<path d={"M 23 150 A 127 127 0 0 1 "+p1x+" "+p1y+" L "+p2x+" "+p2y+" A 103 103 0 0 0 47 150 z"} fill={this.props.color} opacity={this.state._n} stroke='white' strokeWidth='1'/>
				
			</svg>
			)
	}
}
Dashboard.defaultProps = {
	style:{},
	n:1,
	color:'red'
}
export default Dashboard