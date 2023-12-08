import axios, { CanceledError } from 'axios'
import { useEffect, useState } from 'react'

interface User {
name : string,
id : number
}
export const App = () => {

  const [users , setUsers] = useState<User[]>([])
  const [error , setErrors] = useState()
  const[isLoading , setLoading] = useState(false)
  //Optimistic Update
  const onDelete = (user:User) => {
    const originalUsers = [...users]
  setUsers(users.filter(u  => user.id !== u.id) )
  //Calling Server to delete it
  axios.delete("https://jsonplaceholder.typicode.com/users/" + user.id)
  .catch(err => {setErrors(err.message)
  setUsers(originalUsers)})
  }
  
 

  useEffect(()=>{
    const controller = new AbortController();
    setLoading(true)
    axios.get<User[]>("https://jsonplaceholder.typicode.com/users" , {signal : controller.signal})
    .then((res)=>{
      setUsers(res.data);
      setLoading(false);
    }
    )
    .catch((err)=> { 
      if(err instanceof CanceledError) return;
      setErrors(err.message);
    setLoading(false)} )
    return () => controller.abort();
  },[])
  const addUser = () => {

    const newUser = { id: 0 , name:'zara'}
    setUsers([newUser , ...users]);
    const originalUsers = [...users]
    axios.post("https://jsonplaceholder.typicode.com/users/" , newUser)
    .then(({data : savedUser}) => setUsers([savedUser ,...users]))
    .catch(err => {setErrors(err.message)
      setUsers(originalUsers)})
    }

    const updateUser = (user : User) =>{
     const originalUsers = [...users]
     const updatedUser = {...user , name : user.name + "!"}
     setUsers(users.map(u => user.id == u.id ? updatedUser : u ))

     axios.patch("https://jsonplaceholder.typicode.com/users/" + user.id, updatedUser)
     .catch(err => {setErrors(err.message)
      setUsers(originalUsers)})
    }
  return (
    <>
    { error && <p className="text-danger">{error}</p> }
    {isLoading && <div className="spinner-border"></div>}
    <button onClick={addUser} className="btn btn-primary mb-3">Add</button>
    <ul className='list-group'>
      {users.map(user => <li className='list-group-item d-flex justify-content-between' key={user.id}>{user.name}
      <div>
      <button className="btn btn-outline-danger mx-3" onClick={() => updateUser(user)}>Update</button>
      <button type='button' onClick={() => onDelete(user)} className="btn-close"></button>
      </div>
      </li>)}
    </ul>
    </>
  )
}
export default App;