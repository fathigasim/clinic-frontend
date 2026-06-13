 
import React,{useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsSchedule, selectDoctorSchedule } from '../doctorSlice';
 const DoctorsSchedule = () => {
const dispatch = useDispatch();
const doctorSchedule = useSelector(selectDoctorSchedule);


useEffect(() => {
    const fetchDoctorSchedule = async () => {
      try { 
        await dispatch(getDoctorsSchedule());
      } catch (error) {
        console.error('Error fetching doctor schedule:', error);
      }
    };

    fetchDoctorSchedule();
  }, [dispatch]);

  return ( <>
    {console.log("doctorSchedule data in component =>",doctorSchedule)}
    </>   )

 }

 export default DoctorsSchedule