import React from 'react'

function ShowAllLocation(props) {
    return (
        <div>
            <h1>Recent Searches</h1>
          {props.locationArray.map((item)=>{
              return(
                  <div key={item._id}>
                      <span onClick={()=> props.getLocationWeather(item.city)}></span>
                      <span>{item.city} {item.country}</span>
                      <button onClick={()=> props.handleDeleteById(item._id)}>Delete</button>
                      </div>
              )
          })}
        </div>
    )
}

export default ShowAllLocation
