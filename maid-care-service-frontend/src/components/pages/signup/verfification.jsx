import React,{useState,useEffect} from "react";
import {useHistory,useParams,Redirect} from "react-router-dom";
import { auth } from '../../../api/auth.js';
import {VStack,Box} from '@chakra-ui/react';

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
            setError(err.response)
            console.log(err)
        })
    }

    
    useEffect(() => {
        verify()
    },[token])

    if(verified && !error){
        // set location state from
        // setiing history state won't work bc it crashes with history push for redirecting to homepage
        return(<Redirect to={{pathname:"/login",state:{from:'/auth/verify'}}}/>)
    }
    else if(error && error.status === 401){
        return(<VStack>
            <Box>
            Sorry, we cannot verify your account
            <br/>
            An error occur: Token not existed or has expired
            </Box>
        </VStack>)
    }
    else if(error && error.status === 403){
        return(<VStack>
            <Box>
            Sorry, we cannot verify your account
            <br/>
            An error occur: Invalid user
            </Box>
        </VStack>)
    }
    return(<div>Redirecting</div>)
    
    
}

export default Verification;