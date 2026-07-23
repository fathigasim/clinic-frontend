import {useEffect} from 'react'
import { useParams } from 'react-router'
import { useDispatch } from 'react-redux';
export const EditDoctor = () => {
    const {id}=useParams();
    const dispatch=useDispatch();
    useEffect(()=>{
        console.log('Checking Id got to edit doctor component',id);
      if(id==null)
      {
        return;
      }
         dispatch();
    },[dispatch,id])
  return (
    <div>
      
    </div>
  )
}

export default EditDoctor
