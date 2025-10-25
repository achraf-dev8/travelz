import React from 'react'
import '../../styles/HandleRequest.css'
import Lottie from 'lottie-react'
import loadingAnim from '../../assets/loading_gif.json'
import noConnectionAnim from '../../assets/no_internet.json'
import errorAnim from '../../assets/error.json'
import emptyAnim from '../../assets/empty.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faRefresh, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { AddButton } from '../../components/home/add/AddButton'

export const HandleRequest = ({reqState, retry, add , subject, layout}) => {
  return reqState == "loading" ? ((
    
    <div className="loading_screen">
      <div className="loading_container">
        <Lottie
          animationData={loadingAnim}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div> 
  )) : reqState == "success" ? layout  : (<div className={`loading_screen ${reqState}`}>
      <div className={`loading_container ${reqState}`}>
          <Lottie
            animationData={reqState == "network" ? noConnectionAnim : reqState == "empty" ? emptyAnim : errorAnim}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
    </div>
    <p padding = '20px' className='error-text'>{reqState == "network" ? "Check your internet connection!" : reqState == "empty" ?
      `Add Your First ${subject}!` :"Something wrong happened, please try again!"}</p>
    {reqState != "empty" ? (    <button className='add-button scale-hover confirm' style={{gap: '20px', paddingBlock:'10px'}}
    onClick={retry}
    >
      <p>Retry</p>
      <FontAwesomeIcon icon={faRotateRight} style={{fontSize : '20px'}}/>
    </button>) : ( <button className={`add-button scale-hover`} style={{fontSize:'20px', gap: '30px', height: '55px', 
   paddingInline:'30px' , maxWidth : 'none'}} 
    onClick={add} >
            <p class="text">{`Add ${subject}`}</p>
            <FontAwesomeIcon icon={faPlus}/>
            
          </button>)}
  </div> )
  
}
