import { CanceledError } from "axios"
import { useEffect, useState } from "react"
import userService, { User } from "../services/userService"

const useUser = () => {
  const [users , setUsers] = useState<User[]>([])
  const [error , setErrors] = useState()
  const[isLoading , setLoading] = useState(false)
 
  

  useEffect(()=>{
    setLoading(true)
   const {request , cancel} = userService.getAll<User[]>();
    request.then((res)=>{
      setUsers(res.data);
      setLoading(false);
    }
    )
    .catch((err)=> { 
      if(err instanceof CanceledError) return;
      setErrors(err.message);
    setLoading(false)} )
    return () => cancel();
  },[])
  return {users , error , isLoading ,setErrors , setUsers}
}

 export default useUser;