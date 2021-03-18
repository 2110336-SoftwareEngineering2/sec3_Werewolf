import React,{useState} from "react";
import {useParams,Redirect} from "react-router-dom";
import { auth } from '../../../api';

const Verification = () => {
    const [verified,setVerified] = useState(false)
    const [error,setError] = useState(false)
    let {token} = useParams()
    
    function verify(){
        auth.get('/verify/' + token)
        .then(response => {
            console.log(response)
            setVerified(true);
        })
        .catch(err => {
            setError(err.message)
        })
    }

    verify()

    if(!error && verified){
        return(<Redirect to="/login" />)
    }
    else{
        return(<div>
            Sorry, we cannot verify your account
            <br/>
            {error}
        </div>)
    }
    
    
}

export default Verification;