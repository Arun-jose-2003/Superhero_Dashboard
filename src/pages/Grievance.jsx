import React, { useState, useEffect } from 'react';
import { Table, Form, Container, Row, Col } from 'react-bootstrap';
import { viewAllGrievanceAPI, updateGrievanceStatusAPI } from '../Services/allAPI';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #FF416C, #FF4B2B);
  padding: 2rem 0;
`;

const GlassCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  font-size: 3.5rem;
  margin-bottom: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
`;

const StyledTable = styled(Table)`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;

  th {
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    border: none;
  }

  td {
    // color: #fff;
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const UrgencyBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-weight: bold;
  color: white;
  background-color: ${props => 
    props.urgency === 'High' ? '#ff6b6b' : 
    props.urgency === 'Medium' ? '#feca57' : 
    '#48dbfb'};
`;

const StatusSelect = styled(Form.Control)`
  // background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: black;
  font-weight: bold;
  transition: all 0.3s ease;

  &:focus {
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  }
`;

const FilterCard = styled(GlassCard)`
  margin-bottom: 2rem;
`;

const FilterLabel = styled(Form.Label)`
  color: black;
  font-weight: bold;
`;

const FilterSelect = styled(Form.Control)`
  // background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: black;
  transition: all 0.3s ease;

  &:focus {
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
  }
`;

export default function Grievance() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [grievance, setGrievance] = useState([]);

  const viewAllGrievance = async () => {
    try {
      const result = await viewAllGrievanceAPI();
      if (result.status === 200) {
        const grievanceData = result.data;
        setGrievance(grievanceData);
      } else {
        console.log('Error fetching data', result.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const result = await updateGrievanceStatusAPI(complaintId, { status: newStatus });
      if (result.status === 200) {
        alert('Status updated successfully');
        viewAllGrievance();
      } else {
        console.log('Failed to update grievance status');
      }
    } catch (error) {
      console.log('Error updating status:', error);
    }
  };

  const filteredGrievances = grievance.filter((complaint) => {
    const isStatusMatch = statusFilter === 'All' || complaint.status === statusFilter;
    const isUrgencyMatch = urgencyFilter === 'All' || complaint.urgency === urgencyFilter;
    return isStatusMatch && isUrgencyMatch;
  });

  useEffect(() => {
    viewAllGrievance();
  }, []);

  return (
    <DashboardContainer>
      <Container>
        <GlassCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Grievance Dashboard</Title>

          <Row className="mb-4">
            <Col md={6}>
              <FilterCard>
                <FilterLabel>Filter by Status</FilterLabel>
                <FilterSelect
                  as="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Resolved</option>
                </FilterSelect>
              </FilterCard>
            </Col>
            <Col md={6}>
              <FilterCard>
                <FilterLabel>Filter by Urgency</FilterLabel>
                <FilterSelect
                  as="select"
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </FilterSelect>
              </FilterCard>
            </Col>
          </Row>

          <StyledTable responsive hover>
            <thead>
              <tr>
                <th>Citizen</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Date</th>
                <th>Location</th>
                <th>Category</th>
                <th>Incident Details</th>
                <th>Urgency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map((complaint) => (
                <motion.tr
                  key={complaint.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{complaint.name}</td>
                  <td>{complaint.phone}
                    
                  </td>
                  <td>{complaint.email}</td>
                  <td>{complaint.date}</td>
                  <td>{complaint.location}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.description}</td>
                  
                  
                  <td>
                    <UrgencyBadge urgency={complaint.urgency}>
                      {complaint.urgency}
                    </UrgencyBadge>
                  </td>
                  <td>
                    <StatusSelect
                      as="select"
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Resolved</option>
                    </StatusSelect>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </StyledTable>
        </GlassCard>
      </Container>
    </DashboardContainer>
  );
}