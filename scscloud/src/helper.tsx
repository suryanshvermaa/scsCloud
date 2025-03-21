import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export async function validator(){
    const navigate=useNavigate();
    const accessToken= Cookies.get("AccessCookie");
    if(!accessToken){
       const refreshToken= Cookies.get("RefreshCookie");
       if(refreshToken){
        const res=await axios.post('http://localhost:8080/api/v1/refresh-token',{refreshToken});
        if(res){
            Cookies.set("AccessCookie", res.data.cookies[0].value, {expires:Date.now()+900000})
            Cookies.set("RefreshCookie", res.data.cookies[1].value, {expires:Date.now()+86400000})
            console.log('refresh token successfully');
            
        }else{
            console.log('err in refresh token');
            navigate('/login');
        }
       }else{
        
        navigate('/login');
       }
    }
}