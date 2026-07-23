import {useState,useEffect} from 'react'
import { getPatients,selectPatientsResult,selectPatientLoading } from '../patientSlice';
import Paginationbootstrap from '../../../components/Pagintationbootstrap';
import PaginationbootstrapElipsed from '../../../components/ElipsedPagination';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLoaderData, useSearchParams } from 'react-router-dom';
import { Button, Form, FormControl,Row,Col, Container,Table,Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
const Patients = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const paramsPage = Number(searchParams.get("page") || "1");
    const paramsPageSize = Number(searchParams.get("pageSize") || "10");
    
    const [query, setQuery] = useState(searchParams.get("q") || ""); // initialize query from URL

    const dispatch = useDispatch();
    const patientResult = useSelector(selectPatientsResult);
    const loading = useSelector(selectPatientLoading);
    const loaction=useLocation();
    useEffect(() => {
      toast.info(loaction.state?.message)
        // Fetch patients when component mounts or when page changes
        dispatch(getPatients({ q: query, page: paramsPage, pageSize: paramsPageSize }));
    }, [dispatch, paramsPage, paramsPageSize]); // re-fetch when page or pageSize changes
    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ q: query, page: 1, pageSize: paramsPageSize });
        dispatch(getPatients({ q: query ?? "", page: 1, pageSize: paramsPageSize }));
        console.log("Printing result of get patients fuction", patientResult);
    };
    if (loading) {
        return <div>Loading...</div>;
    }
  return (
    
    <>


    <Container className="justify-content-center mx-auto my-4">
      {/* 1. Search Form */}
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="d-flex gap-2">
              <Form.Group className="flex-grow-1 mb-0">
                <FormControl
                  type="text"
                  name="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter patient name or email..."
                />
              </Form.Group>
              <Button size='sm' type="submit" variant="primary">
                Search
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      {/* 2. Loading Indicator */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" role="status" />
          <span className="ms-2">Loading patients...</span>
        </div>
      )}

      {/* 3. Results Section */}
      {!loading && patientResult && (
        patientResult.items && patientResult.items.length > 0 ? (
          <Row className="justify-content-center mt-4">
            <Col xs={12} md={10} lg={8}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {patientResult.items.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.firstName}</td>
                      <td>{patient.lastName}</td>
                      <td>{patient.phone}</td>
                      <td> <Link to={`/patients/editpatients/${patient.id}`}>
    Edit
</Link></td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-3">
                <PaginationbootstrapElipsed
                  page={paramsPage}
                  totalPages={patientResult.totalPages}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                />
              </div>
            </Col>
          </Row>
        ) : (
          <div className="text-center text-muted my-4">No patients found.</div>
        )
      )}
    </Container>


    </>
  )
}

export default Patients
