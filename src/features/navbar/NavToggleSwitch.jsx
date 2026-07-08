// import { useState, useEffect } from 'react';
// import { Form, Modal, Button, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import { useDispatch,useSelector } from 'react-redux';
// import { disableMfa,enableMfa,setupMfa,statusMfa } from '../auth/authSlice';
// const NavToggleSwitch = () => {
//     const dispatch=useDispatch();
//   const [isOn, setIsOn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Enable flow state
//   const [showSetupModal, setShowSetupModal] = useState(false);
//   const [setupData, setSetupData] = useState(null); // { sharedKey, authenticatorUri }
//   const [enableCode, setEnableCode] = useState('');
//   const [recoveryCodes, setRecoveryCodes] = useState(null);

//   // Disable flow state
//   const [showDisableModal, setShowDisableModal] = useState(false);
//   const [password, setPassword] = useState('');

//   const [error, setError] = useState(null);

//   // Load current MFA status on mount
//   useEffect(() => {
 
//      const mfaStatusFunction = async()=>{
//      const res= dispatch(statusMfa());
//        setIsOn(res.enabled)
//        setLoading(false)
//      }
  
//    mfaStatusFunction()
//   }, [dispatch]);

//   const handleToggle = () => {
//     setError(null);
//     if (isOn) {
//       // Turning OFF — needs password confirmation first
//       setShowDisableModal(true);
//     } else {
//       // Turning ON — needs setup + code confirmation first
//       startSetup();
//     }
//   };

//   const startSetup = async () => {
//     try {
//     //   const res = await axios.get('https://localhost:7032/api/auth/mfa/setup');
//     const res = await dispatch(setupMfa())
//       setSetupData(res);
//       setShowSetupModal(true);
//     } catch (err) {
//       setError('Could not start MFA setup.');
//     }
//   };

//   const confirmEnable = async () => {
//     try {
//    //   const res = await axios.post('https://localhost:7032/api/auth/mfa/enable', { code: enableCode });
//    const res= await dispatch(enableMfa(enableCode))
//       setRecoveryCodes(res.recoveryCodes); // show these once, force user to save them
//       setIsOn(true);
//       setShowSetupModal(false);
//       setEnableCode('');
//     } catch (err) {
//       setError('Invalid code. Try again.');
//     }
//   };

//   const confirmDisable = async () => {
//     try {
//      // await axios.post('/api/auth/mfa/disable', { password });
//       await dispatch(disableMfa(password))
//       setIsOn(false);
//       setShowDisableModal(false);
//       setPassword('');
//     } catch (err) {
//       setError('Invalid password.');
//     }
//   };

//   if (loading) return null;

//   return (
//     <div>
//       <Form className="p-3">
//         <Form.Check
//           type="switch"
//           id="custom-switch"
//           label={isOn ? "Two-factor authentication is ON" : "Two-factor authentication is OFF"}
//           checked={isOn}
//           onChange={handleToggle}
//         />
//       </Form>

//       {/* ENABLE flow: scan QR, enter code */}
//       <Modal show={showSetupModal} onHide={() => setShowSetupModal(false)}>
//         <Modal.Header closeButton><Modal.Title>Set up two-factor authentication</Modal.Title></Modal.Header>
//         <Modal.Body>
//           {recoveryCodes ? (
//             <>
//               <Alert variant="warning">Save these recovery codes now — they won't be shown again.</Alert>
//               <ul>{recoveryCodes.map(c => <li key={c}><code>{c}</code></li>)}</ul>
//               <Button onClick={() => { setShowSetupModal(false); setRecoveryCodes(null); }}>Done</Button>
//             </>
//           ) : setupData ? (
//             <>
//               <p>Scan this in your authenticator app:</p>
//               {/* render setupData.authenticatorUri as a QR code, e.g. via qrcode.react */}
//               <p>Or enter manually: <code>{setupData.sharedKey}</code></p>
//               <Form.Control
//                 placeholder="6-digit code"
//                 value={enableCode}
//                 onChange={e => setEnableCode(e.target.value)}
//               />
//               {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
//               <Button className="mt-3" onClick={confirmEnable}>Confirm</Button>
//             </>
//           ) : null}
//         </Modal.Body>
//       </Modal>

