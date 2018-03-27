import React,{Component} from 'react'
import {TopBar,Box,MapComponent,Dashboard1} from '../components'
import {PageHeader} from 'react-bootstrap'
import {Scene,Mesh,MeshBasicMaterial,PlaneGeometry,SpotLight,CubeGeometry,Cube,Circle,Cone,Cylinder,Icosahedron,Torus,saveScene,LoadMesh,LoadMeshGroup,LoadMeshCollection} from '../lib/3D'
import * as THREE from 'three'
import {pickObject,pickObjectByUrl} from '../lib/3D/dragObjFunctions.js'
var mainPage
const url = 'http://localhost:3000/lib/3D/mesh/'
class MainPage extends Component{
	constructor(props){
		super(props)
		mainPage = this
		this.state = {
			n:0.9
		}
		this.test = this.test.bind(this)
		this.test2 = this.test2.bind(this)
		this.test3 = this.test3.bind(this)
		this.test4 = this.test4.bind(this)
	}
	less(){
		mainPage.setState({n:mainPage.state.n-0.1})
	}
	test(){
		var {alter,getMesh,uuid} = this.test
		alter()
	}
	test2(){
		var {uuid,getMesh} = this.test2
		var _mesh = getMesh()
		_mesh.rotation.set(_mesh.rotation._x,_mesh.rotation._y+0.3,_mesh.rotation._z)
	}
	test3(){
		var {uuid,getMesh} = this.test3
		var _mesh = getMesh()
		if (!global.interval_test3) {
			global.interval_test3 = setInterval(()=>{
				_mesh.rotation.set(_mesh.rotation._x,_mesh.rotation._y+0.1,_mesh.rotation._z)
			},100)
		}else{
			clearInterval(global.interval_test3)
			global.interval_test3 = undefined
		}
	}
	test4(){
		var {uuid,getMesh} = this.test4
		var _mesh = getMesh()
		_mesh.rotation.set(_mesh.rotation._x,_mesh.rotation._y+0.3,_mesh.rotation._z)
	}
	componentDidMount(){
		// var _this = this
		// var scene = new THREE.Scene();
		
  //       var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
		
  //       var renderer = new THREE.WebGLRenderer();
		
  //       renderer.setSize(800, 800);
		
  //       document.getElementById('test').appendChild(renderer.domElement);
  //       var geometry = new THREE.CircleGeometry( 1, 32 );
		// var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		// var circle = new THREE.Mesh( geometry, material );
		// scene.add( circle );
  //       camera.position.z = 5;
  //       function render() {
  //           requestAnimationFrame(render);
  //           circle.rotation.x += 0.03;
  //           circle.rotation.y += 0.03;
  //           renderer.render(scene, camera);
  //       }
  //       render();
        
	}
	
	btnClick_wall(){
		pickObjectByUrl(url+'wall10.json',true)
	}
	btnClick_door(){
		pickObjectByUrl(url+'door.json',true)
	}
	btnClick_desk(){
		pickObjectByUrl(url+'desk.json',true)
	}
	btnClick_chair(){
		pickObjectByUrl(url+'chair.json',true)
	}
	btnClick__door(){
		pickObjectByUrl(url+'_door.json')
	}
	btnClick_air_conditioner(){
		pickObjectByUrl(url+'air-conditioner.json',true)
	}
	btnClick_mechineBox(){
		pickObjectByUrl(url+'mechineBox.json',true)
	}
	btnClick_glass(){
		pickObjectByUrl(url+'glass.json')
	}
	btnClick_computer(){
		pickObjectByUrl(url+'computer.json',true)
	}
	btnClick_saveScene(){
		saveScene('http://localhost:3000/save',0,function(data){
			console.log(data)
		})
	}
	render(){
		return (
			<div >
				<TopBar />
				<div id='mainPage_body' style={{width:'1200px',margin:'0 auto',height:(window.screen.availHeight-102)+'px'}}>
					<PageHeader id='page_header'>
						页面
					</PageHeader>
					<Box style={{height:'1000px'}}>
						<Scene camera_position={{x:150,y:150,z:0}} plane_width={300} plane_height={300} plane_position={{x:0,y:-10,z:0}} plane_rotation={{x:-Math.PI/2,y:0,z:0}}>
							<LoadMeshCollection url='http://localhost:3000/lib/3D/mesh/manyObjs.json' position={{x:30,y:3,z:0}} bind={[{func:this.test2}]} >
							</LoadMeshCollection>
							<LoadMesh url='http://localhost:3000/lib/3D/mesh/platform.json' position={{x:-10,y:-10,z:0}} />
							<LoadMesh url='http://localhost:3000/lib/3D/mesh/platform2.json' position={{x:-5,y:-5,z:0}} />
							<LoadMesh url='http://localhost:3000/lib/3D/mesh/wall100.json' position={{x:-20,y:0,z:0}} />
							<LoadMeshGroup url='http://localhost:3000/lib/3D/mesh/door2.json' position={{x:-20,y:-2.5,z:55}} bind={[{func:this.test,id:'_door'}]} />
							<LoadMeshGroup url='http://localhost:3000/lib/3D/mesh/someObjs.json' position={{x:30,y:-7,z:30}} />
							<LoadMesh url='http://localhost:3000/lib/3D/mesh/air-conditioner.json' position={{x:0,y:-5,z:-50}} scale={{x:2,y:2,z:2}} rotation={{x:0,y:-1,z:0}} />
							<LoadMesh url='http://localhost:3000/lib/3D/mesh/blackboard.json' position={{x:-19,y:15,z:0}} />
							<LoadMesh url='http://localhost:3000/lib/3D/mesh/fan.json' position={{x:30,y:30,z:0}} bind={[{func:this.test3}]} />
						</Scene>
					</Box>
					<Box style={{height:'200px',width:'49%'}}>
						<button onMouseDown={this.btnClick_wall}>wall</button>
						<button onMouseDown={this.btnClick_door}>door</button>
						<button onMouseDown={this.btnClick_desk}>desk</button>
						<button onMouseDown={this.btnClick_chair}>chair</button>
						<button onMouseDown={this.btnClick__door}>_door</button>
						<button onMouseDown={this.btnClick_air_conditioner}>air-conditioner</button>
						<button onMouseDown={this.btnClick_mechineBox}>mechineBox</button>
						<button onMouseDown={this.btnClick_glass}>glass</button>
						<button onMouseDown={this.btnClick_computer}>computer</button>
						<button onClick={this.btnClick_saveScene}>save</button>
						<button onClick={this.test}>test</button>
						<button onClick={this.test2}>test2</button>
						<button onClick={this.test3}>test3</button>
						<button onClick={this.test4}>test4</button>
					</Box>
					<Box id='test'>
					</Box>
				</div>
				
			</div>
			)
	}
}
export default MainPage