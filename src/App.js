import React, { Component } from "react";
import axios from "axios";
import ShowWeather from "./components/ShowWeather/ShowWeather";
import ShowAllLocation from "./components/ShowAllLocation/ShowAllLocation"

export class App extends Component {
  state = {
    input: "",
    targetName:"",
    targetCountry:"",
    info:null,
    haveInfo:false,
    errorMessage:"",
    locationArray:[]
  };
  handleOnChange = (event) => {
    this.setState({
      input: event.target.value,
    });
  };

  async componentDidMount(){
    try{
      let allLocations = await axios.get(
        "http://localhost:8080/api/location/get-all-location"
        
      )
      this.setState({
        locationArray: allLocations.data.payload
      })

    }catch(e){
      this.setState({
        errorMessage: e.response.data.message
      })
    }
  }
_
handleSearchSubmit = async () => {
  if (this.state.input.length === 0) {
    this.setState({
      errorMessage: "You must enter a location!",
    });
  } else {
    try {
      let result = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.state.input}&appid=34607f1d0a8961ce8f701372a96ec2ec&units=imperial`
      );
      let foundIndex = this.state.locationArray.findIndex((item) => {
        if (item.city === result.data.name && result.data.sys.country) {
          return item;
        }
      });
      if (foundIndex === -1) {
        let savedLocation = await axios.post(
          "http://localhost:8080/api/location/create-location",
          {
            city: result.data.name,
            country: result.data.sys.country,
          }
        );
        this.setState({
          targetName: result.data.name,
          targetCountry: result.data.sys.country,
          info: result.data.main,
          haveInfo: true,
          errorMessage: "",
          locationArray: [
            ...this.state.locationArray,
            savedLocation.data.payload,
          ],
        });
      }
    } catch (e) {
      this.setState({
        errorMessage: e.response.data.message,
      });
    }
  }
};


  getLocationWeather = async (location)=>{
    try{
      let result = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.state.input}&appid=34607f1d0a8961ce8f701372a96ec2ec&units=imperial`
      )
      this.setState({
        targetName: result.data.name,
        targetCountry: result.data.sys.country,
        info: result.data.main,
        haveInfo: true,
        errorMessage: "",
       
      });
    }catch(e){
      this.setState({
        errorMessage: e.response.data.message
      })
    }
  }

  handleDeleteById= async (id)=>{
    try {
      let deleted = await axios.delete(`http://localhost:8080/api/location/delete-by-id/${id}`
      
      )
      let filteredArray = this.state.locationArray.filter(item=> item._id !== deleted.data.payload._id)
      this.setState({
        locationArray:filteredArray
      })
  } catch (e) {
      this.setState({
        errorMessage: e.response.data.message,
      })
  }
  }
  render() {
    return (
      <div style={{ textAlign: "center", marginTop: "8%" }}>
        <h1>Weather Search App</h1>
        <input
          onChange={this.handleOnChange}
          type="text"
          value={this.state.input}
          name="input"
        />
        <button onClick={this.handleSearchSubmit}>Submit</button>
       
         <div >
           <div style={{color:"red"}}> {this.state.errorMessage && this.state.errorMessage}</div>
           <ShowWeather 
            targetName={this.state.targetName}
            targetCountry={this.state.targetCountry}
            info={this.state.info}
            haveInfo={this.state.haveInfo}
            
            />
            <div>
              <ShowAllLocation 
              locationArray={this.state.locationArray}
              handleDeleteById={this.handleDeleteById}
              getLocationWeather={this.getLocationWeather}
              />
            </div>
          </div>
           
      </div>
     
    );
  }
}
export default App;