//       {/* DISABLE flow: confirm password */}
//       <Modal show={showDisableModal} onHide={() => setShowDisableModal(false)}>
//         <Modal.Header closeButton><Modal.Title>Disable two-factor authentication</Modal.Title></Modal.Header>
//         <Modal.Body>
//           <Form.Control
//             type="password"
//             placeholder="Confirm your password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//           />
//           {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
//           <Button variant="danger" className="mt-3" onClick={confirmDisable}>Disable MFA</Button>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default NavToggleSwitch;


import { useState, useEffect } from 'react';
import { Form, Modal, Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { disableMfa, enableMfa, setupMfa, statusMfa } from '../auth/authSlice';
import { tokenService } from '../../services/tokenService';
const NavToggleSwitch = () => {
  const dispatch = useDispatch();
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [enableCode, setEnableCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState(null);

  const [showDisableModal, setShowDisableModal] = useState(false);
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);


useEffect(() => {
  let cancelled = false;

  const loadStatus = async () => {
    const token = tokenService.getAccessToken();
    if (!token) {
      if (!cancelled) setLoading(false);
      return;
    }
    try {
      const result = await dispatch(statusMfa()).unwrap();
      if (!cancelled) setIsOn(result.enabled);
    } catch (err) {
      console.error('Failed to load MFA status', err);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  loadStatus();
  return () => { cancelled = true; }; // cleanup guards against setState after unmount
}, [dispatch]);

  const handleToggle = () => {
    setError(null);
    if (isOn) {
      setShowDisableModal(true);
    } else {
      startSetup();
    }
  };

  const startSetup = async () => {
    try {
      const result = await dispatch(setupMfa()).unwrap();
      setSetupData(result); // { sharedKey, authenticatorUri }
      setShowSetupModal(true);
    } catch (err) {
      console.log(err)
      setError('Could not start MFA setup.');
    }
  };

  const confirmEnable = async () => {
    try {
      const result = await dispatch(enableMfa(enableCode)).unwrap();
      setRecoveryCodes(result.recoveryCodes);
      setIsOn(true);
     // setShowSetupModal(false);
      setEnableCode('');
    } catch (err) {
        console.log(err)
      setError('Invalid code. Try again.');
    }
  };

  const confirmDisable = async () => {
    try {
      console.log('Checking confirmDisable is actually submitting the password',password)
      console.log(typeof password, password)
      await dispatch(disableMfa(password)).unwrap();
      setIsOn(false);
      setShowDisableModal(false);
      setPassword('');
    } catch (err) {
        console.log(err)
      setError('Invalid password.');
    }
  };

  if (loading) return null;

  return (
    <div>
      <Form className="p-3">
        <Form.Check
          type="switch"
          id="custom-switch"
          label={isOn ? "Two-factor authentication is ON" : "Two-factor authentication is OFF"}
          checked={isOn}
          onChange={handleToggle}
        />
      </Form>

      <Modal show={showSetupModal} onHide={() => setShowSetupModal(false)}>
        <Modal.Header closeButton><Modal.Title>Set up two-factor authentication</Modal.Title></Modal.Header>
        <Modal.Body>
          {recoveryCodes ? (
            <>
              <Alert variant="warning">Save these recovery codes now — they won't be shown again.</Alert>
              <ul>{recoveryCodes.map(c => <li key={c}><code>{c}</code></li>)}</ul>
              <Button onClick={() => { setShowSetupModal(false); setRecoveryCodes(null); }}>Done</Button>
            </>
          ) : setupData ? (
            <>
              <p>Scan this in your authenticator app:</p>
              <p>Or enter manually: <code>{setupData.sharedKey}</code></p>
              <Form.Control
                placeholder="6-digit code"
                value={enableCode}
                onChange={e => setEnableCode(e.target.value)}
              />
              {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
              <Button className="mt-3" onClick={confirmEnable}>Confirm</Button>
            </>
          ) : null}
        </Modal.Body>
      </Modal>

      <Modal show={showDisableModal} onHide={() => setShowDisableModal(false)}>
        <Modal.Header closeButton><Modal.Title>Disable two-factor authentication</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
          <Button variant="danger" className="mt-3" onClick={confirmDisable}>Disable MFA</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NavToggleSwitch;