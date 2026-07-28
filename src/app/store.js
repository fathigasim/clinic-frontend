import { configureStore } from '@reduxjs/toolkit';

import patientReducer from  '../features/patient/patientSlice';
import doctorSlice from '../features/doctor/doctorSlice';
import authSlice from '../features/auth/authSlice';
import appointmentSlice from '../features/appointment/AppointmentSlice';
import medicalRecordSlice from '../features/medicalrecord/medicalrecordSlice';
import invoiceSlice from '../features/invoice/invoiceSlice';
import paymentSlice from '../features/payment/paymentSlice';

const rawLogger = (store) => (next) => (action) => {
  console.log('RAW ACTION HIT STORE:', action.type, action);
  return next(action);
};
export const store = configureStore({
  reducer: {
    patient:patientReducer,
    doctor: doctorSlice,
    auth: authSlice,
    appointment: appointmentSlice,
    medicalrecord: medicalRecordSlice,
    invoice: invoiceSlice,
    payment:paymentSlice
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       // Ignore stripe objects in actions
  //       ignoredActions: ['payments/setStripeElements'],
  //       ignoredPaths: ['payments.stripeElements'],
  //     },
  //   }).concat(rawLogger),
  middleware: (getDefaultMiddleware) =>
  [rawLogger, ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['payments/setStripeElements'],
      ignoredPaths: ['payments.stripeElements'],
    },
  })],
});


// export  RootState =  store.getState;
// export  AppDispatch = tpeof store.dispatch;