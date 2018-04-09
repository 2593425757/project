import React,{Component} from 'react'
import {TopBar,Box,MapComponent,Dashboard1} from '../components'
import {PageHeader} from 'react-bootstrap'
import {Scene,Mesh,MeshBasicMaterial,PlaneGeometry,SpotLight,CubeGeometry,Cube,Circle,Cone,Cylinder,Icosahedron,Torus,saveScene,T3Mesh,T3MeshGroup,T3MeshCollection,importScene,clearScene} from '../lib/3D'
// import * as THREE from 'three'
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
		_mesh.rotation.set(_mesh.rotation._x,_mesh.rotation._y+0.1,_mesh.rotation._z)
	}
	test3(){
		var {uuid,getMesh} = this.test3
		var _mesh = getMesh()
		if (!global.interval_test3) {
			global.interval_test3 = setInterval(()=>{
				_mesh.rotation.set(_mesh.rotation._x,_mesh.rotation._y+0.2,_mesh.rotation._z)
			},100)
		}else{
			clearInterval(global.interval_test3)
			global.interval_test3 = undefined
		}
	}
	test4(){
		var {uuid,getMesh,alter} = this.test4
		alter()
	}
	componentDidMount(){
		var test = function(){
			var _this = this
			var scene = new THREE.Scene();
			
	        var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
			
	        var renderer = new THREE.WebGLRenderer();
			
	        renderer.setSize(800, 800);
			
	        document.getElementById('test').appendChild(renderer.domElement);
	        var geometry = new THREE.BoxGeometry( 2, 2 ,2);
	        var geometry2 = new THREE.BoxGeometry( 2, 2 ,2);
	        geometry2.translate(1,1,1)
	        var material = []
			for(var i=0;i<6;i++){
				material.push(new THREE.MeshBasicMaterial({color:0x444444}))
			}
			material[0] = new THREE.MeshBasicMaterial({color:0xeeeeee})
			material[2] = new THREE.MeshBasicMaterial({color:0xeeeeee})
			material[1] = new THREE.MeshBasicMaterial({color:0xeeeeee})
			var box1 = new THREE.Mesh( geometry2, material );
			var box2 = new THREE.Mesh( geometry, material );
			var box1BSP = new ThreeBSP(box1)
			var box2BSP = new ThreeBSP(box2)
			var resultBSP = box1BSP.subtract(box2BSP)
			var res = resultBSP.toMesh()
			res.geometry.computeFaceNormals()
			res.geometry.computeVertexNormals()
			
			res.material = material
			scene.add(res)
	        camera.position.z = 15;
			var newgeometry = new THREE.BoxGeometry( 4, 2 ,2);
			res.geometry = newgeometry
			res.material = new THREE.MeshBasicMaterial({color:0x222222})
	        function render() {
	            requestAnimationFrame(render);
	            res.rotation.x += 0.03
	            res.rotation.y += 0.03
	            renderer.render(scene, camera);
	        }
	        render();
		}
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
		global.jsonList = saveScene()
		console.log(jsonList)
	}
	btnClick_clearScene(){
		clearScene()
	}
	btnClick_importScene(){
		importScene(global.jsonList)
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
						<Scene camera_position={{x:150,y:150,z:0}} plane_width={300} plane_height={300} plane_position={{x:0,y:-10,z:0}} plane_rotation={{x:-Math.PI/2,y:0,z:0}} plane_materialUrl={url+'./floor.jpg'}>
							<T3MeshCollection url={url+'./manyObjs.json'} position={{x:30,y:3,z:0}} bind={[{func:this.test4}]} >
								<T3MeshGroup position={{x:0,y:-6,z:0}}>
									<T3Mesh url={url+'./computer.json'} position={{x:0,y:0,z:10}} />
									<T3Mesh url={url+'./computer.json'} position={{x:0,y:0,z:-10}} />
								</T3MeshGroup>
							</T3MeshCollection>
							<T3MeshGroup url={url+'./platform_group.json'} position={{x:-10,y:-7.5,z:0}} />
							<T3MeshGroup >
								<T3Mesh url={url+'./wall130.json'} position={{x:-20,y:0,z:0}} />
								<T3Mesh url={url+'./_door.json'} position={{x:-20,y:-10,z:54}} bind={[{func:this.test}]} />
								<T3Mesh url={url+'./blackboard.json'} position={{x:-19,y:15,z:0}} />
								<T3Mesh url={url+'./screen.json'} position={{x:-18,y:18,z:-15}} />
							</T3MeshGroup>
							<T3MeshGroup url={url+'./wall_window_group.json'} position={{x:45,y:10,z:-65}} rotation={{x:0,y:1.57,z:0}}  >
								<T3Mesh url={url+'./curtain.json'} position={{x:30,y:0,z:1}}/>
								<T3Mesh url={url+'./curtain.json'} position={{x:-30,y:0,z:1}}/>
							</T3MeshGroup>
							<T3MeshGroup url={url+'./wall_window_group.json'} position={{x:45,y:10,z:65}} rotation={{x:0,y:-1.57,z:0}}>
								<T3Mesh url={url+'./curtain.json'} position={{x:30,y:0,z:-1}}/>
								<T3Mesh url={url+'./curtain.json'} position={{x:-30,y:0,z:-1}}/>
							</T3MeshGroup>
							<T3MeshGroup url={url+'./cabinet_group.json'} position={{x:45,y:-10,z:-58}} rotation={{x:0,y:-1.57,z:0}} bind={[{func:this.test2},{func:this.test4,id:'drawer1'}]} />
							<T3Mesh url={url+'./air-conditioner.json'} position={{x:0,y:-5,z:-50}} scale={{x:2,y:2,z:2}} rotation={{x:0,y:-1,z:0}} />
							<T3Mesh url={url+'./fan.json'} position={{x:30,y:30,z:0}} bind={[{func:this.test3}]} />
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
						<button onClick={this.btnClick_saveScene}>保存场景</button>
						<button onClick={this.btnClick_clearScene}>清空场景</button>
						<button onClick={this.btnClick_importScene}>导入场景</button>
						<button onClick={this.test}>开关门</button>
						<button onClick={this.test2}>旋转柜子</button>
						<button onClick={this.test3}>电扇开关</button>
						<button onClick={this.test4}>打开抽屉</button>
					</Box>
					<Box id='test'>
					</Box>
				</div>
				
			</div>
			)
	}
}
export default MainPage