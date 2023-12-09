import useUser from './hooks/useUsers'
import userService, { User } from './services/userService'
export const App = () => {

  const {users , error , isLoading , setErrors , setUsers} = useUser();
  const addUser = () => {
    
    const newUser = { id: 0 , name:'zara'}
    setUsers([newUser , ...users]);
    const originalUsers = [...users]

    userService.create(newUser).then(({data : savedUser}) => setUsers([savedUser ,...users]))
    .catch(err => {setErrors(err.message)
      setUsers(originalUsers)})
    }

     //Optimistic Update
  const onDelete = (user:User) => {
    const originalUsers = [...users]
  setUsers(users.filter(u  => user.id !== u.id) )
  //Calling Server to delete it
  
  userService.delete(user.id).catch(err => {setErrors(err.message)
  setUsers(originalUsers)})
  } 

    const updateUser = (user : User) =>{
     const originalUsers = [...users]
     const updatedUser = {...user , name : user.name + "!"}
     setUsers(users.map(u => user.id == u.id ? updatedUser : u ))

     userService.create(updatedUser)
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