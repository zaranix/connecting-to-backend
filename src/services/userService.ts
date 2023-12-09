import create from "./http-service";
export interface User {
  name : string,
  id : number
  }


//This is the only place we provide the endpoint
export default create('/users'); 