import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {deleteDoctorSchedule,getDoctorsSchedule} from '../doctorSlice';
import { useDispatch
//    ,useSelector
 } from 'react-redux';
import { toast } from 'react-toastify';
import { AiTwotoneDelete } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
export const  DeleteDoctorScheduleModal=({id,children })=> {
    console.log(`Check out if modal sees the doctor id`,id)
    const dispatch=useDispatch();
    //const doctorSchedule = useSelector(selectDoctorSchedule);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 const handleDeleteDoctorSchedule=async (id)=>{
    try{
      const result= await  dispatch(deleteDoctorSchedule(id)).unwrap();
            console.log(`printing out delete doctor schedule result`,result)     
        toast.info(result);
 await dispatch(getDoctorsSchedule());
    }
      catch(error){
           console.log(error)
      }
  }
  return (
    <>

      <Button variant="danger" onClick={handleShow}>
        <i><FaRegTrashAlt/></i> Delete
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Doctor Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body> Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          <i><IoMdClose/></i>  Close
          </Button>
          <Button variant="danger" onClick={()=>{handleClose
          handleDeleteDoctorSchedule(id)   
        }
          }>
          <AiTwotoneDelete />Confirm Delete
          </Button>
        </Modal.Footer>
        
      </Modal>
    </>
  );
}

export default DeleteDoctorScheduleModal;


